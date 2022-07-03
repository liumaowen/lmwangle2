import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class YunfeeapiService {

  constructor(private http: Http) { }

  deleteselected(search) {
    return this.http.delete('store/api/yunfee', { search: search }).toPromise();
  }

  getList(search) {
    return this.http.get('store/api/yunfee', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/yunfee', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modify(id, search) {
    return this.http.put('store/api/yunfee/' + id, search).toPromise();
  }

  getone(id) {
    return this.http.get('store/api/yunfee/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  import(search) {
    return this.http.post('store/api/yunfee/import', search).toPromise();
  }
  delsection(id) {
    return this.http.delete('store/api/section/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**批量修改有效时间 */
  modifybatchvaliddate(search) {
    return this.http.put('store/api/section/modifybatchvaliddate', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取运价参考明细表 */
  getcankaolist(search) {
    return this.http.get('store/api/yunpricecankao', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**修改运价参考明细表的价格 */
  modifyprice(id, search) {
    return this.http.put('store/api/yunpricecankao/modifyprice/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
