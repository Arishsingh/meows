"use client"

import React, { useId } from "react"

import { cn } from "@/lib/utils"

/**
 * DotPattern - SVG <pattern>-tiled dot grid. One <circle> source tiled by the
 * browser - O(1) DOM nodes regardless of viewport size. Replaces the previous
 * O(width * height) implementation that mounted thousands of <motion.circle>
 * nodes and caused style-recalc / scroll jank.
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  cx?: number
  cy?: number
  cr?: number
  className?: string
  /** Soft radial halo on dots. Implemented via SVG gradient (still 1 source). */
  glow?: boolean
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  glow = false,
  className,
  ...props
}: DotPatternProps) {
  const id = useId()
  const gradientId = `${id}-gradient`
  const patternId = `${id}-pattern`

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80",
        className
      )}
      {...props}
    >
      <defs>
        {glow ? (
          <radialGradient id={gradientId}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        ) : null}
        <pattern
          id={patternId}
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={cx}
            cy={cy}
            r={glow ? cr * 2 : cr}
            fill={glow ? `url(#${gradientId})` : "currentColor"}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
