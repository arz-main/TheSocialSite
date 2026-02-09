type CardProp = {
	img : string
	title: string
	description : string
}

function Card(props : CardProp){
	return (
		<div className="w-full rounded-xl border bg-white p-4 shadow">
			<img className="w-15 h-15 object-contain mb-4" 
				src={props.img} 
				alt={props.title}
			/>
			<h3 className="text-lg text-black font-semibold">
				{props.title}
			</h3>
			<p className="text-sm text-gray-600">
				{props.description}
			</p>
		</div>
	)
}

export default Card