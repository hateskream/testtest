<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { navigation } from '../constants';
import { createRouteObject } from '../helpers';

interface IMinifiedSidebarProps {
	activeItem: IconIds;
}

const props = defineProps<IMinifiedSidebarProps>();

const emits = defineEmits<{
	expand: [];
}>();
</script>

<template>
	<div class="dashboard-sidebar-minified">
		<div :class="classes.iconWrapper" @click="emits('expand')">
			<ui-icon
				:id="IconIds.Logo"
				width="40px"
				height="12px"
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
						{ [classes.iconNotActive]: item.id !== props.activeItem },
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
</style>
