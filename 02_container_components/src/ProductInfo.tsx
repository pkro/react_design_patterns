const exampleProduct = {
	name: 'Flat-Screen TV',
	price: '$300',
	description: 'Huge LCD screen, a great deal',
	rating: 4.5,
}

export type productType = typeof exampleProduct;

export type ProductInfoProps = {
	product?: productType;
}
export const ProductInfo = ({ product }: ProductInfoProps) => {
	const { name, price, description, rating } = product || {};

	return (
		<>
		<h3>{name}</h3>
		<p>{price}</p>
		<h3>Description:</h3>
		<p>{description}</p>
		<p>Average Rating: {rating}</p>
		</>
	);
}
