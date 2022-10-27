import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'environments/environment';


@Injectable()
export class UserapiService {

  constructor(private http: Http, private storage: StorageService) { }

  /**
   *
   *钉钉快捷登陆接口
   * @param {*} code 钉钉code码
   * @returns {Promise<any>}
   * @memberof UserapiService
   */
  ddLogin(code: any): Promise<any> {
    return this.http.post('wisdom/oauth/dinglogin', { code: code }).toPromise().then((data: any) => {
      return data.json() as any;
    });
  }


  /**
   * 登录
   * @param user 用户对象 用户名，密码
   */
  apilogin(user: object): Promise<any> {
    return this.http.post('store/pub/wsdlogin', user).toPromise().then(response => {
      return response.json() as any[];
    });
  }

  /**
   * 获取验证码
   * @param username 用户名
   */
  getCode(username: string): Promise<any> {
    return this.http.post('store/pub/getCode', { 'username': username }).toPromise().then(response => {
      return response.json() as any[];
    });
  }

  /**
   * 变更内部用户登录
   * @param user 用户对象 用户名，密码
   */
  oauthApilogin(user: object): Promise<any> {
    return this.http.post('wisdom/oauth/login', user).toPromise().then(response => {
      return response.json() as any[];
    });
  }

  /**
   * 变更内部用户获取验证码
   * @param username 用户名
   */
  oauthGetCode(username: string): Promise<any> {
    return this.http.post('wisdom/oauth/getCode', { 'username': username }).toPromise().then(response => {
      return response.json() as any[];
    });
  }

