import { ProductCard } from '@/pages/assortment/ProductsList/ProductCard/ProductCard';
import { IProduct } from '@/pages/types/productTypes';
import styles from './ProductsList.module.scss';

interface Props {
	products: IProduct[];
	sortParameter: string;
	filterParameter: string;
}

export function ProductsList({ products, sortParameter, filterParameter }: Props) {
	return (
		<div id={styles['product-list']}>
			{products.map((product, index) => {
				return <ProductCard key={index} productData={product} />;
			})}
		</div>
	);
}
