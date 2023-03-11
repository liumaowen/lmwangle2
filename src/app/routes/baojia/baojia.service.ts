import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class BaojiaService {

  constructor(private http: Http) { }

  queryBaojia(search): Promise<any> {
    return this.http.get('store/api/baojia',{search:search}).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getBaojia(id): Promise<any> {
    return this.http.get('store/api/baojia/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  deletBaojia(id): Promise<any> {
    return this.http.delete('store/api/baojia/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  vorunvBaojia(id): Promise<any> {
    return this.http.get('store/api/baojia/vorunv/' + id).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  create(search): Promise<any> {
    return this.http.post('store/api/baojia', search).toPromise();
  }

}
