<script setup lang="ts">


import type { ITableCheckCell } from '../model';


interface IProps {
	data: ITableCheckCell;
}

const props = defineProps<IProps>();


</script>

<template>
	<div :class="classes.chartContainer">
		{{props.data}}
	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	width: 100%;
	height: 32px;
}


.value {
	text-align: left;
	color: var(--text-color-base-500);
}

.iconWrapper {
	margin-left: 4px;
	transform: scaleX(-1) translateY(4px);
}

</style>
