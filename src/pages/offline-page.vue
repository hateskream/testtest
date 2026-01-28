<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useOnline } from '@vueuse/core';

import { ErrorAction, ErrorTemplate } from '@/modules/error';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { isOnline } from '@/shared/lib';
import { RouteNames } from '@/types/route.d';
import { AppLayout } from '@/modules/layout';

const OFFLINE_DESCRIPTION = 'We can’t connect right now.\nPlease check your internet connection and try again';
const ONLINE_DESCRIPTION = 'Connection restored! Everything is ready.';

const route = useRoute();
const router = useRouter();

const isOnlineValue = useOnline();

function toHome() {
	router.replace({ name: RouteNames.Home });
}

function reload() {
	if (!isOnline()) {
		return;
	}

	const { redirect } = route.query;

	if (typeof redirect === 'string') {
		router.replace(redirect);
	} else {
		toHome();
	}
}
</script>

<template>
	<app-layout>
		<div :class="classes.offlinePage">
			<error-template :description="isOnlineValue ? ONLINE_DESCRIPTION : OFFLINE_DESCRIPTION">
				<template #actions>
					<error-action variant="primary" @click="toHome">Homepage</error-action>
					<error-action
						:disabled="!isOnlineValue"
						variant="secondary"
						@click="reload"
					>
						<template #icon>
							<ui-icon :id="IconIds.Retry" />
						</template>
						<template #default>Refresh</template>
					</error-action>
				</template>
			</error-template>
		</div>
	</app-layout>
</template>

<style module="classes">
.offlinePage {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-self: center;
	height: 100%;
}
</style>
