import { UserapiService } from './userapi.service';
import { ToasterService, Toast } from 'angular2-toaster/angular2-toaster';
import { Injectable, Inject } from '@angular/core';
import { Http, Request, RequestOptionsArgs, Response, RequestOptions, ConnectionBackend, Headers, ResponseOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { enableProdMode } from '@angular/core';
import { environment } from '../../../environments/environment';

import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

declare var dd: any;

const httpLoading = new Subject<boolean>();
const isExam = new Subject<boolean>();

const Error401 = new Subject<boolean>();
@Injectable()
export class HttpInterceptorService extends Http {
  count = 0;
  status = {
    'status.400': '错误的请求。由于语法错误，该请求无法完成。',
    'status.401': '未经授权。服务器拒绝响应。',
    'status.403': '已禁止。服务器拒绝响应。',
    'status.404': '未找到。无法找到请求的位置。',
    'status.405': '方法不被允许。使用该位置不支持的请求方法进行了请求。',
    'status.406': '不可接受。服务器只生成客户端不接受的响应。',
    'status.407': '需要代理身份验证。客户端必须先使用代理对自身进行身份验证。',
    'status.408': '请求超时。等待请求的服务器超时。',
    'status.409': '冲突。由于请求中的冲突，无法完成该请求。',
    'status.410': '过期。请求页不再可用。',
    'status.411': '长度必需。未定义“内容长度”。',
    'status.412': '前提条件不满足。请求中给定的前提条件由服务器评估为 false。',
    'status.413': '请求实体太大。服务器不会接受请求，因为请求实体太大。',
    'status.414': '请求 URI 太长。服务器不会接受该请求，因为 URL 太长。',
    'status.415': '不支持的媒体类型。服务器不会接受该请求，因为媒体类型不受支持。',
    'status.416': 'HTTP 状态代码 {0}',
    'status.500': '内部服务器错误。',
    'status.501': '未实现。服务器不识别该请求方法，或者服务器没有能力完成请求。',
    'status.503': '服务不可用。服务器当前不可用(过载或故障)。'
  };

  static getHttpLoading(): Observable<boolean> {
    return httpLoading;
  }
  /**是否需要答题 */
  static getIsExam(): Observable<boolean> {
    return isExam;
  }

  static getError401(): Observable<boolean> {
    return Error401;
  }

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private router: Router, private storage: StorageService, private toasterService: ToasterService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    // if(url == 'string'){
    //     return Observable.throw({"error": ""});
    // }

    // typeof url == 'string' ? (url = environment.api + url) : (url.url = environment.api + url.url);

    if (typeof url === 'string') {
      url = (url.indexOf('assets/') != -1 ? environment.self : environment.api) + url;
    } else {
      url.url = (url.url.indexOf('assets/') != -1 ? environment.self : environment.api) + url.url;
    }
    console.log('显示加载中。。。');
    httpLoading.next(true);
    if (this.isRepeatSubmit(url)) {
      let resp = new Response(new ResponseOptions({ body: '{"msg":"重复的提交！"}', status: 500 }))

      return this.intercept(Observable.throw(resp));
    }


    return this.intercept(super.request(url, this.getRequestOptionArgs(options)));
  }
  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.get(url, this.getRequestOptionArgs(options));
  }
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.post(url, body, this.getRequestOptionArgs(options));
  }
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return super.put(url, body, this.getRequestOptionArgs(options));
  }
  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return super.delete(url, this.getRequestOptionArgs(options));
  }

  // 修改headers参数信息

  getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers.set('Content-Type', 'application/json');
    options.headers.set('version', environment.version);
    if (this.storage.get('token')) {
      options.headers.set('token', this.storage.get('token'));
    }
    return options;
  }
  // 请求发生错误是提示信息
  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      httpLoading.next(false);
      console.log('关闭加载中。。。');
      if (err.status < 200 || err.status >= 400) {
        // console.error(err.json());
        if (err.status === 401) {
          Error401.next(true);

        } else if (err.status === 800) {
          this.toasterService.pop('error', '系统已升级，请刷新页面');
        } else {
          try {
            this.toasterService.pop('error', '网络错误：' + err.status + ' - ' + err.json().msg || err.json());
          } catch (e) {
            this.toasterService.pop('error', '网络错误：' + err.status + ' - ' + err._body || '请联系管理员！');
          }
        }

        return Observable.throw(err);
      } else {
        return Observable.throw(err);
      }
    }).map((value: Response) => {
      const url = value.url;
      if (url.indexOf('assets/') === -1) {
        if (this.storage.examcount === 0) {
          const valueexam = value.headers.get('isexam');
          if (valueexam === 'false') {
            this.storage.examcount++;
          }
          isExam.next(valueexam === 'false');
        }
      }
      httpLoading.next(false);
      if (url.indexOf('api/question/getquestion') !== -1 || url.indexOf('api/question/starttest') !== -1) {
        setTimeout(() => {
          this.storage.examcount = 0;
        }, 100);
      }
      console.log('关闭加载中。。。');
      return value;
    });
  }

  // -----------检测重复提交-----------
  // 近期提交记录
  recentSubmits = [];
  // 是否是重复提交，参数是请求配置对象
  isRepeatSubmit(config) {
    // 忽略GET请求
    if (config.method == 0) {
      return false;
    }
    // 请求对象
    let submit = {
      // 唯一标识
      uuid: config.method + config.url,
      // 时间戳
      time: new Date().getTime()
    };
    // 请求参数，POST、PUT用.data，DELETE用.params
    let params = config.getBody();
    // 将请求参数JSON附加到请求对象唯一标识
    if (params instanceof Object) {
      submit.uuid += params.json();
    } else {
      submit.uuid += params;
    }
    // 检测结果变量
    let result = false;
    // 遍历近期提交记录
    for (let i = 0; i < this.recentSubmits.length; i++) {
      const lastSubmit = this.recentSubmits[i];
      // 请求对象如果近期发生过那么更新检测结果
      if (submit.uuid === lastSubmit.uuid
        && submit.time - lastSubmit.time < 1000) {
        result = true;
        break;
      }
    }
    // 更新近期提交记录，最多保留5条
    this.recentSubmits.push(submit);
    if (this.recentSubmits.length > 5) {
      // 移除第一条记录
      this.recentSubmits.shift();
    }
    // 返回结果
    return result;
  }
}
