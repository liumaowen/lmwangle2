import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XmdCgbuchaapiService {

  constructor(private http: Http) { }


  cgbuchalist(search: object): Promise<any> {
    return this.http.get('store/api/xmd/cgbucha/cgbuchalist', { search: search }).toPromise();
  }

  // 创建补差单
  createcgbucha(create): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/create', create).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 补差详情
  cgbuchadetail(id): Promise<any> {
    return this.http.get('store/api/xmd/cgbucha/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 添加退款明细
  adddet(det): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/adddet', det).toPromise();
  }
  // 获取待补差数据
  getcgbuchaing(search): Promise<any> {
    return this.http.get('store/api/xmd/cgbucha/cgbuchaing', {search: search}).toPromise().then(data => {
      return data.json() as any;
    });
  }
  importdet(det): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/import', det).toPromise().then();
  }
  importfanli(det): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/importfanli', det).toPromise().then();
  }
  importfanlinew(det): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/importfanlinew', det).toPromise().then();
  }
  kunbaohaopipeifanli(det): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/kunbaohaopipeifanli', det).toPromise().then(data => {
        return data.json() as any[];
    });
  }
  modifydet(id,modify): Promise<any> {
    return this.http.put('store/api/xmd/cgbucha/modifydet/' + id, modify).toPromise().then();
  }
  modifydetnew(id,modify): Promise<any> {
    return this.http.put('store/api/xmd/cgbucha/modifydetnew/' + id, modify).toPromise().then();
  }
  // 删除主表
  removeById(id): Promise<any> {
    return this.http.delete('store/api/xmd/cgbucha/' + id).toPromise().then();
  }
  // 删除明细
  removedet(id): Promise<any> {
    return this.http.delete('store/api/xmd/cgbucha/removeone/' + id).toPromise().then();
  }
  // 上传明细
  uploaddet(search): Promise<any> {
    return this.http.post('store/api/xmd/cgbucha/uploaddet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //提交审核
  submitverify(id): Promise<any> {
    return this.http.get('store/api/xmd/cgbucha/submitverify/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  deletecgbuchaDet(search) {
    return this.http.post('store/api/xmd/cgbucha/deletecgbuchadet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
