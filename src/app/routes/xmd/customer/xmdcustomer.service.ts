import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class XmdcustomerService {

  constructor(private http: Http) {
  }

  pagelist(search) {
    return this.http.get('store/api/xmd/customer', {search: search}).toPromise();
  }

  createCustomer(search) {
    return this.http.post('store/api/xmd/customer', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findByNameAndSalename(search) {
    return this.http.get('store/api/xmd/customer/findByNameAndSalename', {search: search}).toPromise();
  }

  findAllbyname(search): Promise<any> {
    return this.http.get('store/api/xmd/customer/findAllbyname', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findonlinecustomer(search): Promise<any> {
    return this.http.get('store/api/xmd/customer/findonlinecustomer', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findwiskind(): Promise<any> {
    return this.http.get('store/api/xmd/customer/findwiskind').toPromise().then(data => {
      return data.json() as any[];
    });
  }


  findwl() {
    return this.http.get('store/api/xmd/customer/findwl').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 搜索物流公司*/
  findwlsearch(search) {
    return this.http.get('store/api/xmd/customer/findwllikename', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 搜索物流公司*/
  findsccwlsearch(search) {
    return this.http.get('store/api/xmd/customer/findsccwllikename', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findFee(search) {
    return this.http.get('store/api/xmd/customer/findfee', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getsupplier(search) {
    return this.http.get('store/api/xmd/customer/getsupplier', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findProduce(search) {
    return this.http.get('store/api/xmd/customer/findproduce', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  checkCompany(search) {
    return this.http.get('store/api/xmd/customer/checkcompany', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getCustomer(id) {
    return this.http.get('store/api/xmd/customer/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  pagemoneylist(search) {
    return this.http.get('store/api/xmd/customer/moneypagelist', {search: search}).toPromise();
  }

  pageyuelist(search) {
    return this.http.get('store/api/xmd/customer/yuepagelist', {search: search}).toPromise();
  }

  createOLCustomer(search) {
    return this.http.post('store/api/xmd/customer/createolcustomer', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifyCustomer(id, search) {
    return this.http.put('store/api/xmd/customer/' + id, search).toPromise();
  }

  getAddress(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise();
  }

  disable(id) {
    return this.http.get('store/api/xmd/customer/disable/' + id).toPromise();
  }

  enable(id) {
    return this.http.get('store/api/xmd/customer/enable/' + id).toPromise();
  }

  verify(id) {
    return this.http.get('store/api/xmd/customer/verify/' + id).toPromise();
  }

  refuse(id) {
    return this.http.get('store/api/xmd/customer/refuse/' + id).toPromise();
  }

  createAide(id) {
    return this.http.get('store/api/xmd/customer/aide/' + id).toPromise();
  }

  getuser(id) {
    return this.http.get('store/api/xmd/customer/user/' + id).toPromise().then(data => {
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
    return this.http.get('store/api/xmd/customer/getmaddress/' + id).toPromise();
  }

  findcustomerbynature(search) {
    return this.http.get('store/api/xmd/customer/findcustomerbynature', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getUserChandi(search) {
    return this.http.get('store/api/xmd/userchandi', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  customerbehavior(search) {
    return this.http.get('store/api/xmd/order/findGroupByBuyerid', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createUserchandi(search) {
    return this.http.post('store/api/xmd/userchandi', search).toPromise();
  }

  removeUserchandi(id): Promise<any> {
    return this.http.delete('store/api/xmd/userchandi/delete/' + id).toPromise();
  }

  deladdr(addrid) {
    return this.http.delete('store/api/addr/' + addrid).toPromise();
  }

  /**创建物流公司评价 */
  createzixin(search) {
    return this.http.post('store/api/xmd/wuliuscore/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**查询物流公司资信评价 */
  getzixinlist(search) {
    return this.http.get('store/api/xmd/wuliuscore/findzixin', {search: search}).toPromise();
  }

  /**创建物流公司证件 */
  createcertificate(search) {
    return this.http.post('store/api/xmd/customer/certificate', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**查询物流公司证件 */
  getcertificatelist(search) {
    return this.http.get('store/api/xmd/customer/findcertificate', {search: search}).toPromise();
  }

  /**删除物流公司证件 */
  delcertificatelist(id) {
    return this.http.delete('store/api/xmd/customer/delcertificate/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findonlineAndsalecustomer(search): Promise<any> {
    return this.http.get('store/api/xmd/customer/findonlineandsalecustomer', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  updtebank(search) {
    return this.http.put('store/api/baccount/updatebank', search).toPromise();
  }

  deletebank(id) {
    return this.http.delete('store/api/baccount/deletebank/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getCustomerSortData(month): Promise<any> {
    return this.http.get('store/api/xmd/customer/getCustomerSortData/' + month).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
