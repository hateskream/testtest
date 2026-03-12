<script setup lang="ts">
import { UiSkeleton } from '@/shared/ui/skeleton';

const contentWidths = ['70%', '90%', '50%', '30%'];
</script>

<template>
	<div :class="classes.root">
		<header :class="classes.header">
			<div :class="classes.headerMain">
				<div :class="classes.title">
					<ui-skeleton
						width="60%"
						height="32px"
						border-radius="8px"
					/>
				</div>

				<div :class="classes.meta">
					<ui-skeleton width="60px" height="20px" />
					<div :class="classes.scoreSentiment">
						<ui-skeleton
							width="20px"
							height="20px"
							shape="circle"
						/>
						<ui-skeleton width="100px" height="20px" />
					</div>
				</div>
			</div>

			<aside :class="classes.sidebar">

				<section :class="classes.section">
					<ui-skeleton width="100px" height="32px" />

				</section>

				<section :class="[classes.section, classes.sidebarMargin]">
					<ui-skeleton
						:class="classes.top"
						width="100px"
						height="32px"
					/>
					<ui-skeleton width="80px" height="20px" />
					<ui-skeleton width="80px" height="20px" />
				</section>

			</aside>
		</header>

		<section :class="classes.content">
			<ui-skeleton
				v-for="(width, i) in contentWidths"
				:key="i"
				:width="width"
				height="20px"
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
	container: details / inline-size;
}

.header {
	position: relative;
	display: block;
}

.headerMain {
	display: flex;
	flex-direction: column;
}

.title {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.meta {
	display: flex;
	align-items: center;
	gap: 20px;
	margin: 16px 0;
}

.scoreSentiment {
	display: flex;
	align-items: center;
	gap: 4px;
}

.sidebar {
	display: flex;
	flex-direction: column;
	gap: 52px;
	margin-bottom: 16px;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 8px;
}


.content {
	display: flex;
	flex-direction: column;
	margin-top: 12px;
	gap: 12px;
}

@container (max-width: 649px) {
	.sidebar {
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 20px;
		width: auto;
	}
}

@container (min-width: 650px) {
	.header,
	.content {
		padding-right: 324px;
	}

	.sidebar {
		position: absolute;
		top: 0;
		right: 0;
		flex-direction: column;
		justify-content: space-between;
		width: 308px;
		height: 100%;
	}

	.content {
		margin-top: 0;
	}
}
</style>
