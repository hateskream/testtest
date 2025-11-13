<script setup lang="ts">

interface ISummaryComponentProps {
	text: string;
	summaryAt: string;
}

const props = defineProps<ISummaryComponentProps>();

</script>

<template>
	<div :class="classes.container">
		<div :class="classes.text">
			{{ props.text }}
		</div>
		<div :class="classes.summaryAt">
			Summarized at {{ props.summaryAt }}
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.text {
	font-style: normal;
	font-weight: 400;
	font-size: 13.3px;
	line-height: 180%;
	color: rgb(255 255 255 / 96%);
	letter-spacing: 0.146px;
}

.summaryAt {
	font-style: normal;
	font-weight: 400;
	font-size: 12.2px;
	line-height: 180%; /* 21.96px */
	color: rgb(255 255 255 / 62%);
	letter-spacing: 0.122px;
}
</style>
