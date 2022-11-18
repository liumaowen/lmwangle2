import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PriceapiService {

  constructor(private http: Http) { }

  modifyBacediffprice(id, search) {
    return this.http.get('store/api/price/modifybacediffprice/' + id, { search: search }).toPromise();
  }

  listprice(search) {
    return this.http.get('store/api/price', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  pageList(search) {
    return this.http.get('store/api/pricelog', { search: search }).toPromise();
  }

  remove(id) {
    return this.http.delete('store/api/pricelog/' + id).toPromise();
  }

  getpriceSelect(search) {
    return this.http.get('store/api/price/selected', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getpriceLogAndDet(id) {
    return this.http.get('store/api/pricelog/det/' + id).toPromise().then(data => {
      return data.json() as object;
    });
  }
  // 获取统调价格数据
  getTiaoPriceCount(search) {
    return this.http.post('store/api/price/gettiaoprice', search).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  createpricelog(search) {
    return this.http.post('store/api/pricelog', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  judgeprice(search) {
    return this.http.post('store/api/pricelog/judgeprice',search ).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  judge(search) {
    return this.http.post('store/api/pricelog/judge',search ).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // auditprice(search) {
  //   return this.http.get('store/api/pricelog/verify', { search: search }).toPromise();
  // }
  auditprice(search) {
    return this.http.post('store/api/pricelog/tongtiaoprice', search).toPromise();
  }

  notagree(search) {
    return this.http.get('store/api/pricelog/notagree', { search: search }).toPromise();
  }

  delpricelogdet(pricelogdetid) {
    return this.http.delete('store/api/pricelog/det/' + pricelogdetid).toPromise();
  }
}
