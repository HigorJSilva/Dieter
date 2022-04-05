import { ModelStatic } from "sequelize/types"


export async function unique(value: string, key: string, model: ModelStatic<any>){
    
let emailCheck = await model.findOne({ where: { [key]: value } })
    
    return emailCheck !== null ? Promise.reject() : true
}
