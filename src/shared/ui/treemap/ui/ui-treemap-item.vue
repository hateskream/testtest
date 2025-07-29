<script setup lang="ts">
import { computed } from 'vue';

const THOUSAND = 1_000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const TRILLION = 1_000_000_000_000;

interface IVisibleConfig {
	isShowLogo: boolean;
	isShowTicker: boolean;
	isPercent: boolean;
}

interface IUiTreemapItem {
	ticker: string;
	logoUrl: string;
	value: number;

	left: number;
	top: number;
	height: number;
	width: number;

	color: string;

	visibleConfig: IVisibleConfig;
}

const props = defineProps<IUiTreemapItem>();

const preparedValue = computed(() => {
	if (props.visibleConfig.isPercent) {
		return `${props.value.toFixed(2)}%`;
	}

	if (props.value >= TRILLION) {
		return `${(props.value / TRILLION).toFixed(2)} T`;
	}

	if (props.value >= BILLION) {
		return `${(props.value / BILLION).toFixed(2)} B`;
	}

	if (props.value >= MILLION) {
		return `${(props.value / MILLION).toFixed(2)} M`;
	}

	if (props.value >= THOUSAND) {
		return `${(props.value / THOUSAND).toFixed(2)} K`;
	}

	return props.value.toFixed(2);
});

</script>
<template>
	<div
		:style="{
			left:props.left + 'px',
			top: props.top + 'px',
			width: props.width + 'px',
			height: props.height + 'px',
			backgroundColor: props.color,
		}"
		class="item"
	>
		<div
			v-if="props.visibleConfig.isShowLogo"
			class="item-logo"
		/>
		<div
			v-if="props.visibleConfig.isShowTicker"
			class="item-ticker"
		>
			{{ props.ticker }}
		</div>
		<div
			class="item-value"
		>
			{{ preparedValue }}
		</div>
	</div>
</template>

<style scoped>
.item {
	position: absolute;
	container-type: size;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: #ffffff;
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

.item-value {
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

	.item-value {
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

	.item-value {
		font-size: 10px;
		line-height: 170%;
	}
}

@container (height < 70px) {
	.item-logo {
		width: 20px;
		height: 20px;
	}

	.item-value {
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

	.item-value {
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
