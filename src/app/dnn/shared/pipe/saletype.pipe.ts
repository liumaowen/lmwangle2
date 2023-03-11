import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'saletype'
})
export class SaletypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '0') {
      return '增值税普通发票';
    } else if (value == '1') {
      return '增值税专用发票';
    } else if (value == '2') {
        return '电子增值税专用发票';
    } else {
      return '普通电子发票';
    }
  }

}
