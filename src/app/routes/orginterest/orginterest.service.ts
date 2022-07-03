import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrginterestService {

  constructor(private http: Http) { }

  // 资金占用利息查询
  getAllTable(search): Promise<any> {
    return this.http.get('store/api/orginterest/getalltable', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
}
