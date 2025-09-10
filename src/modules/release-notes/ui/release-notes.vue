<script setup lang="ts">
import { ref } from 'vue';

import { UiModal } from '@/shared/ui/modal';

import ModalBody from './modal-body.vue';

const isOpen = ref(false);

function toggleModal(): void {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div>
		<div class="activator" @click="toggleModal">i</div>
		<ui-modal v-model="isOpen">
			<modal-body class="modal" @close="toggleModal" />
		</ui-modal>
	</div>
</template>

<style scoped>
.activator {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 60px;
	height: 60px;
	margin-bottom: 20px;
	margin-left: 20px;
	font-size: 50px;
	text-align: center;
	color: #ffffff;
	background: rgb(255 255 255 / 3%);
	border: 1px solid rgb(37 37 39 / 50%);
	border-radius: 50%;
	cursor: pointer;
}

.modal {
	width: 600px;
	margin: 50px 0;
}
</style>
