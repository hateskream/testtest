<script setup lang="ts">
import {
	BaseTickerModalWrapper,
	BaseTickerModalHeader,
	BaseTickerModalContent,
} from '@/modules/widgets/base';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import type { CompanyHeadquarters } from '../../model';

import HeadquartersCitiesContent from '../common/headquarters-cities-content.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
	data: CompanyHeadquarters;
}>();

const isFullscreen = defineModel<boolean>({
	required: true,
});
</script>

<template>
	<base-ticker-modal-wrapper v-model="isFullscreen">
		<base-ticker-modal-header>
			{{ props.meta.name }}
		</base-ticker-modal-header>
		<base-ticker-modal-content>
			<headquarters-cities-content :data="props.data" is-fullscreen />
		</base-ticker-modal-content>
	</base-ticker-modal-wrapper>
</template>

<style module="classes">

</style>
