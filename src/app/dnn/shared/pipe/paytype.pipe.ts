import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paytype'
})
export class PaytypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.isproduct) {
      return '';
    } else {
      if (value.isself) {
        return '提单付款';
      } else {
        if (value.paytype == 0) {
          return '全额';
        } else {
          return '欠款';
        }
      }
    }
  }

}
