import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'xstuihuostatus'
})
export class XstuihuostatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '1') {
      return '待审核';
    } else if (value == '2') {
      return '已审核';
    } else {
      return null;
    }
  }

}
