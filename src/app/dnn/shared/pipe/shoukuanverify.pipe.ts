import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shoukuanverify'
})
export class ShoukuanverifyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '1') {
      return true;
    } else {
      return false;
    }
  }

}