  /**
   * 获取用户信息
   */
  userInfo2(): Promise<any> {
    return this.http.get('store/api/user/myinfo').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getAttrsByParentid(id): Promise<any> {
    return this.http.get('store/api/classify/listBypidall', { search: { pid: id } }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  userInfo(): Promise<any> {
    const deferred = new Promise((resolve, reject) => {
      if (!this.storage.get('token')) {
        this.storage.remove('cuser');
        reject('Get UserInfo but No Token');   // 声明执行失败，即服务器返回错误
      } else {
        if (this.storage.getObject('cuser')) {
          resolve(this.storage.getObject('cuser'));	// 声明执行成功，可以返回数据了
        } else {
          this.userInfo2().then((response) => {
            this.storage.setObject('cuser', response);
            resolve(response);	// 声明执行成功，可以返回数据了
          }, (error) => {
            reject('net::ERR_CONNECTION_REFUSED');   // 声明执行失败，即服务器返回错误
          });
        }
      }
    });
    return deferred;
  }

  /**
   * 修改密码
   * @param user 用户对象
   */
  modipwd(user: object): Promise<any> {
    return this.http.post('store/api/user/modipwd', user).toPromise();
  }

  /**
   * 用户查询待写
   * @param search
   * @param deptid
   */
  usersearch2(search: string, deptid?: string): Promise<any> {
    return this.http.get('store/api/user/userlist', { search: 'search=' + search }).toPromise();
  }

  /**
   * 用户查询待写
   * @param search
   * @param deptid
   */
   usersearch3(search: string, deptid?: string): Promise<any> {
    return this.http.get('store/api/user/usernamelist', { search: 'search=' + search }).toPromise();
  }

  /**
   * 查询代理人
   * @param search 查询条件
   */
  findAgent(search: any): Promise<any> {
    return this.http.get('store/api/user/findagent', { search: search }).toPromise();
  }

  /**
   * 代理用户
   * @param search 代理用户
   */
  agentUser(search: any): Promise<any> {
    return this.http.get('store/api/user/agent', { search: search }).toPromise();
  }

  // 注销登录方法
  delTokenInRedis(): Promise<any> {
    return this.http.get('store/api/user/deltokeninredis').toPromise();
  }

  // 退出接口迁移到wisdom服务上
  wisdomdelToken(): Promise<any> {
    if (environment.ismenhu) {
      return this.http.get('smgcoresvc/oauth/logout').toPromise();
    } else {
      return this.http.get('wisdom/oauth/logout').toPromise();
    }
  }

  // 库存明细表查询接口

  listDetail(search: any): Promise<any> {
    return this.http.get('store/api/kucun/detail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 查询所有公司
  searchCompany(search, deptid?): Promise<any> {
    return this.http.get('store/api/customer/findbyname', { search: 'search=' + search }).toPromise();
  }
  // 查询所有公司改造版本
  findcustomer(search, deptid?): Promise<any> {
    return this.http.get('store/api/customer/findbyname', { search: search }).toPromise();
  }

  // 查询机构
  searchjigou(search): Promise<any> {
    return this.http.get('store/api/org/list/' + search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取当前用户所有角色
  myrole2() {
    return this.http.get('store/api/user/myrole').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取当前用户的所有角色
  myrole() {
    const deferred = new Promise((resolve, reject) => {
      if (!this.storage.get('token')) {
        this.storage.remove('myrole');
        reject('Get myrole but No Token');
      } else {
        if (this.storage.getObject('myrole')) {
          resolve(this.storage.getObject('myrole'));	// 声明执行成功，可以返回数据了
        } else {
          this.myrole2().then(data => {
            this.storage.setObject('myrole', data);
            resolve(data);
          }, err => {
            reject('net::ERR_CONNECTION_REFUSED');
          });
        }
      }
    });	// 声明延后执行，表示要去监控后面的执行

    return deferred;
  }

  // 获取此操作的授权账号:客户端ui层权限判断用
  accounts2(search) {
    return this.http.get('store/api/permision/accounts/' + search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取操作权限
  accounts(operateid) {
    const deferred = new Promise((resolve, reject) => {
      if (!this.storage.get('token')) {
        this.storage.remove('accounts');
        reject('Get accounts but No Token');   // 声明执行失败，即服务器返回错误
      } else {

        if (!this.storage.getObject('accounts')) {
          this.storage.setObject('accounts', {});
        }
        const accounts = this.storage.getObject('accounts');

        if (accounts[operateid]) {
          resolve(accounts[operateid]);	// 声明执行成功，可以返回数据了
        } else {

          this.accounts2(operateid).then((response) => {
            accounts[operateid] = response;
            this.storage.setObject('accounts', accounts); // {41:[],526:[],}
            resolve(response);	// 声明执行成功，可以返回数据了
          }, (error) => {
            reject('net::ERR_CONNECTION_REFUSED');   // 声明执行失败，即服务器返回错误
          });

        }
      }
    });

    return deferred;
  }

  // 分类获取品名
  getarea(): Promise<any> {
    return this.http.get('assets/server/dnn/area.json').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // 获取仓库
  cangkulist(): Promise<any> {
    return this.http.get('store/api/classify/cangkulist').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取有库存的仓库
  cangkulist2(): Promise<any> {
    return this.http.get('store/api/classify/cangkulist2').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 获取万事达内部公司
  findwiskind(): Promise<any> {
    return this.http.get('store/api/customer/findwiskind').toPromise().then((data) => {
      return data.json() as any[];
    });
  }
  // 获取选中客户的送货地址
  findAddr(customerid): Promise<any> {
    return this.http.get('store/api/addr/listbycustomerid/' + customerid).toPromise().then((data) => {
      return data.json() as any[];
    });
  }

  get(id) {
    return this.http.get('store/api/user/' + id).toPromise().then((data) => {
      return data.json() as any[];
    });
  }

  query(search) {
    return this.http.get('store/api/user', { search: search }).toPromise();
  }

  create(search) {
    return this.http.post('store/api/user', search).toPromise();
  }

  register(search) {
    return this.http.post('store/api/user/register', search).toPromise();
  }

  update(id, search) {
    return this.http.put(`store/api/user/${id}`, search).toPromise();
  }
  enableUser(userid, search) {
    return this.http.put(`store/api/user/enableuser/${userid}`, search).toPromise();
  }
  disableUser(userid, search) {
    return this.http.put(`store/api/user/disableuser/${userid}`, search).toPromise();
  }
  modifypas(id, search) {
    return this.http.put(`store/api/user/${id}/password`, search).toPromise();
  }

  listProjectByUserid(id) {
    return this.http.get(`store/api/project/listProjectByUserid/${id}`).toPromise();
  }

  createProject(search) {
    return this.http.post('store/api/project/create', search).toPromise();
  }

  delProject(id) {
    return this.http.delete(`store/api/project/${id}`).toPromise();
  }

  listByAccountid(id) {
    return this.http.get(`store/api/user/listByAccountid/${id}`).toPromise();
  }
  /**
   * 获取二维码
   */
  getqrcode() {
    return this.http.get('wisdom/oauth/getQRCode').toPromise().then(data => {
      return data.json();
    });
  }
  checkqrcode(guid) {
    return this.http.post('wisdom/oauth/checkQRCode', guid).toPromise().then(data => {
      return data.json();
    });
  }
  // 关联业务员操作
  queryUsersaleman(userid) {
    return this.http.get('store/api/user/usersaleman/list/' + userid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createUsersaleman(model) {
    return this.http.post('store/api/user/usersaleman', model).toPromise();
  }
  delUsersaleman(id) {
    return this.http.delete(`store/api/user/usersaleman/` + id).toPromise();
  }
  // 关联签收人操作
  queryUserreceipt(userid) {
    return this.http.get('store/api/user/userreceipt/list/' + userid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createUserreceipt(model) {
    return this.http.post('store/api/user/userreceipt', model).toPromise();
  }
  delUserreceipt(id) {
    return this.http.delete(`store/api/user/userreceipt/` + id).toPromise();
  }
  /**修改签收人状态 */
  editsave(model) {
    return this.http.put(`store/api/user/userreceipt/editsave`, model).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
