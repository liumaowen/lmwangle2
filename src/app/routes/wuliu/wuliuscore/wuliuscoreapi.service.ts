import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WuliuscoreapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/wuliuscore/finddetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  uploadpic(search) {
    return this.http.post('store/api/wuliuscore/uploadpic', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流运输分析表 */
  gettransport(search) {
    return this.http.get('store/api/wuliuorder/gettransport', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  findsupplier(search) {
    return this.http.get('store/api/wuliuscore/findsupplier', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updateSupplierType(modify): Promise<any> {
    return this.http.put('store/api/customer/updatesuppliertype', modify).toPromise().then();
  }
}
