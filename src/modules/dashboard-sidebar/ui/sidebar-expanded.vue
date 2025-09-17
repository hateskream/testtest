<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { bottomNavigation, navigation } from '../constants';
import { createRouteObject } from '../helpers';
import { useActiveLink } from '../composables';

const emits = defineEmits<{
	minify: [];
}>();

const { isActive } = useActiveLink();
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.headIndex">
			<div :class="classes.logos" @click="emits('minify')">
				<ui-icon
					:id="IconIds.GlobusLogo"
					width="18px"
					height="18px"
				/>
				<ui-delimiter :class="classes.delimiter" />
				<ui-icon
					:id="IconIds.Logo"
					:class="classes.i88"
					width="56px"
				/>
			</div>
		</div>

		<div :class="classes.bodyIndex">
			<router-link
				v-for="item in navigation"
				:key="`${item.routeName}-${item.id}`"
				:to="createRouteObject(item)"
				:class="classes.link"
				:active-class="classes.activeLink"
			>
				<div :class="classes.iconWrapper">
					<ui-icon
						:id="item.icon"
						:class="[
							classes.iconWrapper,
							{ [classes.active]: isActive(item.routeName) },
						]"
						width="20px"
						height="20px"
					/>
				</div>
				<span :class="classes.linkText">
					{{item.routeLabels}}
				</span>
			</router-link>
		</div>

		<div :class="classes.bottomIndex">
			<router-link
				v-for="item in bottomNavigation"
				:key="`${item.routeName}-${item.id}`"
				:to="createRouteObject(item)"
				:class="classes.bottomLink"
				:active-class="classes.bottomActiveLink"
			>
				<ui-icon
					:id="item.icon"
					width="18px"
					height="18px"
				/>
			</router-link>
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 396px;
	height: calc(100% - 24px);
	background-color: var(--bg-color-surface-00);
}

.headIndex {
	display: flex;
	align-items: center;
	height: 42px;
	margin-bottom: 14px;
	padding: 0 14px;
}

.logos {
	display: flex;
	align-items: center;
	gap: 12px;
	height: 36px;
}

.i88 {
	color: var(--icon-color-base-300);
	cursor: pointer;
	transition: color 0.2s ease-out;
}

.i88:hover {
	color: var(--icon-color-base-500);
}

.delimiter {
	height: 16px;
}

.bodyIndex {
	display: flex;
	flex-direction: column;
	gap: 8px;
	padding: 0 16px 16px;
}

.link {
	display: flex;
	align-items: center;
	width: min-content;
	min-width: 0;
	height: 36px;
	padding: 0 16px 0 8px;
	white-space: nowrap;
	background-color: var(--bg-color-base-300-activated);
	border-radius: 12px;
	cursor: pointer;
	gap: 8px;
}

.linkText {
	font-weight: 300;
	font-size: var(--typography-paragraph-size-p01);
	font-family: 'Roboto Flex', sans-serif;
}

.link,
.linkText {
	color: var(--text-color-base-300);
	transition: color 0.2s ease-out;
}

.activeLink,
.activeLink > .linkText,
.link:hover,
.link:hover > .linkText {
	color: var(--text-color-base-500);
}

.iconWrapper {
	display: grid;
	width: 36px;
	height: 36px;
	place-items: center;
}

.bottomIndex {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: auto;
	gap: 16px;
}

.bottomLink {
	color: var(--text-color-base-500);
	transition: color 0.2s ease-out;
}

.bottomActiveLink,
.bottomLink:hover {
	color: var(--text-color-base-300);
}
</style>
