import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'product'
})
export class ProductPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value['isproduct'] || value['isproduct2']) {
      return '加工';
    } else {
      if (value['isself']) {
        return '自销';
      } else {
        return '代销';
      }
    }
  }

}
