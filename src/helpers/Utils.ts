import { matchedData } from "express-validator";
import { Request } from "restify";

export function getFilteredRequest(req: Request) {
    return matchedData(req, {
        includeOptionals: true,
    });
}