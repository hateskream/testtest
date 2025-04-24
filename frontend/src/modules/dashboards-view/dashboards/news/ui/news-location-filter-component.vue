<script setup lang="ts">
import { BaseFilterModal, BaseFilterModalTabWrapper, BaseSwitch } from '../../base';
import { useNewsStore } from '../stores';

const newsStore = useNewsStore();
</script>

<template>
	<base-filter-modal>
		<template #title> Location filter </template>

		<template #content>
			<div>
				<div
					v-for="location in newsStore.locationFilters"
					:key="location.region"
					:class="classes.row"
				>
					<div :class="classes.rowTitle">
						{{ location.region }}
					</div>

					<div>
						<base-switch :is-active="location.isActive" />

						<div v-if="location.countries.length > 0">
							<div :class="classes.tabs">
								<base-filter-modal-tab-wrapper
									v-for="country in location.countries"
									:key="country.code"
									:is-active="country.isActive"
								>
									{{ country.name }}
								</base-filter-modal-tab-wrapper>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</base-filter-modal>
</template>

<style module="classes">
.tabs {
	display: flex;
	gap: 8px;
	align-items: center;
}

.row {
	display: flex;
	align-items: center;
	padding: 4px 0;
}

.rowTitle {
	flex: 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
}

.rowTitle::first-letter {
	text-transform: uppercase;
}
</style>
