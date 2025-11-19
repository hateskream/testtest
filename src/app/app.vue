<script setup lang="ts">
import { FloatingHost } from '@/shared/ui/position';
import { useAppHead } from '@/shared/composables';

useAppHead();
</script>

<template>
	<router-view />
	<floating-host />
</template>
