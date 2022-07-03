import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caigoukind'
})
export class CaigoukindPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.kind === 1) {
      return '期货';
    }else if (value.kind === 2) {
      return '现货';
    }else {
      return '';
    }
  }

}
