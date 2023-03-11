import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ZhibaoService {

  constructor(private http: Http) { }

  //获取质保书管理列表
  getlist(search): Promise<any> {
    return this.http.get("store/api/zhibao", { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //获取质保书列表总记录条目
  getcounts(): Promise<any> {
    return this.http.get("store/api/zhibao/counts").toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //删除某个质保书
  delzhibao(id): Promise<any> {
    return this.http.delete('store/api/zhibao/' + id).toPromise();
  }


  //获取某个质保书
  get(id): Promise<any> {
    return this.http.get('store/api/zhibao/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //添加某个质保书
  verify(kunbaohao): Promise<any> {
    return this.http.get('store/api/zhibao/verify', { search: kunbaohao }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //获取创建质保书
  create(search): Promise<any> {
    return this.http.post("store/api/zhibao", search).toPromise();
  }
  getConditions(search): Promise<any> {
    return this.http.get('store/pub/kucun/getConditions', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 批量下载质保书
  generatezip(search): Promise<any> {
    return this.http.get('store/api/zhibao/generatezip', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
