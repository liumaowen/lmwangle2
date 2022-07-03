import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ExamapiService {

  constructor(private http: Http) { }

  getquestion(): Promise<any> {
    return this.http.get('store/api/question/getquestion').toPromise().then(data => {
      return data.json() as any[];
    });
  }
  save(search) {
    return this.http.post('store/api/question/starttest', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  saveprice(search) {
    return this.http.post('store/api/pricechart', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
