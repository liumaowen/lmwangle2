import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

@Injectable()
export class XmdGoodscodeService {

  constructor(private http: Http) {
  }

  query(search) {
    return this.http.get('store/abc/xmd/mdm/queryGc', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  getchandigongcha(search): Promise<any> {
    return this.http.get('store/abc/xmd/mdm/getchandigongcha', {search: search}).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  goodscodefindone(id): Promise<any> {
    return this.http.get('store/abc/xmd/mdm/goodscode/findone/'+id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
