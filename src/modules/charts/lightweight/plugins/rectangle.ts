import { CanvasRenderingTarget2D } from 'fancy-canvas';
import {
	type Coordinate,
	type DataChangedScope,
	type IChartApi,
	type IPrimitivePaneRenderer,
	type IPrimitivePaneView,
	isBusinessDay,
	type ISeriesApi,
	type ISeriesPrimitive,
	type ISeriesPrimitiveAxisView,
	type PrimitivePaneViewZOrder,
	type SeriesAttachedParameter,
	type SeriesOptionsMap,
	type Time,
} from 'lightweight-charts';

import { bitmapPositionsBox } from '../model';

function ensureDefined<T>(value: T | undefined): T {
	if (value === undefined) {
		throw new Error('Value is undefined');
	}

	return value;
}


export abstract class PluginBase implements ISeriesPrimitive<Time> {
	private _chart: IChartApi | undefined = undefined;
	private _series: ISeriesApi<keyof SeriesOptionsMap> | undefined = undefined;

	protected dataUpdated?(scope: DataChangedScope): void;
	protected requestUpdate(): void {
		if (this._requestUpdate) {
			this._requestUpdate();
		}
	}

	private _requestUpdate?: () => void;

	public attached({ chart, series, requestUpdate }: SeriesAttachedParameter<Time>) {
		this._chart = chart;
		this._series = series;
		this._series.subscribeDataChanged(this._fireDataUpdated);
		this._requestUpdate = requestUpdate;
		this.requestUpdate();
	}

	public detached() {
		this._series?.unsubscribeDataChanged(this._fireDataUpdated);
		this._chart = undefined;
		this._series = undefined;
		this._requestUpdate = undefined;
	}

	public get chart(): IChartApi {
		return ensureDefined(this._chart);
	}

	public get series(): ISeriesApi<keyof SeriesOptionsMap> {
		return ensureDefined(this._series);
	}

	// This method is a class property to maintain the
	// lexical 'this' scope (due to the use of the arrow function)
	// and to ensure its reference stays the same, so we can unsubscribe later.
	private _fireDataUpdated = (scope: DataChangedScope) => {
		if (this.dataUpdated) {
			this.dataUpdated(scope);
		}
	};
}

class RectanglePaneRenderer implements IPrimitivePaneRenderer {
	_p1: IViewPoint;
	_p2: IViewPoint;
	_fillColor: string;

	constructor(p1: IViewPoint, p2: IViewPoint, fillColor: string) {
		this._p1 = p1;
		this._p2 = p2;
		this._fillColor = fillColor;
	}

	draw(target: CanvasRenderingTarget2D) {
		target.useBitmapCoordinateSpace(scope => {
			if (
				this._p1.x === null ||
				this._p1.y === null ||
				this._p2.x === null ||
				this._p2.y === null
			) {
				return;
			}
			const ctx = scope.context;
			const horizontalPositions = bitmapPositionsBox(
				this._p1.x,
				this._p2.x,
				scope.horizontalPixelRatio,
			);
			const verticalPositions = bitmapPositionsBox(
				this._p1.y,
				this._p2.y,
				scope.verticalPixelRatio,
			);
			ctx.fillStyle = this._fillColor;
			ctx.fillRect(
				horizontalPositions.position,
				verticalPositions.position,
				horizontalPositions.length,
				verticalPositions.length,
			);
		});
	}
}

interface IViewPoint {
	x: Coordinate | null;
	y: Coordinate | null;
}

class RectanglePaneView implements IPrimitivePaneView {
	_source: Rectangle;
	_p1: IViewPoint = { x: null, y: null };
	_p2: IViewPoint = { x: null, y: null };

	constructor(source: Rectangle) {
		this._source = source;
	}

	update() {
		const { series } = this._source;
		const y1 = series.priceToCoordinate(this._source._p1.price);
		const y2 = series.priceToCoordinate(this._source._p2.price);
		const timeScale = this._source.chart.timeScale();
		const x1 = timeScale.timeToCoordinate(this._source._p1.time);
		const x2 = timeScale.timeToCoordinate(this._source._p2.time);
		this._p1 = { x: x1, y: y1 };
		this._p2 = { x: x2, y: y2 };
	}

	renderer() {
		return new RectanglePaneRenderer(
			this._p1,
			this._p2,
			this._source._options.fillColor,
		);
	}
}

class RectangleAxisPaneRenderer implements IPrimitivePaneRenderer {
	_p1: number | null;
	_p2: number | null;
	_fillColor: string;
	_vertical: boolean = false;

	constructor(
		p1: number | null,
		p2: number | null,
		fillColor: string,
		vertical: boolean,
	) {
		this._p1 = p1;
		this._p2 = p2;
		this._fillColor = fillColor;
		this._vertical = vertical;
	}

	draw(target: CanvasRenderingTarget2D) {
		target.useBitmapCoordinateSpace(scope => {
			if (this._p1 === null || this._p2 === null) {
				return;
			}
			const ctx = scope.context;
			ctx.globalAlpha = 0.5;
			const positions = bitmapPositionsBox(
				this._p1,
				this._p2,
				this._vertical ? scope.verticalPixelRatio : scope.horizontalPixelRatio,
			);
			ctx.fillStyle = this._fillColor;
			if (this._vertical) {
				ctx.fillRect(0, positions.position, 15, positions.length);
			} else {
				ctx.fillRect(positions.position, 0, positions.length, 15);
			}
		});
	}
}

