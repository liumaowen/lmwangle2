import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XiaoshouapiService {

  constructor(private http: Http) { }

  getlist() {
    return this.http.get('store/api/ldtihuo/ldlist').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //获取待临调期货列表
  getldqihuolist(search) {
    return this.http.get('store/api/ldtihuo/ldqihuolist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  ldtihuo(search): Promise<any> {
    return this.http.post('store/api/ldtihuo', search).toPromise();
  }
  // 查询提货单主表和明细
  getldtihuo(tihuoid): Promise<any> {
    return this.http.get('store/api/tihuo/' + tihuoid).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  // 临调提货单中真实重量的修改
  modifyWeight(ldtihuoid, search): Promise<any> {
    console.log(search);
    return this.http.put('store/api/ldtihuo/modifyweight/' + ldtihuoid, search).toPromise();
  }

  offlinetihuolist(): Promise<any> {
    return this.http.get('store/api/tihuo/offlinelist').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  offlinetihuolist1(search): Promise<any> {
    return this.http.get('store/api/tihuo/offlinelist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  querytihuolist(search): Promise<any> {
    return this.http.get('store/api/tihuo/list', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createtihuo(search): Promise<any> {
    return this.http.post('store/api/tihuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
 //判断合同变更后是否上传客户公章
 iskehugaizhang(search): Promise<any> {
  return this.http.post('store/api/tihuo/iskehugaizhang',search).toPromise().then(data => {
    return data.json() as any[];
  });
}
  emancipation(search) {
    return this.http.post('store/api/businessorder/emancipation', search).toPromise();
  }

  query(search) {
    return this.http.get('store/api/tihuo', { search: search }).toPromise();
  }

  canceltihuo(search) {
    return this.http.put('store/api/tihuo/cancel', search).toPromise();
  }

  get(id) {
    return this.http.get('store/api/tihuo/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  listFeeDetail(search) {
    return this.http.get('store/api/tihuo/listfeedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

   // 删除某组费用明细
  removeTihuofee(search) {
    return this.http.get('store/api/tihuo/removetihuofee', { search: search }).toPromise();
  }
/*     // 删除某个费用明细
    removethfee(search) {
      return this.http.post('store/api/tihuo/removethfee',  { search: search } ).toPromise();
    } */
 /*    // 批量删除费用明细
    deltihuofee(search) {
      return this.http.post('store/api/allot/removeallotfees', search ).toPromise();
    } */

  
    // 加工货物批量删除
    removetihuofees(search): Promise<any> {
      return this.http.post('store/api/tihuo/removetihuofees',  search).toPromise();
    }
  

  arrears(search) {
    return this.http.get('store/api/tihuo/arrearsapply', { search: search }).toPromise();
  }

  tihuopay(tihuoid, search) {
    return this.http.get('store/api/tihuo/tihuopay/' + tihuoid, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifygoodsstatus(search) {
    return this.http.put('store/api/tihuo/modifygoodsstatus', search).toPromise();
  }

  refusecancel(search) {
    return this.http.put('store/api/tihuo/refuse', search).toPromise();
  }

  cancelShiti(tihuoid, search) {
    return this.http.get('store/api/tihuo/cancelshiti/' + tihuoid, { search: search }).toPromise();
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
  //查找预估费用单价 
  findyufufeelist(search) {
    return this.http.get('store/api/tihuo/findyufufeelist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  xstuihuo(search) {
    return this.http.post('store/api/tihuo/xstuihuo', search).toPromise();
  }

  modifytihuo(id, search) {
    return this.http.put('store/api/tihuo/' + id, search).toPromise();
  }
  updatecarnum(id, search) {
    return this.http.put('store/api/tihuo/updatecarnum/' + id, search).toPromise();
  }

  tihuodet(search) {
    return this.http.get('store/api/tihuo/tihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  queryxstuihuo(search) {
    return this.http.get('store/api/tihuo/xstuihuolist', { search: search }).toPromise();
  }

  getxstuihuo(id) {
    return this.http.get('store/api/tihuo/xstuihuo/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  removeTuihuofee(search) {
    return this.http.get('store/api/tihuo/tuihuo/removetuihuofee', { search: search }).toPromise();
  }

  listTuihuoFeeDetail(search) {
    return this.http.get('store/api/tihuo/tuihuo/listfeedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createTuihuoFee(search) {
    return this.http.post('store/api/tihuo/tuihuo/createfee', search).toPromise();
  }

  removexstuihuo(id) {
    return this.http.delete('store/api/tihuo/removexstuihuo/' + id).toPromise();
  }

  verify(id) {
    return this.http.get('store/api/tihuo/verify/' + id).toPromise();
  }
  //添加临调明细单
  addtihuodet(model) {
    return this.http.post('store/api/ldtihuo/addtihuodet', model).toPromise().then(data => {
      return data.json() as any[];
    });
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
  //完成临调
  finishld(model) {
    return this.http.put('store/api/ldtihuo/finishld', model).toPromise();
  }
  //加工订单成品临调列表查询
  listfproducts() {
    return this.http.get('store/api/ldtihuo/ldfproductlist').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cangkutihuodet(search) {
    return this.http.get('store/api/cangkutihuo/tihuodet', { search: search }).toPromise().then(data => {
      console.log(data);
      return data.json() as any[];
    });
  }
  createChukuFee(search) {
    return this.http.post('store/api/tihuo/createchukufee', search).toPromise();
  }

  verifyChange(id) {
    return this.http.get('store/api/tihuo/verifyChange/' + id).toPromise();
  }
  refuseChange(id) {
    return this.http.get('store/api/tihuo/refuseChange/' + id).toPromise();
  }
  chexiaoqiankuan(id) {
    return this.http.delete('store/api/tihuo/chexiaoqiankuan/' + id).toPromise();
  }
  bilishifangdingjin(tihuoid) {
    return this.http.put('store/api/tihuo/bilishifangdingjin/' + tihuoid, {}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取调拨费 */
  getdiaobofee(search) {
    return this.http.get('store/api/tihuo/getallotfee', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  yanqitihuo(search) {
    return this.http.get('store/api/report/yanqitihuo', { search: search }).toPromise().then(data => {
      console.log(data);
      return data.json() as any[];
    });
  }
  /**线下发货匹配车号模板下载 */
  offlinedownloadtemplate() {
    return this.http.get('store/api/tihuo/offlinedownloadtemplate').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**线下发货匹配车号上传 */
  offlinecarnumberupload(search) {
    return this.http.post('store/api/tihuo/offlinecarnumber', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  putOrderdetToProorderdet(search) {
    return this.http.post('store/api/produce/createtasklistfromoffline', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**销售退货修改 */
  xstuihuoupdate(search) {
    return this.http.put('store/api/tihuo/xstuihuo/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**临调提货引入库存 */
  ldtihuoimportkucun(search) {
    return this.http.post('store/api/ldtihuo/importkucun', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询当前订单的物流竞价 */
  getwuliuorderlist(search) {
    return this.http.post('store/api/wuliuorder/getwuliuorderlist', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 资金占用利息申请
  fundInterestSubmit(id) {
    return this.http.get('store/api/tihuo/fundinterestsubmit/' + id).toPromise();
  }
  // 释放货物明细表
  releaselist(search) {
    return this.http.get('store/api/businessorder/releaselist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 修改提货单中的费用
  updateFee(search) {
    return this.http.put('store/api/tihuo/updatefee', search).toPromise();
  }

  // 修改提货单中的费用
  confirmFee(tihuoid) {
    return this.http.get('store/api/tihuo/confirmfee/' + tihuoid).toPromise();
  }
  /**下载模板 */
  downloadExcel() {
    return this.http.get('store/api/tihuo/download').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**上传报销费用明细表 */
  pipeiTihuo(search) {
    return this.http.post('store/api/tihuo/pipeitihuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询当前订单的资金占用利息-应收利息 */
  findinterestbyorder(tihuoid) {
    return this.http.get('store/api/tihuo/findinterestbyorder/' + tihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询当前订单的资金占用利息-应收利息 */
  tihuointeresttijiao(search) {
    return this.http.put('store/api/tihuo/tihuointeresttijiao', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取可释放定金 */
  getkeshifang(search): Promise<any> {
    return this.http.get('store/api/tihuo/getkeshifang', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
