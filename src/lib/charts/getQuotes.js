let connectionManagerInstance = null

const getQuotes = async ({ symbol, granularity, count, start, end }) => {
  if (!connectionManagerInstance) {
    throw new Error('ConnectionManager instance not set. Call setConnectionManager first.')
  }

  const request = {
    ticks_history: symbol,
    style: granularity ? 'candles' : 'ticks',
    count,
    end: end ? String(end) : 'latest',
    adjust_start_time: 1,
  }
  if (granularity) {
    request.granularity = granularity
  }
  if (start) {
    request.start = String(start)
  }

  const response = await connectionManagerInstance.send(request)
  if (response.error) {
    const errorMessage =
      typeof response.error === 'object' && response.error !== null && response.error.message
        ? String(response.error.message)
        : 'Unknown error in tick history'
    throw new Error(errorMessage)
  }

  const result = {}
  if (Array.isArray(response.candles)) {
    result.candles = response.candles.map(candle => ({
      open: +candle.open,
      high: +candle.high,
      low: +candle.low,
      close: +candle.close,
      epoch: +candle.epoch,
    }))
  } else if (response.history && response.history.prices && response.history.times) {
    result.history = {
      prices: response.history.prices.map(price => +price),
      times: response.history.times.map(time => +time),
    }
  }
  return result
}

export const setConnectionManager = instance => {
  connectionManagerInstance = instance
}

export default getQuotes
