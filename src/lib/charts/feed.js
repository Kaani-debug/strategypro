import ConnectionManager from './connection'
import StreamManager from './streamManager'
import getQuotes, { setConnectionManager } from './getQuotes'

export const WS_ENDPOINT = 'wss://ws.derivws.com/websockets/v3'
export const WS_APP_ID = 12812
export const WS_LANGUAGE = 'en'

let connectionManager = null
let streamManager = null

export const initConnection = ({ appId = WS_APP_ID, endpoint = WS_ENDPOINT, language = WS_LANGUAGE } = {}) => {
  if (connectionManager) return connectionManager
  connectionManager = new ConnectionManager({ appId, endpoint, language })
  streamManager = new StreamManager(connectionManager)
  setConnectionManager(connectionManager)
  return connectionManager
}

export const getConnection = () => connectionManager

export const getStreamManager = () => streamManager

export { getQuotes }

const subscriptionIds = {}

export const subscribeQuotes = ({ symbol, granularity, style }, callback) => {
  const request = {
    ticks_history: symbol,
    style: style || (granularity ? 'candles' : 'ticks'),
    subscribe: 1,
    adjust_start_time: 1,
    count: 1,
    end: 'latest',
  }
  if (granularity) {
    request.granularity = granularity
  }

  const handleResponse = response => {
    if (response.subscription && response.subscription.id) {
      const key = `${symbol}-${granularity || 0}`
      subscriptionIds[key] = response.subscription.id
    }
    if (response.tick) {
      const { tick } = response
      callback({
        Date: new Date(tick.epoch * 1000).toISOString(),
        Close: tick.quote,
        tick,
        DT: new Date(tick.epoch * 1000),
      })
    }
    if (response.ohlc) {
      const { ohlc } = response
      callback({
        Date: new Date(ohlc.open_time * 1000).toISOString(),
        Open: parseFloat(ohlc.open),
        High: parseFloat(ohlc.high),
        Low: parseFloat(ohlc.low),
        Close: parseFloat(ohlc.close),
        ohlc,
        DT: new Date(ohlc.open_time * 1000),
      })
    }
  }

  streamManager.subscribe(request, handleResponse)

  return () => {
    const forgetRequest = {
      ticks_history: symbol,
      granularity: granularity || undefined,
    }
    streamManager.forget(forgetRequest, handleResponse)
  }
}

export const unsubscribeQuotes = request => {
  if (!request?.symbol) return
  const { symbol, granularity = 0, ticks_history = '' } = request
  const key = `${symbol || ticks_history}-${granularity || 0}`
  if (subscriptionIds[key]) {
    connectionManager
      .send({ forget: subscriptionIds[key] })
      .then(() => {
        delete subscriptionIds[key]
      })
      .catch(error => console.error('Error forgetting subscription:', error))
  }
  streamManager.forget(request)
}
