<script setup lang="ts">
import { computed, ref, toValue } from 'vue';

import { ModalItemCheckbox, ModalSearch } from '..';
import { UiImage } from '@/shared/ui/image';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import type {
	IModalFilterTicker,
	IModalFilterTickerLists,
	IModalFilterTickerWithGroup,
} from '../model';
import { compareStrings } from '@/shared/lib';

interface IModalFilterTickerProps {
	modelValue: IModalFilterTickerLists;
	isMultiSelect?: boolean;
}

const props = withDefaults(defineProps<IModalFilterTickerProps>(), {
	isMultiSelect: true,
});

interface IModalFilterTickerEmits {
	(e: 'update:modelValue', data: IModalFilterTickerLists): void;
}

const emits = defineEmits<IModalFilterTickerEmits>();

const selectedItems = computed<IModalFilterTickerWithGroup[]>(() =>
	Object.entries(props.modelValue)
		.map(([group, arr]) => arr.map(item => ({ ...item, group })))
		.flat()
		.filter(item => item.isSelected),
);

const totalItems = computed(() =>
	Object.values(props.modelValue).reduce((acc, curr) => acc + curr.length, 0),
);

const selectAll = ref<{ [x: string]: boolean }>(
	Object.keys(props.modelValue).reduce((acc, curr)=> (acc[curr]= false, acc), {} as { [x: string]: boolean }),
);

const search = ref('');

const currentStage = ref<string>('');

const selectedBadge = ref<'all' | 'selected'>('all');

function handleUpdateSelect(toUpdateItem: IModalFilterTicker, group: string, value: boolean) {
	const toUpdateIdx = props.modelValue[group].findIndex(item =>
		compareStrings(item.ticker, toUpdateItem.ticker),
	)!;

	const newList = toValue(props.modelValue);

	newList[group][toUpdateIdx].isSelected = value;

	emits('update:modelValue', newList);

	if (selectedItems.value.length === 0) {
		selectedBadge.value = 'all';
	}
}


</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.search">
			<modal-search v-model="search" />
		</div>

		<div v-if="selectedItems.length > 0" :class="classes.listBadge">
			<div
				v-for="item in selectedItems"
				:key="item.ticker"
				:class="classes.badge"
			>
				<div :class="classes.badgeImageWrapper">
					<ui-image
						:src="item.image"
						:class="classes.badgeImage"
						replacement="/images/market/ADA.png"
					/>
				</div>
				<div :class="classes.badgeTitle">
					{{ item.ticker }}
				</div>
				<div @click="handleUpdateSelect(item, item.group, false)">
					<ui-icon
						:id="IconIds.Close"
						width="10"
						height="10"
						:class="classes.badgeRemoveIcon"
					/>
				</div>
			</div>
		</div>

		<div :class="classes.listAllBadges">
			<div
				:class="[classes.listAllBadge,
					{ [classes.listAllBadgeActive]: selectedBadge === 'all'}
				]"
				@click="selectedBadge = 'all'"
			>
				<span>All</span>
				<span>·</span>
				<span>{{ totalItems }}</span>
			</div>
			<div
				v-if="selectedItems.length > 0"
				:class="[classes.listAllBadge,
					{ [classes.listAllBadgeActive]: selectedBadge === 'selected'}
				]"
				@click="selectedBadge = 'selected'"
			>
				<span>Selected</span>
				<span>·</span>
				<span>{{ selectedItems.length }}</span>
			</div>
		</div>

		<template v-if="selectedBadge === 'all'">
			<template
				v-if="currentStage === ''"
			>
				<div
					v-for="(list, name) in modelValue"
					:key="name"
				>
					<div :class="classes.listItem">
						<div :class="classes.listItemTitle" @click="currentStage = <string>name">{{ name }}</div>
						<div>
							<modal-item-checkbox
								v-for="item in list.slice(0, 3)"
								:key="item.ticker"
								:model-value="item.isSelected"
								@update:model-value="
									handleUpdateSelect(item, name as string, !item.isSelected)
								"
							>
								<div :class="classes.listItemData">
									<div :class="classes.listItemDataImageWrapper">
										<ui-image
											:src="item.image"
											:class="classes.listItemDataImage"
											replacement="/images/market/ADA.png"
										/>
									</div>

									<div :class="classes.listItemDataNameWrapper">
										<span :class="classes.listItemDataName">
											{{ item.ticker }}
										</span>
										<span>·</span>
										<span :class="classes.listItemDataSubName">
											{{ item.name }}
										</span>
									</div>
								</div>
							</modal-item-checkbox>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div :class="classes.listItem">
					<div :class="classes.listItemTitle" @click="currentStage = ''">
						<ui-icon :id="IconIds.Back" />
						{{ currentStage }}
						<span>·</span>
						<span :class="classes.listItemTitleBadge">
							{{ modelValue[currentStage].length }}
						</span>
					</div>
					<div>
						<modal-item-checkbox v-model="selectAll[currentStage]">
							<div :class="classes.listItemData">
								<div :class="classes.listItemDataImageWrapper">
									<ui-icon
										:id="IconIds.Cryptos"
										:class="classes.listItemDataImage"
										replacement="/images/market/ADA.png"
									/>
								</div>
								<div :class="classes.listItemDataNameWrapper">
									<span :class="classes.listItemDataName">
										All {{ currentStage }}
									</span>
								</div>
							</div>
						</modal-item-checkbox>
						<modal-item-checkbox
							v-for="item in modelValue[currentStage]"
							:key="item.ticker"
							:model-value="item.isSelected"
							@update:model-value="
								handleUpdateSelect(item, currentStage, !item.isSelected)
							"
						>
							<div :class="classes.listItemData">
								<div :class="classes.listItemDataImageWrapper">
									<ui-image
										:src="item.image"
										:class="classes.listItemDataImage"
										replacement="/images/market/ADA.png"
									/>
								</div>

								<div :class="classes.listItemDataNameWrapper">
									<span :class="classes.listItemDataName">
										{{ item.ticker }}
									</span>
									<span>·</span>
									<span :class="classes.listItemDataSubName">
										{{ item.name }}
									</span>
								</div>
							</div>
						</modal-item-checkbox>
					</div>
				</div>
			</template>
		</template>
		<template v-else>
			<div :class="classes.listItem" style="margin-top: 15px;">
				<div>
					<modal-item-checkbox
						v-for="item in selectedItems"
						:key="item.ticker"
						:model-value="item.isSelected"
						@update:model-value="
							handleUpdateSelect(item, item.group, !item.isSelected)
						"
					>
						<div :class="classes.listItemData">
							<div :class="classes.listItemDataImageWrapper">
								<ui-image
									:src="item.image"
									:class="classes.listItemDataImage"
									replacement="/images/market/ADA.png"
								/>
							</div>

							<div :class="classes.listItemDataNameWrapper">
								<span :class="classes.listItemDataName">
									{{ item.ticker }}
								</span>
								<span>·</span>
								<span :class="classes.listItemDataSubName">
									{{ item.name }}
								</span>
							</div>
						</div>
					</modal-item-checkbox>
				</div>
			</div>
		</template>
	</div>
