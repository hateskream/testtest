<script setup lang="ts">
import { computed } from 'vue';

import {
	ModalBadge,
	ModalItemSelector,
	ModalBadgeList,
	ModalItemInteraction,
	ModalItemCheckbox,
} from '@/modules/widgets/base';
import type { IMarketSettings, ISingleSetting, IColorDepthSetting } from '../model';
import { TitleViewVariant } from '../model';
import { UiDriver } from '@/shared/ui/driver';
import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';

const market = defineModel<IMarketSettings>('market', { required: true });
const sizeBy = defineModel<ISingleSetting>('sizeBy', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

const activeMarketName = computed(
	() => market.value.markets
		.find(m => m.id === market.value.active)?.displayName || '',
);

const activeSizeBy = computed(
	() => sizeBy.value.values
		.find(sb => sb.key === sizeBy.value.active)?.displayName || '',
);

const activeColorBy = computed(
	() => colorBy.value.values
		.find(cb => cb.key === colorBy.value.active)?.displayName || '',
);

const activeColorDepth = computed(() => {
	const acd = colorDepth.value.values
		.find(cd => cd.id === colorDepth.value.active);

	if (!acd) {
		return '';
	}

	return `${acd.start} to ${acd.end}`;
});

const activeDisplayValue = computed((): string =>
	displayValue.value.values
		.find(dv => dv.key === displayValue.value.active)?.displayName || '',
);

function updateMarket(newActiveId: string) {
	market.value.active = newActiveId;;
}

function updateSizeBy(newSizeBy: string) {
	sizeBy.value.active = newSizeBy;
}

function updateColorBy(newColorBy: string) {
	colorBy.value.active = newColorBy;
}

function updateColorDepth(newColorDepth: string) {
	colorDepth.value.active = newColorDepth;
}

function updateDisplayValue(newDisplayValue: string) {
	displayValue.value.active = newDisplayValue;
}

function updateTitle(newTitle: TitleViewVariant) {
	title.value = newTitle;
}
</script>

<template>
	<div class="root">
		<div class="right">
			<modal-badge class="market">
				<template #title>
					{{ activeMarketName }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						class="icon"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Market</template>
						<template #default>
							<modal-item-selector
								v-for="m in market.markets"
								:key="m.id"
								:model-value="m.id === market.active"
								@update:model-value="updateMarket(m.id)"
							>
								{{ m.displayName }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge class="color">
				<template #title>
					{{ activeColorBy }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						class="icon"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Color by</template>
						<template #default>
							<modal-item-selector
								v-for="cb in colorBy.values"
								:key="cb.key"
								:model-value="cb.key === colorBy.active"
								@update:model-value="updateColorBy(cb.key)"
							>
								{{ cb.displayName }}
							</modal-item-selector>
							<ui-driver />
							<ui-position>
								<template #default>
									<modal-item-interaction>
										Color depth : {{ activeColorDepth }}
									</modal-item-interaction>
								</template>
								<template #content>
									<modal-badge-list>
										<template #title>Color depth</template>
										<template #default>
											<modal-item-selector
												v-for="cd in colorDepth.values"
												:key="cd.id"
												:model-value="cd.id === colorDepth.active"
												@update:model-value="updateColorDepth(cd.id)"
											>
												{{ cd.start }} to {{ cd.end }}
											</modal-item-selector>
										</template>
									</modal-badge-list>
								</template>
							</ui-position>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

			<modal-badge>
				<template #title>
					{{ activeSizeBy }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						class="icon"
					/>
				</template>
				<template #content>
					<modal-badge-list>
						<template #title>Size by</template>
						<template #default>
							<modal-item-selector
								v-for="sb in sizeBy.values"
								:key="sb.key"
								:model-value="sb.key === sizeBy.active"
								@update:model-value="updateSizeBy(sb.key)"
							>
								{{ sb.displayName }}
							</modal-item-selector>
						</template>
					</modal-badge-list>
				</template>
			</modal-badge>

		</div>
		<div class="left">
			<ui-position position="right-start">
				<template #default>
					<ui-icon :id="IconIds.ThreeDots" class="icon" />
				</template>
				<template #content>
					<modal-badge-list>
						<modal-item-checkbox
							v-model="isShowLogo"
						>
							Logo
						</modal-item-checkbox>
						<ui-position>
							<template #default>
								<modal-item-interaction>
									<div>
										Title : {{ title }}
									</div>
								</modal-item-interaction>
							</template>
							<template #content>
								<modal-badge-list>
									<template #default>
										<modal-item-selector
											v-for="t in TitleViewVariant"
											:key="t"
											:model-value="t === title"
											@update:model-value="updateTitle(t)"
										>
											{{ t }}
										</modal-item-selector>
									</template>
								</modal-badge-list>
							</template>
						</ui-position>
						<ui-position>
							<template #default>
								<modal-item-interaction>
									<div>
										Display value : {{ activeDisplayValue }}
									</div>
								</modal-item-interaction>
							</template>
							<template #content>
								<modal-badge-list>
									<template #default>
										<modal-item-selector
											v-for="dv in displayValue.values"
											:key="dv.key"
											:model-value="dv.key === displayValue.active"
											@update:model-value="updateDisplayValue(dv.key)"
										>
											{{ dv.displayName }}
										</modal-item-selector>
									</template>
								</modal-badge-list>
							</template>
						</ui-position>
					</modal-badge-list>
				</template>
			</ui-position>
		</div>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	justify-content: space-between;
	gap: 20px;
}

.right {
	display: flex;
}

.left {
	display: flex;
	align-items: center;
}

.market {
	margin-right: 24px;
}

.color {
	margin-right: 4px;
}

.icon {
	color: rgb(100 101 104 / 100%);
	cursor: pointer;
}

.icon:hover {
	color: rgb(255 255 255 / 100%);
}
</style>
