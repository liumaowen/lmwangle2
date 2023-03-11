import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class NoticeapiService {


  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/notice', { search: search }).toPromise();
  }

  create(search) {
    return this.http.post('store/api/notice', search).toPromise();
  }

  get(id) {
    return this.http.get(`store/api/notice/${id}`).toPromise();
  }

  update(id, search) {
    return this.http.put(`store/api/notice/${id}`, search).toPromise();
  }

  del(id) {
    return this.http.delete(`store/api/notice/${id}`).toPromise();
  }

}
