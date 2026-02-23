<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ inheritAttrs: false });

const id = useId();
</script>

<template>
	<g>
		<symbol :id="id" viewBox="0 0 173 173">
			<path
				d="M173 86.5a86.5 86.5 0 1 0-173 0h17.941a68.559 68.559 0 0 1 137.118 0z"
				:fill="`url(#${id}-gradient)`"
				fill-opacity=".5"
			/>
			<defs>
				<radialGradient
					:id="`${id}-gradient`"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="rotate(-90.001 86.79 0)scale(91.42)"
				>
					<stop
						offset=".566"
						stop-color="#fff"
						stop-opacity=".9"
					/>
					<stop
						offset=".873"
						stop-color="#0c0c0d"
						stop-opacity="0"
					/>
				</radialGradient>
			</defs>
		</symbol>
		<use :href="`#${id}`" v-bind="$attrs" />
	</g>
</template>
