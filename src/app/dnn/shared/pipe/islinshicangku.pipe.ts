import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'islinshicangku'
})
export class isLinshicangkuPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === true) {
      return '是';
    } else if (value === false) {
      return '否';
    }
  }

}
