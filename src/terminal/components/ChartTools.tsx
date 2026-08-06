import type { ReactNode } from 'react'
import type { ChartTool } from '@/terminal/state/uiStore'
import { useUiStore } from '@/terminal/state/uiStore'
import {
  Crosshair,
  Move,
  Pencil,
  Ruler,
  RotateCcw,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { cn } from '@/terminal/lib/cn'

interface ToolButtonProps {
  tool: ChartTool
  label: string
  children: ReactNode
}

function ToolButton({ tool, label, children }: ToolButtonProps) {
  const activeTool = useUiStore((s) => s.tool)
  const setTool = useUiStore((s) => s.setTool)
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={activeTool === tool}
      onClick={() => setTool(tool)}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition',
        'hover:bg-slate-800 hover:text-slate-100',
        activeTool === tool && 'bg-indigo-500/15 text-indigo-400',
      )}
    >
      {children}
    </button>
  )
}

interface ChartToolsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export default function ChartTools({ onZoomIn, onZoomOut, onReset }: ChartToolsProps) {
  return (
    <div className="absolute left-4 top-16 z-20 hidden flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/85 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-md lg:flex">
      <button
        type="button"
        title="Zoom in"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Zoom out"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <ZoomOut className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Reset view"
        aria-label="Reset view"
        onClick={onReset}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-100"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
      <div className="my-1 h-px bg-slate-800" />
      <ToolButton tool="crosshair" label="Crosshair">
        <Crosshair className="h-4 w-4" />
      </ToolButton>
      <ToolButton tool="draw" label="Draw trendline">
        <Pencil className="h-4 w-4" />
      </ToolButton>
      <ToolButton tool="measure" label="Measure distance">
        <Ruler className="h-4 w-4" />
      </ToolButton>
      <ToolButton tool="pan" label="Pan chart">
        <Move className="h-4 w-4" />
      </ToolButton>
      <div className="my-1 h-px bg-slate-800" />
      <div
        title="Simulated environment"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-amber-400/80"
      >
        <ShieldAlert className="h-4 w-4" />
      </div>
    </div>
  )
}
