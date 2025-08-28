<script setup lang="ts">
import { useRouter } from 'vue-router';

import { LayoutComponent } from '@/modules/layout';
import { RouteNames } from '@/types/route.d';

const router = useRouter();

function goBack() {

	router.push({ name: RouteNames.TickerCrypto });

}
</script>


<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<div :class="classes.wrapper">
				<div>Welcome to non existing Automobiles Section Page</div>
				<button class="testButton" @click="goBack">Go Back</button>
			</div>
		</template>
	</layout-component>
</template>
<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	gap: 10px;

	div {
		font-size: 32px;
		color: var(--text-color-base-500);
	}

	button {
		padding: 10px;
		color: var(--text-color-base-500);
		border: 1px solid var(--text-color-base-500);
		cursor: pointer;
	}
}
</style>

