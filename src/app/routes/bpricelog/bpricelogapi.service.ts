import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BpricelogapiService {

  constructor(private http: Http) { }

  pageList(serach) {
    return this.http.get('store/api/bpricelog', { search: serach }).toPromise();
  }

  remove(id) {
    return this.http.delete('store/api/bpricelog/' + id).toPromise();
  }

  getBpriceSelect(search) {
    return this.http.get('store/api/bprice/selected', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getbpricelogandbpricelogdet(id) {
    return this.http.get('store/api/bpricelog/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createBpricelog(search) {
    return this.http.post('store/api/bpricelog', search).toPromise();
  }

  auditBprice(search) {
    return this.http.get('store/api/bpricelog/verify', { search: search }).toPromise();
  }

  notagree(search) {
    return this.http.get('store/api/bpricelog/notagree', { search: search }).toPromise();
  }

  reportBpricelog(search) {
    return this.http.get('store/api/bpricelog/reportdetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
