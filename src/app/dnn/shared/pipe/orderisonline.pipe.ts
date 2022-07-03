import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderisonline'
})
export class OrderisonlinePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return '是';
    } else {
      return '否';
    }
  }

}
