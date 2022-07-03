import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RoleapiService {

  constructor(private http: Http) { }

  listByUserid(id) {
    return this.http.get(`store/api/role/listByUserid/${id}`).toPromise();
  }

  getroleusers(): Promise<any> {
    return this.http.get('store/api/role/listUserByRoleid?roleid=9').toPromise().then(data => {
      return data.json() as any[];
    });
  }

}
