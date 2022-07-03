import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DeptpriceapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/deptprice', { search: search }).toPromise();
  }

  get(id) {
    return this.http.get('store/api/deptprice/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/deptprice', search).toPromise();
  }

  listSummery(search) {
    return this.http.put('store/api/deptprice/listsummery', search).toPromise().then(data => {
      return data.json() as any[];
    })
  }

}
