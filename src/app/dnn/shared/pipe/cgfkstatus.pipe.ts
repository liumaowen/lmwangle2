import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cgfkstatus'
})
export class CgfkstatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '现金';
    }else if (value === 2) {
      return '电汇';
    }else if (value === 3) {
      return '承兑';
    }else if (value === 4) {
      return '转账';
    }
    return null;
  }

}
