<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';

const breadCrumbsData = [
	{
		name: 'Markets',
		type: 'common',
		isActive: false,
	},
	{
		name: 'USA',
		type: 'common',
		isActive: false,

	},
	{
		name: 'more',
		type: 'svg',
		isActive: false,
	},
	{
		name: 'Motor vehicles',
		type: 'common',
		isActive: false,
	},
	{
		name: 'TSLA',
		type: 'common',
		isActive: true,
	},

];
</script>

<template>
	<div :class="classes.breadcrumbs">
		<template v-for="(item, index) in breadCrumbsData" :key="item.name">
			<div
				v-if="item.type === 'common'"
				:class="[classes.breadcrumb, { [classes.active]: item.isActive }]"
				class="paragraph-p-03"
			>
				{{ item.name }}
			</div>
			<ui-icon
				v-else
				:id="IconIds.GeneralMore"
				:class="classes.iconWrapper"
				width="16px"
				height="16px"
			/>
			<div v-if="index !== breadCrumbsData.length - 1" :class="classes.separator">/</div>
		</template>
	</div>
</template>

<style module="classes">
.breadcrumbs {
	display: flex;
	align-items: center;
	height: 30px;
	padding: 5px 0;
	gap: 9px;
}

.breadcrumb {
	overflow: hidden;
	color: var(--text-color-base-300);
	text-overflow: ellipsis;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
}

.separator {
	opacity: 0.3;
}

.breadcrumb:hover {
	color: var(--text-color-brand-500);
}

.iconWrapper {
	cursor: pointer;
}

.active {
	margin-left: -5px;
	padding: 1px 6px;
	color: var(--text-color-base-500);
	background: var(--bg-color-base-300);
	border-radius: 6px;
}
</style>
