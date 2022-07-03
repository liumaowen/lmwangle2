import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transporttype'
})
export class TransporttypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == 0) {
      return '自提';
    } else {
      return '代运';
    }
  }

}
