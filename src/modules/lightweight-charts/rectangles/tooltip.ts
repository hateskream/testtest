import { type IChartApi } from 'lightweight-charts';
import { CanvasRenderingTarget2D } from 'fancy-canvas';
import {
	CrosshairMode,
	type IPrimitivePaneRenderer,
	type IPrimitivePaneView,
	type MouseEventParams,
	type PrimitivePaneViewZOrder,
	type ISeriesPrimitive,
	type SeriesAttachedParameter,
	type LineData,
	type WhitespaceData,
	type CandlestickData,
	type Time,
} from 'lightweight-charts';

import { positionsLine } from '../utils/position-line';
import { convertTime, formattedDateAndTime } from '../utils';

export interface ITooltipOptions {
	title: string;
	followMode: 'top' | 'tracking';
	/** fallback horizontal deadzone width */
	horizontalDeadzoneWidth: number;
	verticalDeadzoneHeight: number;
	verticalSpacing: number;
	/** topOffset is the vertical spacing when followMode is 'top' */
	topOffset: number;
}

export interface ITooltipContentData {
	title?: string;
	price: string;
	date: string;
	time: string;
}

export interface ITooltipPosition {
	visible: boolean;
	paneX: number;
	paneY: number;
}

export class TooltipElement {
	private _chart: IChartApi | null;

	private _element: HTMLDivElement | null;
	private _priceElement: HTMLDivElement | null;
	private _dateElement: HTMLDivElement | null;

	private _options: ITooltipOptions;

	private _lastTooltipWidth: number | null = null;

	public constructor(chart: IChartApi, options: Partial<ITooltipOptions>) {
		this._options = {
			title: '',
			followMode: 'tracking',
			horizontalDeadzoneWidth: 45,
			verticalDeadzoneHeight: 100,
			verticalSpacing: 20,
			topOffset: 20,
			...options,
		};
		this._chart = chart;

		const element = document.createElement('div');
		applyStyle(element, {
			display: 'flex',
			'flex-direction': 'column',
			'align-items': 'center',
			position: 'absolute',
			transform: 'translate(calc(0px - 50%), 0px)',
			opacity: '0',
			left: '0%',
			top: '0',
			'z-index': '100',
			'background-color': '#161618',
			'border-radius': '8px',
			padding: '8px',
			'font-family': 'Roboto Flex, sans-serif',
			'font-size': '11px',
			'font-weight': '400',
			'line-height': '16px',
			'pointer-events': 'none',
			color: '#fff',
			gap: '4px',
			border: '1px solid rgba(199, 199, 199, 0.05)',
		});

		const priceElement = document.createElement('div');
		applyStyle(priceElement, {
			'font-size': '12px',
			'font-weight': '440',
			color: '#fff',
		});
		setElementText(priceElement, '');
		element.appendChild(priceElement);

		const dateElement = document.createElement('div');
		applyStyle(dateElement, {
			color: '#9A9A9D',
			'font-size': '10px',
		});
		setElementText(dateElement, '');
		element.appendChild(dateElement);

		this._element = element;
		this._priceElement = priceElement;
		this._dateElement = dateElement;

		const chartElement = this._chart.chartElement();
		chartElement.appendChild(this._element);

		const chartElementParent = chartElement.parentElement;
		if (!chartElementParent) {
			console.error('Chart Element is not attached to the page.');
			return;
		}
		const { position } = getComputedStyle(chartElementParent);
		if (position !== 'relative' && position !== 'absolute') {
			console.error('Chart Element position is expected be `relative` or `absolute`.');
		}
	}

	public destroy() {
		if (this._chart && this._element) {
			this._chart.chartElement().removeChild(this._element);
		}
	}

	public applyOptions(options: Partial<ITooltipOptions>) {
		this._options = {
			...this._options,
			...options,
		};
	}

	public options(): ITooltipOptions {
		return this._options;
	}

	public updateTooltipContent(tooltipContentData: ITooltipContentData) {
		if (!this._element) {
			return;
		}
		const tooltipMeasurement = this._element.getBoundingClientRect();
		this._lastTooltipWidth = tooltipMeasurement.width;
		setElementText(this._priceElement, tooltipContentData.price);
		setElementText(this._dateElement, tooltipContentData.date);
	}

