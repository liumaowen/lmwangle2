import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MdmService {

  constructor(private http: Http) { }
  mdmcategoryquery(search): Promise<any> {
    return this.http.get('store/api/mdmattr/mdmcategory', { search: search }).toPromise();
  }
  mdmattrquery(search): Promise<any> {
    return this.http.get('store/api/mdmattr', { search: search }).toPromise();
  }
  gnquery(search): Promise<any> {
    return this.http.get('store/api/mdmattr/gn', { search: search }).toPromise();
  }
  gnMdmgn(search): Promise<any> {
    return this.http.get('store/api/mdm/getMdmgn', { search: search }).toPromise();
  }
  getMdmAttributeDic(search): Promise<any> {
    return this.http.get('store/api/mdm/getMdmAttributeDic', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  createMaterial(search): Promise<any> {
    return this.http.post('store/api/mdm/createMaterial', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getchandigongcha(search): Promise<any> {
    return this.http.get('store/api/mdm/getchandigongcha', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  editattr(search): Promise<any> {
    return this.http.put('store/api/mdmattr/editattr', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getChildrenTree(pid): Promise<any> {
    return this.http.get('store/api/mdm/mdmclassify/getChildrenTree', { search: pid }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  get(id) {
    return this.http.get('store/api/mdm/mdmclassify/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  addNode(search) {
    return this.http.post('store/api/mdm/mdmclassify', search).toPromise();
  }
  getmdmclassifychild(id): Promise<any> {
    return this.http.get(`store/api/mdm/mdmclassify/getchild/${id}`).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
