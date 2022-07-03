import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderyunshutype'
})
export class OrderyunshutypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return '自提';
    } else if (value === 1) {
      return '代运';
    }else {
      return '转货';
    }
  }

}
