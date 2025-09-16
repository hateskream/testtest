<script setup lang="ts">
import { FilterListType } from '@/modules/ticker-selector/model';


interface IProps {
	totalItems: number;
	totalSelected: number;
	isSearching: boolean;
}

defineProps<IProps>();

const showTypeBoard = defineModel<FilterListType>();

</script>

<template>
	<div :class="classes.listAllBadges">
		<div
			:class="[classes.listAllBadge,
				{ [classes.listAllBadgeActive]: showTypeBoard === FilterListType.All }
			]"
			@click="showTypeBoard = FilterListType.All"
		>
			<span>All Tickers</span>
			<span>·</span>
			<span>{{ totalItems }}</span>
		</div>
		<div
			v-if="totalSelected > 0 || isSearching"
			:class="[classes.listAllBadge,
				{ [classes.listAllBadgeActive]: showTypeBoard === FilterListType.Selected }
			]"
			@click="showTypeBoard = FilterListType.Selected"
		>
			<span>Selected</span>
			<span>·</span>
			<span>{{ totalSelected }}</span>
		</div>
	</div>

</template>


<style module="classes">
.listAllBadges {
	display: flex;
	gap: 6px;
	align-items: center;
	padding-inline: 12px;
	margin-bottom: 6px;
}


.listAllBadge {
	display: flex;
	align-items: center;
	height: 32px;
	padding: 0 12px;
	font-weight: 380;
	font-size: 10px;
	color: var(--text-color-base-300);
	background-color: rgb(37 37 39 / 50%);
	border-radius: 20px;
	gap: 2px;
	cursor: pointer;
	transition: background-color 0.1s ease, color 0.1s ease;
}


.listAllBadgeActive {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}
</style>
