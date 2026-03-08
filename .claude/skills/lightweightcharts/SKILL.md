---
name: lightweightcharts
description: Use when working with Lightweight Charts (TradingView) — creating/modifying chart components, custom primitives, price lines, forecast visualizations, or debugging chart rendering issues. Covers project-specific architecture, custom primitives, and patterns.
---

# Lightweight Charts Module

## Overview

Version `lightweight-charts@5.0.6` (`fancy-canvas@2.1.0` for canvas rendering). Located in `src/modules/lightweight-charts/`. Used for financial charts: ticker prices, price targets, forecasts, dominance/market cap visualizations.

## Module Structure

```
src/modules/lightweight-charts/
├── model/          # Branded timestamps, chart enums, date ranges, timezone, price/percent formatting
├── composables/    # use-chart-context (candle data sharing), use-chart-context-indicators (indicator series)
├── const/          # Default series settings (MAIN_AREA_SETTINGS, MAIN_CANDLESTICK_SETTINGS, MA_SETTINGS)
├── utils/          # Coordinate helpers, time conversion, SMA calc, data preparation, mock generators
├── rectangles/     # Custom primitives (PluginBase, Rectangle, TooltipPrimitive, TimeAxisLabels, HLCAreaSeries)
├── plugins/        # Chart.js plugins (bar charts only, NOT LWC)
└── ui/             # Vue chart components
```

## Custom Primitives

All extend `PluginBase` (`rectangles/rectangle.ts`) implementing `ISeriesPrimitive<Time>`. Attached via `series.attachPrimitive()`.

| Primitive          | File                             | Purpose                                                                                                                                                  |
| ------------------ | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PluginBase`       | `rectangles/rectangle.ts`        | Abstract base — manages chart/series refs, subscribes to data changes, provides `requestUpdate()`                                                        |
| `Rectangle`        | `rectangles/rectangle.ts`        | Filled rectangle between two price/time points. Options: `fillColor`, `fillLabels`, `priceLabelFormatter`, `timeLabelFormatter`                          |
| `TooltipPrimitive` | `rectangles/tooltip.ts`          | Custom crosshair tooltip (DOM-based). Overrides crosshair to `CrosshairMode.Magnet`. Options: `followMode: 'top' \| 'tracking'`, `priceExtractor`        |
| `TimeAxisLabels`   | `rectangles/time-axis-labels.ts` | Custom time axis labels ("Historical"/"Forecast"). Uses `setSegmentData()` with `ITimeSegmentData`                                                       |
| `HLCAreaSeries`    | `rectangles/hlc-area.ts`         | Custom series: high/low/close lines with two filled areas. Options: `highLineColor`, `lowLineColor`, `closeLineColor`, `areaBottomColor`, `areaTopColor` |

## Key Model Files

- **`model/timestamp.ts`** — Branded types `UtcSeconds`, `UtcMilliseconds` with Zod schemas. Conversion: `secondsToUTCTimestamp()`, `strTimeToChartTime()`
- **`model/chart.ts`** — Enums `TypeChart` (Candlestick/Line), `IndicatorsChart` (Main/SMA). Helpers: `timeToZonedTime()`, `zonedTimeToTime()`
- **`model/date-range.ts`** — `DateRangePreset` enum (1D to ALL), Zod discriminated union `DateRangeValue`, `presetToDateRange()`, `createPreset()`
- **`model/timezone.ts`** — `TimezoneUtc` enum (UTC-12 to UTC+14), `timezoneUtcToIntl()`

## Indicator Series

15 indicators via `use-chart-context-indicators.ts`: SMA, EMA, MACD, ADX, DEMA, RMA, WMA, RSI, STOCH, CCI, AO, WILLR, STOCHRSI, ATR, BBANDS. Each creates series via `chart.addSeries()`, subscribes to candle updates, auto-cleans on removal.

Config pattern via `defineSeriesConfig()` from `@/modules/indicator/base/series`:

```typescript
// LineSeries on main pane
defineSeriesConfig({
	definition: LineSeries,
	options: { color: "#2962ff", title: "SMA", priceLineVisible: false },
});
// HistogramSeries on separate pane
defineSeriesConfig({
	definition: HistogramSeries,
	paneIndex: 5,
	isPrice: false,
	options: { color: "#26a69a", title: "MACD" },
});
```

## Examples

### Creating a Chart

```typescript
import {
	ColorType,
	createChart,
	LineStyle,
	CrosshairMode,
} from "lightweight-charts";

