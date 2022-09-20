import { Outlet } from "@remix-run/react";
import DefaultLayout from "~/components/DefaultLayout";

export default function DashboardRoute() {
  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <Outlet />
    </DefaultLayout>
  );
}
