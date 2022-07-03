import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'org'
})
export class OrgPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log('org', value);
    if (value) {
      return value.name;
    }
    return null;
  }

}
