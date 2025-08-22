<script setup lang="ts">

import { computed } from 'vue';

const { fill = '230, 23, 53', width = 80, height = 80, shadow = '230 23 53' } = defineProps<{
	fill?: string;
	shadow?: string;
	width?: number | string;
	height?: number | string;
}
>();
const fillRgba = computed(() => {
	return `rgba(${fill})`;
});

</script>


<template>
	<div :class="classes.logo">
		<svg
			:width="width"
			:height="height"
			viewBox="35 35 95 95"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>


			<g filter="url(#filter1_i_33672_102855)" data-figma-bg-blur-radius="25">
				<path
					d="M38.75 85C38.75 59.4568 59.4568 38.75 85 38.75V38.75C110.543 38.75 131.25
				59.4568 131.25 85V85C131.25 110.543 110.543 131.25 85 131.25V131.25C59.4568 131.25
				38.75 110.543 38.75 85V85Z"
					:fill="fillRgba"
				/>
				<g clip-path="url(#clip11_33672_102855)">
					<g clip-path="url(#clip12_33672_102855)">
						<g clip-path="url(#clip13_33672_102855)">
							<g clip-path="url(#clip14_33672_102855)">
								<path d="M55.6328 57.5291H111.633V113.529H55.6328V57.5291Z" :fill="fillRgba" />
								<path
									d="M70.4668 84.4691C71.8708 85.7941 73.2218 86.9071 73.2218
									89.2381C73.2218 91.7811 71.9248 93.5291 68.9538 93.5291C66.8478
									93.5291 64.8488 92.6811 64.6868 89.3961L64.6328 88.5291H67.4958C67.4958
									89.5551 67.7158 90.7211 68.9538 90.7211C69.6028 90.7211 69.9268 90.3511
									69.9268 89.5551C69.9268 88.4951 68.7378 87.5421 67.5498 86.5891C65.8208
									85.1051 64.8498 83.8341 64.8498 81.6091C64.8498 79.3301 66.1998 77.5291
									69.0078 77.5291C71.1688 77.5291 72.8428 78.4831 73.0058 81.6091L73.0598
									82.5291H70.3048V81.8731C70.3048 80.9201 69.9808 80.2311 69.1158
									80.2311C68.6298 80.2311 68.1438 80.5491 68.1438 81.3441C68.0898 82.5091
									68.7378 82.9331 70.4668 84.4691ZM97.6328 80.5291H98.8258C99.4198 80.5291
									99.9598 80.7611 99.9598 82.7741C99.9598 84.7341 99.3118 85.0521 98.7178
									85.0521H97.6328V80.5291ZM103.633 93.5291L101.796 86.2711C102.876 85.4761
									103.525 84.0461 103.525 82.2971C103.525 79.3831 101.905 77.5291 99.4198
									77.5291H94.6328V93.5291H97.6328V87.0651H98.6628L100.069
									93.5291H103.633ZM90.0208 85.5821C90.0208 89.8731 89.4268 90.7741 88.4008
									90.7741H87.6328V80.5291H88.3998C89.4268 80.5291 90.0208 81.2911 90.0208
									85.5821ZM84.6328 93.5291H88.8328C92.0188 93.5291 93.6398 90.8271 93.6398
									85.5821C93.6398 80.3371 92.0198 77.5291 88.8318
									77.5291H84.6328V93.5291ZM79.7028 82.9331C79.7028 85.1051 79.1098
									85.4761 78.5688 85.4761H77.6328V80.5291H78.5688C79.1088 80.5291 79.7028
									80.8141 79.7028 82.9331ZM78.8388 88.0191C81.6488 88.0191 83.2688 86.4291
									83.2688 82.9331C83.2688 79.3301 81.6488 77.5291 79.1088
									77.5291H74.6328V93.5291H77.6328V88.0191H78.8388Z"
									fill="#273F33"
								/>
							</g>
						</g>
					</g>
				</g>
			</g>
			<defs>
				<filter
					id="filter0_f_33672_102855"
					x="0"
					y="0"
					width="182.5"
					height="182.5"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feGaussianBlur stdDeviation="22.5" result="effect1_foregroundBlur_33672_102855" />
				</filter>
				<clipPath id="bgblur_0_33672_102855_clip_path" transform="translate(0 0)">
					<path
						d="M45 91.25C45 65.7068 65.7068 45 91.25 45V45C116.793 45 137.5 65.7068 137.5
						91.25V91.25C137.5 116.793 116.793 137.5 91.25 137.5V137.5C65.7068 137.5 45 116.793
						45 91.25V91.25Z"
					/>
				</clipPath>
				<clipPath id="bgblur_5_33672_102855_clip_path" transform="translate(0 0)">
					<path
						d="M45 85C45 62.9086 62.9086 45 85 45V45C107.091 45 125 62.9086 125
						85V85C125 107.091 107.091 125 85 125V125C62.9086 125 45 107.091 45 85V85Z"
					/>
				</clipPath>
				<filter
					id="filter1_i_33672_102855"
					x="13.75"
					y="13.75"
					width="142.5"
					height="142.5"
					filterUnits="userSpaceOnUse"
					color-interpolation-filters="sRGB"
				>
					<feFlood flood-opacity="0" result="BackgroundImageFix" />
					<feBlend
						mode="normal"
						in="SourceGraphic"
						in2="BackgroundImageFix"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
						result="hardAlpha"
					/>
					<feOffset dx="-1.44141" dy="1.44141" />
					<feComposite
						in2="hardAlpha"
						operator="arithmetic"
						k2="-1"
						k3="1"
					/>
					<feColorMatrix type="matrix" values="0 0 0 0 0.152941 0 0 0 0 0.247059 0 0 0 0 0.2 0 0 0 1 0" />
					<feBlend
						mode="normal"
						in2="shape"
						result="effect1_innerShadow_33672_102855"
					/>
				</filter>
				<clipPath id="bgblur_10_33672_102855_clip_path" transform="translate(-13.75 -13.75)">
					<path
						d="M38.75 85C38.75 59.4568 59.4568 38.75 85 38.75V38.75C110.543 38.75 131.25
						59.4568 131.25 85V85C131.25 110.543 110.543 131.25 85 131.25V131.25C59.4568
						131.25 38.75 110.543 38.75 85V85Z"
					/>
				</clipPath>
				<clipPath id="clip1_33672_102855">
					<rect
						width="62.5"
						height="62.5"
						:fill="fillRgba"
						transform="translate(60 60)"
					/>
				</clipPath>
				<clipPath id="clip2_33672_102855">
					<rect
						width="93.75"
						height="93.75"
						:fill="fillRgba"
						transform="translate(45 45)"
					/>
				</clipPath>
				<clipPath id="clip3_33672_102855">
					<path
						d="M45 65C45 53.9543 53.9543 45 65 45H118.75C129.796 45 138.75 53.9543
						138.75 65V118.75C138.75 129.796 129.796 138.75 118.75 138.75H65C53.9543
						138.75 45 129.796 45 118.75V65Z"
						:fill="fillRgba"
					/>
				</clipPath>
				<clipPath id="clip4_33672_102855">
					<rect
						width="56"
						height="56"
						:fill="fillRgba"
						transform="translate(63.8827 67.7791)"
					/>
				</clipPath>
				<clipPath id="clip6_33672_102855">
					<rect
						width="62.5"
						height="62.5"
						:fill="fillRgba"
						transform="translate(53.75 53.75)"
					/>
				</clipPath>
				<clipPath id="clip7_33672_102855">
					<rect
						width="93.75"
						height="93.75"
						:fill="fillRgba"
						transform="translate(38.75 38.75)"
					/>
				</clipPath>
				<clipPath id="clip8_33672_102855">
					<path
						d="M38.75 58.75C38.75 47.7043 47.7043 38.75 58.75 38.75H112.5C123.546
						38.75 132.5 47.7043 132.5 58.75V112.5C132.5 123.546 123.546 132.5 112.5
						132.5H58.75C47.7043 132.5 38.75 123.546 38.75 112.5V58.75Z"
						:fill="fillRgba"
					/>
				</clipPath>
				<clipPath id="clip9_33672_102855">
					<rect
						width="56"
						height="56"
						:fill="fillRgba"
						transform="translate(57.6327 61.5291)"
					/>
				</clipPath>
				<clipPath id="clip11_33672_102855">
					<rect
						width="62.5"
						height="62.5"
						:fill="fillRgba"
						transform="translate(53.75 53.75)"
					/>
				</clipPath>
				<clipPath id="clip12_33672_102855">
					<rect
						width="93.75"
						height="93.75"
						:fill="fillRgba"
						transform="translate(38.75 38.75)"
					/>
				</clipPath>
				<clipPath id="clip13_33672_102855">
					<path
						d="M38.75 58.75C38.75 47.7043 47.7043 38.75 58.75 38.75H112.5C123.546
						38.75 132.5 47.7043 132.5 58.75V112.5C132.5 123.546 123.546 132.5
						112.5 132.5H58.75C47.7043 132.5 38.75 123.546 38.75 112.5V58.75Z"
						:fill="fillRgba"
					/>
				</clipPath>
				<clipPath id="clip14_33672_102855">
					<rect
						width="56"
						height="56"
						:fill="fillRgba"
						transform="translate(55.6328 57.5291)"
					/>
				</clipPath>
			</defs>
		</svg>

	</div>
</template>
<style module="classes">
.logo {
	position: relative;
	width: v-bind(width+ 'px');
	height: v-bind(height+ 'px');
	background: rgb(228 228 231 / 4%);
	border-radius: v-bind(width+ 'px');
	cursor: pointer;
	user-select: none;

	svg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
}

.logo::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 330%;
	height: 150%;
	background: rgb(v-bind(shadow) 16%);
	transform: translate(-22%, -30%);
	filter: blur(88px);
	pointer-events: none;
}

</style>


