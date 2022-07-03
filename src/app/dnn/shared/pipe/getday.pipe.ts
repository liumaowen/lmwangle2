import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getday'
})
export class GetdayPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value){
      return Math.floor((new Date().getTime() - value)/86400000);//86400000 = 1000*60*60*24
    }else{
      return null;
    }
  }

}
