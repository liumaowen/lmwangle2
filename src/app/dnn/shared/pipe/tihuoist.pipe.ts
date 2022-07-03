import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tihuoist'
})
export class TihuoistPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return '总价';
    } else {
      return '单价';
    }
  }

}
