<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { IconIds } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiControlButton } from '@/shared/ui/control-button';
import { UserRequestConfig, type IUserRequestPayload } from '../../api/user-request';

import FooterFeatureRequestImagePreview from './previews/footer-feature-request-image-preview.vue';
import FooterFeatureRequestFilePreview from './previews/footer-feature-request-file-preview.vue';

const props = defineProps<{
	loading: boolean;
}>();

const emits = defineEmits<{
	'form-send': [IUserRequestPayload];
}>();

interface IUserFile {
	url: string;
	file: File;
	isImage: boolean;
}

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea');
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput');

const inputValue = ref('');
const attachedFiles = ref<IUserFile[]>([]);
const isDragging = ref(false);
let dragCounter = 0;

function isValidFile(file: File) {
	if (file.size === 0) {
		return false;
	}

	if (file.size > UserRequestConfig.MaxFileSize) {
		return false;
	}

	const extension = file.name.split('.').pop()?.toLowerCase();
	if (extension === 'lnk' || extension === 'url') {
		return false;
	}

	return true;
}

function addFiles(files: FileList | File[]) {
	for (const file of files) {
		if (!isValidFile(file)) {
			continue;
		}

		if (attachedFiles.value.length >= UserRequestConfig.MaxFiles) {
			break;
		}

		const isImage = file.type.startsWith('image/');
		attachedFiles.value.push({
			file,
			url: isImage ? URL.createObjectURL(file) : '',
			isImage,
		});
	}
}

function removeFile(index: number) {
	const [removed] = attachedFiles.value.splice(index, 1);
	if (removed.url) {
		URL.revokeObjectURL(removed.url);
	}
}

function handleInput() {
	if (!textareaRef.value) {
		return;
	}

	textareaRef.value.style.height = 'auto';
	textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
}

function handlePaste(event: ClipboardEvent) {
	const files = event.clipboardData?.files;

	if (!files?.length) {
		return;
	}

	addFiles(files);
}

function handleDragEnter() {
	dragCounter++;
	isDragging.value = true;
}

function handleDragLeave() {
	dragCounter--;

	if (dragCounter === 0) {
		isDragging.value = false;
	}
}

function handleDrop(event: DragEvent) {
	event.preventDefault();
	dragCounter = 0;
	isDragging.value = false;

	const items = event.dataTransfer?.items;

	if (!items?.length) {
		return;
	}

	const files: File[] = [];

	for (const item of items) {
		const entry = item.webkitGetAsEntry?.();

		if (entry && !entry.isFile) {
			continue;
		}

		const file = item.getAsFile();

		if (file) {
			files.push(file);
		}
	}

	addFiles(files);
}

function handleFileChange(event: Event) {
	const input = event.target as HTMLInputElement;

	if (!input.files) {
		return;
	}

	addFiles(input.files);
	input.value = '';
}

function openFilePicker() {
	fileInputRef.value?.click();
}

function onFormSend() {
	const trimmed = inputValue.value.trim();

	if (trimmed.length < UserRequestConfig.MinTextLength) {
		return;
	}

	if (trimmed.length > UserRequestConfig.MaxTextLength) {
		return;
	}

	if (attachedFiles.value.length > UserRequestConfig.MaxFiles) {
		return;
	}

	emits('form-send', {
		text: trimmed,
		images: attachedFiles.value.map(({ file }) => file),
	});
}
</script>

<template>
	<section
		:class="{
			[classes.textBlock]: true,
			[classes.dragging]: isDragging,
			[classes.loading]: props.loading
		}"
		@dragover.prevent
		@dragenter.prevent="handleDragEnter"
		@dragleave="handleDragLeave"
		@drop="handleDrop"
	>
		<div :class="classes.head">
			<ui-text token="title-400">
				Missing feature?
			</ui-text>

			<ui-text token="text-400-r" :class="classes.subheading">
				Describe your idea and we'll make it happen
			</ui-text>
		</div>

		<div :class="classes.attached">
			<div :class="classes.wrapper">
				<div :class="classes.text">
					<div :class="classes.fadeWrap">
						<div :class="classes.top"></div>
					</div>

					<ui-text token="text-300-r" :class="classes.textAreaWrapper">
						<textarea
							ref="textarea"
							v-model="inputValue"
							:class="classes.textArea"
							placeholder="Type your idea here..."
							rows="1"
							@input="handleInput"
							@paste="handlePaste"
						/>
					</ui-text>
				</div>

				<ui-control-button
					token="m-24"
					:icon-id="IconIds.Attachment"
					@click="openFilePicker"
				/>

				<input
					ref="fileInput"
					type="file"
					multiple
					hidden
					@change="handleFileChange"
				/>
			</div>

			<div v-if="attachedFiles.length" :class="classes.previews">
				<template
					v-for="(item, index) in attachedFiles"
					:key="item.file.name + index"
				>
					<footer-feature-request-image-preview
						v-if="item.isImage"
						:url="item.url"
						:filename="item.file.name"
						@remove="removeFile(index)"
					/>
					<footer-feature-request-file-preview
						v-else
						:filename="item.file.name"
						@remove="removeFile(index)"
					/>
				</template>
			</div>
		</div>

		<ui-control-button
			token="l-24-bg"
			:icon-id="IconIds.ArrowUp"
			:disabled="loading"
			@click="onFormSend"
		>
			Send
		</ui-control-button>
	</section>
</template>

<style module="classes">
.textBlock {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	min-width: 300px;
	padding: 16px;
	border-radius: 8px;
	outline: 2px solid transparent;
	outline-offset: -2px;
	transition: outline-color 0.2s ease-in-out;
	gap: 24px;
}

.dragging {
	outline-color: rgb(255 255 255);
}

.head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	align-self: stretch;
}

.subheading {
	width: 187px;
	color: var(--color-text-base-300, #9a9a9d);
}

.attached {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	align-self: stretch;
}

.wrapper {
	display: flex;
	align-items: flex-end;
	align-self: stretch;
	min-width: 300px;
	padding: 2px;
	border-radius: 8px;
	gap: var(--padding-padding-s3, 4px);
}

.text {
	position: relative;
	display: flex;
	flex: 1 0 0;
	align-items: flex-end;
	max-height: 400px;
	border-bottom: 1px solid var(--border-surf-04, rgb(73 73 80 / 32%));
	gap: var(--padding-padding-s2, 2px);
}

.fadeWrap {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	padding-top: var(--padding-padding-s6, 10px);
	pointer-events: none;
	inset: 0;
	touch-action: none;
}

.top {
	position: absolute;
	top: -10px;
	align-self: stretch;
	width: 100%;
	height: 20px;
	background: linear-gradient(180deg, #030303 0%, #03030384 14%, rgb(0 0 0 / 0%) 100%);
}

.textAreaWrapper {
	flex: 1 0 0;
	max-height: 400px;
	padding:
		var(--padding-padding-s7, 12px) var(--padding-padding-s3, 4px)
		var(--padding-padding-s5, 8px) var(--padding-padding-s3, 4px);
	overflow: scroll;
	scrollbar-width: none;
}

.textAreaWrapper::-webkit-scrollbar {
	display: none;
}

.textArea {
	display: block;
	width: 100%;
	min-height: 24px;
	padding: 0;
	overflow: hidden;
	font-size: inherit;
	line-height: inherit;
	font-family: inherit;
	color: var(--text-500, rgb(255 255 255 / 96%));
	background: none;
	border: none;
	outline: none;
	resize: none;
}

.textArea::placeholder {
	color: var(--text-100, rgb(255 255 255 / 30%));
}

.previews {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: var(--padding-padding-s3, 4px);
}
</style>
