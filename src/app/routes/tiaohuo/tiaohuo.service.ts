import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TiaohuoService {

 constructor(private http: Http) { }

query(search): Promise<any> {
    return this.http.get('store/api/tiaohuo', { search: search }).toPromise();
  }
add(model): Promise<any> {
  return this.http.post('store/api/tiaohuo', model).toPromise().then(data => {
     return data.json() as any[];
   });
}
//调货定金返息
dingjinfanxi(search) {
    return this.http.get('store/api/tiaohuo/dingjinfanxi', { search: search }).toPromise().then(data => {
        return data.json() as any[];
    });
}
//调货定金收息
dingjinshouxi(search) {
    return this.http.get('store/api/tiaohuo/findall', { search: search }).toPromise().then(data => {
        return data.json() as any[];
    });
}
calcdingjinshouxi(search) {
    return this.http.get('store/api/dingjinshouxi/calc').toPromise().then(data => {
        return data.json() as any[];
    });
}
// 根据qihuodetid删除一个qihuodet的明细
delQihuo(qihuoid): Promise<any> {
  return this.http.delete('store/api/qihuo/' + qihuoid).toPromise();
}
  
}