	public updatePosition(positionData: ITooltipPosition) {
		if (!this._chart || !this._element) {
			return;
		}
		this._element.style.opacity = positionData.visible ? '1' : '0';
		if (!positionData.visible) {
			return;
		}
		const x = this._calculateXPosition(positionData, this._chart);
		const y = this._calculateYPosition(positionData);
		this._element.style.transform = `translate(${x}, ${y})`;
	}

	private _calculateXPosition(
		positionData: ITooltipPosition,
		chart: IChartApi,
	): string {
		const x = positionData.paneX + chart.priceScale('left').width();
		const deadzoneWidth = this._lastTooltipWidth
			? Math.ceil(this._lastTooltipWidth / 2)
			: this._options.horizontalDeadzoneWidth;
		const xAdjusted = Math.min(
			Math.max(deadzoneWidth, x),
			chart.chartElement().clientWidth - deadzoneWidth,
		);
		return `calc(${xAdjusted}px - 50%)`;
	}

	private _calculateYPosition(positionData: ITooltipPosition): string {
		if (this._options.followMode == 'top') {
			return `${this._options.topOffset}px`;
		}
		const y = positionData.paneY;
		const flip =
			y <= this._options.verticalSpacing + this._options.verticalDeadzoneHeight;
		const yPx = y + (flip ? 1 : -1) * this._options.verticalSpacing;
		const yPct = flip ? '' : ' - 100%';
		return `calc(${yPx}px${yPct})`;
	}
}

function setElementText(element: HTMLDivElement | null, text: string) {
	if (!element || text === element.innerText) {
		return;
	}
	element.innerText = text;
	element.style.display = text ? 'block' : 'none';
}

function applyStyle(element: HTMLElement, styles: Record<string, string>) {
	for (const [key, value] of Object.entries(styles)) {
		element.style.setProperty(key, value);
	}
}

class TooltipCrosshairLinePaneRenderer implements IPrimitivePaneRenderer {
	_data: ITooltipCrosshairLineData;

	constructor(data: ITooltipCrosshairLineData) {
		this._data = data;
	}

	draw(target: CanvasRenderingTarget2D) {
		if (!this._data.visible) {
			return;
		}
		target.useBitmapCoordinateSpace(scope => {
			const ctx = scope.context;
			const crosshairPos = positionsLine(
				this._data.x,
				scope.horizontalPixelRatio,
				1,
			);
			ctx.fillStyle = this._data.color;
			ctx.fillRect(
				crosshairPos.position,
				this._data.topMargin * scope.verticalPixelRatio,
				crosshairPos.length,
				scope.bitmapSize.height,
			);
		});
	}
}

class MultiTouchCrosshairPaneView implements IPrimitivePaneView {
	_data: ITooltipCrosshairLineData;
	constructor(data: ITooltipCrosshairLineData) {
		this._data = data;
	}

	update(data: ITooltipCrosshairLineData): void {
		this._data = data;
	}

	renderer(): IPrimitivePaneRenderer | null {
		return new TooltipCrosshairLinePaneRenderer(this._data);
	}

	zOrder(): PrimitivePaneViewZOrder {
		return 'bottom';
	}
}

interface ITooltipCrosshairLineData {
	x: number;
	visible: boolean;
	color: string;
	topMargin: number;
}

export interface ITooltipPrimitiveOptions {
	lineColor: string;
	tooltip?: Partial<ITooltipOptions>;
	priceExtractor: <T extends WhitespaceData>(dataPoint: T) => string;
}

export class TooltipPrimitive implements ISeriesPrimitive<Time> {
	private _options: ITooltipPrimitiveOptions;
	private _tooltip: TooltipElement | undefined = undefined;
	_paneViews: MultiTouchCrosshairPaneView[];
	_data: ITooltipCrosshairLineData = {
		x: 0,
		visible: false,
		color: 'rgba(0, 0, 0, 0.2)',
		topMargin: 0,
	};

	_attachedParams: SeriesAttachedParameter<Time> | undefined;

