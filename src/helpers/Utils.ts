import { matchedData } from "express-validator";
import { Request } from "restify";

export function getFilteredRequest(req: Request) {
    return matchedData(req, {
        includeOptionals: true,
    });
}

export function replaceUndefinedFields(object: any) {
    Object.keys(object).forEach(key => object[key] === undefined ? object[key] = null : {});
    return object;
}