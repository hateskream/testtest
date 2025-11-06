<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

const contentWidths = ['100%', '92%', '96%', '88%', '75%', '60%'];
</script>

<template>
	<div :class="classes.root">
		<header :class="classes.header">
			<div :class="classes.title">
				<ui-skeleton
					width="80%"
					height="24px"
					border-radius="8px"
				/>

				<ui-skeleton
					width="40%"
					height="24px"
					border-radius="8px"
				/>
			</div>

			<div :class="classes.meta">
				<ui-skeleton width="60px" height="14px" />
				<ui-skeleton width="24px" height="14px" />
				<ui-skeleton width="80px" height="14px" />
			</div>
		</header>

		<aside :class="classes.sidebar">
			<section :class="classes.section">
				<ui-skeleton width="90px" height="18px" />
				<ui-skeleton
					v-for="i in 2"
					:key="'src' + i"
					width="100px"
					height="14px"
				/>
				<ui-skeleton
					width="70px"
					height="10px"
					:opacity="0.6"
				/>
			</section>

			<section :class="classes.section">
				<ui-skeleton width="90px" height="18px" />
				<ui-skeleton
					v-for="i in 2"
					:key="'ticker' + i"
					width="60px"
					height="18px"
					border-radius="9999px"
				/>
			</section>
		</aside>

		<section :class="classes.content">
			<ui-skeleton
				v-for="(width, i) in contentWidths"
				:key="i"
				:width="width"
				height="18px"
			/>
		</section>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	padding: 0 16px;
}

.header {
	margin-bottom: 16px;
}

.title {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.meta {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 16px;
}

.sidebar {
	display: flex;
	gap: 24px;
	margin-bottom: 16px;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.content {
	display: flex;
	flex-direction: column;
	margin-top: 12px;
	gap: 9px;
}
</style>
