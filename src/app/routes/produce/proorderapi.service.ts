import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProorderapiService {

  constructor(private http: Http) { }

  create(search) {
    return this.http.post('store/api/proorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findAddr(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getdet(id) {
    return this.http.get('store/api/proorder/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getfpdet(id) {
    return this.http.get('store/api/proorder/fpdet/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  removeOneDet(id) {
    return this.http.get('store/api/proorder/remove/' + id).toPromise();
  }

  removeOneFpDet(id) {
    return this.http.get('store/api/proorder/removefpro/' + id).toPromise();
  }

  importFav(id, search) {
    return this.http.get('store/api/proorder/impfav/' + id, { search: search }).toPromise();
  }

  addproduct(search) {
    return this.http.post('store/api/proorder/addproduct', search).toPromise();
  }

  submitVuser(id, search) {
    return this.http.get('store/api/proorder/submitvuser/' + id, { search: search }).toPromise();
  }

  verify(id, search) {
    return this.http.get('store/api/proorder/verify/' + id, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  cancelVerify(id, search) {
    return this.http.get('store/api/proorder/cancelverify/' + id, { search: search }).toPromise();
  }

  del(id) {
    return this.http.delete('store/api/proorder/' + id).toPromise()
  }

  finish(id) {
    return this.http.get('store/api/proorder/finish/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  //添加费用
  addfee(model) {
    return this.http.post('store/api/proorder/addfee', model).toPromise();
  }
  //删除预估费用
  delorderfee(orderfeedetid, search) {
    return this.http.delete('store/api/proorder/delfee/' + orderfeedetid, { search: search }).toPromise();
  }
  findyugufee(id) {
    return this.http.get('store/api/proorder/findyugufee/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // findAddr: { method: "GET", url: "/api/addr/listbycustomerid/:customerid", isArray: true },
  // removeOneDet: { method: 'GET', url: "/api/proorder/remove/:id" },
  // importFav: { method: "GET", url: "/api/proorder/impfav/:id" },
  // getmoney: { method: 'GET', url: '/app/usermoney/:id' },
  // modifyunfee: { method: 'PUT', url: '/api/proorder/modifyunfee' },
  // createAddr: { method: 'POST', url: '/api/addr' },
  // companysearch: { method: 'GET', url: '/api/customer/findbysale', isArray: true },
  // verify: { method: 'GET', url: '/api/proorder/verify/:id' },
  // cancelVerify: { method: 'GET', url: '/api/proorder/cancelverify/:id' },
  // removeOneFpDet: { method: 'GET', url: "/api/proorder/removefpro/:id" },
  // getdet: { method: 'GET', url: '/api/proorder/det/:id', isArray: true },
  // getfpdet: { method: 'GET', url: '/api/proorder/fpdet/:id', isArray: true },
  // addproduct: { method: 'GET', url: '/api/proorder/addproduct' },
  // del: { method: 'DELETE', url: '/api/proorder/:id' },
  // submitVuser: { method: 'GET', url: '/api/proorder/submitvuser/:id' },
  // finish: { method: 'GET', url: '/api/proorder/finish/:id', isArray: true }

}
