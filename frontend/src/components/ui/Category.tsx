import type { LucideIcon } from "lucide-react"

type CategoryProp = {
	id : number
	icon : LucideIcon
	title: string
}

function Category({icon: Icon, title}: CategoryProp){
	return (
		<div className="hover:bg-red-200 hover:border-red-900 flex flex-col w-full rounded-xl border bg-white p-4 shadow items-center">
			<Icon className="aspect-square w-10"></Icon>
			<h1 className="text-lg text-black font-semibold">
				{title}
			</h1>
		</div>
	)
}

export default Category