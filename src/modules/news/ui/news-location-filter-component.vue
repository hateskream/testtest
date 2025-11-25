<script setup lang="ts">
import { BaseSwitch, ModalFilter, ModalFilterTabWrapper } from '@/modules/widgets/base';
import { toggleLocationCountry, toggleLocationRegion, type ILocation } from '../model';

const locations = defineModel<ILocation[]>('locations', { required: true });

function toggleRegion(region: string) {
	locations.value = toggleLocationRegion(locations.value, region);
}

function toggleCountry(region: string, countryCode: string) {
	locations.value = toggleLocationCountry(locations.value, region, countryCode);
}
</script>

<template>
	<modal-filter>
		<template #title> Location </template>

		<template #content>
			<div :class="classes.container">
				<div
					v-for="location in locations"
					:key="location.region"
					:class="classes.row"
				>
					<div v-if="location.isCanAllSwitch">
						<div :class="classes.top">
							<span :class="[classes.rowTitle, location.isActive && classes.titleActive]">
								{{ location.region }}
							</span>

							<base-switch
								:class="classes.switch"
								:is-active="location.isActive"
								@click="toggleRegion(location.region)"
							/>
						</div>

						<div v-if="location.countries.length" :class="classes.content">
							<div :class="classes.virtual"></div>
							<div :class="classes.tabs">
								<modal-filter-tab-wrapper
									v-for="country in location.countries"
									:key="country.code"
									:is-active="country.isActive"
									@click.stop.prevent="toggleCountry(location.region, country.code)"
								>
									{{ country.name }}
								</modal-filter-tab-wrapper>
							</div>
						</div>
					</div>

					<div v-else :class="classes.sub">
						<div :class="classes.top">
							<span
								:class="[classes.rowTitle, location.isActive && classes.titleActive]"
							>
								{{location.region}}
							</span>
						</div>

						<div :class="classes.tabs">
							<modal-filter-tab-wrapper
								v-for="country in location.countries"
								:key="country.code"
								:is-active="country.isActive"
								@click.stop.prevent="toggleCountry(location.region, country.code)"
							>
								{{ country.name }}
							</modal-filter-tab-wrapper>
						</div>
					</div>
				</div>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.container {
	width: 508px;
}

.content {
	display: flex;
	width: 100%;
}

.tabs {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	align-items: center;
	padding: 4px 0;
}

.row {
	padding: 0 12px;
}

.sub {
	display: flex;
}

.top {
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	height: 42px;
	padding: 10px 0;
}

.rowTitle {
	min-width: 15ch;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
	transition: all 0.15s ease-in-out;
}

.titleActive {
	color: var(--text-color-base-300-activated);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}

.virtual {
	min-width: 15ch;
	font-size: 12px;
	white-space: nowrap;
	visibility: hidden;
}
</style>
