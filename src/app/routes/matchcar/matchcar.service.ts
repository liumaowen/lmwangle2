import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MatchcarService {

  constructor(private http: Http) { }
  //创建
  createMatchcar(search) {
    return this.http.post('store/api/matchcar', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //创建
  getdestList(buyerid) {
    return this.http.get('store/api/matchcar/findDest/' + buyerid).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getDetail(id) {
    return this.http.get('store/api/matchcar/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //获取约车单费用报价
  getMatchcarfee(id) {
    return this.http.get('store/api/matchcarfee/findByMatchcarid/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteM(id) {
    return this.http.delete('store/api/matchcar/' + id).toPromise();
  }
  multipledeletedet(search) {
    return this.http.post('store/api/matchcar/multipledeletedet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 车号匹配模板下载
  downloadtemplate() {
    return this.http.get('store/api/matchcar/downloadtemplate').toPromise();
  }
  matchcarnumber(search): Promise<any> {
    return this.http.post('store/api/matchcar/matchcarnumber', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  delDetail(detid) {
    return this.http.delete('store/api/matchcar/det/' + detid).toPromise();
  }
  //删除报价
  delMatchcarfee(matchcarfeeid) {
    return this.http.delete('store/api/matchcarfee/delete/' + matchcarfeeid).toPromise();
  }
  //创建约车报价
  createfee(search) {
    return this.http.post('store/api/matchcarfee/create', search).toPromise();
  }
  createtihuo(search) {
    return this.http.post('store/api/matchcar/createtihuo', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  listDetail(search) {
    return this.http.get('store/api/matchcar/selectall', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  noticeMatchcarfee(json) {
    return this.http.post('store/api/matchcarfee/noticefee', json).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  noticewuliuinfo(search) {
    return this.http.get('store/api/matchcar/noticewuliuinfo', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  matchcarwuliu(search) {
    return this.http.get('store/api/matchcar/findYunshu', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 临调约车单中真实重量的修改
  modifyWeight(ldmatchcardetid, search): Promise<any> {
    console.log(search);
    return this.http.put('store/api/matchcar/modifyweight/' + ldmatchcardetid, search).toPromise();
  }
  // 临调约车单通知物流找车
  noticewlfindcar(matchcarid): Promise<any> {
    return this.http.get('store/api/matchcar/noticewuliufindcar/' + matchcarid, null).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取建议地址，地址自动提示
  getSuggestionPlace(keyword) {
    return this.http.get('store/api/suggestion/getplace', { search: { keyword: keyword } }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // #################### 物流 ########################
  createRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updateRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cancelRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/cancel', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  endRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/end', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  syncRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/sync', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createmoreRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/more', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  morecancelRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/morecancel', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  moreupdateRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/moreupdate', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  moresyncRPCwuliuorder(search) {
    return this.http.post('store/api/wuliushuzihua/moresync', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  
}
