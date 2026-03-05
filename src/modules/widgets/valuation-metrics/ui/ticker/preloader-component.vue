<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.metrics">
			<div :class="classes.header">
				<ui-skeleton width="84px" height="24px" />
				<ui-skeleton width="84px" height="24px" />
			</div>
			<div :class="classes.row">
				<ui-skeleton
					:class="classes.title"
					width="60px"
					height="30px"
				/>
				<ui-skeleton width="84px" height="30px" />
				<ui-skeleton width="84px" height="30px" />
			</div>
			<div :class="classes.row">
				<ui-skeleton
					:class="classes.title"
					width="60px"
					height="30px"
				/>
				<ui-skeleton width="84px" height="30px" />
				<ui-skeleton width="84px" height="30px" />
			</div>
			<div :class="classes.row">
				<ui-skeleton
					:class="classes.title"
					width="60px"
					height="30px"
				/>
				<ui-skeleton width="84px" height="30px" />
				<ui-skeleton width="84px" height="30px" />
			</div>
			<div :class="classes.row">
				<ui-skeleton
					:class="classes.title"
					width="60px"
					height="30px"
				/>
				<ui-skeleton width="84px" height="30px" />
				<ui-skeleton width="84px" height="30px" />
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	overflow-x: auto;
}

.metrics {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 3px;
	padding: 0 12px;
	gap: 3px;
}

.row {
	display: flex;
	align-items: center;
	align-self: stretch;
	padding: 3px 12px;
	gap: 4px;
}

.title {
	margin-right: auto;
}
</style>

