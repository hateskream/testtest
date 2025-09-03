import { CategoryScale, Chart, LinearScale, Tooltip, type ChartConfiguration } from 'chart.js';
import { TreemapController, TreemapElement, type TreemapDataPoint } from 'chartjs-chart-treemap';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

export interface IDataItem {
	id: string;
	value: number;
}

export interface ITreeMapItem {
	id: string;
	left: number;
	top: number;
	height: number;
	width: number;
	isOther: boolean;
}

export function useTreemapLayout(
	treemapCanvas: Ref<HTMLCanvasElement | null>,
	data: Ref<IDataItem[]>,
) {
	Chart.register(TreemapController, TreemapElement, LinearScale, CategoryScale, Tooltip);

	const treemapRaw = ref<TreemapDataPoint[]>([]);

	let renderedChart: Chart<'treemap'> | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let resizeObserver: ResizeObserver | null = null;

	const preparedData = computed(() => data.value.map(el => el.value));
	const valueToIdMap = computed(() => new Map(data.value.map(el => [el.value, el.id])));

	const SHARE_SHOW_MORE_AREA = 0.01;
	const SHOW_MORE_AREA_MIN_SIZE = 2500;
	const MIN_COUNT_OTHER_ELEMENTS = 10;

	const treemap = computed((): ITreeMapItem[] => {
		if (
			!treemapCanvas.value ||
			treemapRaw.value.length === 0
		) {
			return [];
		}

		const { width, height } = treemapCanvas.value.getBoundingClientRect();
		// if calculated size is less than SHOW_MORE_AREA_MIN_SIZE, use SHOW_MORE_AREA_MIN_SIZE
		const showMoreArea = Math.max(Math.ceil(width * height * SHARE_SHOW_MORE_AREA), SHOW_MORE_AREA_MIN_SIZE);

		let areaAccumulator = 0;
		let otherCount = 0;

		const prepared = treemapRaw.value
			.map(item => ({
				id: valueToIdMap.value.get(item.v)!,
				left: item.x,
				top: item.y,
				width: item.w,
				height: item.h,
				area: item.w * item.h,
			}))
			.sort((a, b) => a.area - b.area)
			.map(item => {
				if (areaAccumulator + item.area < showMoreArea) {
					areaAccumulator += item.area;
					otherCount += 1;
					return {
						...item,
						isOther: true,
					};
				} else {
					return {
						...item,
						isOther: false,
					};
				}
			});

		let minLeftSmall = prepared[0].left;
		let minTopSmall = prepared[0].top;

		prepared.filter(item => item.isOther).forEach(item => {
			if (minLeftSmall > item.left) {
				minLeftSmall = item.left;
			}

			if (minTopSmall > item.top) {
				minTopSmall = item.top;
			}
		});

		const otherEl = {
			width: width - minLeftSmall,
			height: height - minTopSmall,
			left: minLeftSmall,
			top: minTopSmall,
			isOther: true,
			id: 'other',
		};

		return otherCount < MIN_COUNT_OTHER_ELEMENTS
			? prepared.map(el => ({ ...el, isOther: false }))
			: [
				...prepared
					.map(item =>
						item.isOther
							? item
							: {
								...item,
								isOther: item.left === minLeftSmall && item.top >= minTopSmall,
							},
					)
					.filter(item => !item.isOther),
				otherEl,
			];
	});

	const largestElementId = computed(() => {
		if (treemap.value.length < 2) {
			return '';
		}
		return treemap.value[treemap.value.length - 2].id;
	});

	const other = computed(() => {
		return data.value.filter(el => !treemap.value.find(item => item.id === el.id));
	});

	watch(
		() => data.value,
		() => {
			if (!treemapCanvas.value) {
				return;
			}

			ctx = treemapCanvas.value.getContext('2d');
			if (!ctx) {
				return;
			}

			treemapRaw.value = renderChart(ctx);
		});

	onMounted(() => {
		if (!treemapCanvas.value) {
			return;
		}

		ctx = treemapCanvas.value.getContext('2d');
		if (!ctx) {
			return;
		}

		treemapRaw.value = renderChart(ctx);

		resizeObserver = watchCanvasSize(treemapCanvas.value, () => {
			treemapRaw.value = renderChart(ctx!);
		});
	});

	onUnmounted(() => {
		if (renderedChart) {
			renderedChart.destroy();
		}

		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});

	function watchCanvasSize(element: HTMLCanvasElement, cb: () => void) {
		const observer = new ResizeObserver(cb);

		observer.observe(element);
		return observer;
	}

	function renderChart(ctx2d: CanvasRenderingContext2D): TreemapDataPoint[] {
		if (renderedChart) {
			renderedChart.destroy();
		}

		const config: ChartConfiguration<'treemap'> = {
			type: 'treemap',
			data: {
				datasets: [
					{
						tree: preparedData.value,
						data: [],
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
			},
		};

		renderedChart = new Chart(ctx2d, config);

		return extractData(renderedChart);
	};

	// function updateChart(): TreemapDataPoint[] {
	// 	if (!renderedChart) {
	// 		// eslint-disable-next-line no-console
	// 		console.warn('renderedChart is null');
	// 		return [];
	// 	}

	// 	renderedChart.data.datasets[0].tree = preparedData.value,
	// 	renderedChart.update();
	// 	return extractData(renderedChart);
	// }

	function extractData(chart: Chart<'treemap'>): TreemapDataPoint[] {
		const [{ data: treemapRawData }] = chart.data.datasets;
		if (treemapRawData === null) {
			return [];
		}

		return treemapRawData as TreemapDataPoint[];
	}

	return {
		treemap,
		other,
		largestElementId,
	};
}
