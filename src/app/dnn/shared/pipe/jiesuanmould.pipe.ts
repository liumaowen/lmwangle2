import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jiesuanmould'
})
export class JiesuanmouldPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '先开票后付款';
    } else if (value === 2) {
      return '先付款后开票';
    } 
  }

};
