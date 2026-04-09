import { cn } from "../utils/ClassNameMergeUtil";
import { Label } from "./Label";

interface FormFieldProps {
    label: string;
    className?: string;
    children: React.ReactNode;
}

function FormField({ label, className, children }: FormFieldProps) {
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <Label>{label}</Label>
            {children}
        </div>
    );
}

export { FormField };