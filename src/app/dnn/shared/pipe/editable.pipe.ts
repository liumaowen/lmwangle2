import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'editable'
})
export class EditablePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (status == '1') {
      return true;
    } else {
      return false;
    }
  }

}
