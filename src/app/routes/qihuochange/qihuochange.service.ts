import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class QihuochangeService {

  constructor(private http: Http) { }
  createqihuochange(search): Promise<any> {
    return this.http.post('store/api/qihuochange', search).toPromise();
  }
  createqihuochangedet(search) {
    return this.http.post('store/api/qihuochange/createdet', search).toPromise();
  }
  getDetail(qihuochangeid) {
    return this.http.get('store/api/qihuochange/' + qihuochangeid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getDetailList(qihuochangeid) {
    return this.http.get('store/api/qihuochange/det/' + qihuochangeid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifygc(detid, model) {
    return this.http.put('store/api/qihuochange/modifygc/' + detid, model).toPromise();
  }
  modifyqihuochangedet(id, model) {
    return this.http.put('store/api/qihuochange/modifyqihuochangedet/' + id, model).toPromise();
  }
  submitvuser(id) {
    return this.http.put('store/api/qihuochange/submitvuser/' + id, {}).toPromise();
  }
  review(id) {
    return this.http.put('store/api/qihuochange/review/' + id, {}).toPromise();
  }
}
