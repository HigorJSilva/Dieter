interface ResponseInterface {
    status: Boolean, 
    message: String | null,
    data: Array<any> | Object | null,
    errors: Array<any> | null
}

class ApiResponse {
    constructor(
        status: Boolean, 
        message: String | null,
        data: Array<any> | Object | null,
        errors: Array<any> | null
        )
        {
            //@ts-ignore
            data = typeof data !== 'array' && data !== null ? Array(data) : data
            const resposta: ResponseInterface = {status, message, data, errors};
            return resposta;
    
        }
}
export {ApiResponse}