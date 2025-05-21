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
			<div :class="classes.body">
				<slot name="body">


				</slot>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.widgetWrapper {
	padding: 3px;
	width: 100%;

}

.widget {
	border-radius: 18px;
	background: #131315;
	width: 100%;
}

.header {
	padding: 8px 10px
}

.headerText {
	line-height: 22px;
	padding: 0 8px;
}
.body {
	padding: 0 16px 8px 16px;
}
</style>
