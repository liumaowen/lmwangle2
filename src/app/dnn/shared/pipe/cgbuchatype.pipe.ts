import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cgbuchatype'
})
export class CgbuchatypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    if (value.type === 0) {
      return '采购退款';
    } else if (value.type === 1) {
      return '价格调整';
    } else if (value.type === 2) {
      return '外购承兑贴息';
    } else if (value.type === 3) {
      return '年底应到未到返利';
    } else if (value.type === 4) {
      return '自办承兑贴息';
    } else if (value.type === 5) {
      return 'PJ补差';
    }else if (value.type === 6) {
      return '跨月结算价格调整';
    }else if (value.type === 7) {
      return '超支借款利息';
    }
    else {
      return '';
    }
  }

}
