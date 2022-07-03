import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsbuchatype'
})
export class JsbuchatypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value.type === 1) {
      return '退补';
    }else if (value.type === 2) {
      return '质量异议';
    }else if (value.type === 3) {
      return '其他';
    }
    return null;
  }

}
