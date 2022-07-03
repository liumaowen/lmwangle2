import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BpriceapiService {

  constructor(private http: Http) { }

  listBprice(search) {
    return this.http.get('store/api/bprice', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/bprice', search).toPromise()
  }

}
