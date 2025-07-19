// lib/nexoClient.ts
import nexo from "@tiendanube/nexo";

const instance = nexo.create({
  clientId: process.env.NEXT_PUBLIC_TIENDANUBE_CLIENT_ID, // o ponelo directamente si querés hardcodear
  log: true, // dejar true mientras desarrollamos para ver logs
});

export default instance;
