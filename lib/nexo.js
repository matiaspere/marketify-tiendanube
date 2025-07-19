"use client";
import nexo from "@tiendanube/nexo";

const nexoInstance =
  typeof window !== "undefined"
    ? nexo.create({
        clientId: process.env.NEXT_PUBLIC_TIENDANUBE_CLIENT_ID,
        log: true,
      })
    : null;

export default nexoInstance;
