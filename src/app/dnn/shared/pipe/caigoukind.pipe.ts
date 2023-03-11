import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caigoukind'
})
export class CaigoukindPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '期货';
    }else if (value === 2) {
      return '现货';
    }else if(value === 3){
      return '调货';
    }else {
      return '';
    }
  }

}
