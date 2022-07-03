import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fkjiesuantype'
})
export class FkjiesuantypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value===1){
     return '现金';
    }else if(value===2){
      return '电汇';
    }else if(value===3){
      return '承兑';
    }else if(value===4){
      return '转账';
    }else if(value===5){
      return '处理余额';
    }
    return null;
  }
}
