import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration
} from '@remix-run/react'
import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction
} from '@remix-run/node'

import { getUser } from './session.server'
import globalStyles from './styles/global.css'
import { json } from '@remix-run/node'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: globalStyles }]
}

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Remix Notes',
	viewport: 'width=device-width,initial-scale=1'
})

type LoaderData = {
	user: Awaited<ReturnType<typeof getUser>>
}

export const loader: LoaderFunction = async ({ request }) => {
	return json<LoaderData>({
		user: await getUser(request)
	})
}

export default function App() {
	return (
		<html lang='en' className='h-full'>
			<head>
				<Meta />
				<Links />
			</head>
			<body className='h-full'>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
