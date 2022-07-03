import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qihuostatus'
})
export class QihuostatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '制单中';
    } else if (value === 2) {
      return '审核中';
    } else if (value === 3) {
      return '已审核';
    } else if (value === 4) {
      return '已下单';
    } else if (value === 5) {
      return '已采购';
    } else if (value === 6) {
      return '待提货';
    } else if (value === 7) {
      return '已完成';
    } else if (value === 8) {
      return '变更中';
    }
    return null;
  }

}
