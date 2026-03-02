import type { HomeCardProp } from "../../types/HomePageTypes";

export function HomeCard({ icon: Icon, title, description }: HomeCardProp) { // that :Icon is just a way of saying it's a react component not html tag
    return (
        <div className="w-full rounded-xl border border-none bg-card p-4 shadow">
            <Icon className="text-white bg-primary w-10 h-10 p-1 rounded-lg"></Icon>
            <h1 className="text-lg text-text font-semibold py-4">
                {title}
            </h1>
            <p className="text-sm text-text-opaque py-4">
                {description}
            </p>
        </div>
    )
}