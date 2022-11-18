import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class SellproService {

  constructor(private http: Http) { }
  sellprolist(search): Promise<any> {
    return this.http.get('store/api/crm/project/listinerp', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  projectlist(search): Promise<any> {
    return this.http.get('store/api/crm/project/findByCdate', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getdetail(id): Promise<any> {
    return this.http.get('store/api/sellpro/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  getprojectsummary(search): Promise<any> {
    return this.http.get('store/api/crm/project/getprojectsummary', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
/**
   * 获取机构区域列表
   */
  listarea(kid: string): Promise<any> {
    return this.http.get(`store/api/classify/list/${kid}`).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 涂镀日报明细表
   */
  daylogfinddet(search): Promise<any> {
    return this.http.get(`store/api/daylog/finddet`,  { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 涂镀日报明细表手动同步日报数据
   */
  autodaylog(search): Promise<any> {
    return this.http.get(`store/api/daylog/autodaylog`,  { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 涂镀日报明细表手动同步休假数据
   */
   autoxiujia(search): Promise<any> {
    return this.http.get(`store/api/daylog/autoxiujia`,  { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
 /**
  * 涂镀所有状态日报明细表
  */
  daylogfindall(search): Promise<any> {
    return this.http.get(`store/api/daylog/findallstatus`,  { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 手动修改提交状态
   */
  updateTijiaostatus(search): Promise<any> {
    return this.http.put(`store/api/daylog/updatetijiaostatus`,  search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 手动更新日报审批状态和审批结果
   */
   updatedaylog(search): Promise<any> {
     return this.http.put(`store/api/daylog/updatedaylog`,  search).toPromise().then(data => {
       return data.json() as any[];
     });
   }
  /**
   * 涂镀日报差异汇总表
   */
   getdifflist(search): Promise<any> {
    return this.http.get(`store/api/daylog/getdifflist`,  { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**
   * 手动添加涂镀日报
   */
   manualadd(search): Promise<any> {
    return this.http.post(`store/api/daylog/manualadd`,  search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
 /**
  * 批量转交项目
  */
  batchforwardBPM(search): Promise<any> {
    return this.http.put(`store/api/crm/project/batchforwardBPM`,  search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
 /**
  * 批量终止项目
  */
  batchoverBPM(search): Promise<any> {
    return this.http.put(`store/api/crm/project/batchoverBPM`,  search).toPromise().then(data => {
        return data.json() as any[];
    });
  }
}
