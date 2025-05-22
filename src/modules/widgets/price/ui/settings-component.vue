<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { usePriceStore } from '../stores';

import ToggleComponent from './toggle-component.vue';

const priceStore = usePriceStore();
const { isShowChart, isShowPercentageChange, isShowLogo, isShowTicker, isShowDescription } =
	storeToRefs(priceStore);

const {
	toggleShowChart,
	toggleShowPercentageChange,
	toggleShowLogo,
	toggleShowTicker,
	toggleShowDescription,
} = priceStore;

const settings = [
	{ label: 'Chart', toggle: toggleShowChart, value: isShowChart },
	{ label: 'Change, %', toggle: toggleShowPercentageChange, value: isShowPercentageChange },
	{ label: 'Logo', toggle: toggleShowLogo, value: isShowLogo },
	{ label: 'Ticker', toggle: toggleShowTicker, value: isShowTicker },
	{ label: 'Description', toggle: toggleShowDescription, value: isShowDescription },
];
</script>

<template>
	<div :class="classes.root">
		<h3 :class="classes.title">Additional features</h3>
		<ul :class="classes.list">
			<li
				v-for="(setting, index) in settings"
				:key="index"
				:class="[classes.item]"
			>
				<toggle-component
					:checked="setting.value.value"
					:label="setting.label"
					@update:checked="setting.toggle"
				/>
			</li>
		</ul>
	</div>
</template>

<style module="classes">
.root {
	padding: 6px;
	color: #ffffff;
	background-color: rgb(22 22 24 / 100%);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 18px;
}

.title {
	padding: 12px;
	font-weight: 500;
	font-size: 16px;
	color: rgb(146 146 149 / 100%);
}

.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 12px;
	border-radius: 16px;
	cursor: pointer;
}

.item:hover {
	background-color: rgb(49 49 53 / 20%);
}
</style>
