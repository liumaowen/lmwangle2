import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BusinessorderapiService {

  constructor(private http: Http) { }

  getmoney(search) {
    return this.http.get('store/app/usermoney/moneydet', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  getmoney1(search) {
    return this.http.get('store/app/usermoney/getmoney', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  getCode(search) {
    return this.http.get('store/app/order/getpaycode', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }

  query(search) {
    return this.http.get('store/api/businessorder', { search: search }).toPromise();
  }

  create(search) {
    return this.http.post('store/api/businessorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findAddr(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  importFav(id, search) {
    return this.http.get('store/api/businessorder/impfav/' + id, { search: search }).toPromise();
  }

  updateBusiness(search) {
    return this.http.put('store/api/businessorder', search).toPromise();
  }

  removeOneDet(id) {
    return this.http.get('store/api/businessorder/remove/' + id).toPromise();
  }
  
    /**批量删除销售合同明细 */
  delbusinessorderDet(search) {
    return this.http.post('store/api/businessorder/removelist', search).toPromise().then(data => {
    return data.json() as any[];
      });
    }
        /**批量删除销售合同明细 */
        delremoveorder(search) {
    return this.http.post('store/api/businessorder/removeorder', search).toPromise().then(data => {
    return data.json() as any[];
      });
    }
  submitVuser(id, search) {
    return this.http.get('store/api/businessorder/submitvuser/' + id, { search: search }).toPromise();
  }

  verify(id, search) {
    return this.http.get('store/api/businessorder/verify/' + id, { search: search }).toPromise();
  }

  pay(id, search) {
    return this.http.get('store/app/order/pay/' + id, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  arrears(search) {
    return this.http.get('store/api/businessorder/arrearsapply', { search: search }).toPromise();
  }

  modifyunfee(search) {
    return this.http.put('store/api/businessorder/modifyunfee', search).toPromise();
  }

  modifyjiagongfee(search) {
    return this.http.put('store/api/businessorder/modifyjiagongfee', search).toPromise();
  }

  createAddr(search) {
    return this.http.post('store/api/addr', search).toPromise();
  }

  companysearch(search) {
    return this.http.get('store/api/customer/findbysale', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  getQihuoByBillno(search) {
    return this.http.get('store/api/qihuo/findbybillno', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  cancelVerify(id, search) {
    return this.http.get('store/api/businessorder/cancelverify/' + id, { search: search }).toPromise();
  }

  getdet(id) {
    return this.http.get('store/api/businessorder/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  del(id) {
    return this.http.delete('store/api/businessorder/' + id).toPromise();
  }

  getchukufeetype(search) {
    return this.http.put('store/api/businessorder/getchukufeetype', search).toPromise();
  }


  changetprice(search) {
    return this.http.put('store/api/businessorder/changetprice', search).toPromise();
  }

  refuseverify(id, search) {
    return this.http.get('store/app/order/refuseverify/' + id, { search: search }).toPromise();
  }

  cancelorder(id, search) {
    return this.http.get('store/api/businessorder/cancel/' + id, { search: search }).toPromise();
  }

  finish(id, search) {
    return this.http.get('store/api/businessorder/finish/' + id, { search: search }).toPromise();
  }

  recalculate(id) {
    return this.http.get('store/api/businessorder/calculate/' + id).toPromise();
  }

  save(id, search) {
    return this.http.get('store/api/businessorder/save/' + id, { search: search }).toPromise();
  }
  createoverdraft(search) {
    return this.http.post('store/api/overdraft', search).toPromise().then();
  }
  queryoverdraft(search) {
    return this.http.get('store/api/overdraft', { search: search }).toPromise();
  }
  getoverdraftdetail(id) {
    return this.http.get('store/api/overdraft/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  huankuan(search) {
    return this.http.put('store/api/overdraft/huankuan', search).toPromise();
  }
  modifyhuankuan(search) {
    return this.http.put('store/api/overdraft/modifyhuankuan', search).toPromise();
  }
  verifyhuankuan(id) {
    return this.http.get('store/api/overdraft/huankuan/verify/' + id).toPromise();
  }
  queryoverdraftprogress(search) {
    return this.http.get('store/api/overdraft/lixi', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 查看质保书
  getZhibaoUrl(id) {
    return this.http.get('store/api/order/getzhibaourl/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 批量下载质保书
  downlodezhibao(search): Promise<any> {
    return this.http.get('store/api/zhibao/generatezip', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  modifyishand(id) {
    return this.http.get('store/api/overdraft/modifyishand/' + id,).toPromise();
  }

  orderdetgroup(orderdetids){
    return this.http.get('store/api/businessorder/orderdetgroup?orderdetids=' + orderdetids).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  /**物流竞价明细作废 */
  zuofei(search) {
    return this.http.put('store/api/wuliuorder/zuofei', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 竞价明细
  wuliuofferdetail(orderid): Promise<any> {
    return this.http.get('store/api/wuliuorder/findbyorderid/' + orderid).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  // 修改提货方式
  modifyorder(editorder) {
    return this.http.put('store/api/order/modifyorder', editorder).toPromise();
  }
}
