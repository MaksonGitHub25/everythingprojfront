import { createContext, useEffect, useState, ReactNode } from 'react';
import { IProduct, CartProductType } from '@/types/productTypes';
import { CartUpdateContextType } from '@/types/contextTypes';

interface ProviderProps {
	children: ReactNode;
}

export const CartContext = createContext<CartProductType>([]);
export const CartUpdateContext = createContext<CartUpdateContextType>({
	addProductToCard: (product: IProduct) => {},
	deleteProduct: (deleteProductId: string) => {},
	deleteAllProducts: () => {},
	decreaseProductAmount: (productId: string) => {},
	increaseProductAmount: (productId: string) => {},
});

export function CartProvider({ children }: ProviderProps) {
	const [products, setProducts] = useState<CartProductType>([]);

	const addProductToCard = (productToAdd: IProduct) => {
		const existProducts = [...products];

		let foundSameProduct = false;
		existProducts.map((product) => {
			if (
				product.productsData.uniqueProductId === productToAdd.uniqueProductId
			) {
				product.amount++;
				foundSameProduct = true;
			}
		});

		setProducts((prevValue) => {
			const newProducts = foundSameProduct
				? existProducts
				: [...prevValue, { amount: 1, productsData: productToAdd }];

			localStorage.setItem('cartProducts', JSON.stringify(newProducts));
			return newProducts;
		});
	};

	const deleteProduct = (deleteProductId: string) => {
		const newProducts = [...products];

		const appropriateProductIndex = products.findIndex(
			(product) => product.productsData.uniqueProductId === deleteProductId
		);

		if (appropriateProductIndex !== -1) {
			newProducts.splice(appropriateProductIndex, 1);
		}

		setProducts(newProducts);
		localStorage.setItem('cartProducts', JSON.stringify(newProducts));
	};

	const deleteAllProducts = () => {
		setProducts([]);
		localStorage.setItem('cartProducts', '[]');
	};

	const decreaseProductAmount = (productId: string) => {
		const newProducts = [...products];

		newProducts.map((product) => {
			if (product.productsData.uniqueProductId === productId) product.amount--;
		});

		setProducts(newProducts);
		localStorage.setItem('cartProducts', JSON.stringify(newProducts));
	};

	const increaseProductAmount = (productId: string) => {
		const newProducts = [...products];

		newProducts.map((product) => {
			if (product.productsData.uniqueProductId === productId) product.amount++;
		});

		setProducts(newProducts);
		localStorage.setItem('cartProducts', JSON.stringify(newProducts));
	};

	useEffect(() => {
		const cartProductsCookieValue = localStorage.getItem('cartProducts');
		if (cartProductsCookieValue)
			setProducts(JSON.parse(cartProductsCookieValue));
	}, []);

	return (
		<CartContext.Provider value={products}>
			<CartUpdateContext.Provider
				value={{
					addProductToCard,
					deleteProduct,
					deleteAllProducts,
					decreaseProductAmount,
					increaseProductAmount,
				}}>
				{children}
			</CartUpdateContext.Provider>
		</CartContext.Provider>
	);
}
