import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RukuService {

  constructor(private http: Http) { }

  query(search): Promise<any> {
    return this.http.get('store/api/ruku', { search: search }).toPromise();
  }

  nmquery(search): Promise<any> {
    return this.http.get('store/api/nmruku', { search: search }).toPromise();
  }
  /**在途入库分页查询 */
  zaituquery(search): Promise<any> {
    return this.http.get('store/api/zaitukucun/findByPage', { search: search }).toPromise();
  }
  /**在途入库模板下载测试用 */
  createExcel(): Promise<any> {
    return this.http.get('store/api/zaitukucun/createExcel').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  create(search): Promise<any> {
    return this.http.post('store/api/ruku', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**入库后发送通知 */
  rukusendmsg(search): Promise<any> {
    return this.http.post('store/api/ruku/rukusendmsg', search).toPromise();
  }
  /**上传在途入库 */
  createzaitu(search): Promise<any> {
    return this.http.post('store/api/zaitukucun/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询某条在途入库单信息
  getone(id): Promise<any> {
    return this.http.get('store/api/zaitukucun/getModel/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 在途查询物流竞价明细
  findbyzaituid(zaituid) {
    return this.http.get('store/api/wuliuorder/findbyzaituid/' + zaituid).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 删除某个在途库存的入库单信息
  delzaituRukudet(id): Promise<any> {
    return this.http.delete('store/api/zaitukucun/deletedet/' + id).toPromise();
  }


  createweishi(search): Promise<any> {
    return this.http.post('store/api/nmruku', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询某条入库单信息
  get(id): Promise<any> {
    return this.http.get('store/api/ruku/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询所有入库单
  findAll(id): Promise<any> {
    return this.http.get('store/api/ruku/groupByGn/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 删除某个库存的入库单信息
  delRukudet(id): Promise<any> {
    return this.http.delete('store/api/ruku/det/' + id).toPromise();
  }

  //批量删除入库明细
  deleterukudet(search) {
    return this.http.post('store/api/ruku/deleterukudet', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取分类信息
  getGoodscodeAttribute(search): Promise<any> {
    return this.http.get('store/api/report/getGoodscodeAttribute', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询库存明细表
  rukudet(search): Promise<any> {
    return this.http.get('store/api/report/rukudet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 删除库存
  revoke(id): Promise<any> {
    return this.http.delete('store/api/ruku/revoke/' + id).toPromise();
  }

  // 删除库存
  delRuku(id): Promise<any> {
    return this.http.delete('store/api/ruku/' + id).toPromise();
  }
  // 入库汇总明细
  rukucollect(search): Promise<any> {
    return this.http.get('store/api/ruku/rukucollect', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 根据入库id查询汇总明细
  listCollectByrukuid(rukuid): Promise<any> {
    return this.http.get('store/api/ruku/rukucollect/' + rukuid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 创建采购费用
  createCaigoufee(caigoufee): Promise<any> {
    return this.http.post('store/api/ruku/createcaigoufee/', caigoufee).toPromise();
  }
  // 获取费用列表
  listFeeDetail(rukuid): Promise<any> {
    return this.http.get('store/api/ruku/listfeedetail/' + rukuid).toPromise().then(data => {
      return data.json() as any;
    });
  }
  // 采购费用删除
  delcaigoufee(feecollectid): Promise<any> {
    return this.http.delete('store/api/ruku/delfee/' + feecollectid).toPromise();
  }
  /* 批量删除费用明细 */
  removetihuofees(search) {
    return this.http.post('store/api/tihuo/removetihuofees', search ).toPromise().then(data => {
    return data.json() as any[];
  });
}
  
  // 采购费用  批量删除
  deletefee(search): Promise<any> {
    return this.http.post('store/api/ruku/deletefee' , search).toPromise().then(data => {
      return data.json() as any[];
  });
}

  // 文档删除
  deletefile(search): Promise<any> {
    return this.http.post('store/api/file/delete', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // #################产品质检反馈表########################
  uploadProductzhijian(moduleparam): Promise<any> {
    return this.http.post('store/api/productzhijian', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  queryProductzhijian(search): Promise<any> {
    return this.http.get('store/api/productzhijian/list', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  removeSelectDets(model) {
    return this.http.put('store/api/productzhijian/delselectdets', model).toPromise();
  }
  makezhibaoshu(id): Promise<any> {
    return this.http.get('store/api/productzhijian/reload/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  printZhibaoshu(kunbaohao): Promise<any> {
    return this.http.get('store/api/productzhijian/print/' + kunbaohao).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifydetail(model) {
    return this.http.put('store/api/productzhijian/modifydetail', model).toPromise();
  }

  uploadWeishiProductzhijian(moduleparam): Promise<any> {
    return this.http.post('store/api/productzhijian/weishizhibao', moduleparam).toPromise().then(data => {
      return data.json();
    });
  }
  queryWeishiZhibao(search): Promise<any> {
    return this.http.get('store/api/productzhijian/weishizhibao', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifyweishidetail(model) {
    return this.http.put('store/api/productzhijian/modifyweishidetail', model).toPromise();
  }

  removeWeishiDets(model) {
    return this.http.put('store/api/productzhijian/removeweishidets', model).toPromise();
  }
  printWeishiZhibaoshu(kunbaohao): Promise<any> {
    return this.http.get('store/api/productzhijian/weishiprint/' + kunbaohao).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
