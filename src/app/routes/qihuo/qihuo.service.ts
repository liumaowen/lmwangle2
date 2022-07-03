import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { toPromise } from "rxjs/operator/toPromise";

@Injectable()
export class QihuoService {

  constructor(private http: Http) { }
  query(search): Promise<any> {
    return this.http.get('store/api/qihuo', { search: search }).toPromise();
  }
  add(model): Promise<any> {
    return this.http.post('store/api/qihuo', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 更新
  update(id, model): Promise<any> {
    return this.http.put('store/api/qihuo/' + id, model).toPromise();
  }
  createqihuodet(model): Promise<any> {
    return this.http.post('store/api/qihuo/createqihuodet', model).toPromise();
  }
  modifyqihuodet(id, model) {
    return this.http.put('store/api/qihuo/modifyqihuodet/' + id, model).toPromise();
  }
  modifyinterestfree(id, model) {
    return this.http.put('store/api/qihuo/modifyinterestfree/' + id, model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //根据qihuoid获取期货主表信息
  findqihuo(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuo/findqihuo/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //根据qihuoid获取期货明细
  findQihuodet(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuo/findqihuodet/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 根据qihuodetid删除一个qihuodet的明细
  delQihuo(qihuoid): Promise<any> {
    return this.http.delete('store/api/qihuo/' + qihuoid).toPromise();
  }
  // 根据qihuodetid删除一个qihuodet的明细
  deldet(qihuodetid): Promise<any> {
    return this.http.delete('store/api/qihuo/delqihuodet/' + qihuodetid).toPromise();
  }
  // 添加定金
  adddingjin(model): Promise<any> {
    return this.http.post("store/api/qihuo/adddingjin", model).toPromise();
  }
  verifydingjin(qihuoid, dingjinid): Promise<any> {
    return this.http.put('store/api/qihuo/verifydingjin/' + qihuoid, { dingjinid: dingjinid }).toPromise();
  }
  // 释放定金
  shifangdingjin(model): Promise<any> {
    return this.http.post("store/api/qihuo/shifangdingjin", model).toPromise();
  }
  //根据qihuoid和buyerid查询定金
  finddingjin(qihuoid): Promise<any> {
    return this.http.get("store/api/qihuo/finddingjin/" + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  //根据dingjinid删除定金
  deldingjin(dingjinid): Promise<any> {
    return this.http.delete('store/api/qihuo/deldingjin/' + dingjinid).toPromise();
  }
  //添加成品
  createProduct(model): Promise<any> {
    return this.http.post("store/api/qihuo/product", model).toPromise();
  }
  //查询成品
  findProduct(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuo/product/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //删除成品
  delproduct(productid): Promise<any> {
    return this.http.get('store/api/proorder/removefpro/' + productid).toPromise();
  }
  //期货提交审核人
  submitverify(qihuoid, model): Promise<any> {
    return this.http.put('store/api/qihuo/submitverify/' + qihuoid, model).toPromise();
  }
  //期货审核
  verify(qihuoid, search): Promise<any> {
    return this.http.get('store/api/qihuo/verify/' + qihuoid, { search: search }).toPromise();
  }
  //期货弃审
  qishen(qihuoid, search): Promise<any> {
    return this.http.get('store/api/qihuo/qishen/' + qihuoid, { search: search }).toPromise();
  }
  noticeCaigou(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuo/noticecaigou/' + qihuoid).toPromise();
  }
  // 维实-入库申请
  noticerukuapply(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuo/noticeruku/' + qihuoid).toPromise();
  }
  //期货费用添加
  createFee(qihuodetid, model): Promise<any> {
    return this.http.put('store/api/qihuo/feecreate/' + qihuodetid, model).toPromise();
  }
  //获取orderdet中的数据
  findOrderdet(qihuoid): Promise<any> {
    return this.http.get('store/api/businessorder/det/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //获取基料
  findBasematerial(qihuoid): Promise<any> {
    return this.http.get('store/api/proorder/findproorderdet/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteProorderdet(proorderdetid): Promise<any> {
    return this.http.get('store/api/proorder/remove/' + proorderdetid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //修改颜色，色号
  modifycolor(detid, model) {
    return this.http.put('store/api/qihuo/modifycolor/' + detid, model).toPromise();
  }
  //修改备注
  modifybeizhu(detid, model) {
    return this.http.put('store/api/qihuo/modifybeizhu/' + detid, model).toPromise();
  }
  savebeizhu(id, model) {
    return this.http.put('store/api/qihuo/savebeizhu/' + id, model).toPromise();
  }
  //现货转期货引入库存
  impkucun(detid, model) {
    return this.http.put('store/api/qihuo/impkucun/' + detid, model).toPromise();
  }
  //打印预览
  print(id) {
    return this.http.get('store/api/qihuo/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  //上传合同的查看
  lookContract(id) {
    return this.http.get('store/api/qihuo/lookcontract/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //生成pdf
  makepdf(id): Promise<any> {
    return this.http.get('store/api/qihuo/reload/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  modifygc(detid, model) {
    return this.http.put('store/api/qihuo/modifygc/' + detid, model).toPromise();
  }
  //定金明细表数据获取
  listdingjin(search) {
    return this.http.get('store/api/qihuo/listdingjin', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  //获取公差配置json文件
  getchandigongcha() {
    return this.http.get('assets/server/dnn/chandigongcha.json').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //行复制功能
  copydet(model) {
    return this.http.put('store/api/qihuo/detcopy', model).toPromise();
  }
  finishqihuo(qihuoid, model) {
    return this.http.put('store/api/qihuo/finishqihuo/' + qihuoid, model).toPromise();
  }
  // 期货中添加费用
  addfeeinqihuo(model) {
    return this.http.post('store/api/qihuo/addfeeinqihuo', model).toPromise();
  }
  //获取预估费用
  findYugufees(qihuodetid) {
    return this.http.get('store/api/qihuo/findyugufee/' + qihuodetid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //删除预估费用
  delorderfee(orderfeedetid, qihuodetid) {
    return this.http.delete('store/api/qihuo/delorderfee/' + orderfeedetid, { search: { qihuodetid: qihuodetid } }).toPromise();
  }
  getchukufeetype(search) {
    return this.http.put('store/api/businessorder/getchukufeetype', search).toPromise();
  }
  //修改销售价格
  modifyprice(qihuodetid, model) {
    return this.http.put('store/api/qihuo/modifyprice/' + qihuodetid, model).toPromise();
  }
  //定金开始核算日期确定按钮
  hesuandingjin(qihuoid) {
    return this.http.put('store/api/qihuo/hesuandingjin/' + qihuoid, {}).toPromise();
  }
  //期货接单汇总
  qihuojiedanhuizong(search) {
    return this.http.get('store/api/qihuo/qihuojiedanhuizong', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //期货合同执行情况表
  qihuoexecute(search) {
    return this.http.get('store/api/report/qihuohtexecute', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //项目工程明细表
  gongchengdetail(search) {
    return this.http.get('store/api/report/gongchengdetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //期货合同确认完成
  confirmfinish(search) {
    return this.http.put('store/api/qihuo/confirmfinish', search).toPromise();
  }
  //测试信息用
  noticemsg() {
    return this.http.get('store/pub/kucun/notification').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 合同上传
  uploadcontract(model) {
    return this.http.post('store/api/qihuo/uploadcontract', model).toPromise();
  }
  //订单作废
  zuofeiOrder(qihuoid, zuofeireason) {
    return this.http.put('store/api/qihuo/cancel/' + qihuoid, { zuofeireason: zuofeireason }).toPromise();
  }
  //取消通知采购
  cancelnoticecaigou(qihuoid) {
    return this.http.put('store/api/qihuo/cancelnotice/' + qihuoid, {}).toPromise();
  }
  //添加配款
  addAllocation(model): Promise<any> {
    return this.http.post('store/api/qihuoallocation/addallocation', model).toPromise();
  }
  verifyAllocation(qihuoid, allocationid): Promise<any> {
    return this.http.put('store/api/qihuoallocation/verifyallocation/' + qihuoid, { allocationid: allocationid }).toPromise();
  }
  //释放配款
  shifangAllocation(model): Promise<any> {
    return this.http.post('store/api/qihuoallocation/shifangallocation', model).toPromise();
  }
  //根据qihuoid和buyerid查询配款
  findAllocation(qihuoid): Promise<any> {
    return this.http.get('store/api/qihuoallocation/findallocation/' + qihuoid).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  /**根据orderid获取关联项目 */
  getcontactproject(orderid): Promise<any> {
    return this.http.get('store/api/qihuo/getcontactproject/' + orderid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**临调明细插行 */
  copylddet(search): Promise<any> {
    return this.http.put('store/api/qihuo/lddetcopy', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**临调明细修改 */
  updatelddet(search): Promise<any> {
    return this.http.put('store/api/qihuo/updatelddet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 物流报价
  addWuliuorder(model): Promise<any> {
    return this.http.post('store/api/qihuo/addwuliuorder', model).toPromise();
  }
  //是否有匹配的固定路线
  matchSection(search): Promise<any> {
    return this.http.post('store/api/qihuo/matchsection', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 通知物流专员报价
  noticewuliuyuan(search): Promise<any> {
    return this.http.post('store/api/qihuo/noticewuliuuser', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 通知物流专员进行现货报价
  createxhwuliuorder(search): Promise<any> {
    return this.http.post('store/api/wuliuorder/createxhwuliuorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 现货通知物流专员报价
  xhnoticewuliuyuan(search): Promise<any> {
    return this.http.post('store/api/wuliuorder/createxhwuliuorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 期货合同中物流竞价明细
  wuliuofferdetail(qihuoid): Promise<any> {
    return this.http.get(`store/api/qihuo/wlfindbyqihuoid/${qihuoid}`).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //根据wuliuorderid删除一个物流竞价的明细
  wuliuorderdel(id): Promise<any> {
    return this.http.delete('store/api/wuliuorder/deletewlorder/' + id).toPromise();
  }

  // 查看质保书
  getZhibaoUrl(id) {
    return this.http.get('store/api/order/getzhibaourl/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 批量下载质保书
  downlodezhibao(search): Promise<any> {
    return this.http.get('store/api/zhibao/generatezip', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询scc中请购单状态
  sccinquirystatus(search) {
    return this.http.get('store/api/wuliuorder/sccinquirystatus', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流竞价明细表修改卸货联系人 */
  editxhlianxiren(model) {
    return this.http.put('store/api/wuliuorder/editxhlianxiren', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 通知物流专员进行调拨报价
  createallotwuliuorder(search): Promise<any> {
    return this.http.post('store/api/wuliuorder/createallotwuliuorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 通知物流专员进行在途报价
  createzaituwuliuorder(search): Promise<any> {
    return this.http.post('store/api/wuliuorder/createzaituwuliuorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 一键撤回到制单中
  onerecall(id): Promise<any> {
    return this.http.get('store/api/qihuo/onerecall/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 期货合同变更按钮
  orderchange(id): Promise<any> {
    return this.http.get('store/api/qihuochangelog/applyqihuochange/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 期货合同变更按钮
  orderchangesubmitverify(search): Promise<any> {
    return this.http.put('store/api/qihuochangelog/submitverify', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询期货变更记录 */
  getqihuochangeloglist(id) {
    return this.http.get('store/api/qihuochangelog/getqihuochangeloglist/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  copyqihuo(model): Promise<any> {
    return this.http.post('store/api/qihuo/copyqihuo', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改期货mdm物料明细
  modifymdmqihuodet(model): Promise<any> {
    return this.http.put('store/api/qihuo/modifymdmqihuodet', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getmat(id): Promise<any> {
    return this.http.get('store/api/mdm/getmat/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
