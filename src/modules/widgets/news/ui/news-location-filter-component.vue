<script setup lang="ts">
import { BaseSwitch, ModalFilter, ModalFilterTabWrapper } from '../../base';
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
		<template #title> Location filter </template>

		<template #content>
			<div>
				<div
					v-for="location in locations"
					:key="location.region"
					:class="classes.row"
				>
					<div :class="classes.rowTitle">
						{{ location.region }}
					</div>

					<div :class="classes.content">
						<base-switch
							v-if="location.isCanAllSwitch"
							:class="classes.switch"
							:is-active="location.isActive"
							@click="toggleRegion(location.region)"
						/>

						<div v-if="location.countries.length > 0">
							<div :class="classes.tabs">
								<modal-filter-tab-wrapper
									v-for="country in location.countries"
									:key="country.code"
									:is-active="country.isActive"
									@click.stop.prevent="
										toggleCountry(
											location.region,
											country.code,
										)
									"
								>
									{{ country.name }}
								</modal-filter-tab-wrapper>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</modal-filter>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.switch {
	align-self: flex-end;
	margin-bottom: 8px;
}

.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
