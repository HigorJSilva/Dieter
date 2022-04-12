import { ModelStatic } from "sequelize/types"


export async function unique(value: string, key: string, model: ModelStatic<any>){
    
let emailCheck = await model.findOne({ where: { [key]: value } })
    
    return emailCheck !== null ? Promise.reject() : true
}

export function phone(value: string){
    let regex: RegExp = /\(?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/
    return regex.test(value.replace(/\D/g, ""));
}

export async function authorizeAction(model: ModelStatic<any>, value: any, userId: any) {
    const vava =  await model.findOne({ where: { 
            id: value,
        }
    });
    
    if(!vava){
       return Promise.reject();
    }
    
    return vava.userId === userId ? true : Promise.reject();
    
}