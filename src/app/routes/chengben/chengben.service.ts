import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ChengbenService {

    constructor(private http: Http) { }

    //查询毛利
    listchengben(): Promise<any> {
        return this.http.get('store/api/chengbenhesuan/listall').toPromise().then(data => {
            return data.json() as any[];
        })
    }
    modifyLastkucun(id, model) {
        return this.http.put('store/api/chengbenhesuan/modifykucunweight/' + id, model).toPromise().then(data => {
            return data.json() as any[];
        })
    }
    listwmchengben(): Promise<any> {
        return this.http.get('store/api/wmchengbenhesuan/listall').toPromise().then(data => {
            return data.json() as any[];
        })
    }
    listonechengben(param) {
        return this.http.get('store/pub/onechengben/listall', { search: param }).toPromise().then(data => {
            return data.json() as any[];
        })
    }
    listwsonechengben() {
        return this.http.get('store/pub/wsonechengben/listall').toPromise().then(data => {
            return data.json() as any[];
        })
    }
    getcheckdata() {
        return this.http.get('store/pub/onechengben/checkchengbendata').toPromise().then(data => {
            return data.json() as any[];
        })
    }
    getcheckdatasheshui(param) {
        return this.http.get('store/pub/onechengben/getcheckdatasheshui', { search: param }).toPromise().then(data => {
            return data.json() as any[];
        })
    }
    listsheshuichengben(param) {
        return this.http.get('store/pub/onechengben/listsheshuichengben', { search: param }).toPromise().then(data => {
            return data.json() as any[];
        })
    }
}
