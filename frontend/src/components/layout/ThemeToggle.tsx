import { useState } from "react";
import switchTheme from "../../utils/themeUtils";
import {Sun, Moon} from "lucide-react"

function ThemeToggle() {
	const themes = ["light", "dark"];
	const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

	const handleToggle = () => {
		const nextIndex = (currentThemeIndex + 1) % themes.length;
		setCurrentThemeIndex(nextIndex);
		switchTheme(themes[nextIndex]);
	};

	return (
		<div className="border-2 bg-background hover:bg-button border-text rounded-lg">
			<button
				onClick={handleToggle}
				className="p-4"
			>
				{currentThemeIndex == 0 ? <Moon></Moon> : <Sun color="white"></Sun> }
			</button>
		</div>
	);
}

export default ThemeToggle;
