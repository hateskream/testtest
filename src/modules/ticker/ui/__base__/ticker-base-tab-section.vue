<script setup lang="ts">
import TickerBaseTabSectionWrapper from './atoms/ticker-base-tab-section-wrapper.vue';
import TickerBaseTabSectionHead from './atoms/ticker-base-tab-section-head.vue';
import TickerBaseTabSectionBody from './atoms/ticker-base-tab-section-body.vue';
</script>

<template>
	<ticker-base-tab-section-wrapper>
		<ticker-base-tab-section-head>
			<slot name="title" />

			<template #tags>
				<slot name="tags" />
			</template>
		</ticker-base-tab-section-head>

		<ticker-base-tab-section-body>
			<slot name="content" />
		</ticker-base-tab-section-body>
	</ticker-base-tab-section-wrapper>
</template>
