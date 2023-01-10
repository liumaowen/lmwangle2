import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordertype'
})
export class OrdertypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 0) {
      return '期货';
    } else if (value === 1) {
      return '期货加工';
    } else if (value === 2) {
      return '临调';
    } else if (value === 3) {
      return '线上';
    } else if (value === 4) {
      return '自销';
    } else if (value === 5) {
      return '代销';
    } else if (value === 6) {
      return '加工';
    } else if (value === 7) {
      return '代销加工';
    } else if (value === 8) {
      return '自销加工';
    } else if (value === 9) {
      return '调货';
    } else if (value === 10) {
      return '调货加工';
    } else if (value === 11) {
      return '净料期货';
    } else if (value === 12) {
      return '净料调货';
    } else if (value === 13) {
      return '在途';
    } else if (value === 14) {
      return '在途加工';
    } else if (value === 15) {
      return '维实品牌';
    }else if (value === 16) {
      return '现货调货';
    } else if (value === 17) {
      return '现货调货加工';
    }else if (value === 18) {
      return '期货调货';
    }else if (value === 19) {
      return '期货调货加工';
    }
    return null;
  }

}
