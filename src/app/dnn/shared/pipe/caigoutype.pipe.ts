import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caigoutype'
})
export class CaigoutypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '工程单';
    }else if (value === 2) {
      return '库存销售';
    }else if (value === 3) {
      return '市场调货';
    }else if (value === 4) {
      return '维实外采';
    }else if (value === 5) {
      return '现货';
    }else if (value === 6) {
      return '期货';
    } else {
      return '';
    }
  }

}
