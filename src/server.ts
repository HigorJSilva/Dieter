import { server } from "./config/restify";

server.listen(3000, () => {
    console.log("Server running");
});