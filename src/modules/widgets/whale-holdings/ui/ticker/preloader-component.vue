<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.segments">
			<div :class="classes.segment">
				<ui-skeleton
					:class="classes.dot"
					width="6px"
					height="6px"
				/>
				<ui-skeleton width="50px" height="16px" />
				<ui-skeleton width="70px" height="24px" />
			</div>
			<div :class="classes.segment">
				<ui-skeleton
					:class="classes.dot"
					width="6px"
					height="6px"
				/>
				<ui-skeleton width="70px" height="16px" />
				<ui-skeleton width="70px" height="24px" />
			</div>
			<div :class="classes.segment">
				<ui-skeleton
					:class="classes.dot"
					width="6px"
					height="6px"
				/>
				<ui-skeleton width="50px" height="16px" />
				<ui-skeleton width="60px" height="24px" />
			</div>
		</div>
		<ui-skeleton
			:class="classes.indicator"
			width="100%"
			height="16px"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 8px;
}

.segments {
	display: flex;
	flex-wrap: wrap;
	gap: 12px 16px;
}

.segment {
	display: flex;
	flex-direction: column;
	width: 80px;
	gap: 2px;
}

.dot {
	margin-bottom: 4px;
}

.indicator {
	margin: 12px 0;
}
</style>
