import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MycustomerapiService {

  constructor(private http: Http) { }

  pagelist(search) {
    return this.http.get('store/api/customer', { search: search }).toPromise();
  }

  createCustomer(search) {
    return this.http.post('store/api/customer', search).toPromise();
  }

  getCustomer(id) {
    return this.http.get('store/api/customer/' + id).toPromise();
  }

  modifyCustomer(id, search) {
    return this.http.put('store/api/customer/' + id, search).toPromise();
  }

  getAddress(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise();
  }

  getBaccount(id) {
    return this.http.get('store/api/baccount/listbycustomerid/' + id).toPromise();
  }

  getUsers(id) {
    return this.http.get('store/api/user/listBykehuid/' + id).toPromise();
  }

  findByNameAndSalename(search) {
    return this.http.get('store/api/customer/findByNameAndSalename', { search: search }).toPromise();
  }


}
