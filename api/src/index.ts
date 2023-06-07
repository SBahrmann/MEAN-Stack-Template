import * as http from "http";

import App from "./app";
import { environment } from "../environments/environment";

const port = environment.port;

App.set("port", port);
const server = http.createServer(App);
server.listen(port);

server.on("listening", (): void => {
    const addr = server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr?.port}`;
    console.info(`Listening on ${bind}`);
});

module.exports = App;