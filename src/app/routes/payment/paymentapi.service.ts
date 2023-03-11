import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PaymentapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/fukuan', { search: search }).toPromise();
  }
  audit(id) {
    return this.http.get('store/api/fukuan/audit/' + id).toPromise();
  }

  get(id) {
    return this.http.get('store/api/fukuan/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  del(id) {
    return this.http.delete('store/api/fukuan/' + id).toPromise();
  }
  createpayjihua(model) {
    return this.http.post('store/api/payjihua', model).toPromise();
  }
  queryPayjihua(search) {
    return this.http.get('store/api/payjihua', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  removePayjihua(id) {
    return this.http.delete('store/api/payjihua/' + id).toPromise();
  }
  getPayjihua(payjihuaid) {
    return this.http.get('store/api/payjihua/' + payjihuaid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatePayjihua(id, model) {
    return this.http.put('store/api/payjihua/' + id, model).toPromise();
  }

  fukuanlode(id) {
    return this.http.get('store/api/fukuan/fukuanlode/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  print(id) {
    return this.http.get('store/api/fukuan/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
