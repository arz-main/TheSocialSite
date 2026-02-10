import type { LucideIcon } from "lucide-react"

type CardProp = {
	id: number
	icon : LucideIcon
	title: string
	description : string
}

function Card({icon: Icon, title, description }: CardProp){ // that :Icon is just a way of saying it's a react component not html tag
	return (
		<div className="w-full rounded-xl border border-none bg-white p-4 shadow">
			<Icon className="aspect-square w-15 pt"></Icon>
			<h1 className="text-lg text-black font-semibold py-4">
				{title}
			</h1>
			<p className="text-sm text-gray-600 py-4">
				{description}
			</p>
		</div>
	)
}

export default Card