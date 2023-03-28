import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ReceiptService {

  constructor(private http: Http) {
  }

  // 收据明细表
  receiptlist(search) {
    return this.http.post('store/api/receipt/det', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 收据详情
  receiptdet(id): Promise<any> {
    return this.http.get('store/api/receipt/' + id).toPromise().then(data => {
      return data.json();
    });
  }

  //生成pdf
  makePdf(id): Promise<any> {
    return this.http.get('store/api/receipt/makepdf/' + id).toPromise().then(data => {
      return data.json();
    });
  }

  printPdf(id): Promise<any> {
    return this.http.get('store/api/receipt/print/' + id).toPromise().then(data => {
      return data.json();
    });
  }

  create(e) {
    return this.http.post('store/api/receipt/create', {body: e}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 收款明细表
  shoukuandet(search) {
    return this.http.get('store/api/receipt/shoukuan', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  repayment(e) {
    return this.http.post('store/api/receipt/repayment', e).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**收据申请作废 */
  zuofei(search): Promise<any> {
    return this.http.post('store/api/receipt/cancel' , search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
