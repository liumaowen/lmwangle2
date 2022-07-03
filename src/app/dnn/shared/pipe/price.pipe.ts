import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return Math.round(value * 100) / 100;
    } else {
      return '';
    }
  }

}
