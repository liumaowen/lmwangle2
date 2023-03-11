import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cgfkkind'
})
export class CgfkkindPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '定金';
    }else if (value === 2) {
      return '货款';
    }else if (value === 3) {
      return '费用';
    }
    return null;
  }

}
