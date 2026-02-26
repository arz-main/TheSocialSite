import React from "react";

interface ActionButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	disabled?: boolean;
	variant?: "primary" | "secondary" | "outline";
	className?: string;
}

const variantStyles = {
	primary:
		"bg-button hover:bg-primary text-text border rounded-lg px-8 py-2.5",
	secondary:
		"bg-primary hover:bg-button text-text-opposite border rounded-lg px-8 py-2.5",
	outline:
		"bg-transparent border-2 border-text hover:bg-button rounded-lg px-8 py-2.5",
};

const ActionButton = ({
	children,
	onClick,
	type = "button",
	disabled = false,
	variant = "primary",
	className = "",
}: ActionButtonProps) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`
        inline-block
        transition-all
        duration-200
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
		>
			{children}
		</button>
	);
};

export default ActionButton;