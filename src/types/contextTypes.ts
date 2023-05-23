import { IProduct } from './productTypes';
import { IUnionUserData } from './userTypes';

export type CartUpdateContextType = {
	addProductToCard: (productData: IProduct) => void;
	deleteProduct: (deleteProductId: string) => void;
	deleteAllProducts: () => void;
};

export type UserDataContextType = {
	data: IUnionUserData | null;
};

export type UserDataUpdateContextType = {
	saveData: (credential: IUnionUserData) => void;
	deleteData: () => void;
	deleteTokens: () => void;
};