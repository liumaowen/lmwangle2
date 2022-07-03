import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'innertranster'
})
export class InnertransterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '转账';
    } else if (value === 2) {
      return '收款';
    } else if (value === 3) {
      return '退款';
    } else {
      return '';
    }
  }

}
