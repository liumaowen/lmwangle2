import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EchartsService {

    constructor(private http: Http) { }
    /**各机构采购量 */
    getPie(search) {
        return this.http.get('store/api/caigou/councgweight', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**各产地采购量 */
    getPieChandi(search) {
        return this.http.get('store/api/caigou/countcgweight2', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**涂镀公司采购量 */
    getPieTudu(search) {
        return this.http.get('store/api/caigou/countcustcgweight', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**各机构出货量 */
    getBarOrg(search) {
        return this.http.get('store/api/tihuo/countthweight', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**各品名出货量 */
    getBarGn(search) {
        return this.http.get('store/api/tihuo/countthgnweight', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }
    /**各区域出货量 */
    getMapArea(search) {
        return this.http.get('store/api/tihuo/countthareaweight', { search: search }).toPromise().then(data => {
            return data.json() as any[];
        });
    }

}
