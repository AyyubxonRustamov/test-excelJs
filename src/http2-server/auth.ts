import { Exception } from "./exception";
import { users } from "./users";

export function auth(request, reply, done) {
  try {
    let bearer = request.headers["authorization"]?.replace("Bearer ", "");

    const user = users.find((u) => u.id === bearer);
    if (!user) throw Exception.unauthorized(bearer);

    request.user = user;

    done();
  } catch (error) {
    console.log("Authenticaton error");
    return reply.status(401).send(Exception.unauthorized("idididid"));
  }
}
