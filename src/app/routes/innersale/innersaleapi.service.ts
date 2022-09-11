import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class InnersaleapiService {

  constructor(private http: Http) { }

  query(search): Promise<any> {
    return this.http.get('store/api/innersale', { search: search }).toPromise();
  }

  importFav(id, search): Promise<any> {
    return this.http.get('store/api/innersale/impfav/' + id, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  listInnersale(id): Promise<any> {
    return this.http.get('store/api/innersale/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  listInnersaleDet(id): Promise<any> {
    return this.http.get('store/api/innersale/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  createInnersale(search): Promise<any> {
    return this.http.post('store/api/innersale', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  updateInnersale(search): Promise<any> {
    return this.http.put('store/api/innersale', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  // verifyInnersale(search): Promise<any> {
  //   return this.http.get('store/api/innersale/verify', { search: search }).toPromise();
  // }
  // sverifyInnersale(search): Promise<any> {
  //   return this.http.get('store/api/innersale/sverify', { search: search }).toPromise();
  // }

  removeOneDet(id): Promise<any> {
    return this.http.get('store/api/innersale/remove/' + id).toPromise();
  }
  
 
    /**批量删除明细 */
    removeDet(search) {
      return this.http.post('store/api/innersale/removelist', search).toPromise().then(data => {
      return data.json() as any[];
      });
    }

  zhidingVuser(id): Promise<any> {
    return this.http.get('store/api/innersale/vuser/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  removeInnersale(id): Promise<any> {
    return this.http.delete('store/api/innersale/' + id).toPromise();
  }

  refreshprice(id): Promise<any> {
    return this.http.get('store/api/innersale/refresh/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  changeFeeprice(search): Promise<any> {
    return this.http.put('store/api/innersale/changefeeprice', search).toPromise();
  }
  // back(id): Promise<any> {
  //   return this.http.get('store/api/innersale/back/' + id).toPromise().then();
  // }
  updatezhiliangyiyi(search){
    return this.http.put('store/api/innersale/modifyzhiliangyiyi', search).toPromise();
  }
}
