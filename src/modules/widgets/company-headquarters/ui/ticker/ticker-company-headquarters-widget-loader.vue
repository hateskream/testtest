<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';

interface ITickerCompanyHeadquartersWidgetLoaderProps {
	meta: ITickerWidgetMeta;
}

const props = defineProps<ITickerCompanyHeadquartersWidgetLoaderProps>();
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>

		<base-ticker-widget-content :class="classes.content">
			<div
				v-for="n in 4"
				:key="n"
				:class="classes.region"
			>
				<div :class="classes.cell">
					<ui-skeleton
						width="20px"
						height="20px"
						border-radius="50%"
					/>
					<ui-skeleton width="80px" height="20px" />
				</div>
				<div :class="classes.cities">
					<ui-skeleton
						width="100%"
						height="100%"
						border-radius="6px"
					/>
				</div>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: 0;
}

.region {
	display: flex;
	align-self: stretch;
	height: 106px;
	padding: var(--padding-padding-s6, 10px);
	border-bottom: 1px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
}

.cell {
	display: flex;
	flex: 1 0 0;
	align-items: center;
	min-width: 80px;
	height: var(--height-height-s15, 36px);
	padding: 8px var(--padding-padding-s6, 10px);
	gap: var(--padding-padding-s4, 6px);
}

.cities {
	display: flex;
	flex: 1 0 0;
	gap: var(--padding-padding-s4, 6px);
}
</style>
