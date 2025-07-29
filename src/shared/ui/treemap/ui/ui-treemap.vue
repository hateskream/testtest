<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { toRefs } from 'vue';

import { useDepth, useTreemapLayout, type ITreeMapItem } from '../composable';

interface IDataInput {
	ticker: string;
	logoUrl: string;
	value: number;
	percentage: number;
}

interface IDataItem extends ITreeMapItem, IDataInput {
	color: string;
}

interface IUiTreemap {
	data: IDataInput[];
	depthRange: {
		start: number;
		end: number;
	};
}

const props = defineProps<IUiTreemap>();

const { treemap } = useTreemapLayout(
	useTemplateRef<HTMLCanvasElement>('treemapCanvas'),
	computed(() => props.data.map(({ ticker, value }) => ({ value, id: ticker }))),
);

const { getColorByValue } = useDepth(toRefs(props).depthRange);

const treemapWithData = computed<IDataItem[]>(() =>
	treemap.value.map(item => {
		const dataItem = props.data.find(({ ticker }) => ticker === item.id)!;

		return {
			...item,
			...dataItem,
			color: getColorByValue(dataItem.percentage),
		};
	}),
);

</script>

<template>
	<div class="treemap-container">
		<canvas ref="treemapCanvas" class="hidden"></canvas>
		<div
			v-for="(item, index) in treemapWithData"
			:key="index"
			:style="{
				left:item.left + 'px',
				top: item.top + 'px',
				width: item.width + 'px',
				height: item.height + 'px',
				backgroundColor: item.color,
			}"
			class="item"
		>
			<div class="item-logo" />
			<div class="item-ticker">{{ item.ticker }}</div>
			<div class="item-percentage">{{ item.percentage }} %</div>
		</div>
	</div>

</template>

<style scoped>
.treemap-container {
	position: relative;
	height: 100%;
}

.hidden {
	display: none;
}

.item {
	position: absolute;
	container-type: size;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #ffffff;
	background-color: #ff4d4d;
	border: 1px solid #000000;
}

.item-logo {
	width: 40px;
	height: 40px;
	margin-bottom: 6px;
	border: 1px solid #000000;
	border-radius: 50%;
}

.item-ticker {
	font-size: 24px;
	line-height: 150%;
}

.item-percentage {
	font-size: 17px;
	line-height: 150%;
}

@container (height < 170px) {
	.item-logo {
		width: 24px;
		height: 24px;
	}

	.item-ticker {
		font-size: 15px;
		line-height: 170%;
	}

	.item-percentage {
		font-size: 13px;
		line-height: 160%;
	}
}

@container (height < 110px) {
	.item-logo {
		width: 24px;
		height: 24px;
	}

	.item-ticker {
		font-size: 10px;
		line-height: 170%;
	}

	.item-percentage {
		font-size: 10px;
		line-height: 170%;
	}
}

@container (height < 70px) {
	.item-logo {
		width: 20px;
		height: 20px;
	}

	.item-percentage {
		display: none;
	}
}

@container (height < 40px) {
	.item-logo {
		display: none;
	}

	.item-ticker {
		display: none;
	}
}

@container (width < 80px) {
	.item-logo {
		width: 20px;
		height: 20px;
		margin: 0;
	}

	.item-ticker {
		display: none;
	}

	.item-percentage {
		display: none;
	}
}

@container (width < 40px) {
	.item-logo {
		display: none;
	}

	.item-ticker {
		display: none;
	}
}
</style>
