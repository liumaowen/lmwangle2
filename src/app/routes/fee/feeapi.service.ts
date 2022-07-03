import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FeeapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/fee', { search: search }).toPromise();
  }

  modify(search) {
    return this.http.put('store/api/fee/modifyfee', search).toPromise();
  }

  feehuizong(search) {
    return this.http.get('store/api/fee/feehuizong', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  feedetail(search) {
    return this.http.get('store/api/fee/feedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  feedet(search) {
    return this.http.get('store/api/fee/feedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  feefukuandet(search) {
    return this.http.get('store/api/feefukuan/feefukuandet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  feefukuandetreporter(search) {
    return this.http.get('store/api/feefukuan/feefukuandetreporter', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**报销费用明细表 */
  baoxiaofeedet(search) {
    return this.http.get('store/api/maycurreporter/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**报销费用明细表 */
  findcar(search) {
    return this.http.get('store/api/maycurreporter/findcar', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**邯郸报销费用明细表 */
  baoxiaofeedethandan(search) {
    return this.http.get('store/api/maycurreporter/findhandan', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流竞价明细表 */
  wuliubaojiadet(search) {
    return this.http.get('store/api/wuliuorder/finddetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**填写物流竞价 */
  addwuliubaojia(search) {
    return this.http.put('store/api/wuliuorder/addwuliubaojia', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流竞价询价申请 */
  sccgetprice(search) {
    return this.http.post('store/api/wuliuorder/pushdata2scc', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**一键竞价 */
  sccgetpricenew(search) {
    return this.http.post('store/api/wuliuorder/pushdata2sccnew', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**竞价转换为固定路线 */
  changeguding(search) {
    return this.http.get('store/api/wuliuorder/changeguding', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  /**上传报销费用明细表 */
  uploadbaoxiaofeedet(search) {
    return this.http.post('store/api/maycurreporter/excelcreate', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**上传报销费用明细表 */
  uploadfinancefeedet(search) {
    return this.http.post('store/api/maycurreporter/createfinancefee', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**同步每刻报 */
  refreshmaycur(start) {
    return this.http.get('store/api/maycurreporter/batchcreate?start=' + start).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**下载报销明细表模板 */
  downloadExcel() {
    return this.http.get('store/api/maycurreporter/download').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**修改报销费用明细表 */
  editbaoxiao(search) {
    return this.http.put('store/api/maycurreporter/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 删除每刻报费用明细
  delete(id) {
    return this.http.delete('store/api/maycurreporter/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 中选单列表查询
  querybiddingorder(search) {
    return this.http.post('store/api/wuliuorder/getbiddingorders', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 中选单确认
  confirmbiddingorder(search) {
    return this.http.post('store/api/wuliuorder/updatebiddingorders', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流竞价明细作废 */
  zuofei(search) {
    return this.http.put('store/api/wuliuorder/zuofei', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 固定路线查询
  queryyunfeelist(search) {
    return this.http.get('store/api/section/list', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 物流竞价明细表引入固定路线
  wuliuorderimportyunfee(search) {
    return this.http.post('store/api/wuliuorder/wuliuorderimportyunfee', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 物流竞价明细表创建模糊报价
  createmohubaojia(search) {
    return this.http.post('store/api/wuliuorder/createmohubaojia', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  batchHandleFee(json) {
    return this.http.post('store/api/feefukuan/batchhandlefee', json).toPromise();
  }
  /**调货竞价查询中选单 */
  getbiddingorders(search): Promise<any> {
    return this.http.post('store/api/tiaohuobidding/getbiddingorders', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 调货竞价中选单确认
  updatebiddingorders(search) {
    return this.http.put('store/api/tiaohuobidding/updatebiddingorders', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 匹配固定路线，修改物流竞价金额单价，发起审批
  matchguding(search) {
    return this.http.put('store/api/wuliuorder/matchguding', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 选择竞价明细转为运价参考值
  createyunpricecankao(search) {
    return this.http.post('store/api/yunpricecankao', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**同步*/
  create(search) {
    return this.http.get('store/api/maycurreporter/create', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**借款单明细表 */
  findloan(search) {
    return this.http.get('store/api/maycurreporter/findloan', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**借款单明细表 */
  loanKaoheVoucher(search) {
    return this.http.get('store/pub/nc/loankaohevoucher', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //填写还款日期
  huankuan(maycurloan) {
    return this.http.put('store/api/maycurreporter/huankuan', maycurloan).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
