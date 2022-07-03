import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shoukuanstatus'
})
export class ShoukuanstatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value===0){
     return '制单中';
    }else if(value===1){
      return '审核中';
    }else if(value===2){
      return '已审核';
    }
    return null;
  }

}
