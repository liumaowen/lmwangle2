import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class XmdService {

  constructor(private http: Http) {
  }

  dingjinfanxi(search) {
    return this.http.get('store/api/xmd/report/dingjinfanxi', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  dingjinshouxi(search) {
    return this.http.get('store/api/xmd/dingjinshouxi/findall', { search: search }).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  calcdingjinshouxi(search) {
      return this.http.get('store/api/xmd/dingjinshouxi/calc').toPromise().then(data => {
          return data.json() as any[];
      });
  }
  findwiskind(): Promise<any> {
    return this.http.get('store/api/xmd/customer/findwiskind').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获得订单明细数据
  orderdet(search) {
    return this.http.get('store/api/xmd/report/orderdet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cangkulist() {
    return this.http.get('store/api/xmd/cangku/cangkulist').toPromise().then(data => {
        return data.json() as any[];
    });
}
listDetail(search): Promise<any> {
  return this.http.get('store/api/xmd/kucun/detail', { search: search }).toPromise().then(data => {
    return data.json() as any[]
  });
}
getConditions(search): Promise<any> {
    return this.http.get('store/api/xmd/kucun/getConditions', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }
}
