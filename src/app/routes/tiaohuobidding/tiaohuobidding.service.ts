import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class TiaohuobiddingService {

  constructor(private http: Http) { }

  create(json) {
    return this.http.post('store/api/tiaohuobidding/create', json).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  find(search): Promise<any> {
    return this.http.get('store/api/tiaohuobidding/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**发送SCC */
  pushdatatoscc(search) {
    return this.http.put('store/api/tiaohuobidding/pushdatatoscc', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  zuofei(search): Promise<any> {
    return this.http.put('store/api/tiaohuobidding/zuofei', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**提交资源外务 */
  submitWaiwuVerify(search): Promise<any> {
    return this.http.put('store/api/tiaohuobidding/submitwaiwuverify', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**手动报价 */
  manualquote(search): Promise<any> {
    return this.http.post('store/api/tiaohuobidding/manualquote', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**调货合同引入调货竞价 */
  importTiaohuoBidding(search): Promise<any> {
    return this.http.post('store/api/tiaohuobidding/importTiaohuoBidding', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
