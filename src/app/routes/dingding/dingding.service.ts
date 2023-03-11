import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DingdingService {

  constructor(private http: Http) { }

  /** 查询 */
  find(search) {
    return this.http.get('store/api/tudutriplog/find', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取出差日志
  getTripLog(search) {
    return this.http.get('store/api/tudutriplog/countavailabletripdays', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取出差申请
  getTripApply(search) {
    return this.http.get('store/api/tudutriplog/gettripapplylist', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /**修改 */
  updatelog(search) {
    return this.http.put('store/api/tudutriplog/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  /** 汇总表查询 */
  summaryFind(search) {
    return this.http.get('store/api/tudutriplog/summaryfind', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
