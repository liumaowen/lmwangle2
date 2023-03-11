import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salebillverify'
})
export class SalebillverifyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return true;
    } else {
      return false;
    }
  }

}
