<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

</script>


<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.wrapperTitle">
				<div :class="classes.title">
					Addresses by Time Held
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.addresses">
				<div :class="classes.address">
					<div :class="classes.addressInterval">
						<div :class="classes.addressIntervalCircle" style="background-color: #ffffff;"></div>
						<span :class="classes.addressIntervalText">Cruisers</span>
					</div>
					<div :class="classes.addressPercent">
						65.99%
					</div>
				</div>

				<div :class="classes.address">
					<div :class="classes.addressInterval">
						<div :class="classes.addressIntervalCircle" style="background-color: #a38cde;"></div>
						<span :class="classes.addressIntervalText">Traders</span>
					</div>
					<div :class="classes.addressPercent">
						26.41%
					</div>
				</div>

				<div :class="classes.address">
					<div :class="classes.addressInterval">
						<div :class="classes.addressIntervalCircle" style="background-color: #ff9151;"></div>
						<span :class="classes.addressIntervalText">Holders</span>
					</div>
					<div :class="classes.addressPercent">
						7.60%
					</div>
				</div>
			</div>
			<div :class="classes.line">
				<div
					:class="classes.lineItem"
					:style="{background: '#fff', width: `66%`}"
				/>
				<div
					:class="classes.lineItem"
					:style="{background: '#A38CDE', width: `26.40%`}"
				/>
				<div
					:class="classes.lineItem"
					:style="{background: '#FF9151', width: `7.60%`}"
				/>
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.line {
	display: flex;
	align-items: center;
	margin-top: 10px;
}

.lineItem {
	height: 14px;
}

.line .lineItem:first-child {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.line .lineItem:last-child {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}

.addresses {
	display: flex;
	align-items: center;
	gap: 12px;
}

.wrapperTitle {
	display: flex;
	gap: 8px;
	align-items: center;
}

.title {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	letter-spacing: 0.104px;
}

.addressPercent {
	margin-top: 4px;
	font-style: normal;
	font-weight: 400;
	font-size: 15px;
	color: #ffffff;
	letter-spacing: 0.165px;
}

.addressIntervalText {
	font-style: normal;
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300, #9a9a9d);
	letter-spacing: 0.08px;
}

.addressInterval {
	display: flex;
	align-items: center;
	gap: 4px;
}

.addressIntervalCircle {
	width: 2px;
	height: 2px;
	border-radius: 100%;
}
</style>
