import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class VoucherService {

  constructor(private http: Http) { }
  // /**入库汇总考核 */
  // rukuhzkaohe(search): Promise<any> {
  //   return this.http.get('store/pub/nc/rukuhzkaohe', { search: search }).toPromise();
  // }
  // /**承兑贴息考核 */
  // rukucdkaohe(search): Promise<any> {
  //   return this.http.get('store/pub/nc/rukucdkaohe', { search: search }).toPromise();
  // }
  // /**采购发票涉税 */
  // caigousheshui(search): Promise<any> {
  //   return this.http.get('store/pub/nc/caigousheshui', { search: search }).toPromise();
  // }

  // /**销售货物考核 */
  // xsKaoheNC(search): Promise<any> {
  //   return this.http.get('store/pub/nc/xsKaoheNC', { search: search }).toPromise();
  // }
  // /**销售货物涉税 */
  // xsKaoheSheshuiNC(search): Promise<any> {
  //   return this.http.get('store/pub/nc/xsKaoheSheshuiNC', { search: search }).toPromise();
  // }


  // /**销售收款考核 */
  // xsshoukuankaoheNC(search) {
  //   return this.http.get('store/pub/nc/shoukuankaohe', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**销售收款涉税 */
  // xsshoukuansheshuiNC(search) {
  //   return this.http.get('store/pub/nc/shoukuansheshui', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**采购付款考核 */
  // cgfukuankaoheNC(search) {
  //   return this.http.get('store/pub/nc/cgfukuankaohe', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**采购付款涉税 */
  // cgfukuansheshuiNC(search) {
  //   return this.http.get('store/pub/nc/cgfukuansheshui', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**费用付款考核 */
  // feefukuankaoheNC(search) {
  //   return this.http.get('store/pub/nc/feefukuankaohe', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**费用付款涉税 */
  // feefukuansheshuiNC(search) {
  //   return this.http.get('store/pub/nc/feefukuansheshui', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**费用计提考核 */
  // feejitiKaoheNC(search) {
  //   return this.http.get('store/pub/nc/feejitikaohe', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**费用计提涉税 */
  // feejitisheshuiNC(search) {
  //   return this.http.get('store/pub/nc/feejitisheshui', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  // /**销售实提费用预提考核 */
  // xsfeeyutikaoheNc(search) {
  //   return this.http.get('store/pub/nc/xsfeeNckaohe', { search: search }).toPromise().then(data => {
  //     return data.json() as any[];
  //   });
  // }
  /**考核涉税生成凭证公共接口 */
  voucherUrl(url: string, search: any) {
    return this.http.get(`store/pub/nc/${url}`, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
