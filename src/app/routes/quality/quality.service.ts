import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QualityService {

  constructor(private http: Http) { }
  /*发表意见*/
  publish(log): Promise<any> {
    return this.http.post('store/api/quality/createlog', log).toPromise();
  }
  /**获取列表 */
  query(search): Promise<any> {
    console.log(search);
    return this.http.get('store/api/quality/getlist', {search: search}).toPromise();
  }
  getdetail(id): Promise<any> {
    return this.http.get('store/api/quality/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /*填写质量意见*/
  modifydeal(quality): Promise<any> {
    return this.http.put('store/api/quality/modifydeal', quality).toPromise();
  }
   // 生成pdf
   makepdf(id): Promise<any> {
    return this.http.get('store/api/quality/makepdf/' + id).toPromise().then(data => {
      return data.json();
    });
  }
  // 打印预览
  print(id) {
    return this.http.get('store/api/quality/print/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
