import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WuliuscoreapiService {
  update(areamiddle: {}) {
    throw new Error('Method not implemented.');
  }

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

  /**常规询价表 */

  createRoute(search){
    return this.http.post('store/api/wliu/createroute', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  
  getRoute(search){
    return this.http.get('store/api/wliu/getroute',{search:search}).toPromise().then(data => {
      return data.json() as any[];
    })
  }

//修改价格公司
  modfiyPrice(modify) {
    return this.http.put('store/api/wliu/modfiyprice',modify).toPromise().then(data => {
    return data.json() as any[];
  });

}
//议价
yijiaPrice(modify) {
  return this.http.put('store/api/wliu/yijiaprice',modify).toPromise().then(data => {
  return data.json() as any[];
});
}
//删除
deleteselected(search) {
  return this.http.post('store/api/wliu/deleteselected', search).toPromise().then(data => {
    return data.json() as any[];
  });
}


}

  
