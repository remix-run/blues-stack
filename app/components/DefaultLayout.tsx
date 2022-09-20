import type { PropsWithChildren } from "react";
import Navbar from "./Navbar";

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="px-6 pt-8 pb-16">{children}</main>
      <footer className="sticky top-[100vh] bg-zinc-200 px-6 py-16">
        Footer stuff...
      </footer>
    </>
  );
}
