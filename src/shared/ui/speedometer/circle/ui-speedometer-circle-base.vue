<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

const id = useId();
</script>

<template>
	<g>
		<symbol :id="id" viewBox="0 0 137 137">
			<path
				d="M137 68.5c0 37.832-30.668 68.5-68.5 68.5S0 106.332 0 68.5 30.669 0 68.5 0 137 30.669 137 68.5
				m-135.63 0c0 37.075 30.055 67.13 67.13 67.13s67.13-30.055 67.13-67.13
				S105.575 1.37 68.5 1.37 1.37 31.425 1.37 68.5"
				:fill="`url(#${id}-gradient)`"
				fill-opacity=".5"
			/>
			<defs>
				<linearGradient
					:id="`${id}-gradient`"
					x1="68.5"
					y1="0"
					x2="68.5"
					y2="137"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset=".314" stop-color="#5b5b5b" />
					<stop offset=".606" stop-color="#0c0c0d" />
				</linearGradient>
			</defs>
		</symbol>
		<use :href="`#${id}`" v-bind="$attrs" />
	</g>
</template>
