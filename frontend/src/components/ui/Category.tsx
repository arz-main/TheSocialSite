import type { LucideIcon } from "lucide-react"

type CategoryProp = {
	id : number
	icon : LucideIcon
	title: string
}

function Category({icon: Icon, title}: CategoryProp){
	return (
		<div className="hover:border-primary flex flex-col w-full rounded-xl border-2 bg-card p-4 shadow items-center">
			<Icon className="text-text w-10 h-10 p-1 rounded-lg"></Icon>
			<h1 className="text-lg text-text font-semibold">
				{title}
			</h1>
		</div>
	)
}

export default Category