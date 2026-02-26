<script setup lang="ts">
import { BaseErrorComponent } from '@/modules/widgets/base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<base-error-component @retry="emits('retry')" />
</template>
