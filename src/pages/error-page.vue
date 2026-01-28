<script setup lang="ts">
import { ErrorLayout, ErrorPreset } from '@/modules/error';
import { AppLayout } from '@/modules/layout';
import type { ErrorCode } from '@/modules/error/model';

const props = defineProps<{
	code: ErrorCode;
}>();
</script>

<template>
	<app-layout>
		<error-layout>
			<template #content>
				<error-preset :code="props.code" />
			</template>
		</error-layout>
	</app-layout>
</template>
