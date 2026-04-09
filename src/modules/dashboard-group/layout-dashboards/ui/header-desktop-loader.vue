<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<div :class="classes.navbar">
		<div :class="classes.left">
			<ui-skeleton width="80px" height="24px" />
			<div :class="classes.tabs">
				<ui-skeleton width="45px" height="24px" />
				<ui-skeleton width="45px" height="24px" />
				<ui-skeleton width="45px" height="24px" />
			</div>
		</div>
		<div :class="classes.right">
			<ui-skeleton width="85px" height="30px" />
		</div>
	</div>
</template>

<style module="classes">
.navbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	padding: 0 18px 0 16px;
}

.left {
	display: flex;
	align-items: center;
	gap: 6px;
}

.right {
	display: flex;
	align-items: center;
	gap: 8px;
}

.tabs {
	display: flex;
	align-items: center;
	padding-left: 6px;
	gap: 16px;
}
</style>