// Standard dark-theme chart (no user interaction)
const chart = createChart(container, {
	autoSize: true,
	layout: {
		textColor: "#9A9A9D",
		background: { type: ColorType.Solid, color: "transparent" },
	},
	rightPriceScale: {
		scaleMargins: { top: 0.1, bottom: 0.25 },
		minimumWidth: 55,
		borderVisible: false,
	},
	grid: {
		vertLines: { visible: false },
		horzLines: {
			visible: true,
			color: "rgba(73, 73, 80, 0.60)",
			style: LineStyle.Dashed,
		},
	},
	timeScale: { visible: true, lockVisibleTimeRangeOnResize: true },
	handleScroll: false,
	handleScale: false,
});

// Navigator mini-chart variant: add rightPriceScale: { visible: false },
// crosshair: { mode: CrosshairMode.Hidden }, height: 80
```

### Series (add, configure, set data)

```typescript
import {
	LineSeries,
	AreaSeries,
	LineType,
	LineStyle,
} from "lightweight-charts";

// Main price line
const main = chart.addSeries(LineSeries, {
	color: "#FFF",
	lineWidth: 1,
	lastValueVisible: false,
	priceLineVisible: false,
});
main.setData(
	history.map((p) => ({
		time: secondsToUTCTimestamp(strTimeToChartTime(p.timestamp)),
		value: p.close,
	})),
);

// Dashed curved forecast line
const forecast = chart.addSeries(LineSeries, {
	color: "#04EDA0",
	lineType: LineType.Curved,
	lineStyle: LineStyle.Dashed,
	crosshairMarkerVisible: false,
	lineWidth: 1,
	lastValueVisible: false,
	priceLineVisible: false,
});

// Area (navigator)
chart.addSeries(AreaSeries, {
	lineColor: "rgba(255, 255, 255, 0.50)",
	topColor: "rgba(73, 73, 80, 0.22)",
	bottomColor: "rgba(73, 73, 80, 0.22)",
	priceLineVisible: false,
});

// Per-point color override
series.setData([
	{ time: t1 as Time, value: 100, color: "#fff" },
	{ time: t2 as Time, value: 120, color: "#FF8D29" },
]);

// Chained: chart.addSeries(LineSeries, { pointMarkersVisible: true }).setData(data);
```

### Price Lines

```typescript
// Label-only (no horizontal line)
series.createPriceLine({
	price: 574,
	axisLabelVisible: true,
	lineVisible: false,
	axisLabelColor: "#043222",
	axisLabelTextColor: "#04EDA0",
	title: "H  574.00",
});

// Dashed horizontal line with label
series.createPriceLine({
	price: 487,
	axisLabelVisible: true,
	lineVisible: true,
	axisLabelColor: "#313537",
	axisLabelTextColor: "#fff",
	color: "#fff",
	lineStyle: LineStyle.Dashed,
	lineWidth: 1,
	title: "C  487.00",
});
```

### Attaching Primitives

```typescript
import { Rectangle } from "@/modules/lightweight-charts/rectangles/rectangle";
import { TooltipPrimitive } from "@/modules/lightweight-charts/rectangles/tooltip";

// Shaded rectangle area
series.attachPrimitive(
	new Rectangle(
		{ price: startPrice, time: startTime },
		{ price: endPrice, time: endTime },
		{ fillColor: "rgba(4, 237, 160, 0.2)" },
	),
);

// Custom crosshair tooltip
series.attachPrimitive(
	new TooltipPrimitive({
		lineColor: "rgba(0, 0, 0, 0.2)",
		tooltip: { followMode: "tracking" },
	}),
);
```

### Time Scale & Cleanup

```typescript
// Fit content after data load
chart.timeScale().fitContent();

// Apply options (rightOffset controls gap to price scale)
chart.timeScale().applyOptions({ rightOffset: 9.5 });

// Fit on resize
useResizeObserver(
	container,
	useDebounceFn(([entry]) => {
		if (lastWidth !== entry.contentRect.width) {
			lastWidth = entry.contentRect.width;
			chart.timeScale().fitContent();
		}
	}),
);

// Cleanup: remove series first, then chart
function destroyChart(): void {
	chart.removeSeries(mainSeries);
	chart.removeSeries(forecastSeries);
	chart.remove();
	chart = null;
}
onBeforeUnmount(destroyChart);
```

## Common Gotchas

- `plugins/` directory contains **Chart.js** plugins (bar charts), NOT Lightweight Charts plugins
- `@shared/component-library` has its own `<i88-chart>` web component wrapping LWC — uses `lightweight-charts@5.1.0` internally
- `priceLineVisible: false` and `lastValueVisible: false` are set on nearly all auxiliary series to avoid default labels
- `timeScale.rightOffset` controls gap between last data point and price scale edge — set to `0` to make lines reach the axis labels