	constructor(options: Partial<ITooltipPrimitiveOptions>) {
		this._options = {
			lineColor: 'rgba(0, 0, 0, 0.2)',
			priceExtractor: (data: LineData | CandlestickData | WhitespaceData) => {
				if ((data as LineData).value !== undefined) {
					return (data as LineData).value.toFixed(2);
				}
				if ((data as CandlestickData).close !== undefined) {
					return (data as CandlestickData).close.toFixed(2);
				}
				return '';
			},
			...options,
		};
		this._paneViews = [new MultiTouchCrosshairPaneView(this._data)];
	}

	attached(param: SeriesAttachedParameter<Time>): void {
		this._attachedParams = param;
		this._setCrosshairMode();
		param.chart.subscribeCrosshairMove(this._moveHandler);
		this._createTooltipElement();
	}

	detached(): void {
		const chart = this.chart();
		if (chart) {
			chart.unsubscribeCrosshairMove(this._moveHandler);
		}
	}

	paneViews() {
		return this._paneViews;
	}

	updateAllViews() {
		this._paneViews.forEach(pw => pw.update(this._data));
	}

	setData(data: ITooltipCrosshairLineData) {
		this._data = data;
		this.updateAllViews();
		this._attachedParams?.requestUpdate();
	}

	currentColor() {
		return this._options.lineColor;
	}

	chart() {
		return this._attachedParams?.chart;
	}

	series() {
		return this._attachedParams?.series;
	}

	applyOptions(options: Partial<ITooltipPrimitiveOptions>) {
		this._options = {
			...this._options,
			...options,
		};
		if (this._tooltip) {
			this._tooltip.applyOptions({ ...this._options.tooltip });
		}
	}

	private _setCrosshairMode() {
		const chart = this.chart();
		if (!chart) {
			throw new Error(
				'Unable to change crosshair mode because the chart instance is undefined',
			);
		}
		chart.applyOptions({
			crosshair: {
				mode: CrosshairMode.Magnet,
				vertLine: {
					visible: false,
					labelVisible: false,
				},
				horzLine: {
					visible: false,
					labelVisible: false,
				},
			},
		});
	}

	private _moveHandler = (param: MouseEventParams) => this._onMouseMove(param);

	private _hideTooltip() {
		if (!this._tooltip) {
			return;
		}
		this._tooltip.updateTooltipContent({
			title: '',
			price: '',
			date: '',
			time: '',
		});
		this._tooltip.updatePosition({
			paneX: 0,
			paneY: 0,
			visible: false,
		});
	}

	private _hideCrosshair() {
		this._hideTooltip();
		this.setData({
			x: 0,
			visible: false,
			color: this.currentColor(),
			topMargin: 0,
		});
	}

	private _onMouseMove(param: MouseEventParams) {
		const chart = this.chart();
		const series = this.series();
		const { logical } = param;
		if (!logical || !chart || !series) {
			this._hideCrosshair();
			return;
		}
		const data = param.seriesData.get(series);
		if (!data) {
			this._hideCrosshair();
			return;
		}
		const price = this._options.priceExtractor(data);
		const coordinate = chart.timeScale().logicalToCoordinate(logical);
		const [date, time] = formattedDateAndTime(param.time ? convertTime(param.time) : undefined);
		if (this._tooltip) {
			const tooltipOptions = this._tooltip.options();
			const topMargin = tooltipOptions.followMode == 'top' ? tooltipOptions.topOffset + 10 : 0;
			this.setData({
				x: coordinate ?? 0,
				visible: coordinate !== null,
				color: this.currentColor(),
				topMargin,
			});
			this._tooltip.updateTooltipContent({
				price,
				date,
				time,
			});
			this._tooltip.updatePosition({
				paneX: param.point?.x ?? 0,
				paneY: param.point?.y ?? 0,
				visible: true,
			});
		}
	}

	private _createTooltipElement() {
		const chart = this.chart();
		if (!chart) {
			throw new Error('Unable to create Tooltip element. Chart not attached');
		}
		this._tooltip = new TooltipElement(chart, {
			...this._options.tooltip,
		});
	}
}
