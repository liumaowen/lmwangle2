import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class KucunService {

  constructor(private http: Http) { }

  // 获取
  getConditions(search): Promise<any> {
    return this.http.get('store/pub/kucun/getConditions', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }

  // 查询库存明细表
  listDetail(search): Promise<any> {
    return this.http.get('store/api/kucun/detail', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }
  // 查询非全款库存明细表
  getfqkkucun(): Promise<any> {
    return this.http.get('store/api/kucun/getfqk').toPromise().then(data => {
      return data.json() as any[]
    });
  }

  // 根据月份非全款库存明细表
  getfqksearch(search): Promise<any> {
    return this.http.get('store/api/kucun/getfqksearch', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }

  // 查询在途库存明细表
  listzaituDetail(search): Promise<any> {
    return this.http.get('store/api/zaitukucun/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改在途仓库
  editzaitucangku(search): Promise<any> {
    return this.http.put('store/api/zaitukucun/updatedet', search).toPromise();
  }
  // 在途仓库入库
  zaituruku(search): Promise<any> {
    return this.http.put('store/api/zaitukucun/confirmdaohuo', search).toPromise();
  }
  // 查询线上库存明细表
  listOnlineDetail(search): Promise<any> {
    return this.http.get('store/api/kucun/onlinedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }

  // 编辑保存备注信息
  modifyBeizhu(search): Promise<any> {
    return this.http.get('store/api/kucun/modifybeizhu/' + search['kucunid'] + '?beizhu=' + search['beizhu']).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询收藏夹中的数据
  getlist(search: object): Promise<any> {
    return this.http.get('store/api/kucun/fav', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取
  getlock(): Promise<any> {
    return this.http.get('store/api/kucun/lock').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 锁货
  addlock(search): Promise<any> {
    return this.http.post('store/api/kucun/lock', search).toPromise();
  }

  // 解锁
  unlock(search): Promise<any> {
    return this.http.delete('store/api/kucun/unlock', { search: search }).toPromise();
  }

  // 查询库存汇总表
  listSearch(search): Promise<any> {
    return this.http.get('store/api/kucun/search', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 懒猫每日销售进度表
  showSaleTable(): Promise<any> {
    return this.http.get('store/api/kucun/showsaletable').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 懒猫每日销售进度表修改未产信息
  modifySaleTable(search): Promise<any> {
    return this.http.post('store/api/kucun/modifysaletable', search).toPromise();
  }

  // 懒猫每日销售进度表下载信息
  lazycatsaletable(search): Promise<any> {
    return this.http.get('store/pub/kucun/lazycatsaletable', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 库存日报表下载信息
  downkucunday(search): Promise<any> {
    return this.http.get('store/pub/kucun/kucunday', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取库存汇总表数据
  summaryDetail(search: object): Promise<any> {
    return this.http.get('store/api/kucun/summary', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取上架下架列表
  listPriceAndKucun(): Promise<any> {
    return this.http.get('store/api/kucun/querypriceandkucun').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 所有规格上架操作
  shelveAll() {
    return this.http.get('store/api/kucun/shelveall').toPromise();
  }

  // 下架
  offShelveCategory(search) {
    return this.http.put('store/api/kucun/offshelvecategory', search).toPromise();
  }

  // 单个规格上架操作
  shelve(search) {
    return this.http.get('store/api/kucun/shelve', { search: search }).toPromise();
  }
  // 库存中标记货物不允许上架
  sign(search) {
    return this.http.get('store/api/kucun/sign', search).toPromise();
  }
  //限时优惠
  youhui(search) {
    return this.http.get('store/api/kucun/youhui', search).toPromise();
  }
  // 修改应有数量
  modifyPriceQuantity(id, search): Promise<any> {
    return this.http.put('store/api/kucun/modifyCount/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询线上线下库存明细表需要传递页码，页数
  pagepriceandkucun(search): Promise<any> {
    return this.http.get('store/api/kucun/pagepriceandkucun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询线上线下库存明细表
  listpriceandkucun(search): Promise<any> {
    return this.http.get('store/api/kucun/listpriceandkucun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 仓库明细
  cangkudet(search): Promise<any> {
    return this.http.get('store/api/classify/cangkudet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  pagepriceandkucundet(search) {
    return this.http.get('store/api/kucun/pagepriceandkucun', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  offShelve(search) {
    return this.http.get('store/api/kucun/offshelve', { search: search }).toPromise();
  }
  // 查询库存日报表
  kucunday(search): Promise<any> {
    return this.http.get('store/api/kucun/kucunday', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //统调上下架数量
  getTiaoPriceCount(search): Promise<any> {
    return this.http.post('store/api/kucun/gettiaocount', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createshelvlog(search) {
    return this.http.post('store/api/kucun/createshelvlog', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 钢厂订货量及销售量查询
  getSaleAndCaigou(search): Promise<any> {
    return this.http.get('store/api/report/gcsaleandcaigou', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //流通单订货分析表
  dinghuoFenxi(search): Promise<any> {
    return this.http.get('store/api/report/dinghuofenxi', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //上传仓储号
  addstorageno(search): Promise<any> {
    return this.http.post('store/api/kucun/addStorageno', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //匹配在途库存入库
  pipeizaitukucun(search): Promise<any> {
    return this.http.post('store/api/zaitukucun/pipeizaituruku', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //匹配在途库存入库
  biansitiaojia(search): Promise<any> {
    return this.http.post('store/api/kucun/pricebian', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询超期库存
  overduekucun(search): Promise<any> {
    return this.http.get('store/api/kucun/overduekucun', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }

  getZhibaoUrl(kubaohao): Promise<any> {
    return this.http.get('store/api/zhibao/getzhibaourl/' + kubaohao).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 在途库存预售
  perSale(params): Promise<any> {
    return this.http.post('store/api/zaitukucun/persale', params).toPromise();
  }

  // 在途库存预售
  submitVerify(params): Promise<any> {
    return this.http.post('store/api/kucuncheck/submitverify', params).toPromise();
  }

  // 取消预售
  cancelPerSale(ids): Promise<any> {
    return this.http.delete('store/api/zaitukucun/cancelpresale?ids=' + ids).toPromise();
  }
  /**机构库存权重库龄 */
  getqzkuling(search): Promise<any> {
    return this.http.get('store/api/kucun/getqzkuling', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询历史机构库存权重库龄 */
  getqzkulingmonth(): Promise<any> {
    return this.http.get('store/api/kucun/getqzkulingmonth').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**机构长期库存吨利息 */
  getlongkucuninterest(search): Promise<any> {
    return this.http.get('store/api/kucun/getlongkucuninterest', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询历史机构长期库存吨利息 */
  getongkucuninterestmonth(): Promise<any> {
    return this.http.get('store/api/kucun/getongkucuninterestmonth').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询库存汇总表
  countBasematerial(search): Promise<any> {
    return this.http.get('store/api/order/countbasematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //库存核对
  check(search): Promise<any> {
    return this.http.post('store/api/kucuncheck/check', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询库存核对明细表
  find(search): Promise<any> {
    return this.http.get('store/api/kucuncheck/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改差异原因
  update(search): Promise<any> {
    return this.http.put('store/api/kucuncheck/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询库存核对明细表
  findhuizong(search): Promise<any> {
    return this.http.get('store/api/kucuncheck/findhuizong', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //匹配车船号
  pipeiCarshipnum(search): Promise<any> {
    return this.http.post('store/api/zaitukucun/pipeicarshipnum', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取自动排单明细表 */
  getautopaidan(search) {
    return this.http.get('store/api/autopaidan/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**删除自动排单明细表 */
  deleteautopaidan(id) {
    return this.http.delete('store/api/autopaidan/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
    /**批量删除明细 */
  delautopaidan(search) {
    return this.http.post('store/api/autopaidan/delautopaidan', search).toPromise().then(data => {
    return data.json() as any[];
    });
  }

  /**上传自动排单 */
  uploadautopaidan(search) {
    return this.http.post('store/api/autopaidan/batchupload', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**单独添加自动排单 */
  createautopaidan(search) {
    return this.http.post('store/api/autopaidan/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //权重库龄
  kulingListDetail(search): Promise<any> {
    return this.http.get('store/api/kucun/kulinglistdetail', { search: search }).toPromise().then(data => {
      return data.json() as any[]
    });
  }
  /**劳尔色号添加 */
  laoercolornumAdd(search) {
    return this.http.post('store/api/kucun/laoercolornum/add', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**查询劳尔色号列表 */
  getLaoercolornumList(search) {
    return this.http.get('store/api/kucun/laoercolornum/list', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**劳尔色号对照表颜色修改 */
  updatelaoernum(search) {
    return this.http.put('store/api/kucun/laoercolornum/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**劳尔色号对照表颜色修改 */
  deleteLaoercolornum(search) {
    return this.http.post('store/api/kucun/laoercolornum/delete', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
