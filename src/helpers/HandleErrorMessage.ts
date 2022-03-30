import * as _ from "lodash";

export function handleErrorMessage (erros: Array<any>){
    var grouped = _.groupBy(erros, function(item: {param: string}){
        return item.param;
      });
      var errorsArray = _.each(grouped, function(value: any, key: any, list: any){
          let errors: Array<any> = [];
          value.forEach((element:{msg: string}) => {
            errors.push(element.msg)
          });
         
        return list[key] = errors;
      });
      return errorsArray;
}