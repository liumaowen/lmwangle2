import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kehutype'
})
export class KehutypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return '直接用户';
    } else if (value === 1) {
      return '贸易商';
    } else if (value === 2) {
      return '终端客户';
    }
  }

}