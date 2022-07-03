import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'feetype'
})
export class FeetypePipe implements PipeTransform {

  transform(type: any, args?: any): any {
    if (type == '1') {
      return '汽运费';
    } else if (type == '2') {
      return '铁运费';
    } else if (type == '3') {
      return '船运费';
    } else if (type == '4') {
      return '出库费';
    } else if (type == '5') {
      return '开平费';
    } else if (type == '6') {
      return '纵剪费';
    } else if (type == '7') {
      return '销售运杂费';
    } else if (type == '8') {
      return '包装费';
    } else if (type == '9') {
      return '仓储费';
    } else if (type == '10') {
      return '保险费';
    }else if (type == '13') {
      return '入库费';
    }
  }

}
