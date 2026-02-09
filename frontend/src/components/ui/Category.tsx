type CategoryProp = {
	img : string
	title: string
}

function Category(props : CategoryProp){
	return (
		<div className="hover:bg-red-200 hover:border-red-900 flex flex-col w-full rounded-xl border bg-white p-4 shadow items-center">
			<img className="aspect-square w-10" 
				src={props.img} 
				alt={props.title}
			/>
			<h1 className="text-lg text-black font-semibold">
				{props.title}
			</h1>
		</div>
	)
}

export default Category