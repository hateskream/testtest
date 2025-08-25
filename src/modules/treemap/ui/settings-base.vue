<script setup lang="ts">
import {
	ModalBadge,
	ModalItemSelector,
	ModalBadgeList,
	ModalItemInteraction,
	ModalItemCheckbox,
} from '@/modules/widgets/base';
import type {
	IMarketSettings,
	ISingleSetting,
	IColorDepthSetting,
	IMarket,
	IColorBy,
	IColorDepth,
	ISettings,
} from '../model';
import { TitleViewVariant } from '../model';
import { UiDriver } from '@/shared/ui/driver';
import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';

interface ISettingsBase {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeDisplayValue: ISettings;
}

const props = defineProps<ISettingsBase>();

const market = defineModel<IMarketSettings>('market', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
const isShowLogo = defineModel<boolean>('isShowLogo', { required: true });
const title = defineModel<TitleViewVariant>('title', { required: true });

function updateMarket(newActiveId: string) {
	market.value.active = newActiveId;
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
	<div class="heatmap-toolbar">
		<div class="start-group">
			<modal-badge
				class="market-modal"
				background-color="var(--color-bg-contrast-300, #DCDCDF)"
				color="var(--color-text-contrast-500, #0C0C0E)"
			>
				<template #title="{ isVisible }">
					{{ props.activeMarket.displayName }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
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

			<modal-badge class="color-modal">
				<template #title="{ isVisible }">

					{{ props.activeColorBy.colorBy.displayName }}

					<ui-icon
						:id="IconIds.DropdownDown"
						width="12"
						height="12"
						:class="['dropdown-icon', { 'rotated': isVisible }]"
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
										<!-- eslint-disable-next-line @stylistic/max-len -->
										Color depth : {{ props.activeColorDepth.start }} to {{ props.activeColorDepth.end }}
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

			<div class="other">
				<slot />
			</div>

		</div>
		<div class="end-group">
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
										Display value : {{ props.activeDisplayValue.displayName }}
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
.heatmap-toolbar {
	display: flex;
	justify-content: space-between;
	gap: 20px;
}

.start-group {
	display: flex;
}

.end-group {
	display: flex;
	align-items: center;
}

.market-modal {
	margin-right: 24px;
}

.color-modal {
	margin-right: 4px;
}

.color-modal,
.market-modal {
	&:hover {
		.dropdown-icon {
			color: rgb(255 255 255 / 100%);
		}
	}
}

.other {
	display: flex;
	align-items: center;
	gap: 4px;
}

.dropdown-icon {
	transition: transform 0.3s ease;

	&.rotated {
		transform: rotate(-180deg);
	}
}
</style>
