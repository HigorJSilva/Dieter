export const requiredMessage = 'Field is required'
export const invalidEmailMessage = 'Invalid e-mail'
export const isNumericMessage = 'Field needs to be a number'
export const invalidMessage = 'Invalid value'
export const uniqueMessage = 'Value already in use'
export const existsMessage = 'Resource Not found'
export const arrayMessage = 'Field is not an array'
export const resourceNotFoundError = (FieldName: string) => `${FieldName} not found`

export const unauthorizedError = 'User not authorized'
export const errorLogin = 'Password did not match'

export const errorCreateUsers = 'Could not register user'
export const errorUpdateUsers = 'Could not update user'
export const errorRemoveUsers = 'Could not remove user'


export const fieldSizeMessage = (min?: number | null, max?: number) => {
    if(min && max){
        return `Field needs to be between ${min} and ${max} characters long`
    }
    if(min){
        return `Field needs to be at least ${min} characters long`
    }
    if(max){
        return `Field needs to be less than ${max} characters long`
    }
}