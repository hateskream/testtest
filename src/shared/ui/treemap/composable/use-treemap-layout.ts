import { CategoryScale, Chart, LinearScale, Tooltip, type ChartConfiguration } from 'chart.js';
import { TreemapController, TreemapElement, type TreemapDataPoint } from 'chartjs-chart-treemap';
import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue';
import { debounce } from '@vexip-ui/utils';

interface IDataItem {
	id: string;
	value: number;
}

export interface ITreeMapItem {
	id: string;
	left: number;
	top: number;
	height: number;
	width: number;
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

	const treemap = computed((): ITreeMapItem[] => treemapRaw.value.map(item => ({
		id: valueToIdMap.value.get(item.v) as string,
		left: item.x,
		top: item.y,
		width: item.w,
		height: item.h,
	})));

	watch(
		() => data.value,
		() => {
			treemapRaw.value = updateChart();
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
			treemapRaw.value = updateChart();
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
		const observer = new ResizeObserver(debounce(cb, 50));

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

	function updateChart(): TreemapDataPoint[] {
		if (!renderedChart) {
			// eslint-disable-next-line no-console
			console.warn('renderedChart is null');
			return [];
		}

		renderedChart.data.datasets[0].tree = preparedData.value,
		renderedChart.update();
		return extractData(renderedChart);
	}

	function extractData(chart: Chart<'treemap'>): TreemapDataPoint[] {
		const [{ data: treemapRawData }] = chart.data.datasets;
		if (treemapRawData === null) {
			return [];
		}

		return treemapRawData as TreemapDataPoint[];
	}

	return {
		treemap,
	};
}
