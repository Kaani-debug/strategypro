const EVENT_STREAM = 'EVENT_STREAM'
const EVENT_NO_SUBSCRIBER = 'EVENT_NO_SUBSCRIBER'

class Stream {
  constructor() {
    this.subscriberCount = 0
    this._listeners = {}
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

  emit(event, payload) {
    ;(this._listeners[event] || []).forEach(cb => {
      try {
        cb(payload)
      } catch (e) {
        console.error(e)
      }
    })
  }

  emitTick(data) {
    this.emit(EVENT_STREAM, data)
  }

  forget() {
    this.off(EVENT_STREAM)
    this.emit(EVENT_NO_SUBSCRIBER)
  }

  destroy() {
    this.forget()
  }

  onNoSubscriber(callback) {
    return this.on(EVENT_NO_SUBSCRIBER, callback)
  }

  onStream(callback) {
    this.subscriberCount++
    this.on(EVENT_STREAM, callback)
  }

  offStream(callback) {
    this.subscriberCount--
    this.off(EVENT_STREAM, callback)
    if (this.subscriberCount === 0) {
      this.emit(EVENT_NO_SUBSCRIBER)
    }
  }
}

export default Stream
