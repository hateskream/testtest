<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { UiWidgetLabel } from '@/shared/ui/widget-label';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();
</script>

<template>
	<base-ticker-widget-wrapper :class="classes.wrapper">
		<base-ticker-widget-header :class="classes.header">
			<template #label>
				<ui-widget-label>
					{{ props.meta.name }}
				</ui-widget-label>
				<ui-skeleton
					width="140px"
					height="24px"
					border-radius="12px"
				/>
			</template>
		</base-ticker-widget-header>

		<base-ticker-widget-content :class="classes.content">
			<div
				v-for="n in 4"
				:key="n"
				:class="classes.item"
			>
				<div :class="classes.label">
					<ui-skeleton width="40px" height="20px" />
					<ui-skeleton width="32px" height="20px" />
				</div>
				<ui-skeleton
					width="100%"
					height="16px"
					border-radius="4px"
				/>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
}

.header {
	display: flex;
	justify-content: space-between;
}

.content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s11, 20px);
}

.item {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: var(--padding-padding-s3, 4px);
	align-self: stretch;
}

.label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}
</style>
