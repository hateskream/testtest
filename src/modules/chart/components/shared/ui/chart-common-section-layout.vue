<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
</script>

<template>
	<div :class="classes.section">
		<slot name="refAnchor" />
		<div :class="classes.sectionTitle">
			<ui-icon
				:id="IconIds.Deals"
				:class="classes.titleIcon"
				width="20px"
				height="20px"
			/>
			<span><slot name="title"></slot></span>
		</div>
		<div :class="classes.section">
			<slot name="body" />
		</div>
	</div>
</template>

<style module="classes">
.sectionTitle {
	position: sticky;
	top: 0;
	z-index: 10;
	display: flex;
	align-items: center;
	margin-bottom: 22px;
	padding: 12px 16px 12px 0;
	font-size: var(--typography-headers-size-h02);
	background: var(--bg-color-surface-00);
	gap: 8px;
}

.titleIcon {
	color: #ffffff;
}

.section {
	display: flex;
	flex-direction: column;
}


</style>
