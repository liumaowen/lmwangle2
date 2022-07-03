import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kuaijikemu'
})
export class KuaijikemuPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '营业外收入';
    }else if (value === 2) {
      return '营业外支出';
    }else if (value === 3) {
      return '银行存款';
    }else if (value === 4) {
      return '应收票据';
    }else if (value === 5) {
      return '预收账款';
    }else if (value === 6) {
      return '库存现金';
    }else {
      return '';
    }
  }

}
