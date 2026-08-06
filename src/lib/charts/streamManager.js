import Stream from './stream'

class StreamManager {
  constructor(connection) {
    this.MAX_CACHE_TICKS = 5000
    this._connection = connection
    this._streams = {}
    this._streamIds = {}
    this._tickHistoryCache = {}
    this._tickHistoryPromises = {}
    this._beingForgotten = {}
    ;['tick', 'ohlc'].forEach(msgType => connection.on(msgType, data => this._onTick(data)))
    connection.onClosed(() => this._onConnectionClosed())
  }

  _getKey({ symbol, granularity, ticks_history }) {
    return `${symbol || ticks_history}-${granularity || 0}`
  }

  _onTick(data) {
    const key = this._getKey(data.echo_req || {})
    if (this._streams[key] && this._tickHistoryCache[key]) {
      this._streamIds[key] = data[data.msg_type]?.id
      this._cacheTick(key, data)
      this._streams[key].emitTick(data)
    } else if (!(key in this._beingForgotten)) {
      this._streamIds[key] = data[data.msg_type]?.id
      this._forgetStream(key)
    }
  }

  _onConnectionClosed() {
    this._streamIds = {}
    Object.keys(this._streams).forEach(key => {
      if (this._streams[key].subscriberCount !== 0) {
        this._forgetStream(key)
      }
    })
  }

  _onReceiveTickHistory(data) {
    const key = this._getKey(data.echo_req || {})
    const cache = StreamManager.cloneTickTicksHistoryResponse(data)
    if (cache) {
      this._tickHistoryCache[key] = cache
    }
    delete this._tickHistoryPromises[key]
  }

  _cacheTick(key, response) {
    if (response.ohlc) {
      const { ohlc } = response
      const candles = this._tickHistoryCache[key].candles
      const candle = {
        close: +ohlc.close,
        high: +ohlc.high,
        low: +ohlc.low,
        open: +ohlc.open,
        epoch: ohlc.open_time,
      }
      const lastCandle = candles[candles.length - 1]
      if (lastCandle && candle.epoch && +lastCandle.epoch === +candle.epoch) {
        candles[candles.length - 1] = candle
      } else {
        candles.push(candle)
        if (candles.length > this.MAX_CACHE_TICKS) {
          candles.shift()
        }
      }
    } else if (response.tick) {
      const { tick } = response
      const { prices, times } = this._tickHistoryCache[key].history
      prices.push(tick.quote)
      times.push(tick.epoch)
      if (prices.length > this.MAX_CACHE_TICKS) {
        prices.shift()
        times.shift()
      }
    }
  }

  _forgetStream(key) {
    const stream = this._streams[key]
    if (stream) {
      stream.destroy()
      delete this._streams[key]
    }
    if (this._streamIds[key]) {
      const id = this._streamIds[key]
      this._beingForgotten[key] = true
      this._connection.send({ forget: id }).then(() => {
        delete this._beingForgotten[key]
        delete this._streamIds[key]
      })
    }
    if (this._tickHistoryCache[key]) {
      delete this._tickHistoryCache[key]
    }
  }

  _createNewStream(request) {
    const key = this._getKey(request)
    const stream = new Stream()
    this._streams[key] = stream
    const subscribePromise = this._connection.send(request)
    this._tickHistoryPromises[key] = subscribePromise
    subscribePromise
      .then(response => {
        this._onReceiveTickHistory(response)
        if (response.error) {
          this._forgetStream(key)
        }
      })
      .catch(() => {
        this._forgetStream(key)
      })
    stream.onNoSubscriber(() => this._forgetStream(key))
    return stream
  }

  subscribe(req, callback) {
    const request = req
    const key = this._getKey(request)
    let stream = this._streams[key]
    if (!stream) {
      stream = this._createNewStream(request)
    }
    stream.onStream(callback)
  }

  forget(request, callback) {
    const key = this._getKey(request)
    const stream = this._streams[key]
    delete this._streams[key]
    if (stream && callback) {
      stream.offStream(callback)
    }
  }

  static cloneTickTicksHistoryResponse({ history, candles }) {
    let clone = null
    if (history) {
      clone = {
        history: {
          prices: history.prices.slice(0),
          times: history.times.slice(0),
        },
      }
    } else if (candles) {
      clone = { candles: candles.slice(0) }
    }
    return clone
  }
}

export default StreamManager
