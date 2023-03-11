import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ShoukuanService {

  constructor(private http: Http) { }

  query(search): Promise<any> {
    return this.http.get('store/api/shoukuan', { search: search }).toPromise();
  }
  get(id): Promise<any> {
    return this.http.get('store/api/shoukuan/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  delShoukuan(id): Promise<any> {
    return this.http.delete('store/api/shoukuan/' + id).toPromise();
  }
  add(search): Promise<any> {
    return this.http.post('store/api/shoukuan', search).toPromise();
  }
  update(id, shoukuanModel): Promise<any> {
    return this.http.put('store/api/shoukuan/' + id, shoukuanModel).toPromise();
  }
  // 提交审核
  submit(id, shoukuanModel): Promise<any> {
    return this.http.put('store/api/shoukuan/verify/' + id, shoukuanModel).toPromise();
  }
  // 审核
  audit(id): Promise<any> {
    return this.http.get('store/api/shoukuan/audit/' + id).toPromise();
  }
  // 获取内部公司对应的银行信息
  findbycustomerid(id): Promise<any> {
    return this.http.get("store/api/baccount/listbycustomerid/" + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 根据银行获取对应的银行账号
  findaccount(id): Promise<any> {
    return this.http.get("store/api/baccount/fukuanaccount/" + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 检查公司是否匹配
  checkCompany(search): Promise<any> {
    return this.http.get("store/api/customer/checkcompany", { search: search }).toPromise().then(data => {
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
  // 质押金
  del(id): Promise<any> {
    return this.http.delete('store/api/zhiyajin/' + id).toPromise();
  }
  create(search) {
    return this.http.post('store/api/zhiyajin', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 参数不确定（如果只传了id search对象就不用写）
  auditzhiyajin(id, kuaijikemu) {
    return this.http.get('store/api/zhiyajin/audit/' + id + '?kuaijikemu=' + kuaijikemu).toPromise();
  }
  getzhiyajin(id): Promise<any> {
    return this.http.get('store/api/zhiyajin/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatezhiyajin(id, model): Promise<any> {
    return this.http.put('store/api/zhiyajin/' + id, model).toPromise();
  }
  submitverify(id, search) {
    return this.http.put('store/api/zhiyajin/verify/' + id, search).toPromise();
  }
  refusezhiyajin(id) {
    return this.http.get('store/api/zhiyajin/refuse/' + id).toPromise();
  }
  queryzhiyajin(search): Promise<any> {
    return this.http.get('store/api/zhiyajin', { search: search }).toPromise();
  }
  tuizhiyajin(id) {
    return this.http.get('store/api/zhiyajin/tuizhiyajin/' + id).toPromise();
  }
  zhiyajintoqiankuan(id) {
    return this.http.get('store/api/zhiyajin/zhiyajintoqiankuan/' + id).toPromise();
  }

}
