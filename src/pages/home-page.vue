<script setup lang="ts">
import { LayoutDashboard } from '@/modules/dashboard-group';
import { AppLayout } from '@/modules/layout';
</script>

<template>
	<app-layout v-slot="{ close }">
		<layout-dashboard @close="close" />
	</app-layout>
</template>
