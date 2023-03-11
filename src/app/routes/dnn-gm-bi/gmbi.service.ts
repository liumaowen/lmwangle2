import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GmbiService {

  constructor(private http:Http) { }

  // 系统用户概览
  getcountbyday(search):Promise<any>{
    return this.http.get("bi/api/user/countofday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 用户访问量
  getvisittoday(search):Promise<any>{
    return this.http.get("bi/api/user/visitofday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 用户访问设备及地区
  getdisdevofday(search):Promise<any>{
    return this.http.get("bi/api/user/disdevofday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 懒猫月销售订单表
  getOfmonth(search):Promise<any>{
    return this.http.get("bi/saleprog/ofmonth",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 懒猫日销售订单表
  getOfday(search):Promise<any>{
    return this.http.get("bi/saleprog/ofday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 编辑修改数据
  editweichan(search):Promise<any>{
    return this.http.post("bi/saleprog/editweichan",search).toPromise();
  }

  // 懒猫月销售订单表
  getOforgmonth(search):Promise<any>{
    return this.http.get("bi/saleprog/oforgmonth",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 懒猫日销售订单表
  getOforgday(search):Promise<any>{
    return this.http.get("bi/saleprog/oforgday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 业务员月销售订单表
  getOfusermonth(search):Promise<any>{
    return this.http.get("bi/saleprog/ofusermonth",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }

  // 业务员日销售订单表
  getOfuserday(search):Promise<any>{
    return this.http.get("bi/saleprog/ofuserday",{search: search}).toPromise().then(data=>{
      return data.json() as any[];
    });
  }
  /**获取运营通用人员 */
  getroleusers(): Promise<any> {
    return this.http.get('store/api/role/listUserByRoleid?roleid=52').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**获取运营支持中心人员操作日志 */
  getuserlogdet(search): Promise<any> {
    return this.http.get('store/api/userlog', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
