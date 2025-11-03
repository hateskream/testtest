<script setup lang="ts">
import type { DisplayVariant } from '@/modules/dashboard-group';
import { UiIcon } from '@/shared/ui/icon';
import { displayVariantToIcon, displayVariantToName } from '../model';


interface IBaseDashboardComponentProps {
	title: string;
	allDisplayVariants: DisplayVariant[];
}

const props = defineProps<IBaseDashboardComponentProps>();

const activeDisplayVariant = defineModel<DisplayVariant>('activeDisplayVariant', { required: true });
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<div :class="classes.titleHeader">
				<div :class="classes.titleText">
					{{ props.title }}
				</div>

				<div
					v-if="props.allDisplayVariants.length > 1"
					:class="classes.displayVariantContainer"
				>
					<div
						v-for="displayVariant in props.allDisplayVariants"
						:key="displayVariant"
						:class="[
							classes.displayVariant,
							{
								[classes.activeDisplayVariant]: displayVariant === activeDisplayVariant,
							},
						]"
						@click="activeDisplayVariant = displayVariant"
					>
						<ui-icon :id="displayVariantToIcon[displayVariant]" />
						<div :class="classes.displayVariantText">{{ displayVariantToName[displayVariant] }}</div>
					</div>
				</div>
			</div>

			<div
				v-if="$slots.filters"
				:class="classes.filters"
			>
				<slot name="filters" />
			</div>
		</div>
		<div :class="classes.content">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.title {
	position: sticky;
	top: 0;
	z-index: 3;
	display: flex;
	flex-direction: column;
}

.titleHeader {
	display: flex;
}

.titleText {
	/* overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis; */
}

.displayVariantContainer {
	display: flex;
}

.displayVariant {
	cursor: pointer;
}

.activeDisplayVariant {
	color: #ffffff;
}

.displayVariantText {
	/*
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	*/
}

.content {
	display: flex;
	flex: 1;
	flex-direction: column;
}
</style>
