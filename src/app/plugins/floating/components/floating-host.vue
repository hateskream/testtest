<script setup lang="ts">
import { listFloatingScopes } from '../composables';

import FloatingScope from './floating-scope.vue';
</script>

<template>
	<teleport to="body">
		<div class="floating-host">
			<floating-scope
				v-for="scope in listFloatingScopes()"
				:key="scope"
				:scope="scope"
			/>
		</div>
	</teleport>
</template>
