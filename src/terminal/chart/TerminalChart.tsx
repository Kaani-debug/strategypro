import { useEffect, useRef } from 'react'
import {
  AreaSeries,
  createChart,
  CrosshairMode,
  LineStyle,
  ColorType,
  LineSeries,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts'
import type { Candle, Tick, TradeTypeId } from '@/terminal/lib/types'
import type { ChartTool } from '@/terminal/state/uiStore'
import { formatEpochSeconds, formatPrice } from '@/terminal/lib/format'

export interface ChartController {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

export const PROJECTION_STEPS = 48

function zoomTimeScale(chart: IChartApi, factor: number): void {
  const range = chart.timeScale().getVisibleLogicalRange()
  if (!range) return
  const current = range.to - range.from
  const next = Math.max(1, current * factor)
  const center = range.from + current / 2
  chart.timeScale().setVisibleLogicalRange({ from: center - next / 2, to: center + next / 2 })
}

interface TerminalChartProps {
  theme: 'light' | 'dark'
  history: Candle[]
  ticks: Tick[]
  growthRate: number
  tradeType: TradeTypeId
  tool: ChartTool
  digits: number
  stepSeconds?: number
  controllerRef: { current: ChartController | null }
}

const COLORS = {
  light: {
    background: '#fdfbf7',
    text: '#262219',
    grid: '#ece6da',
    border: '#d5cdbe',
    line: '#c23a2d',
    top: 'rgba(194, 58, 45, 0.24)',
    bottom: 'rgba(194, 58, 45, 0.00)',
    crosshair: '#9a9181',
    priceLine: '#c23a2d',
    projection: '#e5a83a',
    marker: '#9c82d1',
  },
  dark: {
    background: '#16130e',
    text: '#d5cdbe',
    grid: '#282219',
    border: '#3a3328',
    line: '#e65b4a',
    top: 'rgba(230, 91, 74, 0.26)',
    bottom: 'rgba(230, 91, 74, 0.00)',
    crosshair: '#8d8474',
    priceLine: '#e65b4a',
    projection: '#e5a83a',
    marker: '#b49ad8',
  },
}

interface SeriesPoint {
  time: UTCTimestamp
  value: number
}

function buildRealData(history: Candle[], ticks: Tick[]): SeriesPoint[] {
  const points: SeriesPoint[] = []
  for (const candle of history) {
    if (candle.time > 0 && Number.isFinite(candle.close)) {
      points.push({ time: candle.time as UTCTimestamp, value: candle.close })
    }
  }
  let lastTime = points.length > 0 ? points[points.length - 1].time : 0
  for (const tick of ticks) {
    if (tick.time > lastTime && Number.isFinite(tick.price)) {
      points.push({ time: tick.time as UTCTimestamp, value: tick.price })
      lastTime = tick.time
    }
  }
  return points
}

function buildProjection(points: SeriesPoint[], growthRate: number, stepSeconds = 1): SeriesPoint[] {
  if (points.length < 10) return []
  const last = points[points.length - 1]
  const reference = points[points.length - 11]
  const direction = last.value >= reference.value ? 1 : -1
  const move = last.value * (growthRate / 100) * 0.12
  const target = last.value + direction * move
  const projection: SeriesPoint[] = []
  for (let i = 1; i <= PROJECTION_STEPS; i += 1) {
    const f = i / PROJECTION_STEPS
    const eased = f * f * (3 - 2 * f)
    projection.push({
      time: (last.time + i * stepSeconds) as UTCTimestamp,
      value: last.value + (target - last.value) * eased,
    })
  }
  return projection
}

export default function TerminalChart({
  theme,
  history,
  ticks,
  growthRate,
  tool,
  digits,
  stepSeconds = 1,
  controllerRef,
}: TerminalChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null)
  const projectionRef = useRef<ISeriesApi<'Line'> | null>(null)
  const priceLineRef = useRef<IPriceLine | null>(null)
  const lastAppliedRef = useRef<UTCTimestamp | null>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const colors = COLORS[theme]

    const chart = createChart(element, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: { borderColor: colors.border },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: true,
        rightOffset: 8,
        barSpacing: 7,
        minBarSpacing: 2,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: colors.crosshair,
          width: 1,
          style: LineStyle.LargeDashed,
          labelBackgroundColor: colors.line,
        },
        horzLine: {
          color: colors.crosshair,
          width: 1,
          style: LineStyle.LargeDashed,
          labelBackgroundColor: colors.line,
        },
      },
      localization: {
        priceFormatter: (price: number) => formatPrice(price, digits),
      },
    })

    const area = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      topColor: colors.top,
      bottomColor: colors.bottom,
      lineWidth: 2,
      priceLineColor: colors.priceLine,
      priceLineWidth: 1,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      crosshairMarkerBorderColor: colors.background,
      crosshairMarkerBackgroundColor: colors.line,
    })

    const projection = chart.addSeries(LineSeries, {
      color: colors.projection,
      lineWidth: 2,
      lineStyle: LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    })

    chartRef.current = chart
    seriesRef.current = area
    projectionRef.current = projection
    lastAppliedRef.current = null

    controllerRef.current = {
      zoomIn: () => zoomTimeScale(chart, 1.3),
      zoomOut: () => zoomTimeScale(chart, 0.77),
      reset: () => chart.timeScale().fitContent(),
    }

    const tooltip = document.createElement('div')
    tooltip.style.position = 'absolute'
    tooltip.style.pointerEvents = 'none'
    tooltip.style.zIndex = '10'
    tooltip.style.padding = '6px 10px'
    tooltip.style.borderRadius = '8px'
    tooltip.style.fontSize = '12px'
    tooltip.style.fontWeight = '600'
    tooltip.style.letterSpacing = '0.01em'
    tooltip.style.display = 'none'
    tooltip.style.background = theme === 'dark' ? 'rgba(22,19,14,0.92)' : 'rgba(255,255,255,0.94)'
    tooltip.style.color = theme === 'dark' ? '#ece8df' : '#262219'
    tooltip.style.border = `1px solid ${colors.border}`
    tooltip.style.boxShadow = '0 6px 20px rgba(38,30,18,0.18)'
    tooltip.style.whiteSpace = 'nowrap'
    element.appendChild(tooltip)

    const onCrosshairMove = (param: MouseEventParams) => {
      if (!param.point || !param.time) {
        tooltip.style.display = 'none'
        return
      }
      const realPoint = param.seriesData.get(area) as { time: Time; value: number } | undefined
      const projectionPoint = param.seriesData.get(projection) as { time: Time; value: number } | undefined
      const timeLabel = typeof param.time === 'number' ? formatEpochSeconds(param.time) : String(param.time)
      if (!realPoint && !projectionPoint) {
        tooltip.style.display = 'none'
        return
      }
      let html = `<div style="color:${colors.text}">${timeLabel} UTC</div>`
      if (realPoint) {
        html += `<div><span style="color:${colors.line}">●</span> Price ${formatPrice(realPoint.value, digits)}</div>`
      }
      if (projectionPoint) {
        html += `<div><span style="color:${colors.projection}">◌</span> Projection ${formatPrice(projectionPoint.value, digits)}</div>`
      }
      tooltip.innerHTML = html
      tooltip.style.display = 'block'
      const point = param.point
      const offset = 14
      let left = point.x + offset
      if (left + 190 > element.clientWidth) left = point.x - 190 - offset
      tooltip.style.left = `${left}px`
      tooltip.style.top = `${point.y + offset}px`
    }
    chart.subscribeCrosshairMove(onCrosshairMove)

    return () => {
      chart.unsubscribeCrosshairMove(onCrosshairMove)
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip)
      controllerRef.current = null
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      projectionRef.current = null
      priceLineRef.current = null
      lastAppliedRef.current = null
    }
  }, [theme, digits, controllerRef])

  useEffect(() => {
    const area = seriesRef.current
    if (!area) return
    const data = buildRealData(history, ticks)
    if (data.length === 0) return
    area.setData(data)
    lastAppliedRef.current = data[data.length - 1].time
    if (priceLineRef.current) {
      priceLineRef.current.applyOptions({ price: data[data.length - 1].value })
    } else {
      const colors = COLORS[theme]
      priceLineRef.current = area.createPriceLine({
        price: data[data.length - 1].value,
        color: colors.priceLine,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'LAST',
      })
    }
    const projection = buildProjection(data, growthRate, stepSeconds)
    projectionRef.current?.setData(projection)
  }, [history, theme, growthRate, ticks, stepSeconds])

  useEffect(() => {
    const area = seriesRef.current
    if (!area) return
    const projectionPoints = buildProjection(buildRealData(history, ticks), growthRate, stepSeconds)
    projectionRef.current?.setData(projectionPoints)
  }, [growthRate, history, ticks, stepSeconds])

  useEffect(() => {
    const area = seriesRef.current
    const chart = chartRef.current
    if (!area || !chart) return
    const colors = COLORS[theme]
    if (tool === 'crosshair') {
      chart.applyOptions({
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { visible: true, labelVisible: true },
          horzLine: { visible: true, labelVisible: true },
        },
        handleScroll: true,
        handleScale: true,
      })
    } else if (tool === 'pan') {
      chart.applyOptions({
        crosshair: {
          mode: CrosshairMode.Hidden,
          vertLine: { visible: false },
          horzLine: { visible: false },
        },
      })
    } else if (tool === 'draw' || tool === 'measure') {
      chart.applyOptions({
        crosshair: {
          mode: CrosshairMode.Magnet,
          vertLine: { visible: true, labelVisible: true, color: colors.crosshair },
          horzLine: { visible: true, labelVisible: true, color: colors.crosshair },
        },
      })
    }
  }, [tool, theme])

  return <div ref={containerRef} className="h-full w-full" />
}
