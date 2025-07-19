"use client";

import dynamic from "next/dynamic";

// ✅ Ahora sí podemos usar ssr: false
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
});

export default function Page(props) {
  return <DashboardClient {...props} />;
}