</template>

<style module="classes">
.listBadge {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
	overflow: hidden;
	gap: 4px;
	padding-inline: 12px;
}

.badgeRemoveIcon {
	color: var(--icon-color-base-300);
}

.badge {
	display: flex;
	justify-content: center;
	align-items: center;
	width: max-content;
	padding: 6px 10px 6px 8px;
	background: var(--bg-color-base-100-activated);
	border-radius: 28px;
	gap: 4px;
}

.badgeTitle {
	font-style: normal;
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300-activated);
	letter-spacing: 0.096px;
}

.badgeImageWrapper {
	width: 20px;
	height: 20px;
	aspect-ratio: 1/1;
}

.badgeImage {
	border-radius: 100%;
}

.wrapper {
	width: 286px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid rgb(199 199 199 / 10%);
	border-radius: 18px;
}

.listItemDataTitle {
	width: 100%;
	padding: 10px 12px;
}

.listItemDataNameWrapper {
	display: flex;
	align-items: center;
	gap: 6px;
}

.listItemDataImageWrapper {
	width: 24px;
	height: 24px;
}

.listItemDataImage {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	padding: 4px;
	border: 1px solid var(--border-color-base-300);
	border-radius: 100px;
}

.listItemData {
	display: flex;
	align-items: center;
	gap: 12px;
}

.listItemDataName {
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	text-transform: uppercase;
}

.listItemDataSubName {
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
}

.listItemTitle {
	display: flex;
	align-items: center;
	padding: 12px 12px 10px;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	letter-spacing: 0.052px;
	gap: 4px;
}

.search {
	padding-inline: 12px;
	margin-bottom: 12px;
}

.listItemTitleBadge {
	padding: 4px 6px;
	font-weight: 440;
	font-size: 12px;
	background-color: rgb(255 255 255 / 9%);
	border-radius: 8px;
}

.listAllBadge {
	display: flex;
	align-items: center;
	padding: 7px 12px;
	font-weight: 380;
	font-size: 10px;
	color: var(--text-color-base-300);
	background-color: rgb(37 37 39 / 50%);
	border-radius: 16px;
	gap: 2px;
	cursor: pointer;
	transition: background-color 0.1s ease, color 0.1s ease;
}

.listAllBadgeActive {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}

.listAllBadges {
	display: flex;
	gap: 6px;
	align-items: center;
	padding-inline: 12px;
}
</style>
