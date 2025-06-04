<script setup lang="ts">

</script>

<template>
	<div :class="classes.widgetWrapper">
		<div :class="classes.widget">
			<div
				v-if="$slots.header"
				:class="classes.header"
				class="header-h01"
			>
				<div :class="classes.headerText">

					<slot name="header"></slot>
				</div>
			</div>
			<div
				:class="classes.body"
			>
				<slot name="body"></slot>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.widgetWrapper {
	width: 100%;
	padding: 3px;
}

.widget {
	width: 100%;
	background: #131315;
	border-radius: 18px;
}

.header {
	padding: 8px 10px;
}

.headerText {
	padding: 0 8px;
	line-height: 22px;
}

.body {
	padding: 0 16px 8px;
}
</style>
