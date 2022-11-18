import { toPromise } from 'rxjs/operator/toPromise';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReportService {

  constructor(private http: Http) { }

  // 获取钢卷生命周期
  chain(search: object): Promise<any> {
    return this.http.get('store/api/report/chain', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // 获取调拨明细表
  allotdet(search: object): Promise<any> {
    return this.http.get('store/api/report/allotdet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // 获得内采明细数据
  innersaledet(search) {
    return this.http.get('store/api/report/innersaledet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取品名对应的属性，用于查询界面品名选择
  getGoodscodeAttribute(search): Promise<any> {
    return this.http.get('store/api/report/getGoodscodeAttribute', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得入库明细数据
  rukudet(search) {
    return this.http.get('store/api/report/rukudet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得销售往来数据
  xiaoshouwanglaidet(search) {
    return this.http.get('store/api/report/xiaoshouwanglaidet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得订单明细数据
  orderdet(search) {
    return this.http.get('store/api/report/orderdet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得创新订单明细数据
  orderdetcx(search) {
    return this.http.get('store/api/report/orderdetcx', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获得线上订单考核明细数据
  getonlineorderdet(search) {
    return this.http.get('store/api/order/onlineOrderKaohe', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得发票明细数据
  salebilldet(search) {
    return this.http.get('store/api/report/salebilldet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得客户余额数据
  money(search) {
    return this.http.get('store/api/report/money', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 收款明细表
  shoukuan(search) {
    return this.http.get('store/api/report/shoukuan', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 付款明细表
  fukuan(search) {
    return this.http.get('store/api/report/fukuan', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 销售明细表
  saledet(search) {
    return this.http.get('store/api/report/saledet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得提单考核明细数据
  tihuodet(search) {
    return this.http.get('store/api/report/tihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得提单考核明细数据
  tihuodetcx(search) {
    return this.http.get('store/api/report/tihuodetcx', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获得提单考核明细数据
  wstihuodet(search) {
    return this.http.get('store/api/report/wstihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 费用余额表
  feeyue(search) {
    return this.http.get('store/api/report/feeyue', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 费用往来明细表
  feewanglai(search) {
    return this.http.get('store/api/report/feewanglai', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 公司毛利核算
  companymaoli(search) {
    return this.http.get('store/api/report/companymaoli', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 机构毛利核算
  orgmaoli(search) {
    return this.http.get('store/api/report/orgmaoli', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 计算毛利
  maoliCalc() {
    return this.http.get('store/api/maoli/calcmaoli').toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 计算毛利
  maolidetail(search) {
    return this.http.get('store/api/report/maolidetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //
  calcfpchengben(search) {
    return this.http.get('store/api/produce/chengbencalc', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //
  customer(search) {
    return this.http.get('store/api/report/customer', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 超期客户查询
  customerchaoqi(search) {
    return this.http.get('store/api/report/customerchaoqi', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 获得鼓励类销售汇总表数据
  urge(search) {
    return this.http.get('store/api/report/urge', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取流通单库存预警明细表 */
  getkucunwarning(search) {
    return this.http.get('store/api/kucunwarning/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取流通单库存管理统计表 */
  getkucunstatistics() {
    return this.http.get('store/api/report/kucunstatistics').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**删除流通单库存预警明细表 */
  deletekucunwarning(id) {
    return this.http.delete('store/api/kucunwarning/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**上传库存预警 */
  uploadkucunyujing(search) {
    return this.http.post('store/api/kucunwarning/batchupload', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**修改库存预警 */
  editkucunyujing(search) {
    return this.http.put('store/api/kucunwarning/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**下载库存预警模板 */
  downkucunyujing() {
    return this.http.get('store/api/kucunwarning/downloadtemplate').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**单独添加库存预警 */
  createkucunyujing(search) {
    return this.http.post('store/api/kucunwarning/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  innertransferfind(search) {
    return this.http.get('store/api/innertransfer/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 机构实时利润表 */
  orglirun(search) {
    return this.http.get('store/api/report/orglirun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 板块实时利润表 */
  bankuailirun(search) {
    return this.http.get('store/api/report/gnlirun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /** 产地账面毛利表 */
  getchandimaoli(search) {
    return this.http.get('store/api/chandimaoli/getchandimaoli', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**上传年度同期 */
  uploadniandutongqi(moduleparam): Promise<any> {
    return this.http.post('store/api/chandimaoli/uploadniandutongqi', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  /** 低库存预警发送提醒 */
  sendmsgkucunwaning() {
    return this.http.get('store/api/kucunwarning/sendmsgkucunwaning').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /** 物流运输承运量 */
  getchengyunweight(search) {
    return this.http.get('store/api/report/getchengyunweight', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /** 物流运输承运量 */
  getwuliupush(search) {
    return this.http.get('store/api/report/getwuliupush', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  querylirun(search) {
    return this.http.get('store/api/report/orderlirun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  submitChange(search) {
    return this.http.post('store/api/customer/submitchange', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //客户变更记录
  customerchange(search) {
    return this.http.get('store/api/customer/customerchange', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  customerlist(search) {
    return this.http.get('store/api/customer/customerlist', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
