import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caigoutype'
})
export class CaigoutypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.type === 1) {
      return '工程单';
    }else if (value.type === 2) {
      return '库存销售';
    }else if (value.type === 3) {
      return '市场调货';
    }else {
      return '';
    }
  }

}
