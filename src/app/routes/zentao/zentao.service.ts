import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ZentaoService {

  constructor(private http: Http) { }
  query(search): Promise<any> {
    return this.http.get('store/api/zentao', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
