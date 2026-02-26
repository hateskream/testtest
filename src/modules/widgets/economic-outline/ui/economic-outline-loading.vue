<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';
import { TickerBaseTabSection } from '@/modules/ticker';

</script>

<template>
	<ticker-base-tab-section>
		<template #title>
			<ui-skeleton width="150px" height="22px" />
		</template>
		<template #tags>
			<ui-skeleton width="72px" height="22px" />
		</template>
		<template #content>
			<div :class="classes.text">
				<ui-skeleton
					v-for="key in 3"
					:key="key"
					width="100%"
					height="18px"
				/>

				<ui-skeleton width="52px" height="16px" />
			</div>

			<ui-skeleton width="114px" height="20px" />
		</template>
	</ticker-base-tab-section>
</template>

<style module="classes">
.text {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 4px;
}
</style>
