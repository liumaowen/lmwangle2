import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tihuostatus'
})
export class TihuostatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value == '1'){
      return '已安排发货';
    }else if(value == '2'){
      return '待付款';
    }else if(value == '3'){
      return '货物已出库';
    }else if(value == '4'){
      return '已作废';
    }else if(value == '5'){
      return '撤销中...';
    }else if(value == '7'){
      return '延期利息登记';
    }else if(value == '8'){
      return '延期利息审核';
    }else{
      return null;
    }
  }

}
