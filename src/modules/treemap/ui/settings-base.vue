<script setup lang="ts">
import {
	ModalBadge,
	ModalItemSelector,
	ModalBadgeList,
	ModalItemInteraction,
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
import { UiDelimiter } from '@/shared/ui/delimiter';

import ChangeDisplay from './change-display.vue';

interface ISettingsBase {
	activeMarket: IMarket;
	activeColorBy: IColorBy;
	activeColorDepth: IColorDepth;
	activeDisplayValue: ISettings;

	isShowDots: boolean;
	isNegativeColorMarket: boolean;
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
</script>

<template>
	<div class="heatmap-toolbar">
		<div class="start-group">
			<modal-badge
				class="market-modal"
				:background-color="props.isNegativeColorMarket ? 'var(--color-bg-contrast-300, #DCDCDF)' : undefined"
				:color="props.isNegativeColorMarket ? 'var(--color-text-contrast-500, #0C0C0E)' : undefined"
				strategy="absolute"
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

			<ui-delimiter class="delimiter" />

			<modal-badge class="color-modal" strategy="absolute">
				<template #title="{ isVisible }">
					<ui-icon
						:id="IconIds.Color"
						width="12"
						height="12"
					/>
					<span class="color-modal-text">{{ props.activeColorBy.colorBy.displayName }}</span>

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
										Color depth <span class="dot" /> {{ props.activeColorDepth.start }} to {{ props.activeColorDepth.end }}
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
		<div v-if="props.isShowDots" class="end-group">
			<ui-position position="right-start" strategy="absolute">
				<template #default>
					<ui-icon :id="IconIds.ThreeDots" class="icon" />
				</template>
				<template #content>
					<change-display
						v-model:display-value="displayValue"
						v-model:is-show-logo="isShowLogo"
						v-model:title="title"
						:active-display-value="props.activeDisplayValue"
					/>
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
	container-type: inline-size;
}

.start-group {
	display: flex;
	align-items: center;
}

.end-group {
	display: flex;
	align-items: center;
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

.dot {
	width: 1px;
	height: 1px;
	border: 1px solid var(--color-text-base-300, #9a9a9d);
	border-radius: 100%;
}

.delimiter {
	margin-inline: 12px;
}

@container (max-width: 600px) {
	.color-modal-text {
		display: none;
	}

	.other :deep(.setting-text) {
		display: none;
	}
}
</style>
