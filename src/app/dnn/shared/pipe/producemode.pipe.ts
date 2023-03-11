import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'producemode'
})
export class ProducemodePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return 'OEM';
    } else if (value === 3) {
      return '维实品牌';
    } else {
      return '普通';
    }
  }

}
