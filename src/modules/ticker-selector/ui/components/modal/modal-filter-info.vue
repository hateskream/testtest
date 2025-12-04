<script setup lang="ts">
import { FilterListType } from '@/modules/ticker-selector/model';
import { UiPillItem, UiPillWrapper } from '@/shared/ui/pill';

interface IProps {
	totalItems: number;
	totalSelected: number;
	isSearching: boolean;
}

defineProps<IProps>();

const showTypeBoard = defineModel<FilterListType>();

</script>

<template>
	<ui-pill-wrapper>
		<ui-pill-item
			:model-value="showTypeBoard === FilterListType.All"
			@click="showTypeBoard = FilterListType.All"
		>
			<span>All Tickers</span>
			<span>·</span>
			<span>{{ totalItems }}</span>
		</ui-pill-item>

		<ui-pill-item
			v-if="totalSelected > 0 || isSearching"
			:model-value="showTypeBoard === FilterListType.Selected"
			@click="showTypeBoard = FilterListType.Selected"
		>
			<span>Selected</span>
			<span>·</span>
			<span>{{ totalSelected }}</span>
		</ui-pill-item>
	</ui-pill-wrapper>
</template>


<style module="classes">

</style>
