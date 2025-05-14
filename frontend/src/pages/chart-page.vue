<script setup lang="ts">
import {ref} from 'vue';

import { LayoutComponent } from '@/modules/layout';
import { ChartHeader, ChartLayout, ColumnsLayout } from '@/modules/chart';
import {IconIds, UiIcon} from '@/shared/ui/icon';

import PlaceholderComponent from '@/modules/dashboard-grid/ui/placeholder-component.vue';


const viewMode = ref('mixed');

const chartLayoutEl = ref<InstanceType<typeof ChartLayout> | null>(null);
const setChart = ()=>{
	chartLayoutEl.value?.setMixedViewMode();
}
const setReports = ()=>{
	chartLayoutEl.value?.setReportsViewMode();
}
</script>

<template>
	<layout-component>
		<template #content>
			<chart-layout ref="chartLayoutEl" @change-view="viewMode=$event">
				<template #header>
					<chart-header />
				</template>
				<template #topContent>
					<div :class="classes.placeholderTop"></div>
				</template>
				<template #botContent>
					<columns-layout>
						<template #leftCol>
							<div :class="classes.columnTitle">
								<ui-icon
									:id="IconIds.Gainers"
									:class="classes.titleIcon"
									width="20px"
									height="20px"
								/>
								<span>Overview</span>
							</div>
							<div :class="classes.columnContent">
								<placeholder-component />
							</div>
						</template>
						<template #mainCol>
							<div :class="classes.columnTitle">
								<ui-icon
									:id="IconIds.Gainers"
									:class="classes.titleIcon"
									width="20px"
									height="20px"
								/>
								<span>Financials</span>
							</div>
							<div :class="classes.columnContent">
								<placeholder-component />
							</div>
						</template>
						<template #rightCol>
							<div :class="classes.columnTitle">
								<ui-icon
									:id="IconIds.Gainers"
									:class="classes.titleIcon"
									width="20px"
									height="20px"
								/>
								<span>Insights & Activity</span>
							</div>
							<div :class="classes.columnContent">
								<placeholder-component />
								<placeholder-component />
								<placeholder-component />
								<placeholder-component />
							</div>
						</template>
					</columns-layout>
				</template>/
			</chart-layout>
			<div :class="classes.navigation">
				<button :class="[classes.navigationBtn,{[classes.active]:viewMode==='mixed'}]" @click="setChart">
					Mixed
				</button>
				<button :class="[classes.navigationBtn,{[classes.active]:viewMode==='reports'}]" @click="setReports">
					Reports
				</button>
			</div>
		</template>
	</layout-component>
</template>
<style module="classes">
.placeholderTop{
	background:yellow;
	min-height:400px;
}
.columnTitle{
	display:flex;
	align-items:center;
	gap:8px;
	font-size:var(--typography-headers-size-h02);
	margin-bottom:22px;
}
.titleIcon{
	color:#fff;
}
.columnContent{
	display:flex;
	flex-direction: column;
	gap:20px;
	min-height:300px;
	&>*{
		min-height:300px;
	}
}
.navigation{
	display:flex;
	position:fixed;
	bottom:15px;
	left:50%;
	transform:translateX(-50%);
	border-radius: 99px;
	border: 1px solid rgba(199, 199, 199, 0.10);
	background: rgba(84, 84, 95, 0.60);
	box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.35);
	backdrop-filter: blur(12px);
	button{
		border-radius: 100px;
		cursor:pointer;
		height:34px;
		padding:0 12px;
		color:#9A9A9D;
	}
}
.active{
	background: #fff;
}
</style>
