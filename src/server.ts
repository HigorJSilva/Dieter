import { server } from "./config/restify";

export = server.listen(3000, () => {
    console.log("Server running");
});
