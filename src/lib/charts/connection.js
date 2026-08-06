import SmartChartsPkg from '@deriv-com/smartcharts-champion'

const { PendingPromise } = SmartChartsPkg

const RECONNECT_DELAY = 3000

class ConnectionManager {
  static get EVENT_CONNECTION_CLOSE() {
    return 'CONNECTION_CLOSE'
  }
  static get EVENT_CONNECTION_REOPEN() {
    return 'CONNECTION_REOPEN'
  }

  constructor({ appId, endpoint, language }) {
    this._url = `${endpoint}?l=${language}&app_id=${appId}`
    this._counterReqId = 1
    this._pendingRequests = {}
    this._bufferedRequests = []
    this._listeners = {}
    this._connectionOpened = null
    this._pingTimer = null
    this._ws = null
    this._reconnectTimer = null
    this._destroyed = false
    this._initialize()
  }

  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = []
    this._listeners[event].push(callback)
    return this
  }

  off(event, callback) {
    if (this._listeners[event]) {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback)
    }
    return this
  }

  onOpened(callback) {
    return this.on(ConnectionManager.EVENT_CONNECTION_REOPEN, callback)
  }

  onClosed(callback) {
    return this.on(ConnectionManager.EVENT_CONNECTION_CLOSE, callback)
  }

  offOpened(callback) {
    return this.off(ConnectionManager.EVENT_CONNECTION_REOPEN, callback)
  }

  offClosed(callback) {
    return this.off(ConnectionManager.EVENT_CONNECTION_CLOSE, callback)
  }

  _emit(event, payload) {
    ;(this._listeners[event] || []).forEach(cb => {
      try {
        cb(payload)
      } catch (e) {
        console.error(e)
      }
    })
  }

  _initialize() {
    if (this._destroyed) return
    this._ws = new WebSocket(this._url)
    this._ws.addEventListener('open', () => this._onWsOpen())
    this._ws.addEventListener('close', () => this._onWsClosed())
    this._ws.addEventListener('error', () => {})
    this._ws.addEventListener('message', event => this._onmessage(event))
  }

  _scheduleReconnect() {
    if (this._destroyed || this._reconnectTimer) return
    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null
      if (!this._destroyed && (!this._ws || this._ws.readyState === WebSocket.CLOSED)) {
        this._initialize()
      }
    }, RECONNECT_DELAY)
  }

  _onWsOpen() {
    if (this._connectionOpened) {
      this._connectionOpened.resolve()
      this._connectionOpened = null
    }
    this._emit(ConnectionManager.EVENT_CONNECTION_REOPEN)
    this._sendBufferedRequests()
    if (!this._pingTimer) {
      this._pingTimer = setInterval(() => this._pingCheck(), 15000)
    }
  }

  _pingCheck() {
    if (this._ws && this._ws.readyState === WebSocket.OPEN) {
      this.send({ ping: 1 }, 5000).catch(() => {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
          try {
            this._ws.close()
          } catch (e) {
            /* noop */
          }
        }
      })
    }
  }

  _onWsClosed() {
    if (this._pingTimer) {
      clearInterval(this._pingTimer)
      this._pingTimer = null
    }
    Object.keys(this._pendingRequests).forEach(reqId => {
      if (this._pendingRequests[reqId]) {
        this._bufferedRequests.push(this._pendingRequests[reqId])
      }
    })
    this._emit(ConnectionManager.EVENT_CONNECTION_CLOSE)
    this._scheduleReconnect()
  }

  _onmessage(event) {
    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }
    const { req_id } = data
    if (this._pendingRequests[req_id]) {
      this._pendingRequests[req_id].resolve(data)
      delete this._pendingRequests[req_id]
    }
    this._emit(data.msg_type, data)
  }

  _timeoutRequest(reqId, timeout) {
    setTimeout(() => {
      if (this._pendingRequests[reqId] && this._pendingRequests[reqId].isPending) {
        this._pendingRequests[reqId].reject(new Error('Request Timeout'))
        delete this._pendingRequests[reqId]
      }
    }, timeout)
  }

  _sendBufferedRequests() {
    while (this._bufferedRequests.length > 0) {
      const req = this._bufferedRequests.shift()
      if (req && req.data) this.send(req.data)
    }
  }

  async send(data, timeout) {
    const req = { ...data }
    req.req_id = req.req_id || this._counterReqId++

    if (!this._ws || this._ws.readyState !== WebSocket.OPEN) {
      if (!this._connectionOpened) {
        this._connectionOpened = PendingPromise()
      }
      await this._connectionOpened
    }
    if (this._destroyed || !this._ws) throw new Error('Connection destroyed')

    this._ws.send(JSON.stringify(req))
    if (!this._pendingRequests[req.req_id]) {
      this._pendingRequests[req.req_id] = PendingPromise(req)
    }
    if (timeout) {
      this._timeoutRequest(req.req_id, timeout)
    }
    return this._pendingRequests[req.req_id]
  }

  destroy() {
    this._destroyed = true
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = null
    }
    if (this._pingTimer) {
      clearInterval(this._pingTimer)
      this._pingTimer = null
    }
    try {
      if (this._ws) this._ws.close()
    } catch (e) {
      /* noop */
    }
  }
}

export default ConnectionManager
