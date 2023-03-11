import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'guigetype'
})
export class GuigetypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return '常规';
    } else if (value === 1) {
      return '特殊';
    }
  }

}