import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class OrgApiService {

    constructor(private http: Http) { }

    // 机构概览
    listAll(pid): Promise<any> {
        return this.http.get('store/api/org/list/' + pid).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    getChildrenTree(search) {
        return this.http.get('store/api/org/getChildrenTree', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    addNode(search) {
        return this.http.post('store/api/org', search).toPromise();
    }

    get(id) {
        return this.http.get(`store/api/org/${id}`).toPromise();
    }

    modifyOrg(id, search) {
        return this.http.put(`store/api/org/${id}`, search).toPromise();
    }


}
