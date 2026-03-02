function switchTheme(themeName: string) {
	const htmlElement = document.documentElement;
	htmlElement.classList.remove('dark');
	htmlElement.removeAttribute('data-theme');

	if (themeName === 'dark') {
		htmlElement.classList.add('dark');
	}
}

export default switchTheme