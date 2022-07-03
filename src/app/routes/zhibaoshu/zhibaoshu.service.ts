import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ZhibaoshuService {

  constructor(private http: Http) { }

  getZhiBaoTasks(search: Query): Promise<any> {
    return this.http.get('store/api/zhibaotask/list', { search: search }).toPromise();
  }

  getZhiBaoFormat(): Promise<any> {
    return this.http.get('store/api/zhibaoformat/list').toPromise();
  }

  addZhiBaoTask(search: any): Promise<any> {
    return this.http.post('store/api/zhibaotask', search).toPromise();
  }

  retry(id): Promise<any> {
    return this.http.post(`store/api/zhibaotask/retry/${id}`, null).toPromise();
  }
}

class Query {
  pageNum: number;
  pageSize: number;
  constructor(pageNum, pageSize) {
    this.pageSize = pageSize;
    this.pageNum = pageNum;
  }
}
