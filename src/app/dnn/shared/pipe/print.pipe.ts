import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'print'
})
export class PrintPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === '0' || value === '1' || value === '2' || value === '7') {
      return false;
    } else {
      return true;
    }
  }

}
