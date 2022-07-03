import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ErpkaoheService {

    constructor(private http: Http) { }
    dingjinfanxi(search) {
        return this.http.get('store/api/report/dingjinfanxi', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    dingjinshouxi(search) {
        return this.http.get('store/api/dingjinshouxi/findall', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    calcdingjinshouxi(search) {
        return this.http.get('store/api/dingjinshouxi/calc').toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // yanqitihuo(search) {
    //     return this.http.get('store/api/yanqitihuo/getall', { search: search }).toPromise().then(data => {
    //         return data.json() as any[];
    //     });
    // }

    yanqitihuo(search) {
        return this.http.get('store/api/report/yanqitihuo', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    find(search) {
        return this.http.get('store/api/yanqitihuo/find', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    fundinterestsumdet(search) {
        return this.http.get('store/api/fundinterestsum/det', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    fundinterestsumdetail(id) {
        return this.http.get('store/api/fundinterestsum/' + id).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    htexecute(search) {
        return this.http.get('store/api/report/htexecute', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    jixiaofee(search) {
        return this.http.get('store/api/feejixiao/listfeejixiao', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }

    updatefeejixiao(params) {
        return this.http.put('store/api/feejixiao/updatefeejixiao', params).toPromise();
    }

    lirunjixiao(search) {
        return this.http.get('store/api/report/lirunkaohe', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
        // return this.http.get('store/api/assessment/findbymonth', { search: search }).toPromise().then(data => {
        //     return data.json() as any[];
        // });
    }
    /**上传数量绩效 */
    upload(month, search) {
        return this.http.put(`store/api/assessment/impExcel?month=${month}`, search).toPromise();
    }
    /**上传数量绩效 */
    uploadjixiaotemplate(month, search) {
        return this.http.put(`store/api/jixiaotemplate/handlerdata?month=${month}`, search).toPromise();
    }
    /**查询数量绩效 */
    listjixiaotemplate(search) {
        return this.http.get('store/api/jixiaotemplate/listdata', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    lirunkaohe(search) {
        return this.http.get('store/api/report/lirunkaohe2', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    // feehuizong(search) {
    //     return this.http.get('store/api/fee/feehuizong', { search: search }).toPromise().then(data => {
    //         return data.json() as any[];
    //     });
    // }

    cancelFundInterest(params) {
        return this.http.post('store/api/yanqitihuo/cancelfundinterest', params).toPromise().then(data => {
            return data.json() as any[];
        });
    }
}