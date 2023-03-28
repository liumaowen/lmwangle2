import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class XmdtihuoService {

  constructor(private http: Http) {
  }

  offlinetihuolist(): Promise<any> {
    return this.http.get('store/api/xmd/tihuo/offlinelist').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getkeshifang(search): Promise<any> {
    return this.http.get('store/api/xmd/tihuo/getkeshifang', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //判断合同变更后是否上传客户公章
  iskehugaizhang(search): Promise<any> {
    return this.http.post('store/api/xmd/tihuo/iskehugaizhang', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createtihuo(search): Promise<any> {
    return this.http.post('store/api/xmd/tihuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  emancipation(search) {
    return this.http.post('store/api/xmd/businessorder/emancipation', search).toPromise();
  }

  query(search) {
    return this.http.get('store/api/xmd/tihuo', {search: search}).toPromise();
  }

  canceltihuo(search) {
    return this.http.put('store/api/tihuo/cancel', search).toPromise();
  }

  // 临调提货单中真实重量的修改
  modifyWeight(ldtihuoid, search): Promise<any> {
    console.log(search);
    return this.http.put('store/api/ldtihuo/modifyweight/' + ldtihuoid, search).toPromise();
  }

  // 删除某组费用明细
  removeTihuofee(search) {
    return this.http.get('store/api/tihuo/removetihuofee', {search: search}).toPromise();
  }

  //添加临调明细单
  addtihuodet(model) {
    return this.http.post('store/api/ldtihuo/addtihuodet', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  get(id) {
    return this.http.get('store/api/tihuo/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  listFeeDetail(search) {
    return this.http.get('store/api/tihuo/listfeedetail', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  tihuopay(tihuoid, search) {
    return this.http.get('store/api/tihuo/tihuopay/' + tihuoid, {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifygoodsstatus(search) {
    return this.http.put('store/api/tihuo/modifygoodsstatus', search).toPromise();
  }

  chexiaoqiankuan(id) {
    return this.http.delete('store/api/tihuo/chexiaoqiankuan/' + id).toPromise();
  }

  cancelShiti(tihuoid, search) {
    return this.http.get('store/api/tihuo/cancelshiti/' + tihuoid, {search: search}).toPromise();
  }

  print(id) {
    return this.http.get('store/api/tihuo/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  reload(id) {
    return this.http.get('store/api/tihuo/reload/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createFee(search) {
    return this.http.post('store/api/tihuo/createfee', search).toPromise();
  }

  xstuihuo(search) {
    return this.http.post('store/api/tihuo/xstuihuo', search).toPromise();
  }

  updatecarnum(id, search) {
    return this.http.put('store/api/tihuo/updatecarnum/' + id, search).toPromise();
  }

  modifytihuo(id, search) {
    return this.http.put('store/api/tihuo/' + id, search).toPromise();
  }

  createChukuFee(search) {
    return this.http.post('store/api/tihuo/createchukufee', search).toPromise();
  }

  refuseChange(id) {
    return this.http.get('store/api/tihuo/refuseChange/' + id).toPromise();
  }

  verifyChange(id) {
    return this.http.get('store/api/tihuo/verifyChange/' + id).toPromise();
  }

  // 修改提货单中的费用
  updateFee(search) {
    return this.http.put('store/api/tihuo/updatefee', search).toPromise();
  }

  // 临调批量上传匹配车号
  multipleaddtihuodet(model) {
    return this.http.post('store/api/ldtihuo/multipleaddtihuodet', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 提单明细上传匹配车号（临调除外）
  matchingcarnum(model) {
    return this.http.post('store/api/tihuo/matchingcarnum', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**查询当前订单的资金占用利息-应收利息 */
  findinterestbyorder(tihuoid) {
    return this.http.get('store/api/tihuo/findinterestbyorder/' + tihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 加工货物批量删除
  removetihuofees(search): Promise<any> {
    return this.http.post('store/api/tihuo/removetihuofees', search).toPromise();
  }

  /**查询当前订单的资金占用利息-应收利息 */
  tihuointeresttijiao(search) {
    return this.http.put('store/api/tihuo/tihuointeresttijiao', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
