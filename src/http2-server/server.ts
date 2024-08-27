import fastify from "fastify";
import { auth } from "./auth";
import { clearCookie, download, getCookie, setCookie } from "./controller";
import fastifyCookie from "fastify-cookie";

const server = fastify();

server.register(fastifyCookie)

server.get("/public/*", { preHandler: [auth] }, download);
server.route({ method: "GET", url: "/set-cookie", handler: setCookie });
server.route({ method: "GET", url: "/get-cookie", handler: getCookie });
server.route({ method: "GET", url: "/clear-cookie", handler: clearCookie });

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
