import { database } from "./config/database"; 
import { server } from "./config/restify";

export = server.listen(3000, async() => {
    await database.sync({force:true})
    
    console.log("Server running");
});
