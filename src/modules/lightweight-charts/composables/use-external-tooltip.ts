import { type CSSProperties, type MaybeRefOrGetter, type Reactive, reactive, toValue } from 'vue';
import type { Chart, TooltipModel } from 'chart.js';

export interface ILegendItem {
	color: string;
	text: string;
}

export interface ITooltipRow {
	color: NonNullable<CSSProperties['backgroundColor']>;
	text: string;
	value: string;
}

export type TooltipMode = 'vaults' | 'split';

export interface IUseExternalTooltipOptions {
	mode?: TooltipMode;
	legends?: ILegendItem[];
	wrapperEl?: MaybeRefOrGetter<HTMLElement | null>;
	valuePrefix?: string;
	valueSuffix?: string;
	reversed?: boolean;
	transformTitle?: (title: string[]) => string[];
	transformRowValue?: (rowValue: string) => string;
}

export interface IUseExternalTooltipState {
	visible: boolean;
	x: number;
	y: number;
	padding: number;
	title: string[];
	rows: ITooltipRow[];
}

export interface IUseExternalTooltipContext {
	chart: Chart;
	tooltip: TooltipModel<'line'>;
}

function createRows(
	tooltip: TooltipModel<'line'>,
	args: IUseExternalTooltipOptions,
) {
	const bodyLines = tooltip.body?.map(b => b.lines) ?? [];
	const rows: ITooltipRow[] = [];

	if (args.mode === 'vaults') {
		bodyLines.forEach((body, i) => {
			const legend = args.legends?.[i];

			const value = args.transformRowValue ? args.transformRowValue(body.toString()) : body.toString();

			rows.push({
				color: legend?.color ?? 'red',
				text: legend?.text ?? '',
				value: `${args.valuePrefix}${value}${args.valueSuffix}`,
			});
		});
	} else {
		bodyLines.forEach((body, i) => {
			const row = body.toString().split(':');
			const ticker = row.length > 1 ? row[0] : '';
			const value = row.length > 1 ? row[1] : row[0];

			const [symbol, color] = (ticker?.length > 1 ? ticker : '').split('-');

			const labelColor = tooltip.labelColors?.[i]?.borderColor;

			const transformedValue = args.transformRowValue ? args.transformRowValue(value) : value;

			rows.push({
				color: color ?? labelColor ?? 'transparent',
				text: symbol ?? '',
				value: `${args.valuePrefix}${(transformedValue ?? '').trim()}${args.valueSuffix}`,
			});
		});
	}

	return rows;
}

function createHandler(
	context: IUseExternalTooltipContext,
	state: Reactive<IUseExternalTooltipState>,
	args: IUseExternalTooltipOptions,
) {
	const { tooltip, chart } = context;

	if (tooltip.opacity === 0) {
		state.visible = false;
		return;
	}

	if (args.transformTitle) {
		state.title = args.transformTitle([...tooltip.title]);
	} else {
		state.title = [...tooltip.title];
	}


	const rows = createRows(tooltip, args);

	state.rows = args.reversed ? [...rows].reverse() : rows;


	state.padding = Number(tooltip.options.padding ?? 8);

	const { canvas } = chart;
	const wrapper = toValue(args.wrapperEl) ?? canvas.parentElement;

	if (wrapper) {
		const canvasRect = canvas.getBoundingClientRect();

		state.x = canvasRect.left + tooltip.caretX;
		state.y = canvasRect.top + tooltip.caretY;
		state.visible = true;
	} else {
		state.x = canvas.offsetLeft + tooltip.caretX;
		state.y = canvas.offsetTop + tooltip.caretY;
	}

	state.visible = true;
}

export function useExternalTooltip(
	args: IUseExternalTooltipOptions = {},
) {
	const state = reactive<IUseExternalTooltipState>({
		visible: false,
		x: 0,
		y: 0,
		padding: 8,
		title: [],
		rows: [],
	});

	function handler(context: IUseExternalTooltipContext) {
		return createHandler(context, state, {
			mode: 'split',
			valuePrefix: '$',
			valueSuffix: 'B',
			wrapperEl: document.body,
			...args,
		});
	}

	return { state, handler };
}
