<script setup lang="ts">
import BaseTickerModalScroll from './base-ticker-modal-scroll.vue';
import BaseTickerModalBody from './base-ticker-modal-body.vue';
</script>

<template>
	<base-ticker-modal-scroll>
		<base-ticker-modal-body>
			<slot></slot>
		</base-ticker-modal-body>
	</base-ticker-modal-scroll>
</template>
