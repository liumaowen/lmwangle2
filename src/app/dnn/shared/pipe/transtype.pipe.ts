import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transtype'
})
export class TranstypePipe implements PipeTransform {
//运输方式管道
  transform(value: any, args?: any): any {
    if(value == 0){
      return '自提';
    }else if(value == 1){
      return '代运';
    }
    return null;
  }

}
