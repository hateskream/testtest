<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { navigation } from '../constants';
import { createRouteObject } from '../helpers';
import { useActiveLink } from '../composables';

const emits = defineEmits<{
	expand: [];
}>();

const { isActive } = useActiveLink();
</script>

<template>
	<div class="dashboard-sidebar-minified">
		<div :class="classes.iconWrapper" @click="emits('expand')">
			<ui-icon
				:id="IconIds.Logo"
				width="56px"
			/>
		</div>
		<nav>
			<router-link
				v-for="item in navigation"
				:key="`${item.routeName}-${item.id}`"
				:to="createRouteObject(item)"
				:class="classes.iconWrapper"
				:active-class="classes.activeLink"
			>
				<ui-icon
					:id="item.icon"
					:class="[
						classes.iconWrapper,
						{ [classes.active]: isActive(item.routeName) },
					]"
					width="20px"
					height="20px"
				/>
			</router-link>
		</nav>
	</div>
</template>

<style module="classes">
.iconWrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48px;
	height: 48px;
	color: var(--icon-color-base-300);
	cursor: pointer;
	transition: all 0.2s ease-in-out;

	&:hover {
		color: var(--icon-color-base-500);
	}
}

.active {
	color: #ffffff;
}
</style>
