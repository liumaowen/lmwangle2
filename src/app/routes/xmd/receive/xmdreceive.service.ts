import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XmdreceiveapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/xmdshoukuan', { search: search }).toPromise();
  }

  get(id) {
    return this.http.get('store/api/xmdshoukuan/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/xmdshoukuan', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  update(id, search) {
    return this.http.put('store/api/xmdshoukuan/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  submitverify(id, search) {
    return this.http.put('store/api/xmdshoukuan/verify/' + id, search).toPromise();
  }

  // 参数不确定（如果只传了id search对象就不用写）
  audit(id, kuaijikemu) {
    return this.http.get('store/api/xmdshoukuan/audit/' + id + '?kuaijikemu=' + kuaijikemu).toPromise();
  }
  orgaudit(id) {
    return this.http.get('store/api/xmdshoukuan/orgAudit/' + id).toPromise();
  }
  refuse(id) {
    return this.http.get('store/api/xmdshoukuan/refuse/' + id).toPromise();
  }
  shoukuanlode(id) {
    return this.http.get('store/api/xmdshoukuan/shoukuanlode/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  print(id) {
    return this.http.get('store/api/xmdshoukuan/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  findbycustomerid(id) {
    return this.http.get('store/api/baccount/listbycustomerid/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getfukuanaccount(id) {
    return this.http.get('store/api/baccount/fukuanaccount/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createbankaccount(search) {
    return this.http.post('store/api/baccount', search).toPromise();
  }

  del(id) {
    return this.http.delete('store/api/xmdshoukuan/' + id).toPromise();
  }

  getCloseaccountTime() {
    return this.http.get('store/api/xmdshoukuan/getcloseaccounttime').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  closeaccount(search) {
    return this.http.get('store/api/xmdshoukuan/closeaccount', { search: search }).toPromise();
  }

  openaccount() {
    return this.http.get('store/api/xmdshoukuan/openaccount').toPromise();
  }

  addgpsaleman(search) {
    return this.http.put('store/api/xmdshoukuan/addGpsaleman', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 创建质押金
  createzhiyajin(search) {
    return this.http.post('store/api/zhiyajin', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 合同上传
  uploadcontract(model) {
    return this.http.post('store/api/xmdshoukuan/uploadcontract', model).toPromise();
  }
  // 上传合同的查看
  lookContract(id) {
    return this.http.get('store/api/xmdshoukuan/lookcontract/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //  添加预计回款
  createExceptShoukuan(params): Promise<any> {
    return this.http.post('store/api/xmdshoukuan/createexceptshoukuan', params).toPromise();
  }
  //  资金总体情况表
  getOrgShoukuanJine(search) {
    return this.http.get('store/api/xmdshoukuan/getorgshoukuanjine', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
