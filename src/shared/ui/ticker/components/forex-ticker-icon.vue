<script setup lang="ts">
import { TickerIconGlowEffect } from '@/shared/ui/ticker';

import TickerIcon from './ticker-icon.vue';

type TickerSrc = string | null | undefined;

interface IProps {
	src: TickerSrc | [TickerSrc, TickerSrc];
	ticker: string | string[];
	size: number;
	domain?: string;
	disableGlow?: boolean;
}

defineProps<IProps>();
</script>

<template>
	<span
		:class="classes.wrapper"
		:style="{
			'--icon-size': `${size}px`
		}"
	>
		<template v-for="(image, index) in src" :key="image">
			<slot name="glow1">
				<ticker-icon-glow-effect
					v-if="image && ticker && index === 0 && !disableGlow"
					:icon-src="image"
					:style="{
						width: `${size || 16}px`,
						height: `${size || 16}px`
					}"
					:class="classes.ticker"
				/>
			</slot>

			<span
				v-if="ticker"
				:class="[classes.item, index === 0 && classes.first]"
			>
				<ticker-icon
					:src="image!"
					:ticker="ticker?.[index]"
					:domain="domain ?? src?.[1]!"
					:size="size"
					:disable-glow="disableGlow"
				>
					<template #glow v-if="index === 0" />

					<template #glow v-else-if="$slots.glow">
						<slot name="glow" />
					</template>
				</ticker-icon>
			</span>
		</template>
	</span>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
}

.item {
	margin-left: -4px;
}

.first {
	margin-left: 0;
	mask: radial-gradient(circle 15px at right 50%, transparent 0, transparent 6px, #ffffff 9px);
}
</style>
