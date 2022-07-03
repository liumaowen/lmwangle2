import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flag'
})
export class FlagPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return '是';
    } else {
      return '否';
    }
  }

}
