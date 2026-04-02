<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

const props = defineProps<{
	isTv?: boolean;
}>();
</script>

<template>
	<div :class="classes.section">
		<div :class="classes.hourLabel"></div>

		<div :class="classes.board">
			<div :class="classes.card">
				<div :class="[classes.inner, { [classes.tv]: props.isTv }]">
					<div :class="classes.container">
						<div :class="classes.head">
							<ui-skeleton width="61px" height="20px" />
							<ui-skeleton width="41px" height="20px" />
						</div>
						<div :class="classes.cell">
							<div :class="classes.items">
								<ui-skeleton
									width="20px"
									height="20px"
									border-radius="50%"
								/>

								<ui-skeleton width="157px" height="20px" />
							</div>

							<ui-skeleton width="229px" height="20px" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.section {
	position: relative;
}

.board {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0 4px;
}

.hourLabel {
	height: 30px;
	padding: 8px 18px 0;
}

.outer {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: 1px 0;
	cursor: pointer;
	gap: 10px;
}

.inner {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	padding: var(--padding-padding-s7, 12px) var(--padding-padding-s8, 14px);
	border-radius: 20px;
	gap: var(--padding-padding-s5, 8px);
}

.inner.tv {
	padding: 12px 8px;
}

.container {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--padding-padding-s5, 8px);
	align-self: stretch;
}

.head {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.cell {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	min-height: 32px;
	gap: 8px;
}

.items {
	display: flex;
	align-items: center;
	gap: var(--padding-padding-s5, 8px);
}
</style>
