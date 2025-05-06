<script setup lang="ts">
import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeTitle } from '../index';
</script>

<template>
	<ui-position position="bottom-start">
		<template #default>
			<modal-badge-title>
				<slot name="title" />
			</modal-badge-title>
		</template>

		<template #content>
			<slot name="content" />
		</template>
	</ui-position>
</template>
