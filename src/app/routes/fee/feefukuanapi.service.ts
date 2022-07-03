import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FeefukuanapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/feefukuan', { search: search }).toPromise();
  }

  removeFeefukuan(id) {
    return this.http.delete('store/api/feefukuan/' + id).toPromise();
  }

  create(search) {
    return this.http.post('store/api/feefukuan', search).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getFeefukuanAndDet(id) {
    return this.http.get('store/api/feefukuan/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  removeDet(id) {
    return this.http.delete('store/api/feefukuan/det/' + id).toPromise();
  }

  improtFee(search) {
    return this.http.get('store/api/feefukuan/importFeecollect', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getImpFee(search) {
    return this.http.get('store/api/feefukuan/importselectfee', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  addFeefukuanDet(search) {
    return this.http.post('store/api/feefukuan/addfeefukuandet', search).toPromise()
  }

  submitVuer(search) {
    return this.http.get('store/api/feefukuan/submitvuser', { search: search }).toPromise();
  }


  cancelVuser(id) {
    return this.http.get('store/api/feefukuan/cancelvuser/' + id).toPromise();
  }

  cancelPayuser(id) {
    return this.http.get('store/api/feefukuan/cancelfinance/' + id).toPromise();
  }

  submitFinance(search) {
    return this.http.get('store/api/feefukuan/submitfinance', { search: search }).toPromise();
  }

  verify(id, search) {
    return this.http.get('store/api/feefukuan/verify/' + id, { search: search }).toPromise();
  }

  giveUpAudit(id) {
    return this.http.get('store/api/feefukuan/giveupaudit/' + id).toPromise();
  }

  modifyinfo(id, search) {
    return this.http.put('store/api/feefukuan/modifyinfo/' + id, search).toPromise();
  }

  modifydetinfo(id, search) {
    return this.http.put('store/api/feefukuan/modifydetinfo/' + id, search).toPromise();
  }

  print(id) {
    return this.http.get('store/api/feefukuan/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  reload(id) {
    return this.http.get('store/api/feefukuan/reload/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  modifyShifujine(billid, orgid, search, paycustomerid) {
    return this.http.put('store/api/feefukuan/modifyshifujine/' + billid,
      { orgid: orgid, newvalue: search, paycustomerid: paycustomerid }).toPromise();
  }
  /**制单人提交 */
  cuserConfirm(search) {
    return this.http.get('store/api/feefukuan/submitVuser2', { search: search }).toPromise();
  }
  /**仓储费审核 */
  submitStorage(search) {
    return this.http.get('store/api/feefukuan/submitStorage', { search: search }).toPromise();
  }
  /**付款复核人审核 */
  pcheck(search) {
    return this.http.get('store/api/feefukuan/pcheck', { search: search }).toPromise();
  }
  /**发票复核人审核 */
  submitCheck(search) {
    return this.http.get('store/api/feefukuan/submitCheck', { search: search }).toPromise();
  }
  submitpay(search) {
    return this.http.get('store/api/feefukuan//submitPay', { search: search }).toPromise();
  }
  /**付款人审核 */
  submitFukuan(search) {
    return this.http.get('store/api/feefukuan/submitFukuan', { search: search }).toPromise();
  }
  testNC() {
    return this.http.get('store/pub/nc/tihuosheshuiNC').toPromise();
  }
  // 费用付款单上传发票
  uploadinvoice(search): Promise<any> {
    return this.http.post("store/api/feefukuan/uploadinvoice", search).toPromise();
  }
  // 查看发票
  getInvoiveUrl(id) {
    return this.http.get('store/api/feefukuan/getinvoiveurl/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // 删除发票
  deleteInvoice(params) {
    return this.http.delete('store/api/feefukuan/deleteinvoice', { params: params }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  // 修改税额
  updatetaxjine(search): Promise<any> {
    return this.http.put('store/api/feefukuan/updatetaxjine' ,search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteFeefuandet(search) {
    return this.http.post('store/api/feefukuan/deletefeefuandet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
