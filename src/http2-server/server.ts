import fastifyStatic = require("@fastify/static");
import fastify from "fastify";
import path = require("path");
import { hasRole } from "./roleService";
import { auth } from "./auth";

const server = fastify();

server.register(fastifyStatic, {
  root: path.join(__dirname, "static"),
});

interface DownloadParams {
  foldername: string;
  filename: string;
}

async function download(request: any, reply) {

  let url = request.url.replace('/public/', '')
  console.log('request.url: ',url );
  let urls = url.split('/')
  
  // urls.shift()
  // urls.shift()
  console.log('urls: ' , urls);
  

  hasRole(request.user, "admin");

  const params = request.params as DownloadParams;
  const filename = urls.pop();
  console.log(filename);
  console.log(urls);
  
  const filePath = path.join(__dirname, "static", ...urls);

  console.log(filePath);
  

  reply.header("Content-Disposition", `inline; filename="${filename}"`);
  reply.header("Content-Type", "image/png");

  return reply.sendFile(filename, filePath);
}

server.get("/public/*", { preHandler: [auth] }, download);


server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
