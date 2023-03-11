import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XsbuchaapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/xsbucha/xsbuchalist', { search: search }).toPromise();
  }

  create(search) {
    return this.http.post('store/api/xsbucha/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  querylist(search) {
    return this.http.get('store/api/xsbucha/xsbuchaing', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // 获取销售补差的主表信息和明细表信息
  getxsbucha(id) {
    return this.http.get('store/api/xsbucha/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**销售补差修改 */
  update(search) {
    return this.http.put('store/api/xsbucha/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 审核销售补差
  verify(id) {
    return this.http.get('store/api/xsbucha/verify/' + id).toPromise();
  }
  qishen(id) {
    return this.http.get('store/api/xsbucha/qishen/' + id).toPromise();
  }
  // 拒绝审核销售补差
  refuseverify(id) {
    return this.http.get('store/api/xsbucha/refuseverify/' + id).toPromise();
  }

  // 确认销售补差支付
  confirmpay(id) {
    return this.http.get('store/api/xsbucha/confirmpay/' + id).toPromise();
  }

  removeone(id) {
    return this.http.delete('store/api/xsbucha/removeone/' + id).toPromise();
  }

  submit(id) {
    return this.http.get('store/api/xsbucha/submit/' + id).toPromise();
  }

  removeById(id) {
    return this.http.delete('store/api/xsbucha/' + id).toPromise();
  }

  price(search) {
    return this.http.get('store/api/xsbucha/price', { search: search }).toPromise();
  }

  import(id, search) {
    return this.http.get('store/api/xsbucha/import/' + id, { search: search }).toPromise()
  }

  // 上传实提明细
  uploaddet(search): Promise<any> {
    return this.http.post('store/api/xsbucha/uploaddet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deletexsbuchadet(search) {
    return this.http.post('store/api/xsbucha/deletexsbuchadet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatezhiliangyiyi(search){
    return this.http.put('store/api/xsbucha/modifyzhiliangyiyi', search).toPromise();
  }
}
