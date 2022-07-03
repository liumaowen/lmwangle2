import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'submitverify'
})
export class SubmitverifyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '0') {
      return true;
    } else {
      return false;
    }
  }

}
