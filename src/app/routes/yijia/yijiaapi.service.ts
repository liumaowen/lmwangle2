import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class YijiaapiService {

  constructor(private http: Http) { }


  getList(search) {
    return this.http.get('store/api/customerlevel/getAllLevel',{ search: search } ).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search): Promise<any> {
    return this.http.post('store/api/customerlevel/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  postInfo(): Promise<any>{
    return this.http.get('store/api/customerlevel/postInfo').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**创建议价申请表 */
  createbargain(search): Promise<any> {
    return this.http.post('store/api/bargain/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**议价申请表列表 */
  bargainlist(search): Promise<any> {
    return this.http.get('store/api/bargain/find', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**议价申请表提交 */
  tijiao(search): Promise<any> {
    return this.http.get('store/api/bargain/submitvuser/' + search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**议价申请表作废 */
  zuofei(search): Promise<any> {
    return this.http.put('store/api/bargain/cancel', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  deleteOne(search){
    return this.http.post('store/api/customerlevel/deleteone', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }


}
