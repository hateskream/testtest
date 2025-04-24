<script setup lang="ts">
import { BaseFilterModal, BaseFilterModalTabWrapper } from '../../base';
import { FilterType } from '../../base/model/filter-modal';
import { useNewsStore } from '../stores';

const newsStore = useNewsStore();
</script>

<template>
	<base-filter-modal>
		<template #title> Filter </template>

		<template #content>
			<!-- Remove after demo -->
			<div style="padding-bottom: 10px;">
				<div
					v-for="(filter, key) in newsStore.filters"
					:key="key"
					:class="classes.row"
				>
					<div :class="classes.rowTitle">
						{{ filter.name }}
					</div>

					<div
						v-if="filter.type === FilterType.List"
						:class="classes.tabs"
					>
						<base-filter-modal-tab-wrapper
							v-for="item in filter.list"
							:key="`filter-${key}-${item.value}`"
							:is-active="
								(newsStore.filters[key].value as string[]).includes(item.value)
							"
							@click="newsStore.toggleFiltersList(key, item.value)"
						>
							{{ item.label }}
						</base-filter-modal-tab-wrapper>
					</div>
				</div>
			</div>
		</template>
	</base-filter-modal>
</template>

<style module="classes">
.locationFilter {
	position: relative;
}

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
