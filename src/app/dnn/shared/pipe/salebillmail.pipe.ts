import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salebillmail'
})
export class SalebillmailPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == '3') {
      return true;
    } else {
      return false;
    }
  }

}
