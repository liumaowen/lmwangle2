import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class XmdorderService {

  constructor(private http: Http) {
  }

  query(search) {
    return this.http.get('store/api/xmd/order/orderquery', {search: search}).toPromise();
  }

  create(search) {
    return this.http.post('store/api/xmd/order/creatorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getchukufeetype(search) {
    return this.http.put('store/api/xmd/businessorder/getchukufeetype', search).toPromise();
  }

  //根据qihuoid和buyerid查询配款
  findAllocation(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuoallocation/findallocation/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getorderinfo(id) {
    return this.http.get('store/api/xmd/order/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getorderdet(id) {
    return this.http.get('store/api/xmd/businessorder/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 修改提货方式
  modifyorder(editorder) {
    return this.http.put('store/api/xmd/order/modifyorder', editorder).toPromise();
  }

  finish(id, search) {
    return this.http.get('store/api/xmd/businessorder/finish/' + id, {search: search}).toPromise();
  }

  del(id) {
    return this.http.delete('store/api/xmd/businessorder/' + id).toPromise();
  }

  cancelorder(id, search) {
    return this.http.get('store/api/xmd/businessorder/cancel/' + id, {search: search}).toPromise();
  }

  removeOneDet(id) {
    return this.http.get('store/api/xmd/businessorder/remove/' + id).toPromise();
  }

  submitVuser(id, search) {
    return this.http.get('store/api/xmd/businessorder/submitvuser/' + id, {search: search}).toPromise();
  }

  verify(id, search) {
    return this.http.get('store/api/xmd/businessorder/verify/' + id, {search: search}).toPromise();
  }

  // refuseverify(id, search) {
  //   return this.http.get('store/app/order/refuseverify/' + id, { search: search }).toPromise();
  // }
  cancelVerify(id, search) {
    return this.http.get('store/api/xmd/businessorder/cancelverify/' + id, {search: search}).toPromise();
  }

  getmoney1(search) {
    return this.http.get('store/app/xmd/usermoney/getmoney', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createoverdraft(search) {
    return this.http.post('store/api/overdraft', search).toPromise().then();
  }

  getmoney(search) {
    return this.http.get('store/app/xmd/usermoney/moneydet', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  print(id) {
    return this.http.get('store/api/xmd/order/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  reload(id, ordermodal) {
    return this.http.put('store/api/xmd/order/reload/' + id, ordermodal).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getchukufee(search) {
    return this.http.get('store/api/xmd/order/getchukufee', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
