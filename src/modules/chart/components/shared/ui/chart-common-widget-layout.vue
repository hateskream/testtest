<script setup lang="ts">
interface IProps {
	withoutPadding?: boolean;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.widgetWrapper">
		<div :class="classes.widget">
			<div
				v-if="$slots.header"
				:class="classes.header"
				class="title-300"
			>
				<div :class="classes.headerText">
					<slot name="header"></slot>
				</div>
			</div>
			<div
				:class="props.withoutPadding? '' : classes.body"
			>
				<slot name="body"></slot>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.widgetWrapper {
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: 18px;
}

.widget {
	width: 100%;
	overflow: hidden;
}

.header {
	padding: 8px 10px;
}

.headerText {
	padding: 0 8px;
	font-size: 13px;
}

.body {
	padding: 8px 16px 12px;
}
</style>
