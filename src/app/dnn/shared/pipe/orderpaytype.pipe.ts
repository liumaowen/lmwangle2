import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderpaytype'
})
export class OrderpaytypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value == 0){
      return '款到发货';
    }else if(value == 1){
      return '欠款发货';
    }
    return null;
  }

}
