<script setup lang="ts">
import { IconIds, UiIcon } from '../icon';

</script>

<template>
	<div :class="classes.banner">
		<div :class="classes.bannerTitle">
			<div :class="classes.bannerTitleWrapper">
				<div :class="classes.bannerTitleIcon">
					<ui-icon :id="IconIds.Flash" />
				</div>
				<div :class="classes.bannerTitleText">
					<slot name="title" />
				</div>
			</div>
			<div :class="classes.bannerClose">
				<ui-icon :id="IconIds.Close" />
			</div>
		</div>

		<div :class="classes.bannerText">
			<slot name="text" />
		</div>
	</div>
</template>

<style module="classes">
.banner {
	padding: 16px;
	color: rgb(135 89 252 / 80%);
	background: linear-gradient(0deg, rgb(109 0 252 / 10%) 0%, rgb(109 0 252 / 10%) 100%), #131315;
	border: 1px solid rgb(92 60 169 / 30%);
	border-radius: 12px;
}

.bannerTitleWrapper {
	display: flex;
	align-items: center;
	gap: 4px;
}

.bannerTitle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 16px;
}

.bannerTitleText {
	font-weight: 700;
	font-size: 13px;
	color: var(--text-color-info-500);
	letter-spacing: 0.143px;
}

.bannerText {
	font-weight: 400;
	font-size: 16px;
	line-height: 26px;
	color: rgb(135 89 252 / 80%);
	letter-spacing: 0.143px;
}

.bannerText > * {
	margin-top: 16px;
}

</style>
