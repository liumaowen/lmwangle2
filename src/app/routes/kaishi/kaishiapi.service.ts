import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class KaishiapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/kaishi', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  remove(id) {
    return this.http.delete(`store/api/kaishi/${id}`).toPromise();
  }

  save(search, id?) {
    if (id === 1) {
      return this.http.post('store/api/kaishi?repair=', search).toPromise();
    } else if (id) {
      return this.http.post('store/api/kaishi?batch=', search).toPromise();
    } else {
      return this.http.post('store/api/kaishi', search).toPromise();
    }
  }

  removes(search) {
    return this.http.delete('store/api/kaishi', { search: search }).toPromise();
  }

  get(search) {
    return this.http.get('store/api/kaishi', { search: search }).toPromise();
  }

  reseting(search) {
    return this.http.delete('store/api/kaishi', { search: search }).toPromise();
  }

}
