import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tihuotype'
})
export class TihuotypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return '普通';
    } else if (value === 1) {
      return '转货';
    }
  }

}
