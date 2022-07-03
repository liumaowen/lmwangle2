import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordertype1'
})
export class Ordertype1Pipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value['isonline']) {
      return '线上普通';
    } else {
      if (value['isproduct'] || value['isproduct2']) {
        return '线下加工';
      } else {
        if (value['isself']) {
          return '线下自销';
        } else {
          return '线下代销';
        }
      }
    }
  }

}
