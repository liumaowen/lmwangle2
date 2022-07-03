import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class QuestionapiService {

  constructor(private http: Http) { }

  query(search) {
    return this.http.get('store/api/question/find', { search: search }).toPromise();
  }

  get(id) {
    return this.http.get('store/api/question/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  delete(id) {
    return this.http.delete('store/api/question/delete/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  create(search) {
    return this.http.post('store/api/question/create', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  update(search) {
    return this.http.put('store/api/question/update', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**试题模板下载 */
  downloadexcel() {
    return this.http.get('store/api/question/downloadexcel').toPromise().then(data => {
      return data;
    });
  }
  /**上传试题 */
  batchupload(search) {
    return this.http.post('store/api/question/batchupload', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getTitletypes() {
    return this.http.get('store/api/question/gettitletypes').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getOrgtypes() {
    return this.http.get('store/api/question/getorgtypes').toPromise().then(data => {
      return data.json() as any[];
    });
  }

  hideQuestions(params){
    return this.http.put('store/api/question/hidequestions', params).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getpermission(search) {
    return this.http.get('store/api/question/permission', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createpermission(search) {
    return this.http.post('store/api/question/addpermission', search).toPromise().then(data => {
      // return data.json() as any[];
    });
  }

  updatepermission(search) {
    return this.http.put('store/api/question/updatepermission', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  gettitletypes(search) {
    return this.http.get('store/api/question/updatepermission', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  examdetgroupbyorg(search) {
    return this.http.get('store/api/question/examdetgroupbyorg', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  examdetgroupbyuser(search) {
    return this.http.get('store/api/question/examdetgroupbyuser', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }


}
