export function download(url: string, name: string) {
	const a = document.createElement('a');

	a.href = url;
	a.download = name;
	a.target = '_blank';

	a.click();
}
