<template>
	<div class="wrapper">
		<div class="placeholder-content">
			<span class="placeholder" />
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	height: 100%;
	padding: 10px;
}

.placeholder-content {
	position: relative;
	height: 100%;
	background-color: transparent;
}

.placeholder {
	position: relative;
	display: flex;
	height: 100%;
}

.placeholder-content::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 40px;
	height: 40px;
	border: 1px solid #ffffff;
	border-radius: 18px;
	clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%);
}

.placeholder-content::after {
	content: '';
	position: absolute;
	right: 0;
	bottom: 0;
	width: 40px;
	height: 40px;
	background: transparent;
	border: 1px solid #ffffff;
	border-radius: 18px;
	clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
}

.placeholder::before {
	content: '';
	position: absolute;
	top: 0;
	right: 0;
	width: 40px;
	height: 40px;
	background: transparent;
	border: 1px solid #ffffff;
	border-radius: 18px;
	clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
}

.placeholder::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 40px;
	height: 40px;
	background: transparent;
	border: 1px solid #ffffff;
	border-radius: 18px;
	clip-path: polygon(0 50%, 50% 50%, 50% 100%, 0 100%);
}
</style>
