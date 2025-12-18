<script setup lang="ts">

import { RouteNames } from '@/types/route.d';
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.row">
			<div class="text-100-r">Sector</div>
			<router-link
				:class="classes.sectorLink"
				:to="{name:RouteNames.Test}"
				class="title-200"
			>
				<span :class="classes.sectorName" class="text-200-r">
					Automobile
				</span>
				<span :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.ArrowToTopRight"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</span>
			</router-link>
		</div>
		<div :class="classes.row">
			<div class="text-100-r">Website</div>
			<router-link
				:class="classes.sectorLink"
				:to="{name:RouteNames.Test}"
				class="title-200"
			>
				<span :class="classes.sectorName" class="text-200-r">
					tesla.com
				</span>
				<span :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.ArrowToTopRight"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</span>
			</router-link>
		</div>
		<div :class="classes.row">
			<div class="text-100-r">Sector</div>
			<router-link
				:class="classes.sectorLink"
				:to="{name:RouteNames.Test}"
				class="title-200"
			>
				<span :class="classes.sectorName" class="text-200-r">
					Automobile
				</span>
				<span :class="classes.iconWrapper">
					<ui-icon
						:id="IconIds.ArrowToTopRight"
						width="12"
						height="12"
						:class="classes.icon"
					/>
				</span>
			</router-link>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	max-width: 100%;
	padding: 3px;
	gap: 6px;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 5px 16px;
}

.iconWrapper {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	background-color: var(--metrics-bg-control-300);
	border-radius: 9999px;
}

.sectorLink {
	display: flex;
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	gap: 4px;

	&:hover {
		color: var(--text-color-base-500);
	}
}

.sectorName {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 30px;
	padding: 5px 11px;
	background-color: var(--metrics-bg-control-300);
	border-radius: 9999px;
}

</style>
