import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salebillstatus'
})
export class SalebillstatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '1') {
      return '开票中';
    } else if (value == '2') {
      return '已邮寄';
    } else if (value == '3') {
      return '已审核';
    }
  }

}
