import { useEffect, useState } from 'react';
import Error from 'next/error';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useIsPasswordVisible from '@/hooks/useIsPasswordVisible';
import useCookies from '@/hooks/useCookies';
import useIsAdminAuthorized from '@/hooks/useIsAdminAuthorized';
import { ShowErrorModalWindow } from '@/components/ShowModalWindow/ShowModalWindow';
import { IAdminData } from '@/types/adminTypes';
import { Formik } from 'formik';
import Schema from '@/assets/validationSchemas';
import axios from 'axios';

export default function ModeratePage() {
	const { setCookies } = useCookies();
	const { isAdminAuthorized, isLoading } = useIsAdminAuthorized();

	const { isPasswordVisible, togglePasswordVisible } =
		useIsPasswordVisible(false);
	const [isServerError, setIsServerError] = useState<boolean | null>(null);
	const [isServerOff, setIsServerOff] = useState<boolean>(false);
	const [serverErrorMessage, setServerErrorMessage] = useState<string>('');
	const [isOpenErrorWindow, setIsOpenErrorWindow] = useState<boolean>(false);
	const router = useRouter();

	const checkAdminData = async (adminData: IAdminData) => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/admins/login`,
				adminData
			);

			setIsServerError(false);
		} catch (error: any) {
			const errorMessage =
				error.responce.data.error ||
				"Admin with these credentials doesn't exist now";
			setIsServerError(true);
			setServerErrorMessage(errorMessage);
			return;
		}
	};

	const handleSuccess = () => {
		setCookies('isAdminAuthorized', 'true', {
			path: '/moderate',
			samesite: 'Lax',
			expires: new Date(new Date().getTime() + 5 * 60 * 1000),
		});

		router.push(`${router.pathname}/adminPanel`);
	};

	const handleFailure = () => {
		setIsOpenErrorWindow(true);

		setTimeout(() => {
			setIsOpenErrorWindow(false);
			setIsServerError(null);
		}, 3000);
	};

	useEffect(() => {
		if (isLoading) return;

		if (isAdminAuthorized) router.push('/moderate/adminPanel');
	}, [useIsAdminAuthorized]);

	useEffect(() => {
		if (isServerError === null) return;
		isServerError ? handleFailure() : handleSuccess();
	}, [isServerError]);

	if (isServerOff) return <Error statusCode={500} />;

	return (
		<>
			{isOpenErrorWindow && (
				<ShowErrorModalWindow error={[serverErrorMessage]} />
			)}

			<div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#3c6255] text-white">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Image
						className="mx-auto h-10 w-auto"
						src="/everythingshop_logo.png"
						alt="My Company"
						width={400}
						height={400}
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
						Log in to admin account
					</h2>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
					<Formik
						initialValues={{
							login: '',
							password: '',
						}}
						validationSchema={Schema.LogInValidateSchema}
						onSubmit={(values, { setSubmitting }) => {
							setTimeout(() => {
								console.log('done');
								console.log(values);
								checkAdminData(values);
								setSubmitting(false);
							}, 400);
						}}>
						{({
							values,
							errors,
							touched,
							handleChange,
							handleBlur,
							handleSubmit,
							isSubmitting,
						}) => (
							<form className="space-y-6" onSubmit={handleSubmit}>
								<div>
									<div className="flex items-center justify-between">
										<label
											htmlFor="login"
											className="block text-lg font-medium leading-6">
											Login
										</label>
									</div>
									<div className="mt-2">
										<input
											id="login"
											name="login"
											type="text"
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.login}
										/>
										{errors.login && touched.login && errors.login}
									</div>
								</div>

								<div>
									<div className="flex items-center justify-between">
										<label
											htmlFor="password"
											className="block text-lg font-medium leading-6">
											Password
										</label>
									</div>
									<div className="mt-2">
										<div className="flex flex-row gap-4">
											<input
												id="password"
												name="password"
												type={isPasswordVisible ? 'text' : 'password'}
												autoComplete="current-password"
												className="block w-[90%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												onChange={handleChange}
												onBlur={handleBlur}
												value={values.password}
											/>
											<button
												className="block bg-white rounded-md border-0 py-1.5 px-1 shadow-sm ring-1 ring-inset ring-gray-300"
												tabIndex={-1}
												onClick={togglePasswordVisible}>
												<Image
													src={isPasswordVisible ? '/hide.png' : '/show.png'}
													alt="#"
													width={26}
													height={26}
												/>
											</button>
										</div>
										{errors.password && touched.password && errors.password}
									</div>
								</div>

								<div>
									<button
										type="submit"
										disabled={isSubmitting}
										className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-orange-600 dark:focus-visible:outline-orange-600">
										Log In
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>
		</>
	);
}