abstract class RectangleAxisPaneView implements IPrimitivePaneView {
	_source: Rectangle;
	_p1: number | null = null;
	_p2: number | null = null;
	_vertical: boolean = false;

	constructor(source: Rectangle, vertical: boolean) {
		this._source = source;
		this._vertical = vertical;
	}

	abstract getPoints(): [Coordinate | null, Coordinate | null];

	update() {
		[this._p1, this._p2] = this.getPoints();
	}

	renderer() {
		return new RectangleAxisPaneRenderer(
			this._p1,
			this._p2,
			this._source._options.fillLabels,
			this._vertical,
		);
	}

	zOrder(): PrimitivePaneViewZOrder {
		return 'bottom';
	}
}

class RectanglePriceAxisPaneView extends RectangleAxisPaneView {
	getPoints(): [Coordinate | null, Coordinate | null] {
		const { series } = this._source;
		const y1 = series.priceToCoordinate(this._source._p1.price);
		const y2 = series.priceToCoordinate(this._source._p2.price);
		return [y1, y2];
	}
}

class RectangleTimeAxisPaneView extends RectangleAxisPaneView {
	getPoints(): [Coordinate | null, Coordinate | null] {
		const timeScale = this._source.chart.timeScale();
		const x1 = timeScale.timeToCoordinate(this._source._p1.time);
		const x2 = timeScale.timeToCoordinate(this._source._p2.time);
		return [x1, x2];
	}
}

abstract class RectangleAxisView implements ISeriesPrimitiveAxisView {
	_source: Rectangle;
	_p: IPoint;
	_pos: Coordinate | null = null;
	constructor(source: Rectangle, p: IPoint) {
		this._source = source;
		this._p = p;
	}

	abstract update(): void;
	abstract text(): string;

	coordinate() {
		return this._pos ?? -1;
	}

	visible(): boolean {
		return false;
	}

	tickVisible(): boolean {
		return false;
	}

	textColor() {
		return '';
	}

	backColor() {
		return '';
	}

	movePoint(p: IPoint) {
		this._p = p;
		this.update();
	}
}

class RectangleTimeAxisView extends RectangleAxisView {
	update() {
		const timeScale = this._source.chart.timeScale();
		this._pos = timeScale.timeToCoordinate(this._p.time);
	}

	text() {
		return this._source._options.timeLabelFormatter(this._p.time);
	}
}

class RectanglePriceAxisView extends RectangleAxisView {
	update() {
		const { series } = this._source;
		this._pos = series.priceToCoordinate(this._p.price);
	}

	text() {
		return this._source._options.priceLabelFormatter(this._p.price);
	}
}

interface IPoint {
	time: Time;
	price: number;
}

export interface IRectangleOptions {
	fillColor: string;
	fillLabels: string;
	priceLabelFormatter: (price: number) => string;
	timeLabelFormatter: (time: Time) => string;
}

const defaultOptions: IRectangleOptions = {
	fillColor: 'rgba(0, 111	, 73, 0.2)',
	fillLabels: '#131315',
	priceLabelFormatter: (price: number) => price.toFixed(2),
	timeLabelFormatter: (time: Time) => {
		if (typeof time == 'string') {
			return time;
		}
		const date = isBusinessDay(time)
			? new Date(time.year, time.month, time.day)
			: new Date(time * 1000);
		return date.toLocaleDateString();
	},
};

export class Rectangle extends PluginBase {
	_options: IRectangleOptions;
	_p1: IPoint;
	_p2: IPoint;
	_paneViews: RectanglePaneView[];
	_timeAxisViews: RectangleTimeAxisView[];
	_priceAxisViews: RectanglePriceAxisView[];
	_priceAxisPaneViews: RectanglePriceAxisPaneView[];
	_timeAxisPaneViews: RectangleTimeAxisPaneView[];

	constructor(
		p1: IPoint,
		p2: IPoint,
		options: Partial<IRectangleOptions> = {},
	) {
		super();
		this._p1 = p1;
		this._p2 = p2;
		this._options = {
			...defaultOptions,
			...options,
		};
		this._paneViews = [new RectanglePaneView(this)];
		this._timeAxisViews = [
			new RectangleTimeAxisView(this, p1),
			new RectangleTimeAxisView(this, p2),
		];
		this._priceAxisViews = [
			new RectanglePriceAxisView(this, p1),
			new RectanglePriceAxisView(this, p2),
		];
		this._priceAxisPaneViews = [new RectanglePriceAxisPaneView(this, true)];
		this._timeAxisPaneViews = [new RectangleTimeAxisPaneView(this, false)];
	}

	updateAllViews() {
		this._paneViews.forEach(pw => pw.update());
		this._timeAxisViews.forEach(pw => pw.update());
		this._priceAxisViews.forEach(pw => pw.update());
		this._priceAxisPaneViews.forEach(pw => pw.update());
		this._timeAxisPaneViews.forEach(pw => pw.update());
	}

	priceAxisViews() {
		return this._priceAxisViews;
	}

	timeAxisViews() {
		return this._timeAxisViews;
	}

	paneViews() {
		return this._paneViews;
	}

	priceAxisPaneViews() {
		return this._priceAxisPaneViews;
	}

	timeAxisPaneViews() {
		return this._timeAxisPaneViews;
	}

	applyOptions(options: Partial<IRectangleOptions>) {
		this._options = { ...this._options, ...options };
		this.requestUpdate();
	}
}
