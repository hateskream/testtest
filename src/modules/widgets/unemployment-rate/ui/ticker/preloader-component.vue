<script setup lang="ts">
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { UiSkeleton } from '@/shared/ui/skeleton';
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			<ui-skeleton width="145px" height="24px" />
		</base-ticker-widget-header>
		<base-ticker-widget-content :class="classes.content">
			<ui-skeleton width="100%" height="130px" />
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	padding: 0 var(--padding-padding-s11, 20px) var(--padding-padding-s11, 20px);
}
</style>
