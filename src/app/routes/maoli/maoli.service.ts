import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MaoliService {

  constructor(private http: Http) { }

  //查询毛利
  querymaoli(search): Promise<any> {
    return this.http.get('store/api/report/maolidetail', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //获取卖方买方机构
  queryjigou(id): Promise<any> {
    return this.http.get('store/api/org/:id').toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //毛利计算
  calcmaoli(search): Promise<any> {
    return this.http.get('store/api/maoli/calcmaoli', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  calcfpchengben(search): Promise<any> {
    return this.http.get('store/api/produce/chengbencalc', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  //特殊毛利展现
  queryteshumaoli(search): Promise<any> {
    return this.http.get('store/api/maoli/teshumaoli', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  //特殊毛利新增
  createteshumaoli(search): Promise<any> {
    return this.http.post('store/api/maoli/addteshumaoli', search).toPromise().then(data => {
      return data.json() as any[];
    })
  }
}
