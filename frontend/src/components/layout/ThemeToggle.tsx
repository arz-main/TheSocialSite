import { useState, useEffect } from "react";
import switchTheme from "../../utils/ThemeUtil";
import { Sun, Moon } from "lucide-react"

function ThemeToggle() {
	const themes = ["light", "dark"];
	const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

	// run once on mount to display the light theme
	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			const index = themes.indexOf(storedTheme);
			if (index >= 0) {
				setCurrentThemeIndex(index);
				switchTheme(storedTheme);
			}
		} else {
			// Ensure default theme is applied on first load
			switchTheme(themes[currentThemeIndex]);
		}
	}, []);

	const handleToggle = () => {
		const nextIndex = (currentThemeIndex + 1) % themes.length;
		setCurrentThemeIndex(nextIndex);

		const nextTheme = themes[nextIndex];
		switchTheme(nextTheme);

		// persist choice
		localStorage.setItem("theme", nextTheme);
	};

	return (
		<div className="border-2 bg-background hover:bg-button border-text rounded-lg">
			<button
				onClick={handleToggle}
				className="p-4"
			>
				{currentThemeIndex == 0 ? <Moon></Moon> : <Sun color="white"></Sun>}
			</button>
		</div>
	);
}

export default ThemeToggle;