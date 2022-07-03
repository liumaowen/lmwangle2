import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cgtuihuostatus'
})
export class CgtuihuostatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '待审核';
    }else if (value === 2) {
      return '已审核';
    }else if (value === 0) {
      return '制单中';
    }
  }

}
