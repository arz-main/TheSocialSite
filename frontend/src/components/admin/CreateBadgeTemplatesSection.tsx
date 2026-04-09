import { useState } from "react";
import { useBadgeTemplates } from "../../hooks/useBadgeTemplates";
import type { CreateBadgeTemplateDto, BadgeTemplateCreatorProps } from "../../types/BadgeTypes";
import { Button } from "../BasicButton";
import { Input } from "../BasicInput";
import { FeedbackMessage } from "../FeedbackMessage";
import { FormField } from "../FormField";
import { Select } from "../Select";
import { Textarea } from "../Textrea";

const EMPTY_BADGE_FORM: CreateBadgeTemplateDto = {
    title: "",
    description: "",
    iconUrl: "",
    tier: "Bronze",
    category: "Engagement",
    criteriaTarget: 1,
};

export function CreateBadgeTemplatesSection() {
    const [badgeForm, setBadgeForm] = useState<CreateBadgeTemplateDto>(EMPTY_BADGE_FORM);
    const [validationError, setValidationError] = useState("");
    const [success, setSuccess] = useState(false);

    const { createBadgeTemplate, loading: loadingTemplateBadges, error: templateBadgeError } = useBadgeTemplates();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setBadgeForm(prev => ({
            ...prev,
            [name]: type === "number" || name === "criteriaTarget"
                ? Number(value)
                : value,
        }));
    };

    const handleSubmit = async () => {
        if (!badgeForm.title.trim() || !badgeForm.description.trim()) {
            setValidationError("Title and description are required.");
            return;
        }
        setValidationError("");
        await createBadgeTemplate({ ...badgeForm });
        setBadgeForm(EMPTY_BADGE_FORM);
        setSuccess(true);
    };

    return (
        <BadgeTemplateCreator
            form={badgeForm}
            loading={loadingTemplateBadges}
            error={templateBadgeError}
            validationError={validationError}
            success={success}
            onChange={handleChange}
            onSubmit={handleSubmit}
        />
    );
}


function BadgeTemplateCreator(
    { form, loading, error, validationError, success, onChange, onSubmit }: BadgeTemplateCreatorProps
) {
    return (
        <div className="flex flex-col items-center w-full gap-4">
            <div className="flex flex-col gap-3 w-full max-w-lg">

                <FeedbackMessage error={validationError} success={success ? "Badge created successfully." : null} />

                <FormField label="Title">
                    <Input
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="e.g. First Contribution"
                    />
                </FormField>

                <FormField label="Description">
                    <Textarea
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        rows={3}
                        placeholder="What does the user need to do to earn this?"
                    />
                </FormField>

                <FormField label="Icon URL">
                    <Input
                        name="iconUrl"
                        value={form.iconUrl}
                        onChange={onChange}
                        placeholder="https://..."
                    />
                </FormField>

                <div className="flex gap-3">
                    <FormField label="Tier" className="flex-1">
                        <Select name="tier" value={form.tier} onChange={onChange}>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                        </Select>
                    </FormField>

                    <FormField label="Category" className="flex-1">
                        <Select name="category" value={form.category} onChange={onChange}>
                            <option value="Engagement">Engagement</option>
                            <option value="ContentCreation">Content Creation</option>
                            <option value="CommunitySupport">Community Support</option>
                            <option value="Milestone">Milestone</option>
                        </Select>
                    </FormField>
                </div>

                <FormField label="Criteria Target">
                    <Input
                        type="number"
                        name="criteriaTarget"
                        value={form.criteriaTarget}
                        onChange={onChange}
                        min={1}
                        placeholder="e.g. 10"
                    />
                </FormField>

                <Button
                    onClick={onSubmit}
                    disabled={loading}
                    className="mt-1 self-start px-4 py-2 rounded bg-primary text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                    {loading ? "Creating..." : "Create Badge"}
                </Button>
            </div>
        </div>
    );
}



