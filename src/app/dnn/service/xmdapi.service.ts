import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';


@Injectable()
export class XmdapiService {

  constructor(private http: Http, private storage: StorageService) { }
  // 查询所有公司
  searchCompany(search, deptid?): Promise<any> {
    return this.http.get('store/api/xmd/customer/findbyname', { search: 'search=' + search }).toPromise();
  }
  // 查询所有公司改造版本
  findcustomer(search, deptid?): Promise<any> {
    return this.http.get('store/api/xmd/customer/findbyname', { search: search }).toPromise();
  }
}
