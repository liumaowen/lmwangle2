import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customer'
})
export class CustomerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.name;
    }
    return null;
  }

}
