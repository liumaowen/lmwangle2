import { toPromise } from 'rxjs/operator/toPromise';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

@Injectable()
export class OrderapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/order', { search: search }).toPromise();
  }
  /**净料期货加工明细表 */
  jingliaoorderlist(search) {
    return this.http.get('store/api/order/jingliaoorderlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  get(id) {
    return this.http.get('store/api/order/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  print(id) {
    return this.http.get('store/api/order/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  reload(id,ordermodal) {
    return this.http.put('store/api/order/reload/' + id,ordermodal).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  orderyunfeecalc() {
    return this.http.get('store/api/order/ordercalclist').toPromise().then(data => {
      return data.json() as any[];
    })
  }
  /**添加加工费列表 */
  orderentrucalclist() {
    return this.http.get('store/api/order/orderentrucalclist').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifyorderstatus(search) {
    return this.http.put('store/api/order/modifyorderstatus', search).toPromise();
  }
  /**线上订单保存修改 */
  savebeizhu(search) {
    return this.http.put('store/api/order/addProduceClaim', search).toPromise();
  }
  /**线上订单明细添加加工要求 */
  addDetProduceClaim(search) {
    return this.http.put('store/api/order/addDetProduceClaim', search).toPromise();
  }
  /**填写完备注提交 */
  noticeAccountant(search) {
    return this.http.get('store/api/order/noticeAccountant', { search: search }).toPromise();
  }
  //删除线上明细
  delorder(search): Promise<any> {
    return this.http.post('store/api/order/delorder/' ,search ).toPromise();
  }

    //批量删除线上明细
    deleteorder(search): Promise<any> {
      return this.http.post('store/api/order/deleteorder/' ,search ).toPromise();
    }

  getchukufee(search) {
    return this.http.get('store/api/order/getchukufee', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  addorderdetyunfee(search) {
    return this.http.put('store/api/order/orderdetyunfee', search).toPromise();
  }
  /**加工费的添加 */
  addproduceFee(search) {
    return this.http.post('store/api/order/addProduceFee', search).toPromise();
  }

  querykaipiao(search) {
    return this.http.get('store/api/salebill/billlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  queryexpress(search) {
    return this.http.get('store/api/salebill/expresslist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  addexpress(search) {
    return this.http.put('store/api/salebill/addexpress', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  verifylist(search) {
    return this.http.get('store/api/salebill/verifylist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  verifykaipiao(search) {
    return this.http.put('store/api/salebill/verify', search).toPromise();
  }
  listAddresses(search) {
    return this.http.get('store/api/salebill/listbycustomerid', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  addAddr(search) {
    return this.http.post('store/api/salebill/addr', search).toPromise();
  }
  createkaipiao(search) {
    return this.http.post('store/api/salebill/billing', search).toPromise();
  }

  pageSalebill(search) {
    return this.http.get('store/api/salebill', { search: search }).toPromise();
  }

  getonesale(id) {
    return this.http.get('store/api/order/salebill/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  submitExpress(id, search) {
    return this.http.put('store/api/order/salebill/' + id, search).toPromise()
  }
  modifyExpress(id, search) {
    return this.http.put('store/api/order/modifyexpress/' + id, search).toPromise();
  }

  verify(id, search) {
    return this.http.get('store/api/salebill/verify/' + id, { search: search }).toPromise();
  }
  disverify(id) {
    return this.http.get('store/api/salebill/disverify/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  submitmodify(id, search) {
    return this.http.get('store/api/salebill/modify/' + id, { search: search }).toPromise();
  }

  removeone(id) {
    return this.http.get('store/api/salebill/remove/' + id).toPromise();
  }

  setInvoiceNo(search) {
    return this.http.put('store/api/salebill/setinvoiceno', search).toPromise();
  }

  querykaipiaocount(search) {
    return this.http.get('store/api/salebill/billcount', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  printsalebill(id) {
    return this.http.get('store/api/salebill/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  reloadsalebill(id) {
    return this.http.get('store/api/salebill/reload/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  setweikaipiaoshouru(search) {
    return this.http.post('store/api/salebill/setweikaipiaoshouru', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  makepingzheng() {
    return this.http.get('store/api/salebill/makepingzheng').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  addfee(model) {
    return this.http.post('store/api/order/addfeeinorder', model).toPromise();
  }
  findYugufees(search) {
    return this.http.get('store/api/order/findyugufees', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  //删除预估费用
  delorderfee(orderfeedetid) {
    return this.http.delete('store/api/order/delorderfee/' + orderfeedetid).toPromise();
  }
  //自提改转货权修改
  modifytype(search, Orderid) {
    return this.http.put('store/api/order//modifytype/' + Orderid, search).toPromise();
  }
  showzhixiao(search) {
    return this.http.put('store/app/order/showzhixiao', search).toPromise();
  }
  getadvanceinvoicelist(search) {
    return this.http.get('store/api/advanceinvoice/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**创建提前开票单 */
  createadvance(search) {
    return this.http.post('store/api/advanceinvoice/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询提前开票详情页 */
  getoneadvance(id) {
    return this.http.get('store/api/advanceinvoice/getdetail/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**提交提前开票 */
  submitreviewadvance(id) {
    return this.http.get('store/api/advanceinvoice/submitreview/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**提前开票明细修改 */
  modifyadvancedet(search) {
    return this.http.put('store/api/advanceinvoice/updatedet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**提前开票引入合同明细 */
  importorder(search) {
    return this.http.post('store/api/advanceinvoice/adddet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**作废提前开票引入合同明细 */
  cancelDet(search) {
    return this.http.post('store/api/advanceinvoice/canceldet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**删除提前开票单 */
  deletebill(id) {
    return this.http.delete('store/api/advanceinvoice/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**撤销提前开票单 */
  cancelbill(id) {
    return this.http.get('store/api/advanceinvoice/cancel/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**修改提前开票主表信息 */
  modifyadvance(search) {
    return this.http.put('store/api/advanceinvoice/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**删除提前开票单明细 */
  deletedet(id) {
    return this.http.delete('store/api/advanceinvoice/deletedet/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
    /**批量删除提前开票单明细 */
    deleteorderdet(id) {
      return this.http.delete('store/api/order/deleteorderdet/' + id).toPromise().then(data => {
        return data.json() as any[];
      });
    }
  /**查询合同明细 */
  findorderdetbybillno(search) {
    return this.http.get('store/api/advanceinvoice/getorderdetlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询未还单明细 */
  gethuandan(search) {
    return this.http.get('store/api/salebill/findBybuyerid/' + search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**期货代运汇总表 */
  getqihuodaiyundet(search) {
    return this.http.get('store/api/report/qihuodaiyunorderdet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 提前开票申请明细表上传合同
  uploadOrder(search): Promise<any> {
    return this.http.post('store/api/advanceinvoice/uploadorder', search).toPromise();
  }
  // 提前开票删除附件
  delfujian(search): Promise<any> {
    return this.http.put('store/api/advanceinvoice/delfujian', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 获取涂镀公司销量情况
  gettudusaledet(search): Promise<any> {
    return this.http.get('store/api/report/tudusaledet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取当年的工作日
  getworkday(search): Promise<any> {
    return this.http.get('store/api/workday/getworkday', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改工作日或者已完成工作日
  updateworkday(id, search): Promise<any> {
    return this.http.put('store/api/workday/updateworkday/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取各机构计划量明细表
  getOrgplanList(): Promise<any> {
    return this.http.get('store/api/orgplan/getOrgplanList').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取各机构代钢品下单量明细表
  getDaigpList(): Promise<any> {
    return this.http.get('store/api/daigp/getDaigpList').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改机构计划量
  updateorgplan(search): Promise<any> {
    return this.http.put('store/api/orgplan/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改机构代钢品下单量
  updatedaigp(search): Promise<any> {
    return this.http.put('store/api/daigp/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 添加机构计划量
  createorgplan(search): Promise<any> {
    return this.http.post('store/api/orgplan/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 删除机构计划量
  deleteorgplan(search): Promise<any> {
    return this.http.post('store/api/orgplan/delete', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 导出邮寄信息
  importMailingData(search) {
    return this.http.get('store/api/salebill/importmailingdata', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 开票单匹配快递单号
  addMailingData(search): Promise<any> {
    return this.http.post('store/api/salebill/addmailingdata', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 开票单匹配发票号
  addfpData(search): Promise<any> {
    return this.http.post('store/api/salebill/addfpdata', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //上传发票
  uploadfp(search): Promise<any> {
    return this.http.put('store/api/salebill/uploadfp', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  delfp(search): Promise<any> {
    return this.http.put('store/api/salebill/delfp', search).toPromise().then(data => {
      return data.json() as any;
    });
  }

  //开票单上传发票
  uploadfp2(search): Promise<any> {
    return this.http.put('store/api/salebill/uploadfp2', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  findfps(salebillid): Promise<any> {
    return this.http.get('store/api/salebill/findfps/' + salebillid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  delfp2(search): Promise<any> {
    return this.http.put('store/api/salebill/delfp2', search).toPromise().then(data => {
      return data.json() as any;
    });
  }


  /**涂镀销量进度表历史记录月份 */
  tudusalegroupByMonth() {
    return this.http.get('store/api/report/tudusalegroupByMonth').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**日常接单及成交情况表 */
  daydealdetail(search): Promise<any> {
    return this.http.get('store/api/order/daydealdetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**日常接单及成交情况表 */
  findxundandetail(search): Promise<any> {
    return this.http.get('store/api/yida/findxundandetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**拷贝现货 */
  copyxianhuo(search): Promise<any> {
    return this.http.post('store/api/order/copyxianhuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**是否可以拷贝现货 */
  iscancopyxianhuo(search): Promise<any> {
    return this.http.post('store/api/order/iscancopyxianhuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**创建内部采购发票明细表 */
  createneicaigoufapiao(search): Promise<any> {
    return this.http.post('store/api/neicaigoufapiao', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getDetailAndList(id): Promise<any> {
    return this.http.get('store/api/neicaigoufapiao/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改内部采购发票明细
  modifyNeicaigoufapiaoDetails(search): Promise<any> {
    return this.http.put('store/api/neicaigoufapiao/det', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  submitNeicaigoufapiaoVuser(id, search) {
    return this.http.put('store/api/neicaigoufapiao/submitvuser/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  verifyNeicaigoufapiaoVuser(id, search) {
    return this.http.put('store/api/neicaigoufapiao/verify/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cancelverify(id, search) {
    return this.http.put('store/api/neicaigoufapiao/cancelverify/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  neicaigoufapiaoreporter(search): Promise<any> {
    return this.http.get('store/api/neicaigoufapiao/neicaigoufapiaoreporter', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 删除主表
   */
  delmodel(id) {
    return this.http.delete('store/api/neicaigoufapiao/' + id).toPromise();
  }
  /**
   * 删除明细
   */
  deldetail(id) {
    return this.http.delete('store/api/neicaigoufapiao/det/' + id).toPromise();
  }
  /**
   *  查询质押金
   * @param id 
   * @returns 
   */
  listzhiyajin(id) {
    return this.http.get('store/api/zhiyajin/listzhiyajin', { search: { actualcustomerid: id } }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteDetList(search) {
    return this.http.post('store/api/advanceinvoice/deletedetlist', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  qualityUpdate(params){
    return this.http.put('store/api/order/qualityupdate', params).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  update(search) {
    return this.http.put('store/api/order/updatearea', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  findBillnos(id) {
      return this.http.get('store/api/salebill/findbillnos/'+id).toPromise().then(data => {
        return data.json() as any[];
      });
    }
  getDetail(search){
    return this.http.get('store/api/salebill/getdetail',{ search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
   //开票单上传发票
   uploadfp3(search): Promise<any> {
    return this.http.put('store/api/advanceinvoice/uploadfp2', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
}
