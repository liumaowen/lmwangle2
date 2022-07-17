import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProduceapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/produce', { search: search }).toPromise();
  }


  producedet = (search) => {
    return this.http.get('store/api/produce/producedet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  create(search) {
    return this.http.post('store/api/produce', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modify(id, search) {
    return this.http.put('store/api/produce/' + id, search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  get(id) {
    return this.http.get('store/api/produce/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getDetail(id) {
    return this.http.get('store/api/produce/detail/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  /**费用明细 */
  listFeeDetail(id) {
    return this.http.get('store/api/producefee/findbyproduceid/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  /**删除费用明细 */
  removeProducefee(feecollectid) {
    return this.http.get(`store/api/producefee/removeproducefee?feecollectid=${feecollectid}`).toPromise();
  }
  /**添加费用明细 */
  createproducefee(search) {
    return this.http.post('store/api/producefee/createproducefee', search).toPromise();
  }
  removeById(id) {
    return this.http.delete('store/api/produce/' + id).toPromise();
  }
  removetaskById(id) {
    return this.http.delete('store/api/produce/task/' + id).toPromise();
  }

  removeFp(id) {
    return this.http.delete('store/api/produce/removefp/' + id).toPromise();
  }

  removeBm(id) {
    return this.http.delete('store/api/produce/removebm/' + id).toPromise();
  }
  removetaskbm(id) {
    return this.http.delete('store/api/produce/removetaskbm/' + id).toPromise();
  }
  getBmlist(search) {
    return this.http.get('store/api/produce/basematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getHDBmlist(search) {
    return this.http.get('store/api/produce/nmbasematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getOEMBmlist(search) {
    return this.http.get('store/api/oemtask/basematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getWeishiBmlist(search) {
    return this.http.get('store/api/tasklist/basematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  modifydate(search) {
    return this.http.put('store/api/produce/modifydate', search).toPromise();
  }
  modifytask(search) {
    return this.http.put('store/api/produce/modifytask', search).toPromise();
  }
  // 更新
  updatetasklist(id, model): Promise<any> {
    return this.http.put('store/api/tasklist/modifytask/' + id, model).toPromise();
  }
  modifylistyaoqiu(search) {
    return this.http.put('store/api/produce/modifylist', search).toPromise();
  }
  impBm(search) {
    return this.http.post('store/api/produce/impbm', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  gettaskBmlist(search) {
    return this.http.get('store/api/produce/taskbasematerial', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getOEMBmlistInProduce() {
    return this.http.get('store/api/oemtask/listbminproduce').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getWeishiBmlistInProduce() {
    return this.http.get('store/api/tasklist/listbminproduce').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  imptaskBm(search) {
    return this.http.get('store/api/produce/imtaskpbm', { search: search }).toPromise();
  }
  getTask(id): Promise<any> {
    return this.http.get('store/api/produce/tasklist/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submittask(id) {
    return this.http.get('store/api/produce/submittask/' + id).toPromise();
  }
  verifytask(id) {
    return this.http.get('store/api/produce/verifytask/' + id).toPromise();
  }
  // 加工完成  改变状态
  processfinished(id) {
    return this.http.get('store/api/produce/processfinished/' + id).toPromise();
  }
  refusverify(id) {
    return this.http.get('store/api/produce/refusverify/' + id).toPromise();
  }
  qishen(id) {
    return this.http.get('store/api/produce/qishen/' + id).toPromise();
  }
  print(id) {
    return this.http.get('store/api/produce/taskprint/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  reload(id) {
    return this.http.get('store/api/produce/taskreload/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  judgeGcid(search) {
    return this.http.get('store/api/produce/judgegcid', { search: search }).toPromise();
  }

  getFplist(search) {
    return this.http.get('store/api/produce/fproduct', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  impFp(search) {
    return this.http.post('store/api/produce/impfp', search).toPromise();
  }

  addRemain(search) {
    return this.http.post('store/api/produce/addremian', search).toPromise();
  }

  addBian(search) {
    return this.http.post('store/api/produce/addbian', search).toPromise();
  }

  judge(search) {
    return this.http.get('store/api/produce/judge', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  checkFp(search) {
    return this.http.get('store/api/produce/checkfp', { search: search }).toPromise();
  }
  checkOEMFp(search) {
    return this.http.get('store/api/oemtask/checkoemfp', { search: search }).toPromise();
  }

  checkWeishiFp(search) {
    return this.http.get('store/api/produce/weishicheckfp', { search: search }).toPromise();
  }

  cancelCheck(id) {
    return this.http.get('store/api/produce/cancelcheck/' + id).toPromise();
  }

  cancelOEMCheck(id) {
    return this.http.get('store/api/oemtask/canceloemcheck/' + id).toPromise();
  }

  cancelWeishiCheck(id) {
    return this.http.get('store/api/produce/weishicancelcheck/' + id).toPromise();
  }

  showchengben(search) {
    return this.http.get('store/api/produce/showchengben', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  getcangku() {
    return this.http.get('store/api/produce/getcangku').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createtasklist(search) {
    return this.http.post('store/api/produce/tasklist', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  querytasklist(search) {
    return this.http.get('store/api/produce/tasklist', { search: search }).toPromise();
  }
  calcBmchengben() {
    return this.http.get('store/api/produce/bmchengbencalc').toPromise().then(data => {
      return data.json() as any[];
    })
  }
  impExcel(search, produceid) {
    return this.http.put('store/api/produce/impExcel/' + produceid, search).toPromise().then(data => {
      return data;
    });
  }
  impOEMExcel(search, produceid) {
    return this.http.put('store/api/oemtask/impExcel/' + produceid, search).toPromise().then(data => {
      return data;
    });
  }
  impWEISHIExcel(search, produceid) {
    return this.http.put('store/api/produce/impweishiExcel/' + produceid, search).toPromise().then(data => {
      return data;
    });
  }
  //批量删除基料
  deleteDetList(search) {
    return this.http.post('store/api/produce/deletedetlist', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //批量删除成品
  deleteFpDetList(search) {
    return this.http.post('store/api/produce/deletefpdetlist', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  removeDet(search) {
    return this.http.post('store/api/produce/deletedets', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 匹配加工费
   * @param search 
   * @returns 
   */
  pipeiprocessfee(search) {
    return this.http.post('store/api/processfee/pipeiprocessfee', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
