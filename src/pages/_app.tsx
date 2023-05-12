import '@/styles/variables.css';
import '@/styles/index.css';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserDataProvider } from '@/pages/context/UserDataContext';
import { CartProvider } from './context/CartContext';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Everything Shop</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<CartProvider>
				<UserDataProvider>
					<Component {...pageProps} />
				</UserDataProvider>
			</CartProvider>
		</>
	);
}
