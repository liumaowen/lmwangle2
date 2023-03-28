import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XmdrukuService {

  constructor(private http: Http) { }

// 查询库存明细表
  xmdrukudet(search): Promise<any> {
    return this.http.get('store/api/xmdruku/xmdrukudet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  query(search): Promise<any> {
    return this.http.get('store/api/xmdruku', { search: search }).toPromise();
  }
  create(search): Promise<any> {
    return this.http.post('store/api/xmdruku', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**入库后发送通知 */
  rukusendmsg(search): Promise<any> {
    return this.http.post('store/api/xmdruku/rukusendmsg', search).toPromise();
  }
  // 查询某条入库单信息
  get(id): Promise<any> {
    return this.http.get('store/api/xmdruku/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询所有入库单
  findAll(id): Promise<any> {
    return this.http.get('store/api/xmdruku/groupByGn/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 删除某个库存的入库单信息
  delRukudet(id): Promise<any> {
    return this.http.delete('store/api/xmdruku/det/' + id).toPromise();
  }

  //批量删除入库明细
  deleterukudet(search) {
    return this.http.post('store/api/xmdruku/deleterukudet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取分类信息
  getGoodscodeAttribute(search): Promise<any> {
    return this.http.get('store/api/report/getGoodscodeAttribute', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 删除库存
  revoke(id): Promise<any> {
    return this.http.delete('store/api/xmdruku/revoke/' + id).toPromise();
  }

  // 删除库存
  delRuku(id): Promise<any> {
    return this.http.delete('store/api/xmdruku/' + id).toPromise();
  }

  // 根据入库id查询汇总明细
  listCollectByrukuid(rukuid): Promise<any> {
    return this.http.get('store/api/xmdruku/rukucollect/' + rukuid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 创建采购费用
  createCaigoufee(caigoufee): Promise<any> {
    return this.http.post('store/api/xmdruku/createcaigoufee/', caigoufee).toPromise();
  }
  // 获取费用列表
  listFeeDetail(rukuid): Promise<any> {
    return this.http.get('store/api/xmdruku/listfeedetail/' + rukuid).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 采购费用删除
  delcaigoufee(feecollectid): Promise<any> {
    return this.http.delete('store/api/xmdruku/delfee/' + feecollectid).toPromise();
  }
  // 采购费用  批量删除
  deletefee(search): Promise<any> {
    return this.http.post('store/api/xmdruku/deletefee' , search).toPromise().then(data => {
      return data.json() as any[];
  });
}

  // 文档删除
  deletefile(search): Promise<any> {
    return this.http.post('store/api/file/delete', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
