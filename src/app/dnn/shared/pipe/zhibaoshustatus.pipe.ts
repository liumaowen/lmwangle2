import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zhibaoshustatus'
})
export class ZhibaoshustatusPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if (value === 0) {
      // 0：初始化、1：运行中、2：成功、3：异常
      return '初始化';
    } else if(value ===1){
      return '运行中';
    } else if(value ===2){
      return '成功';
    }
    else if(value ===3){
      return '异常';
    }  }

}
