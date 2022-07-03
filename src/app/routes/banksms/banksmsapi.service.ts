import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BanksmsapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/banksms', { search: search }).toPromise().then(data => {
      return data;
    });
  }

  save(search, params) {
    return this.http.post('store/api/banksms', params, { search: search }).toPromise();
  }

}
