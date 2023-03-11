import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GuideService {

  constructor(private http: Http) { }
  query(search) {
    return this.http.get('store/pub/guidepage', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  save(search) {
    return this.http.post('store/pub/guidepage', search).toPromise();
  }
  remove(id) {
    return this.http.delete(`store/pub/guidepage/${id}`).toPromise();
  }
  query1() {
    return this.http.get('store/pub/guidepage/search').toPromise().then(data => {
      return data.json();
    });
  }
}
