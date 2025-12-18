<script setup lang="ts">
import { BaseSwitch } from '@/modules/widgets/base';
import { toggleLocationCountry, toggleLocationRegion, type ILocation } from '../model';
import { UiModalContent, UiModalTitle, UiModalWrapper } from '@/shared/ui/modal';
import {
	UiFilterChip,
	UiFilterChipWrapper, UiFilterRow,
	UiFilterSectionHeader,
	UiFilterSectionLabel,
} from '@/shared/ui/modal-filter';

defineProps<{
	displayVariant: 'new' | 'default';
}>();

const locations = defineModel<ILocation[]>('locations', { required: true });

function toggleRegion(region: string) {
	locations.value = toggleLocationRegion(locations.value, region);
}

function toggleCountry(region: string, countryCode: string) {
	locations.value = toggleLocationCountry(locations.value, region, countryCode);
}
</script>

<template>
	<ui-modal-wrapper
		:style="{
			width: displayVariant === 'new' ? '418px' : '618px',
		}"
		:display-variant="displayVariant"
	>
		<ui-modal-title> Location </ui-modal-title>

		<ui-modal-content>
			<div
				v-for="location in locations"
				:key="location.region"
				:class="classes.row"
			>
				<div v-if="location.isCanAllSwitch">
					<ui-filter-section-header :is-active="location.isActive">
						{{ location.region }}

						<template #right>
							<base-switch
								:class="classes.switch"
								:is-active="location.isActive"
								@click="toggleRegion(location.region)"
							/>
						</template>
					</ui-filter-section-header>

					<ui-filter-row v-if="location.countries.length" :class="classes.content">
						<ui-filter-section-label />

						<ui-filter-chip-wrapper>
							<ui-filter-chip
								v-for="country in location.countries"
								:key="country.code"
								:is-active="country.isActive"
								@click.stop.prevent="toggleCountry(location.region, country.code)"
							>
								{{ country.name }}
							</ui-filter-chip>
						</ui-filter-chip-wrapper>
					</ui-filter-row>
				</div>

				<ui-filter-row v-else>
					<ui-filter-section-label :is-active="location.isActive">
						{{location.region}}
					</ui-filter-section-label>

					<ui-filter-chip-wrapper>
						<ui-filter-chip
							v-for="country in location.countries"
							:key="country.code"
							:is-active="country.isActive"
							@click.stop.prevent="toggleCountry(location.region, country.code)"
						>
							{{ country.name }}
						</ui-filter-chip>
					</ui-filter-chip-wrapper>
				</ui-filter-row>
			</div>
		</ui-modal-content>
	</ui-modal-wrapper>
</template>

<style module="classes">
.row {
	padding: 0 12px;
}

.virtual {
	min-width: 118px;
	font-size: 12px;
	white-space: nowrap;
	visibility: hidden;
}
</style>
