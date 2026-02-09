type CardProp = {
	img : string
	title: string
	description : string
}

function Card(props : CardProp){
	return (
		<div className="w-full rounded-xl border border-none bg-white p-4 shadow">
			<img className="aspect-square w-15 pt-4" 
				src={props.img} 
				alt={props.title}
			/>
			<h1 className="text-lg text-black font-semibold py-4">
				{props.title}
			</h1>
			<p className="text-sm text-gray-600 py-4">
				{props.description}
			</p>
		</div>
	)
}

export default Card