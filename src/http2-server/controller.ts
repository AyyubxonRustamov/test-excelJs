import path = require("path");
import { hasRole } from "./roleService";

export async function download(request: any, reply) {
  let url = request.url.replace("/public/", "");
  console.log("request.url: ", url);
  let urls = url.split("/");

  // urls.shift()
  // urls.shift()
  console.log("urls: ", urls);

  hasRole(request.user, "admin");

  const filename = urls.pop();
  console.log(filename);
  console.log(urls);

  const filePath = path.join(__dirname, "static", ...urls);

  console.log(filePath);

  reply.header("Content-Disposition", `inline; filename="${filename}"`);
  reply.header("Content-Type", "image/png");

  return reply.sendFile(filename, filePath);
}

export async function setCookie(request, reply) {
  return reply
    .setCookie("token", "12345", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30,
    })
    .send("Cookie has been set");
}

export async function getCookie(request, reply) {
  const token = request.cookies.token;
  return reply.send(`Token from cookie: ${token}`);
}

export async function clearCookie(request, reply) {
  return reply.clearCookie("token", { path: "/" }).send("Cookie has been cleared");
}
