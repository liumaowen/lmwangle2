import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tihuoleibie'
})
export class TihuoleibiePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return '线上';
    } else {
      return '线下';
    }
  }

}
