import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import Link from 'next/link';
import Image from 'next/image';
import useValidation from '@/hooks/useValidation';
import { useUserData, useUserDataUpdate } from '@/hooks/useUserDataContext';
import useCookies from '@/hooks/useCookies';
import useIsPasswordVisible from '@/hooks/useIsPasswordVisible';
import { useIsDarkTheme } from '@/hooks/useIsDarkTheme';
import { ShowErrorModalWindow } from '@/components/ShowModalWindow/ShowModalWindow';
import UserAlreadyAuthorizedPage from '@/components/UserAlreadyAuthorizedPage/UserAlreadyAuthorizedPage';
import GoogleButton from '@/components/GoogleButton/GoogleButton';
import { ISignUpUserData, ILogInUserData } from '@/types/validationTypes';
import { Formik } from 'formik';
import axios from 'axios';

export default function LogIn() {
	const isDarkTheme = useIsDarkTheme();
	const userData = useUserData();
	const { saveData } = useUserDataUpdate();
	const { validateLogInData } = useValidation();
	const { setCookies } = useCookies();
	const [didUserAuthorized, setDidUserAuthorized] = useState<boolean>(false);
	const { isPasswordVisible, togglePasswordVisible } =
		useIsPasswordVisible(false);

	const [logInUserCredential, setLogInUserCredential] =
		useState<ISignUpUserData>();

	const [isServerError, setIsServerError] = useState<boolean | null>(null);
	const [isServerOff, setIsServerOff] = useState<boolean>(false);
	const [serverErrorMessage, setServerErrorMessage] = useState<string>('');
	const [isOpenErrorWindow, setIsOpenErrorWindow] = useState<boolean>(false);
	const router = useRouter();

	const sendDataToServer = async (data: ILogInUserData) => {
		try {
			const loginResult = await axios
				.post(
					`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/customers/login`,
					data
				)
				.then((res) => res.data);

			const jwtToken = loginResult.jwtToken;
			setCookies('jwtToken', jwtToken, {
				sameSite: 'Lax',
			});

			const loginedUserData = await axios
				.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/customers/verify`, {
					jwtToken: jwtToken,
				})
				.then((res) => res.data);
			setLogInUserCredential(loginedUserData);

			setIsServerError(false);
		} catch (error: any) {
			const errorMessage = error.response.data.error;
			setIsServerError(true);
			setServerErrorMessage(errorMessage);
		}
	};

	const handleSuccess = () => {
		router.push('/');
		saveData({
			name: logInUserCredential!.name,
			dateOfBirth: logInUserCredential!.dateOfBirth,
			email: logInUserCredential!.email,
			login: logInUserCredential!.login,
			password: logInUserCredential!.password,
		});
	};

	const handleFailure = () => {
		setIsOpenErrorWindow(true);

		setTimeout(() => {
			setIsOpenErrorWindow(false);
			setIsServerError(null);
		}, 2000);
	};

	useEffect(() => {
		if (isServerError === null) return;
		isServerError ? handleFailure() : handleSuccess();
	}, [isServerError]);

	useEffect(() => {
		if (
			(userData.data?.login && userData.data?.password) ||
			userData.data?.id
		) {
			setDidUserAuthorized(true);
		}
	}, [userData]);

	if (isServerOff) return <Error statusCode={500} />;

	if (didUserAuthorized) return <UserAlreadyAuthorizedPage />;

	return (
		<>
			{isOpenErrorWindow && <ShowErrorModalWindow error={serverErrorMessage} />}

			<div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<Image
						className="mx-auto h-10 w-auto"
						src={
							isDarkTheme
								? '/everythingshop_logo.png'
								: '/everythingshop_logo_dark.png'
						}
						alt="My Company"
						width={400}
						height={400}
					/>
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
						Log in to your account
					</h2>
				</div>

				<div className="flex justify-center mt-8">
					<GoogleButton
						action="Log In"
						redirectUrl="/api/auth/login?action_type=login"
					/>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
					<Formik
						initialValues={{
							login: '',
							password: '',
						}}
						validate={(values: ILogInUserData) => {
							return validateLogInData(values);
						}}
						onSubmit={(values, { setSubmitting }) => {
							setTimeout(() => {
								sendDataToServer(values);
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
											className="block text-lg font-medium leading-6 text-gray-900 dark:text-white">
											Login
										</label>
									</div>
									<div className="mt-2">
										<input
											id="login"
											name="login"
											type="text"
											className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-orange-600 sm:text-sm sm:leading-6"
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
											className="block text-lg font-medium leading-6 text-gray-900 dark:text-white">
											Password
										</label>
										<div className="text-lg">
											<a
												tabIndex={-1}
												className="font-semibold focus:outline-none text-indigo-600 hover:text-indigo-500 dark:text-orange-600 dark:hover:text-orange-500">
												Forgot password?
											</a>
										</div>
									</div>
									<div className="mt-2">
										<div className="flex flex-row gap-4">
											<input
												id="password"
												name="password"
												type={isPasswordVisible ? 'text' : 'password'}
												autoComplete="current-password"
												className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-orange-600 sm:text-sm sm:leading-6"
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
										className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-orange-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-orange-500">
										Log In
									</button>
								</div>
							</form>
						)}
					</Formik>

					<p className="mt-2 text-center text-base text-gray-500 dark:text-white">
						{/* eslint-disable-next-line react/no-unescaped-entities */}
						Already haven't account?{' '}
						<Link
							href="/signUp"
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-orange-600 dark:hover:text-orange-500">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}