import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isprint'
})
export class IsprintPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === '0' || value === '1' || value === '7') {
      return false;
    } else {
      return true;
    }
  }

}
