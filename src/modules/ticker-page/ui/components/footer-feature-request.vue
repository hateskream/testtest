<script setup lang="ts">
import type { IUserRequestPayload } from '../../api/user-request';
import type { RequestStateType } from '../../model/user-request';

import FooterFeatureRequestInitial from './footer-feature-request-initial.vue';
import FooterFeatureRequestForm from './footer-feature-request-form.vue';
import FooterFeatureRequestSended from './footer-feature-request-sended.vue';

const props = defineProps<{
	state: RequestStateType;
	loading: boolean;
}>();

const emits = defineEmits<{
	'request-feature': [];
	'form-send': [IUserRequestPayload];
}>();
</script>

<template>
	<footer-feature-request-initial
		v-if="props.state === 'initial'"
		@request-feature="emits('request-feature')"
	/>
	<footer-feature-request-form
		v-else-if="props.state === 'form'"
		:loading="props.loading"
		@form-send="emits('form-send', $event)"
	/>
	<footer-feature-request-sended
		v-else
		@request-feature="emits('request-feature')"
	/>
</template>
