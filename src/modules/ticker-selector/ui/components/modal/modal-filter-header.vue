<script setup lang="ts">
import { ModalSearch } from '@/modules/widgets/base';

interface IModalFilterHeaderProps {
	isBackgroundTransparent?: boolean;
	autofocus?: boolean;
	textAboveSearch?: string;
	searchPlaceholder?: string;
}

const props = withDefaults(defineProps<IModalFilterHeaderProps>(), {
	isBackgroundTransparent: false,
	textAboveSearch: '',
	searchPlaceholder: 'Start typing the ticker...',
});

const queryModel = defineModel<string>('query', { default: '' });
</script>


<template>
	<div
		:class="classes.header"
		:style="isBackgroundTransparent
			? {
				background: 'linear-gradient(to top, transparent 0, var(--bg-color-surface-01) 22%)',
			}
			: {
				background: 'linear-gradient(to top, transparent 0, var(--bg-modal-color-base) 22%)',
			}"
	>
		<div
			v-if="props.textAboveSearch"
			:class="classes.textAboveSearch"
		>
			{{ props.textAboveSearch }}
		</div>

		<div :class="classes.search">
			<modal-search
				v-model="queryModel"
				:placeholder="props.searchPlaceholder"
				:autofocus="props.autofocus"
			/>
		</div>
	</div>
</template>

<style module="classes">
.textAboveSearch {
	padding: 12px;
	font-style: normal;
	text-align: center;
}

.search {
	padding-inline: 12px;
}

.header {
	margin-bottom: 20px;
}
</style>
