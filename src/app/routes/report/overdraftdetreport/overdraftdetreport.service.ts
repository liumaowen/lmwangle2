import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class OverdraftdetreportService {

  constructor(private http: Http) { }
   // 获得欠款明细数据
   det(search) {
    return this.http.get('store/api/overdraft/details', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
