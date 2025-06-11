<script setup lang="ts">
import { useRouter } from 'vue-router';

import { LayoutComponent } from '@/modules/layout';
import { RouteNames } from '@/types/route.d';

const router = useRouter();

function goBack() {

	router.push({ name: RouteNames.Chart });

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
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 10px;
	width: 100%;
	div{
		font-size:32px;
		color: var(--text-color-base-500);
	}
	button {
		cursor: pointer;
		padding: 10px;
		border: 1px solid var(--text-color-base-500);
		color: var(--text-color-base-500);
	}
}
</style>

