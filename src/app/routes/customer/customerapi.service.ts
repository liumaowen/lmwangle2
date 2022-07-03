import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomerapiService {

  constructor(private http: Http) { }

  findAllbyname(search): Promise<any> {
    return this.http.get('store/api/customer/findAllbyname', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  findonlinecustomer(search): Promise<any> {
    return this.http.get('store/api/customer/findonlinecustomer', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findwiskind(): Promise<any> {
    return this.http.get('store/api/customer/findwiskind').toPromise().then(data => {
      return data.json() as any[];
    });
  }


  findwl() {
    return this.http.get('store/api/customer/findwl').toPromise().then(data => {
      return data.json() as any[];
    });
  }
/** 搜索物流公司*/
  findwlsearch(search) {
    return this.http.get('store/api/customer/findwllikename', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 搜索物流公司*/
  findsccwlsearch(search) {
    return this.http.get('store/api/customer/findsccwllikename', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findFee(search) {
    return this.http.get('store/api/customer/findfee', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getsupplier(search) {
    return this.http.get('store/api/customer/getsupplier', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findProduce(search) {
    return this.http.get('store/api/customer/findproduce', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  checkCompany(search) {
    return this.http.get('store/api/customer/checkcompany', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getCustomer(id) {
    return this.http.get('store/api/customer/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  pagelist(search) {
    return this.http.get('store/api/customer', { search: search }).toPromise();
  }

  pagemoneylist(search) {
    return this.http.get('store/api/customer/moneypagelist', { search: search }).toPromise();
  }

  pageyuelist(search) {
    return this.http.get('store/api/customer/yuepagelist', { search: search }).toPromise();
  }

  createCustomer(search) {
    return this.http.post('store/api/customer', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createOLCustomer(search) {
    return this.http.post('store/api/customer/createolcustomer', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifyCustomer(id, search) {
    return this.http.put('store/api/customer/' + id, search).toPromise();
  }

  getAddress(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise();
  }

  disable(id) {
    return this.http.get('store/api/customer/disable/' + id).toPromise();
  }

  enable(id) {
    return this.http.get('store/api/customer/enable/' + id).toPromise();
  }
  verify(id) {
    return this.http.get('store/api/customer/verify/' + id).toPromise();
  }
  refuse(id) {
    return this.http.get('store/api/customer/refuse/' + id).toPromise();
  }
  createAide(id) {
    return this.http.get('store/api/customer/aide/' + id).toPromise();
  }

  getuser(id) {
    return this.http.get('store/api/customer/user/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getBaccount(id) {
    return this.http.get('store/api/baccount/listbycustomerid/' + id).toPromise();
  }

  getUsers(id) {
    return this.http.get('store/api/user/listBykehuid/' + id).toPromise();
  }

  getMaddress(id) {
    return this.http.get('store/api/customer/getmaddress/' + id).toPromise();
  }
  findcustomerbynature(search) {
    return this.http.get('store/api/customer/findcustomerbynature', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getUserChandi(search) {
    return this.http.get('store/api/userchandi', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  customerbehavior(search) {
    return this.http.get('store/api/order/findGroupByBuyerid', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createUserchandi(search) {
    return this.http.post('store/api/userchandi', search).toPromise();
  }
  removeUserchandi(id): Promise<any> {
    return this.http.delete('store/api/userchandi/delete/' + id).toPromise();
  }
  deladdr(addrid) {
    return this.http.delete('store/api/addr/' + addrid).toPromise();
  }
  /**创建物流公司评价 */
  createzixin(search) {
    return this.http.post('store/api/wuliuscore/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询物流公司资信评价 */
  getzixinlist(search) {
    return this.http.get('store/api/wuliuscore/findzixin', { search: search }).toPromise();
  }
  /**创建物流公司证件 */
  createcertificate(search) {
    return this.http.post('store/api/customer/certificate', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询物流公司证件 */
  getcertificatelist(search) {
    return this.http.get('store/api/customer/findcertificate', { search: search }).toPromise();
  }
  /**删除物流公司证件 */
  delcertificatelist(id) {
    return this.http.delete('store/api/customer/delcertificate/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  findonlineAndsalecustomer(search): Promise<any> {
    return this.http.get('store/api/customer/findonlineandsalecustomer', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
