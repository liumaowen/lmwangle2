import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class XmdCaigouService {

  constructor(private http: Http) {
  }

  create(caigou): Promise<any> {
    return this.http.post('store/api/xmd/caigou', caigou).toPromise().then(data => {
      return data.json();
    });
  }

  getchandi(): Promise<any> {
    return this.http.get('store/api/xmd/caigou/getallchandi').toPromise().then(data => {
      return data.json() as any;
    });
  }

  getcaigoudet(search): Promise<any> {
    return this.http.get('store/api/xmd/caigou/caigoudet', {search: search}).toPromise().then(data => {
      return data.json() as any;
    });
  }

  // 完成采购
  finishDets(search): Promise<any> {
    return this.http.put('store/api/xmd/caigou/finishcaigoudet', {caigoudetids: search}).toPromise().then();
  }

  copydet(copy): Promise<any> {
    return this.http.put('store/api/xmd/caigou/det/copy', copy).toPromise().then(data => {
      return data.json() as any;
    });
  }

  addgrno(grno): Promise<any> {
    return this.http.put('store/api/xmd/caigou/grno', grno).toPromise().then();
  }

  // 修改采购明细（基板厚度）
  updateCaigouDet(search) {
    return this.http.put('store/api/xmd/caigou/updatedet', search).toPromise().then(data => {
      return data.json();
    });
  }

  // 完成采购
  finish(id): Promise<any> {
    return this.http.get('store/api/xmd/caigou/finish/' + id).toPromise().then();
  }

  //修改钢厂合同重量
  modifygchtweight(model, detid) {
    return this.http.put('store/api/xmd/caigou/gchtweight/' + detid, model).toPromise().then();
  }

  deletedet(id): Promise<any> {
    return this.http.delete('store/api/xmd/caigou/det/' + id).toPromise().then();
  }

  getCaigou(id): Promise<any> {
    return this.http.get('store/api/xmd/caigou/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }

  modifymdmcaigoudet(det): Promise<any> {
    return this.http.put('store/api/xmd/caigou/modifymdmcaigoudet', det).toPromise().then(data => {
      return data.json() as any;
    });
  }

  adddet(det): Promise<any> {
    return this.http.put('store/api/xmd/caigou/det', det).toPromise().then(data => {
      return data.json() as any;
    });
  }

  modifyweight(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/weight', modify).toPromise().then();
  }

  modifyprice(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/price', modify).toPromise().then();
  }

  modifyorg(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/updateorg', modify).toPromise().then();
  }

  deletecaigou(id): Promise<any> {
    return this.http.delete('store/api/xmd/caigou/' + id).toPromise().then();
  }

  modifyjiaohuoaddr(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/jiaohuoaddr', modify).toPromise().then();
  }

  modifybeizhu(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/beizhu', modify).toPromise().then();
  }

  cgprint(id): Promise<any> {
    return this.http.get('store/api/xmd/caigou/print/' + id).toPromise().then(data => {
      return data.json();
    });
  }

  modifysupplier(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/supplier', modify).toPromise().then();
  }

  backcg(id): Promise<any> {
    return this.http.get('store/api/xmd/caigou/back/' + id).toPromise().then();
  }

  refusecg(id): Promise<any> {
    return this.http.get('store/api/xmd/caigou/refuse/' + id).toPromise().then();
  }

  modifygc(detid, model) {
    return this.http.put('store/api/xmd/caigou/modifygc/' + detid, model).toPromise();
  }

  modifygongcha(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/gongcha', modify).toPromise().then();
  }

  modifyGcinfo(model, id) {
    return this.http.put('store/api/xmd/caigou/gcinfo/' + id, model).toPromise().then();
  }

  // 提醒盖章
  submitgaizhang(userid, caigouid) {
    return this.http.get('store/api/xmd/caigou/submitGaizhang/' + caigouid + '?userid=' + userid).toPromise().then();
  }

  // 合同上传
  uploadcontract(model) {
    return this.http.post('store/api/xmd/caigou/uploadcontract', model).toPromise();
  }

  //上传合同的查看
  lookContract(id) {
    return this.http.get('store/api/xmd/caigou/lookcontract/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifybuyer(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/buyer', modify).toPromise().then();
  }

  addYuguFee(modify): Promise<any> {
    return this.http.put('store/api/xmd/caigou/addyugufee', modify).toPromise().then();
  }

  deleteyugufee(id): Promise<any> {
    return this.http.delete('store/api/xmd/caigou/deleteyugufee/' + id).toPromise().then();
  }

  modifyjiesuantype(model) {
    return this.http.put('store/api/xmd/caigou/modifyjiesuantype', model).toPromise().then();
  }

  //修改采购订单主表信息
  modifycaigou(editcaigou) {
    return this.http.put('store/api/xmd/caigou/modifycaigou', editcaigou).toPromise();
  }

  importdetrukuapply(det): Promise<any> {
    return this.http.post('store/api/rukuapply/importqihuodet', det).toPromise().then();
  }

  importfpdet(det): Promise<any> {
    return this.http.post('store/api/tasklist/importfpdet', det).toPromise().then();
  }

  getqihuodet(search): Promise<any> {
    return this.http.get('store/api/xmd/caigou/qihuodet', {search: search}).toPromise().then(data => {
      return data.json() as any;
    });
  }

  importdet(det): Promise<any> {
    return this.http.post('store/api/xmd/caigou/importdet', det).toPromise().then();
  }

}
