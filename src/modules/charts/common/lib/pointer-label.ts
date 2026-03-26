export type PointerLabelOptions = {
	widthPadding?: number;
	height?: number;
	radius?: number;
	triangleWidth?: number;
};

export function createPointerLabel(
	text: string,
	backgroundColor: string = 'rgba(4, 237, 160, 0.2)',
	textColor: string = '#04EDA0',
	options: PointerLabelOptions = {},
) {
	const {
		widthPadding = 8,
		height = 16,
		radius = 1,
		triangleWidth = 6,
	} = options;

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d')!;

	ctx.font = '520 9px "Roboto Flex Variable", sans-serif';
	const textWidth = ctx.measureText(text).width;

	const canvasWidth = textWidth + widthPadding * 2 + triangleWidth;
	canvas.width = canvasWidth;
	canvas.height = height;

	ctx.fillStyle = backgroundColor;

	ctx.beginPath();

	ctx.lineTo(triangleWidth, height);
	ctx.lineTo(0, height / 2 + 2);
	ctx.lineTo(0, height / 2 - 2);
	ctx.lineTo(triangleWidth, 0);
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(triangleWidth + radius, 0);
	ctx.lineTo(canvasWidth - radius, 0);
	ctx.quadraticCurveTo(canvasWidth, 0, canvasWidth, radius);
	ctx.lineTo(canvasWidth, height - radius);
	ctx.quadraticCurveTo(canvasWidth, height, canvasWidth - radius, height);
	ctx.lineTo(triangleWidth + radius, height);
	ctx.quadraticCurveTo(triangleWidth, height, triangleWidth, height - radius);
	ctx.lineTo(triangleWidth, radius);
	ctx.quadraticCurveTo(triangleWidth, 0, triangleWidth + radius, 0);
	ctx.fill();

	ctx.shadowBlur = 0;
	ctx.fillStyle = textColor;
	ctx.textBaseline = 'middle';
	ctx.fillText(text, triangleWidth + widthPadding, height / 2);

	return canvas;
}
