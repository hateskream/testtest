<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';

const state = defineModel<boolean>({ required: true });

function toggle() {
	state.value = !state.value;
}
</script>

<template>
	<div :class="classes.controls">
		<transition name="slide-right">
			<div v-if="state" :class="classes.expanded">
				<button
					:class="[classes.control, classes.stateButton]"
					@click="toggle"
				>
					<ui-icon :id="IconIds.DoubleChevron" />
				</button>

				<ui-position>
					<template #title>
						<button :class="classes.control">
							<ui-icon :id="IconIds.Burger" />
						</button>
					</template>
					<template #content>
						<slot name="nav-menu" />
					</template>
				</ui-position>

				<ui-position>
					<template #title>
						<button :class="classes.control">
							<ui-icon :id="IconIds.SettingsV2" />
						</button>
					</template>
					<template #content>
						<slot name="settings-menu" />
					</template>
				</ui-position>

				<button :class="classes.control">
					<ui-icon
						:id="IconIds.ControlFullView"
						width="20px"
						height="20px"
					/>
				</button>
			</div>

			<transition
				v-else
				name="slide-left"
			>
				<div v-if="!state" :class="classes.minified">
					<button
						:class="[classes.control, classes.stateButton]"
						@click="toggle"
					>
						<ui-icon
							:id="IconIds.DoubleChevron"
						/>
					</button>

					<ui-position>
						<template #title>
							<button :class="classes.control">
								<ui-icon :id="IconIds.ThreeDots" />
							</button>
						</template>

						<template #content>
							<slot name="extra-menu" />
						</template>
					</ui-position>
				</div>
			</transition>
		</transition>
	</div>
</template>

<style module="classes">
.controls {
	position: relative;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-left: auto;
	gap: var(--padding-padding-s3, 4px);
}

.expanded,
.minified {
	display: flex;
	align-items: center;
}

.controls:hover .stateButton {
	opacity: 1;
}

.control {
	width: 24px;
	height: 24px;
	padding: 0;
	line-height: 0;
	color: var(--text-color-base-100);
	cursor: pointer;
}

.control:hover {
	color: var(--text-color-base-500, #ffffff);
}

.stateButton {
	opacity: 0;
	transition: opacity 0.15s ease;
}

.expanded .stateButton {
	transform: rotate(180deg);
}
</style>

<style scoped>
.slide-right-enter-from,
.slide-right-leave-to {
	position: absolute;
	right: 0;
	transform: translateX(12px);
	opacity: 0 !important;
}

.slide-right-enter-active,
.slide-right-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease !important;
	pointer-events: none;
}

.slide-right-enter-to,
.slide-right-leave-from {
	transform: translateX(0);
	opacity: 1 !important;
}

.slide-left-enter-from {
	transform: translateX(-12px);
	opacity: 0 !important;
	pointer-events: none;
}

.slide-left-enter-to {
	transform: translateX(0);
	opacity: 1 !important;
}

.slide-left-enter-active {
	position: absolute;
	right: 0;
	transition: opacity 0.25s ease, transform 0.25s ease !important;
}
</style>
