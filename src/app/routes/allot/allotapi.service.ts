import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AllotapiService {

  constructor(private http: Http) { }

  // 获取调拨明细表
  list(search): Promise<any> {
    return this.http.get('store/api/allot', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 创建调拨单
  create(search): Promise<any> {
    return this.http.post('store/api/allot/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取
  getAllot(id): Promise<any> {
    return this.http.get('store/api/allot/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取表的详细信息
  listFeeDetail(search): Promise<any> {
    return this.http.get('store/api/allot/listfeedetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 删除某个调拨明细
  delAllotDet(id): Promise<any> {
    return this.http.delete('store/api/allot/allotdet/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
    // 批量删除货物调拨明细 //
    deleteallotdet(search) {
      return this.http.post('store/api/allot/deleteallotdet', search).toPromise().then(data => {
        return data.json() as any[];
      });
    }
 // 批量删除货物调拨明细 //
 deleteallotdetfee(search) {
  return this.http.post('store/api/allot/deleteallotdetfee', search).toPromise().then(data => {
    return data.json() as any[];
  });
}
  // 删除所有调拨明细
  delDet(search): Promise<any> {
    return this.http.post('store/api/allot/deldet',search).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  // 获取单个调拨单明细信息
  getdet(id): Promise<any> {
    return this.http.get('store/api/allot/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  //获取调拨单变更记录
  getlog(id): Promise<any> {
    return this.http.get('store/api/allot/log/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 编辑修改单个调拨单明细表信息
  change(search: object): Promise<any> {
    return this.http.post('store/api/allot/change', search).toPromise();
  }
//删除线上明细
delallot(search): Promise<any> {
  return this.http.post('store/api/allot/delallot/' ,search ).toPromise();
}

  // 删除某组费用明细
  removeAllotfee(search: object) {
    return this.http.get('store/api/allot/removeallotfee', { search: search }).toPromise();
  }
  // 批量删除费用明细
  removeallotfees(search): Promise<any> {
    return this.http.post('store/api/allot/removeallotfees', search ).toPromise();
  }

  // 删除所有费用明细
  delAllotfee(search): Promise<any> {
    return this.http.post('store/api/allot/delAllotfee',search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 确认调出
  confirm(search): Promise<any> {
    return this.http.post(`store/api/allot/confirm`, search).toPromise();
  }

  // 确认调出，提交审核
  modify(search): Promise<any> {
    return this.http.post('store/api/allot/modify', search).toPromise();
  }

  // 机构负责人审核
  auditAllot(id): Promise<any> {
    return this.http.get('store/api/allot/audit/' + id).toPromise();
  }

  // 生成pdf
  reload(id): Promise<any> {
    return this.http.get('store/api/allot/reload/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 打印预览
  print(id): Promise<any> {
    return this.http.get('store/api/allot/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  allotList(search: object): Promise<any> {
    return this.http.get('store/api/allot/allotList', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 删除某个调拨单
  delAllot(id): Promise<any> {
    return this.http.delete('store/api/allot/' + id).toPromise();
  }

  // 引入收藏夹数据
  importFav(search): Promise<any> {
    return this.http.post('store/api/allot/importFav', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //
  createFee(search): Promise<any> {
    return this.http.post('store/api/allot/createfee', search).toPromise();
  }

  verifyUser(search) {
    return this.http.post('store/api/allot/vuser', search).toPromise();
  }
  // 删除调出标识
  delverifyUser(search){
    return this.http.post('store/api/allot/delvuser', search).toPromise();
  }

  createChukuFee(search): Promise<any> {
    return this.http.post('store/api/allot/createchukufee', search).toPromise();
  }
  /**修改提货人信息 */
  modifytihuo(search) {
    return this.http.put('store/api/allot/tihuoren', search).toPromise();
  }
  /**竞价前调拨明细分组 */
  allotdetgroup(search) {
    return this.http.get('store/api/allot/groupbygcid?allotdetids=' + search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**调拨单查询物流竞价明细 */
  findbyallotid(allotid) {
    return this.http.get('store/api/wuliuorder/findbyallotid/' + allotid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查询期货物流竞价数据
  getqihuowuliuorder(allotid) {
    return this.http.get('store/api/wuliuorder/getqihuowuliuorder/' + allotid).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 引入选中的期货物流竞价
  importqihuowuliuorder(search): Promise<any> {
    return this.http.post('store/api/wuliuorder/importqihuowuliuorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  matchingcarnum(model) {
    return this.http.post('store/api/allot/matchingcarnum', model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  updatecarnum(search) {
    return this.http.put('store/api/allot/updatecarnum/', search).toPromise();
  }
}
