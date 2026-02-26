<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { TickerBaseTabSection } from '@/modules/ticker';
</script>

<template>
	<ticker-base-tab-section>
		<template #title>
			Key indicators
		</template>

		<template #content>
			<div :class="classes.indicators">
				<slot name="indicators" />
			</div>

			<ui-text token="text-100-r" :class="classes.summarized">
				<slot name="summarized" />
			</ui-text>
		</template>
	</ticker-base-tab-section>
</template>

<style module="classes">
.indicators {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.summarized {
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
