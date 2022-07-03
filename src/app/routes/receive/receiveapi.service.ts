import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReceiveapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/shoukuan', { search: search }).toPromise();
  }

  get(id) {
    return this.http.get('store/api/shoukuan/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/shoukuan', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  update(id, search) {
    return this.http.put('store/api/shoukuan/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  submitverify(id, search) {
    return this.http.put('store/api/shoukuan/verify/' + id, search).toPromise();
  }

  // 参数不确定（如果只传了id search对象就不用写）
  audit(id, kuaijikemu) {
    return this.http.get('store/api/shoukuan/audit/' + id + '?kuaijikemu=' + kuaijikemu).toPromise();
  }
  orgaudit(id) {
    return this.http.get('store/api/shoukuan/orgAudit/' + id).toPromise();
  }
  refuse(id) {
    return this.http.get('store/api/shoukuan/refuse/' + id).toPromise();
  }
  shoukuanlode(id) {
    return this.http.get('store/api/shoukuan/shoukuanlode/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  print(id) {
    return this.http.get('store/api/shoukuan/print/' + id).toPromise().then(data => {
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
    return this.http.delete('store/api/shoukuan/' + id).toPromise();
  }

  getCloseaccountTime() {
    return this.http.get('store/api/shoukuan/getcloseaccounttime').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  closeaccount(search) {
    return this.http.get('store/api/shoukuan/closeaccount', { search: search }).toPromise();
  }

  openaccount() {
    return this.http.get('store/api/shoukuan/openaccount').toPromise();
  }

  addgpsaleman(search) {
    return this.http.put('store/api/shoukuan/addGpsaleman', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createneibu(search) {
    return this.http.post('store/api/innertransfer/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  neibudetail(search) {
    return this.http.get('store/api/innertransfer/find', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getneibuone(id) {
    return this.http.get('store/api/innertransfer/getone/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteneibu(id) {
    return this.http.delete('store/api/innertransfer/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  submitverifyneibu(id, search) {
    return this.http.get('store/api/innertransfer/submitverify/' + id, search).toPromise();
  }
  updateneibu(search) {
    return this.http.put('store/api/innertransfer/update', search).toPromise().then(data => {
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
    return this.http.post('store/api/shoukuan/uploadcontract', model).toPromise();
  }
  // 上传合同的查看
  lookContract(id) {
    return this.http.get('store/api/shoukuan/lookcontract/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //  添加预计回款
  createExceptShoukuan(params): Promise<any> {
    return this.http.post('store/api/shoukuan/createexceptshoukuan', params).toPromise();
  }


  //  资金总体情况表
  getOrgShoukuanJine(search) {
    return this.http.get('store/api/shoukuan/getorgshoukuanjine', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
