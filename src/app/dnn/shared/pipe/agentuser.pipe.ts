import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agentuser'
})
export class AgentuserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value.cuser&&value.auser){
			if(value.cuserid === value.auserid){
				return value.cuser.realname;
			}else{
				return value.cuser.realname+"("+value.auser.realname+"代)";
			}
		} 
    return null;
  }

}
