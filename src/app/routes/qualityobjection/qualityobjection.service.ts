import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class QualityobjectionService {

  constructor(private http: Http) { }
  query(search): Promise<any> {
    return this.http.get('store/api/caigou', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  create(quality): Promise<any> {
    return this.http.post('store/api/quality/create', quality).toPromise().then(data => {
      return data.json();
    });
  }
  getdetail(id): Promise<any> {
    return this.http.get('store/api/quality/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  getqualitydet(search): Promise<any> {
    return this.http.get('store/api/quality/qualitydet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  gettihuodet(search): Promise<any> {
    return this.http.get('store/api/quality/gettihuodet', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  importtihuodet(search): Promise<any> {
    return this.http.post('store/api/quality/importtihuodet', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  deletequalitydet(id): Promise<any> {
    return this.http.delete('store/api/quality/deletequalitydet/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modify(search): Promise<any> {
    return this.http.put('store/api/quality/modify', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  deletequality(id): Promise<any> {
    return this.http.delete('store/api/quality/deletequality/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submitverify(search): Promise<any> {
    return this.http.put('store/api/quality/submitverify', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  reportgc(search): Promise<any> {
    return this.http.put('store/api/quality/reportgc', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  centerchuli(search): Promise<any> {
    return this.http.put('store/api/quality/centerchuli', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  gcchuli(search): Promise<any> {
    return this.http.put('store/api/quality/gcchuli', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  salechuli(search): Promise<any> {
    return this.http.put('store/api/quality/salechuli', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifydet(search): Promise<any> {
    return this.http.put('store/api/quality/modifydet', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  makepdf(id): Promise<any> {
    return this.http.get('store/api/quality/makepdf/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  print(id): Promise<any> {
    return this.http.get('store/api/quality/print/' + id).toPromise().then(data => {
      return data.json() as any;
    });
  }
  uploadfujian(search): Promise<any> {
    return this.http.put('store/api/quality/uploadfujian', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  delfujian(search): Promise<any> {
    return this.http.put('store/api/quality/delfujian', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  modifbillno(search): Promise<any> {
    return this.http.put('store/api/quality/modifbillno', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  /**销售业务反馈 */
  salefeedback(search): Promise<any> {
    return this.http.put('store/api/quality/salefeedback', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submitwuliu(search): Promise<any> {
    return this.http.put('store/api/quality/wuliuchuli', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  submitcangku(search): Promise<any> {
    return this.http.put('store/api/quality/cangkuchuli', search).toPromise().then(data => {
      return data.json() as any;
    });
  }
  cancel(search): Promise<any> {
    return this.http.put('store/api/quality/cancel', search).toPromise().then(data => {
      return data.json() as any;
    });
  }

}
