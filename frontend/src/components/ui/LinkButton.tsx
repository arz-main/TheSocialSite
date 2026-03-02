import { Link } from "react-router-dom";
import React from "react";

interface LinkButtonProps {
	children: React.ReactNode;
	to?: string;
	onClick?: () => void;
	variant?: "primary" | "secondary" | "outline";
	className?: string;
}

const variantStyles = {
	primary:
		"bg-button hover:bg-primary text-white border-2 border-background-opposite rounded-lg px-8 py-2.5",
	secondary:
		"bg-primary hover:bg-button text-text-opposite border rounded-lg px-8 py-2.5",
	outline:
		"bg-transparent border-2 border-text hover:bg-button rounded-lg px-8 py-2.5",
};

const LinkButton = ({
	children,
	to,
	onClick,
	variant = "primary",
	className = "",
}: LinkButtonProps) => {
	const baseStyles = `inline-block transition-all duration-200 ${variantStyles[variant]} ${className}`;

	if (to) {
		return (
			<Link to={to} className={baseStyles}>
				{children}
			</Link>
		);
	}

	return (
		<button onClick={onClick} className={baseStyles}>
			{children}
		</button>
	);
};

export default LinkButton;
