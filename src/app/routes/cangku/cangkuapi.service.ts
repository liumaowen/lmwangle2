import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CangkuApiService {

  constructor(private http: Http) { }

  // 删除仓储费
  delstoragefee(id) {
    return this.http.delete('store/api/storagefee/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 批量删除仓储费
  delstoragefees(search) {
    return this.http.post('store/api/storagefee/deletes', search ).toPromise();
  }


  // 获取时间范围
  getTimeSection() {
    return this.http.get(`store/api/storagefee/gettimesection`).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取仓储费
  getStorageFeeList(cangkuid){
    return this.http.get(`store/api/storagefee/getstoragefeelist/` + cangkuid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 添加仓储费计算标准
  create(jsonobject) {
    return this.http.post('store/api/storagefee/create', jsonobject).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  gettihuostoragefee(tihuoid){
    return this.http.get(`store/api/storagefee/gettihuostoragefee/` + tihuoid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取加工费
  getProcessfeeList(cangkuid){
    return this.http.get(`store/api/processfee/` + cangkuid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 上传加工费
  uploadprocessfee(jsonobject){
    return this.http.post(`store/api/processfee/uploadprocessfee`,jsonobject).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  
  // 删除加工费
  delprocessfee(id) {
    return this.http.delete('store/api/processfee/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
    
  // 批量删除加工费

    delprocessfees(search) {
      return this.http.post('store/api/processfee/delprocessfees', search ).toPromise();
    }

  // 删除出库费
  delchukufee(id) {
    return this.http.delete('store/api/chukufee/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
