import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dantype'
})
export class DantypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.dantype === 0) {
      return '甲单';
    }else if (value.dantype === 1) {
      return '乙单';
    }else if (value.dantype === 2) {
      return '丙单';
    }else {
      return '';
    }
  }

}
