<script setup lang="ts">
import { TickerBaseTabSection } from '@/modules/ticker';
import { BaseErrorComponent } from '@/modules/widgets/base';

const emits = defineEmits<{
	refetch: [];
}>();
</script>

<template>
	<ticker-base-tab-section>
		<template #title>News</template>
		<template #content>
			<div :class="classes.error">
				<base-error-component @retry="emits('refetch')" />
			</div>
		</template>
	</ticker-base-tab-section>
</template>

<style module="classes">
.error {
	display: grid;
	width: 100%;
	height: 700px;
	place-items: center;
}
</style>
