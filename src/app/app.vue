<script setup lang="ts">
import { FloatingHost } from '@/shared/ui/position';
import { useAppHead } from '@/shared/composables';
import { UiAppErrorBoundary } from '@/shared/ui/error-boundary';

useAppHead();
</script>

<template>
	<ui-app-error-boundary>
		<router-view />
		<floating-host />
	</ui-app-error-boundary>
</template>
