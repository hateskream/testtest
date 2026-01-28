<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { UiImage } from '@/shared/ui/image';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { RouteNames } from '@/types/route.d';
import { ErrorActionKey, ErrorCode, type ErrorCode as ErrorCodeType, errorConfig, type IErrorAction } from '../model';

import ErrorAction from './error-action.vue';
import ErrorTemplate from './error-template.vue';

const FALLBACK_ERROR_CODE = ErrorCode.SERVER_ERROR;

const props = defineProps<{
	code: ErrorCodeType;
}>();

const emit = defineEmits<{
	(e: 'action', action: IErrorAction): void;
}>();

const router = useRouter();
const route = useRoute();

const currentErrorConfig = computed(() => {
	return errorConfig[props.code] ?? errorConfig[FALLBACK_ERROR_CODE];
});

function toHome() {
	router.replace({ name: RouteNames.Home });
}

function handleAction(action: IErrorAction) {
	emit('action', action);

	if (action.name === ErrorActionKey.HOMEPAGE) {
		toHome();
		return;
	}

	if (action.name === ErrorActionKey.REFRESH) {
		const { redirect } = route.query;

		if (typeof redirect === 'string') {
			router.replace(redirect);
		} else {
			toHome();
		}

		return;
	}
}
</script>

<template>
	<error-template
		:title="currentErrorConfig.title"
		:description="currentErrorConfig.description"
	>
		<template #code>
			<ui-image :src="currentErrorConfig.previewSrc" />
		</template>
		<template v-if="currentErrorConfig.actions?.length" #actions>
			<error-action
				v-for="action in currentErrorConfig.actions"
				:key="action.name"
				:variant="action.variant"
				@click="handleAction(action)"
			>
				<template v-if="action.icon" #icon>
					<ui-icon :id="action.icon as IconIds" />
				</template>
				<template #default>
					{{ action.label }}
				</template>
			</error-action>
		</template>
	</error-template>
</template>

<style module="classes">
</style>
