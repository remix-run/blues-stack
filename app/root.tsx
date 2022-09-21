import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { withSentry, setUser } from "@sentry/remix";
import { useEffect } from "react";

import { getUser } from "./session.server";
import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const user = await getUser(request);
  return json({
    ENV: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      NODE_ENV: process.env.NODE_ENV || "development",
      VERSION: process.env.VERSION,
    },
    user,
  });
}

function App() {
  const { ENV, user } = useLoaderData();
  useEffect(
    () =>
      user &&
      setUser({
        id: user.id,
        email: user.email,
      }),
    [user]
  );

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
const Fallback = () => (
  <html lang="en">
    <head>
      <title>Oh no!</title>
      <Meta />
      <Links />
    </head>
    <body>
      <h1>
        Something bad happened. Don't worry, we've sent the error to Sentry and
        we are on the case!
      </h1>
    </body>
  </html>
);

export default withSentry(App, {
  errorBoundaryOptions: { fallback: <Fallback /> },
});
