import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CaigouService {

  constructor(private http: Http) { }
  query(search): Promise<any> {
    return this.http.get('store/api/caigou', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  create(caigou): Promise<any> {
    return this.http.post('store/api/caigou', caigou).toPromise().then(data => {
      return data.json();
    });
  }
  rukucreate(rukuapply): Promise<any> {
    return this.http.post('store/api/rukuapply/create', rukuapply).toPromise().then(data => {
      return data.json();
    });
  }
  addrukuapplydet(det): Promise<any> {
    return this.http.post('store/api/rukuapply/adddet', det).toPromise().then(data => {
      return data.json() as any;
    });
  }
  getrukuapply(id): Promise<any> {
    return this.http.get('store/api/rukuapply/findbyid/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  copyrukudet(detid): Promise<any> {
    return this.http.get('store/api/rukuapply/copydet/' + detid).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifyrukuapplydet(modify): Promise<any> {
    return this.http.put('store/api/rukuapply/updatedet', modify).toPromise().then();
  }
  modifyrukuapplygc(model) {
    return this.http.put('store/api/rukuapply/midifygc', model).toPromise();
  }
  deleterukuapplydet(id): Promise<any> {
    return this.http.delete('store/api/rukuapply/deletedet/' + id).toPromise().then();
  }
  deleterukuapply(id): Promise<any> {
    return this.http.delete('store/api/rukuapply/delete/' + id).toPromise().then();
  }
  getrukuapplydet(search): Promise<any> {
    return this.http.get('store/api/rukuapply/find', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifyrukuapplybeizhu(modify): Promise<any> {
    return this.http.put('store/api/rukuapply/update', modify).toPromise().then();
  }
  adddet(det): Promise<any> {
    return this.http.put('store/api/caigou/det', det).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifymdmcaigoudet(det): Promise<any> {
    return this.http.put('store/api/caigou/modifymdmcaigoudet', det).toPromise().then(data => {
      return data.json() as any;
    });
  }
  copydet(copy): Promise<any> {
    return this.http.put('store/api/caigou/det/copy', copy).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifygc(detid, model) {
    return this.http.put('store/api/caigou/modifygc/' + detid, model).toPromise();
  }
  getCaigou(id): Promise<any> {
    return this.http.get('store/api/caigou/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  deletedet(id): Promise<any> {
    return this.http.delete('store/api/caigou/det/' + id).toPromise().then();
  }
  addgrno(grno): Promise<any> {
    return this.http.put('store/api/caigou/grno', grno).toPromise().then();
  }
  modifyweight(modify): Promise<any> {
    return this.http.put('store/api/caigou/weight', modify).toPromise().then();
  }
  modifyprice(modify): Promise<any> {
    return this.http.put('store/api/caigou/price', modify).toPromise().then();
  }
  modifyorg(modify): Promise<any> {
    return this.http.put('store/api/caigou/updateorg', modify).toPromise().then();
  }
  importdet(det): Promise<any> {
    return this.http.post('store/api/caigou/importdet', det).toPromise().then();
  }
  importfpdet(det): Promise<any> {
    return this.http.post('store/api/tasklist/importfpdet', det).toPromise().then();
  }
  importdetrukuapply(det): Promise<any> {
    return this.http.post('store/api/rukuapply/importqihuodet', det).toPromise().then();
  }
  getcaigoudet(search): Promise<any> {
    return this.http.get('store/api/caigou/caigoudet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  caigoujiaofu(search): Promise<any> {
    return this.http.get('store/api/report/caigoujiaofu', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  getqihuodet(search): Promise<any> {
    return this.http.get('store/api/caigou/qihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  deletecaigou(id): Promise<any> {
    return this.http.delete('store/api/caigou/' + id).toPromise().then();
  }
  modifyjiaohuoaddr(modify): Promise<any> {
    return this.http.put('store/api/caigou/jiaohuoaddr', modify).toPromise().then();
  }
  modifybeizhu(modify): Promise<any> {
    return this.http.put('store/api/caigou/beizhu', modify).toPromise().then();
  }
  cgprint(id): Promise<any> {
    return this.http.get('store/api/caigou/print/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  // reloadcg(id): Promise<any> {
  //   return this.http.get('store/api/caigou/reload/' + id).toPromise().then(data => {
  //     return data.json();
  //   });
  // }
  reloadcg(id,json) {
    return this.http.put('store/api/caigou/reload/' + id,json).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submitcg(id): Promise<any> {
    return this.http.get('store/api/caigou/submitverify/' + id).toPromise().then();
  }
  verifycg(id): Promise<any> {
    return this.http.get('store/api/caigou/verify/' + id).toPromise().then();
  }
  backcg(id): Promise<any> {
    return this.http.get('store/api/caigou/back/' + id).toPromise().then();
  }
  refusecg(id): Promise<any> {
    return this.http.get('store/api/caigou/refuse/' + id).toPromise().then();
  }
  getchandi(): Promise<any> {
    return this.http.get('store/api/caigou/getallchandi').toPromise().then(data => {
      return data.json() as any;
    });
  }
  pricechartlist(search): Promise<any> {
    return this.http.get('store/api/pricechart/pricechartlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deletepricechart(id): Promise<any> {
    return this.http.delete('store/api/pricechart/' + id).toPromise().then();
  }
  modifysupplier(modify): Promise<any> {
    return this.http.put('store/api/caigou/supplier', modify).toPromise().then();
  }
  modifygongcha(modify): Promise<any> {
    return this.http.put('store/api/caigou/gongcha', modify).toPromise().then();
  }
  // 付款单
  createfk(cgfukuan): Promise<any> {
    return this.http.post('store/api/cgfukuan/create', cgfukuan).toPromise().then(data => {
      return data.json();
    });
  }
  // 引入采购明细创建付款单
  impcreatefk(cgfukuan): Promise<any> {
    return this.http.post('store/api/cgfukuan/impcreate', cgfukuan).toPromise().then(data => {
      return data.json();
    });
  }
  deletecgfk(id): Promise<any> {
    return this.http.delete('store/api/cgfukuan/' + id).toPromise().then();
  }
  submitfk(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/submitverify/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  verifyfk(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/verify/' + id).toPromise().then();
  }
  refusefukuan(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/refuse/' + id).toPromise().then();
  }
  fukuan(json): Promise<any> {
    return this.http.put('store/api/cgfukuan/fukuan', json).toPromise().then();
  }
  fuhe(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/fuhe/' + id).toPromise().then();
  }
  cgfukuanlist(search): Promise<any> {
    return this.http.get('store/api/cgfukuan', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  cgfukuan(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  fukuanprint(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/print/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  reloadprint(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/reload/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  backfukuan(id): Promise<any> {
    return this.http.get('store/api/cgfukuan/back/' + id).toPromise().then();
  }
  fkmodifybeizhu(modify): Promise<any> {
    return this.http.put('store/api/cgfukuan/beizhu', modify).toPromise().then();
  }
  // 获取内部公司对应的银行信息
  findbycustomerid(id): Promise<any> {
    return this.http.get('store/api/baccount/listbycustomerid/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 根据银行获取对应的银行账号
  findaccount(id): Promise<any> {
    return this.http.get('store/api/baccount/fukuanaccount/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 采购退货
  createtuihuo(tuihuo): Promise<any> {
    return this.http.post('store/api/cgtuihuo', tuihuo).toPromise().then(data => {
      return data.json();
    });
  }
  querytuihuo(search): Promise<any> {
    return this.http.get('store/api/cgtuihuo', { search: search }).toPromise().then();
  }
  verifytuihuo(id): Promise<any> {
    return this.http.get('store/api/cgtuihuo/verify/' + id).toPromise().then();
  }
  cgtuihuo(id): Promise<any> {
    return this.http.get('store/api/cgtuihuo/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  // 采购发票
  getcginvoiceing(search): Promise<any> {
    return this.http.get('store/api/cginvoice/billlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createcginvoice(cginvoice): Promise<any> {
    return this.http.post('store/api/cginvoice', cginvoice).toPromise().then(data => {
      return data.json();
    });
  }
  cginvoice(id): Promise<any> {
    return this.http.get('store/api/cginvoice/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  submitcginvoice(id): Promise<any> {
    return this.http.get('store/api/cginvoice/submitverify/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  verifycginvoice(id): Promise<any> {
    return this.http.get('store/api/cginvoice/verify/' + id).toPromise().then();
  }
  getcginvoice(search): Promise<any> {
    return this.http.get('store/api/cginvoice/det', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifyfpweight(modify): Promise<any> {
    return this.http.put('store/api/cginvoice/weight', modify).toPromise().then();
  }
  modifyfpjine(modify): Promise<any> {
    return this.http.put('store/api/cginvoice/jine', modify).toPromise().then();
  }
  deleteinvoice(id): Promise<any> {
    return this.http.delete('store/api/cginvoice/' + id).toPromise().then();
  }
  // 更新采购发票明细数据
  updatedet(search): Promise<any> {
    return this.http.put('store/api/cginvoice/updatedet', search).toPromise().then();
  }
  backinvoice(id): Promise<any> {
    return this.http.get('store/api/cginvoice/back/' + id).toPromise().then();
  }
  qisheninvoice(id): Promise<any> {
    return this.http.get('store/api/cginvoice/refuse/' + id).toPromise().then();
  }
  importinvoice(det): Promise<any> {
    return this.http.post('store/api/cginvoice/importdet', det).toPromise().then();
  }
  delinvoicedet(id): Promise<any> {
    return this.http.delete('store/api/cginvoice/det/' + id).toPromise().then();
  }
  cginvoicecount(search): Promise<any> {
    return this.http.get('store/api/cginvoice/cginvoicecount', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cginvoiceingdet(search): Promise<any> {
    return this.http.get('store/api/cginvoice/invoiceingdet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cginvoicetiaohuo(): Promise<any> {
    return this.http.get('store/api/cginvoice/cginvoicetiaohuo').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 采购往来
  getwanglai(search): Promise<any> {
    return this.http.get('store/api/report/cgwanglai', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getwanglai2(search): Promise<any> {
    return this.http.get('store/api/report/cgwanglai2', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getwanglaiyue(search): Promise<any> {
    return this.http.get('store/api/report/cgwanglaiyue', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getwanglaiyue2(search): Promise<any> {
    return this.http.get('store/api/report/cgwanglaiyue2', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 结算补差
  createjsbucha(bucha): Promise<any> {
    return this.http.post('store/api/jsbucha', bucha).toPromise().then(data => {
      return data.json();
    });
  }
  jsbuchaadddet(det): Promise<any> {
    return this.http.post('store/api/jsbucha/det', det).toPromise().then();
  }
  buchalist(search: object): Promise<any> {
    return this.http.get('store/api/jsbucha/buchalist', { search: search }).toPromise();
  }
  buchaimportdet(det): Promise<any> {
    return this.http.post('store/api/jsbucha/importdet', det).toPromise().then();
  }
  deletebucha(id): Promise<any> {
    return this.http.delete('store/api/jsbucha/' + id).toPromise().then();
  }
  jsbuchadeletedet(id): Promise<any> {
    return this.http.delete('store/api/jsbucha/det/' + id).toPromise().then();
  }
  getjsbuchadet(id): Promise<any> {
    return this.http.get('store/api/jsbucha/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submitjs(id): Promise<any> {
    return this.http.get('store/api/jsbucha/submitverify/' + id).toPromise().then();
  }
  verifyjs(id): Promise<any> {
    return this.http.get('store/api/jsbucha/verify/' + id).toPromise().then();
  }
  backjs(id): Promise<any> {
    return this.http.get('store/api/jsbucha/back/' + id).toPromise().then();
  }
  refusejs(id): Promise<any> {
    return this.http.get('store/api/jsbucha/refuse/' + id).toPromise().then();
  }
  gettihuodet(search): Promise<any> {
    return this.http.get('store/api/jsbucha/tihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 完成采购
  finish(id): Promise<any> {
    return this.http.get('store/api/caigou/finish/' + id).toPromise().then();
  }
  // 完成采购
  finishDets(search): Promise<any> {
    return this.http.put('store/api/caigou/finishcaigoudet', { caigoudetids: search }).toPromise().then();
  }
  createcgfanli(caigou): Promise<any> {
    return this.http.post('store/api/cgfanli', caigou).toPromise().then();
  }
  getfanlidet(search): Promise<any> {
    return this.http.get('store/api/cgfanli/fanlidet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  importfanli(search): Promise<any> {
    return this.http.get('store/api/cgfanli/importfanli', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifyfanli(id, modify): Promise<any> {
    return this.http.put('store/api/cgfanli/modify/' + id, modify).toPromise().then();
  }
  delfanli(id): Promise<any> {
    return this.http.delete('store/api/cgfanli/det/' + id).toPromise().then();
  }
  submitfanli(modify): Promise<any> {
    return this.http.put('store/api/cgfanli/submit', modify).toPromise().then();
  }
  // 修改钢厂合同信息
  modifyGcinfo(model, id) {
    return this.http.put('store/api/caigou/gcinfo/' + id, model).toPromise().then();
  }
  // 提醒盖章
  submitgaizhang(userid, caigouid) {
    return this.http.get('store/api/caigou/submitGaizhang/' + caigouid + "?userid=" + userid).toPromise().then();
  }
  //修改钢厂合同重量
  modifygchtweight(model, detid) {
    return this.http.put('store/api/caigou/gchtweight/' + detid, model).toPromise().then();
  }

  //运输方式
  modifytransporttype(model, detid) {
      return this.http.put('store/api/caigou/transporttype/' + detid, model).toPromise().then();
    }
  //进货管制数据查询
  listjinhuoguozhi(model) {
    return this.http.get('store/api/report/jinhuoguanzhi', { search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 急单管理表
  listurgentcontract(model) {
    return this.http.get('store/api/caigou/urgentcontract', { search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  matchgrno(moduleparam): Promise<any> {
    return this.http.post('store/api/caigou/matchgrno', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  // 合同上传
  uploadcontract(model) {
    return this.http.post('store/api/caigou/uploadcontract', model).toPromise();
  }
  //上传合同的查看
  lookContract(id) {
    return this.http.get('store/api/caigou/lookcontract/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 采购补差明细表
  findjsbuchadetils(search) {
    return this.http.get('store/api/jsbucha/find?start=' + search.start + '&end=' +
      search.end + '&orgid=' + search.orgid + '&sorgid=' + search.sorgid + '&cuserid=' +
      search.cuserid + '&type=' + search.type).toPromise().then(data => {
        return data.json() as any[];
      });
  }
  /**查询钢厂返利汇总表 */
  getfanlihuizongdet(search): Promise<any> {
    return this.http.get('store/api/fanlihuizong/list', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  /**查询钢厂返利汇总表 */
  getfanlihuizongdetnew(search): Promise<any> {
    return this.http.get('store/api/fanlihuizong/listnew', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  tijiao(search): Promise<any> {
    return this.http.post('store/api/fanlihuizong/submit', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  addDetByTemplate(moduleparam): Promise<any> {
    return this.http.post('store/api/caigou/adddetbytemplate', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  /**上传发票号，批量创建发票 */
  batchAddInvoiceingdet(moduleparam): Promise<any> {
    return this.http.post('store/api/cginvoice/addinvoiceingdet', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  /**上传发票号，批量核销发票 */
  hexiaoinvoice(moduleparam): Promise<any> {
    return this.http.post('store/api/cginvoice/hexiaoinvoice', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  // 修改采购明细（基板厚度）
  updateCaigouDet(search) {
    return this.http.put('store/api/caigou/updatedet', search).toPromise().then(data => {
      return data.json();
    });
  }
  // 批量修改采购明细
  batchUpdateCaigouDet(search) {
    return this.http.put('store/api/caigou/batchupdatedet', search).toPromise().then(data => {
      return data.json();
    });
  }
  /**查询未到返利汇总表 */
  getweidaofanlihuizongdet(search): Promise<any> {
    return this.http.get('store/api/weidaofanlihuizong/list', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifyweidaofanli(id, search): Promise<any> {
    return this.http.put('store/api/weidaofanlihuizong/modify/' + id, search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  uploadkucunfanli(search) {
    return this.http.post('store/api/weidaofanlihuizong/kucunfanlipipei', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  submitWeidaofanli(): Promise<any> {
    return this.http.post('store/api/weidaofanlihuizong/submit', {}).toPromise().then(data => {
      return data.json() as any;
    });
  }
  /**查询去年的未到返利汇总表 */
  getlastyearwdfanlihuizongdet(search): Promise<any> {
    return this.http.get('store/api/lastyearwdfanlihuizong/list', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  uploadlastyearfanli(search) {
    return this.http.post('store/api/lastyearwdfanlihuizong/kucunfanlipipei', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  submitlastyearwdfanli(): Promise<any> {
    return this.http.post('store/api/lastyearwdfanlihuizong/submit', {}).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 获取产地
  getChandiList() {
    return this.http.get('store/api/classify/getchandilist').toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 添加采购付款计划
  createCgfukuanPlan(search) {
    return this.http.post('store/api/cgfukuan/createcgfukuanplan', search).toPromise().then(data => {
      return data.json();
    });
  }

  // 查询采购付款计划
  findCgfukuanPlan(search) {
    return this.http.get('store/api/cgfukuan/findcgfukuanplan', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 获取采购付款计划类型
  getPlanTypeList(parentid) {
    return this.http.get('store/api/classify/getlistbyparentid/' + parentid).toPromise().then(data => {
      return data.json() as any;
    });
  }
  cgjiaofuhuizong(search): Promise<any> {
    return this.http.get('store/api/caigou/cgjiaofuhuizong', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  cgjiaofukaohe(search): Promise<any> {
    return this.http.get('store/api/caigou/jiaofukaohe', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  //删除采购付款计划
  removePayjihua(cgfukuanplanid) {
    return this.http.delete('store/api/cgfukuan/deletefukuanplan/' + cgfukuanplanid).toPromise().then();
  }
  getPayjihua(payjihuaid) {
    return this.http.get('store/api/cgfukuan/getone/' + payjihuaid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatePayjihua(model) {
    return this.http.put('store/api/cgfukuan/updatedet', model).toPromise();
  }
  createCaigou(caigou): Promise<any> {
    return this.http.post('store/api/qihuo/createcaigou', caigou).toPromise().then(data => {
      return data.json();
    });
  }
  deletecaigoudet(search) {
    return this.http.post('store/api/caigou/deletecaigoudet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifybuyer(modify): Promise<any> {
    return this.http.put('store/api/caigou/buyer', modify).toPromise().then();
  }
  deleteinvoicedet(search) {
    return this.http.post('store/api/cginvoice/deleteinvoicedet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifyInvoiceNo(modify): Promise<any> {
    return this.http.put('store/api/cginvoice/modifyinvoiceno', modify).toPromise().then();
  }
  modifyInvoiceBeizhu(modify): Promise<any> {
    return this.http.put('store/api/cginvoice/modifyinvoicebeizhu', modify).toPromise().then();
  }
  updateJsbucha(search): Promise<any> {
    return this.http.put('store/api/jsbucha/updatejsbucha', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifyInvoicedate(modify): Promise<any> {
    return this.http.put('store/api/cginvoice/modifyinvoicedate', modify).toPromise().then();
  }
  addYuguFee(modify): Promise<any> {
    return this.http.put('store/api/caigou/addyugufee', modify).toPromise().then();
  }
  deleteyugufee(id): Promise<any> {
    return this.http.delete('store/api/caigou/deleteyugufee/' + id).toPromise().then();
  }
  getYugufeeList(cgdetid) {
    return this.http.get('store/api/caigou/getyugufeelist/' + cgdetid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  listDiscountregister(model){
    return this.http.get('store/api/fanlidet/getfanlidet', { search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  getfanidetgroup(model){
    return this.http.post('store/api/fanlidet/getfanidetgroup', model).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 采购补差单中的规则表
  getcgbuchafanlirule(model){
    return this.http.get('store/api/fanlirule/getcgbuchafanlirule', { search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 同步返利登记表
  autofanlidet(model){
    return this.http.get('store/api/fanlidet/autofanlidet',{ search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 批量修改采购明细
  batchUpdateIsfinish(search) {
    return this.http.put('store/api/fanlidet/batchupdatefinish', search).toPromise().then(data => {
      return data.json();
    });
  }
  listkid(kid: string): Promise<any> {
    return this.http.get(`store/api/classify/list/${kid}`).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createfanlirule(search) {
    return this.http.post('store/api/fanlirule/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatefanlirule(search) {
    return this.http.put('store/api/fanlirule/updatefanlirule', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改返利规则明细
  modifydetail(search) {
    return this.http.put('store/api/fanlirule/modifydetail', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getfanliruledet(search) {
    return this.http.get('store/api/fanlirule/getdet', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getfanlirulegrnodet(search) {
    return this.http.get('store/api/fanlirulegrno/getfanlirulegrnodet', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getfanlirulecaigoudet(search) {
    return this.http.get('store/api/fanlirule/getfanlirulecaigoudet', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**返利规则详情页 */
  getdetail(id): Promise<any> {
    return this.http.get('store/api/fanlirule/getdetail/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 添加优惠明细
  savefanliruledet(search) {
    return this.http.post('store/api/fanlirule/savefanliruledet', search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  // 优惠规则表引入采购明细中的资源号
  importcaigoudet(search) {
    return this.http.post('store/api/fanlirulegrno/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 批量删除返利规则的资源号
  deletefanlirulegrno(search) {
    return this.http.put('store/api/fanlirulegrno/deletedet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 批量作废返利规则
  fanlirulezuofei(search) {
    return this.http.put('store/api/fanlirule/zuofei', search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  // 批量完成返利规则
  finishfalirule(search) {
    return this.http.put('store/api/fanlirule/finishfalirule', search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  // 查询返利规则操作记录
  getfanlirulelog(id) {
    return this.http.get('store/api/fanlirule/getfanlirulelog/'+id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 批量修改采购明细
  batchUpdateYichan(search) {
    return this.http.put('store/api/caigou/batchupdateyichan', search).toPromise().then(data => {
      return data.json();
    });
  }
  uploadprice(search) {
    return this.http.post('store/api/caigou/uploadprice', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  uploadbeizhu2(search) {
    return this.http.post('store/api/caigou/uploadbeizhu2', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  batchUpdate(search) {
    return this.http.put('store/api/caigou/batchupdate', search).toPromise().then(data => {
      return data.json();
    });
  }
  modifyjiesuantype(model) {
    return this.http.put('store/api/caigou/modifyjiesuantype', model).toPromise().then();
  }
  modifyqihuodet(id, model) {
    return this.http.put('store/api/caigou/batchupdatedet/' + id, model).toPromise();
  }
  /**采购马钢明细分组 */
  caigoudetadd(id) {
    return this.http.get('store/api/caigou/groupbygcid/' + id).toPromise().then(data =>{
      return data.json() as any[];
    });
  }
  //修改交货日期
  modifyjiaohuodate(id, json) {
    return this.http.put('store/api/caigou/jiaohuodate/' + id, json).toPromise().then();
    }

  //运输方式
  modifytransporttype1(id, json) {
    return this.http.put('store/api/caigou/transporttype/' + id, json).toPromise().then();
    }
  // 批量推送CBS
  pushcbs(search) {
    return this.http.put('store/api/cgfukuan/pushcbs', search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  listkucunfanlidet(model){
    return this.http.get('store/api/kucunfanlidet/getkucunfanlidet', { search: model }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  //修改采购订单主表信息
  modifycaigou(editcaigou) {
    return this.http.put('store/api/caigou/modifycaigou', editcaigou).toPromise();
  }

    
}
