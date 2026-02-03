<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiControlButton } from '@/shared/ui/control-button';
import { RequestFeatureConfig, type IRequestFeaturePayload } from '../../api/request-feature';

const props = defineProps<{
	state: 'initial' | 'form' | 'sended';
}>();

const emits = defineEmits<{
	'request-feature': [];
	'form-send': [IRequestFeaturePayload];
}>();

interface IUserImage {
	url: string;
	file: File;
}

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea');
const fileInputRef = useTemplateRef<HTMLInputElement>('fileInput');

const inputValue = ref('');
const images = ref<IUserImage[]>([]);

function addImages(files: FileList | File[]) {
	for (const file of files) {
		if (!file.type.startsWith('image/')) {
			continue;
		}

		if (file.size > RequestFeatureConfig.MaxFileSize) {
			continue;
		}

		if (images.value.length >= RequestFeatureConfig.MaxImages) {
			break;
		}

		images.value.push({ file, url: URL.createObjectURL(file) });
	}
}

function removeImage(index: number) {
	const [removed] = images.value.splice(index, 1);
	URL.revokeObjectURL(removed.url);
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

	addImages(files);
}

function handleDrop(event: DragEvent) {
	event.preventDefault();

	const files = event.dataTransfer?.files;

	if (!files?.length) {
		return;
	}

	addImages(files);
}

function handleFileChange(event: Event) {
	const input = event.target as HTMLInputElement;

	if (!input.files) {
		return;
	}

	addImages(input.files);
	input.value = '';
}

function openFilePicker() {
	fileInputRef.value?.click();
}

function onFormSend() {
	const trimmed = inputValue.value.trim();

	if (trimmed.length < RequestFeatureConfig.MinTextLength) {
		return;
	}

	if (trimmed.length > RequestFeatureConfig.MaxTextLength) {
		return;
	}

	if (images.value.length > RequestFeatureConfig.MaxImages) {
		return;
	}

	emits('form-send', {
		text: trimmed,
		images: images.value.map(({ file }) => file),
	});

	inputValue.value = '';
	images.value = [];
}
</script>

<template>
	<section :class="classes.textBlock">
		<template v-if="props.state === 'initial'">
			<div :class="classes.head">
				<ui-text token="title-400">
					Missing feature?
				</ui-text>

				<ui-text token="text-400-r" :class="classes.subheading">
					Describe your idea <br>
					and we’ll make it happen
				</ui-text>
			</div>

			<ui-control-button
				token="l-24-bg"
				:icon-id="IconIds.Feedback"
				@click="emits('request-feature')"
			>
				Request a feature
			</ui-control-button>
		</template>

		<template v-else-if="props.state === 'form'">
			<div :class="classes.head">
				<ui-text token="title-400">
					Missing feature?
				</ui-text>

				<ui-text token="text-400-r" :class="classes.subheading">
					Describe your idea and we’ll make it happen
				</ui-text>
			</div>

			<div :class="classes.attached">
				<div
					:class="classes.wrapper"
					@dragover.prevent
					@dragleave.prevent
					@drop="handleDrop"
				>
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
					<button
						:class="classes.file"
						:disabled="images.length >= RequestFeatureConfig.MaxImages"
						@click="openFilePicker"
					>
						<ui-icon
							:id="IconIds.Attachment"
							width="16px"
							height="16px"
						/>
					</button>

					<input
						ref="fileInput"
						type="file"
						accept="image/*"
						multiple
						hidden
						@change="handleFileChange"
					/>
				</div>

				<div v-if="images.length" :class="classes.previews">
					<div
						v-for="(image, index) in images"
						:key="image.url"
						:class="classes.previewItem"
						:style="{ backgroundImage: `url(${image.url})` }"
					>
						<button :class="classes.removeButton" @click="removeImage(index)">
							<ui-icon
								:id="IconIds.CloseThicc"
								width="6px"
								height="6px"
							/>
						</button>
					</div>
				</div>
			</div>

			<ui-control-button
				token="l-24-bg"
				:icon-id="IconIds.ArrowUp"
				@click="onFormSend"
			>
				Send
			</ui-control-button>
		</template>

		<template v-else>
			<div :class="classes.head">
				<ui-text token="title-400">
					Thanks! Your idea is on its way
				</ui-text>

				<ui-text token="text-400-r" :class="classes.subheading">
					Got another idea? Feel <br>
					free to share more
				</ui-text>
			</div>

			<ui-control-button
				token="l-24-bg"
				:icon-id="IconIds.Feedback"
				@click="emits('request-feature')"
			>
				Request a feature
			</ui-control-button>
		</template>
	</section>
</template>

<style module="classes">
.textBlock {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	min-width: 300px;
	gap: 24px;
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

.file {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 44px;
	height: var(--height-height-s17, 44px);
	color: rgb(128 128 128 / 100%);
	border-radius: 8px;
	cursor: pointer;
	transition-timing-function: ease-in-out;
	transition-duration: 0.3s;
	transition-property: color, background-color, transform;
	gap: 10px;
}

.file:hover {
	color: rgb(255 255 255 / 80%);
	background-color: rgb(73 73 80 / 16%);
	transform: scale(1.08);
}

.file:focus-visible {
	outline: 2px solid rgb(255 255 255 / 30%);
	outline-offset: 2px;
}

.file:disabled {
	color: rgb(128 128 128 / 40%);
	cursor: not-allowed;
	opacity: 0.5;
}

.file:disabled:hover {
	background-color: transparent;
	transform: unset;
}

.previews {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	gap: var(--padding-padding-s3, 4px);
}

.previewItem {
	position: relative;
	width: 40px;
	height: 40px;
	overflow: hidden;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	border-radius: var(--radius-radius-s16-40, 15.6px);
	transition: transform 0.2s ease-in-out;
}

.previewItem:hover {
	transform: scale(1.1);
}

.removeButton {
	position: absolute;
	top: 4px;
	right: 4px;
	display: grid;
	justify-content: center;
	width: 16px;
	height: 16px;
	padding: 0;
	line-height: 0;
	color: var(--icon-300, rgb(255 255 255 / 50%));
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: 500px;
	cursor: pointer;
	place-items: center;
	backdrop-filter: blur(9px);
}

.removeButton:hover {
	color: rgb(255 255 255 / 80%);
	background: rgb(73 73 80 / 64%);
}
</style>
