import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class XmdBusinessorderapiService {

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



  query(search) {
    return this.http.get('store/api/xmd/businessorder', { search: search }).toPromise();
  }

  create(search) {
    return this.http.post('store/api/xmd/businessorder', search).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  findAddr(id) {
    return this.http.get('store/api/addr/listbycustomerid/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }

  updateBusiness(search) {
    return this.http.put('store/api/xmd/businessorder', search).toPromise();
  }
  
    /**批量删除销售合同明细 */
  delbusinessorderDet(search) {
    return this.http.post('store/api/xmd/businessorder/removelist', search).toPromise().then(data => {
    return data.json() as any[];
      });
    }
        /**批量删除销售合同明细 */
        delremoveorder(search) {
    return this.http.post('store/api/xmd/businessorder/removeorder', search).toPromise().then(data => {
    return data.json() as any[];
      });
    }


  verify(id, search) {
    return this.http.get('store/api/xmd/businessorder/verify/' + id, { search: search }).toPromise();
  }



  arrears(search) {
    return this.http.get('store/api/xmd/businessorder/arrearsapply', { search: search }).toPromise();
  }

  modifyunfee(search) {
    return this.http.put('store/api/xmd/businessorder/modifyunfee', search).toPromise();
  }

  modifyjiagongfee(search) {
    return this.http.put('store/api/xmd/businessorder/modifyjiagongfee', search).toPromise();
  }

  createAddr(search) {
    return this.http.post('store/api/addr', search).toPromise();
  }

  getQihuoByBillno(search) {
    return this.http.get('store/api/qihuo/findbybillno', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }


  getdet(id) {
    return this.http.get('store/api/xmd/businessorder/det/' + id).toPromise().then(data => {
      return data.json() as any[];
    });
  }



  getchukufeetype(search) {
    return this.http.put('store/api/xmd/businessorder/getchukufeetype', search).toPromise();
  }


  changetprice(search) {
    return this.http.put('store/api/xmd/businessorder/changetprice', search).toPromise();
  }

  refuseverify(id, search) {
    return this.http.get('store/app/order/refuseverify/' + id, { search: search }).toPromise();
  }





  recalculate(id) {
    return this.http.get('store/api/xmd/businessorder/calculate/' + id).toPromise();
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
    return this.http.get('store/api/xmd/businessorder/orderdetgroup?orderdetids=' + orderdetids).toPromise().then(data => {
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




  removeOneDet(id) {
    return this.http.get('store/api/xmd/businessorder/remove/' + id).toPromise();
  }
  finish(id, search) {
    return this.http.get('store/api/xmd/businessorder/finish/' + id, { search: search }).toPromise();
  }
  del(id) {
    return this.http.delete('store/api/xmd/businessorder/' + id).toPromise();
  }
  cancelorder(id, search) {
    return this.http.get('store/api/xmd/businessorder/cancel/' + id, { search: search }).toPromise();
  }
  submitVuser(id, search) {
    return this.http.get('store/api/xmd/businessorder/submitvuser/' + id, { search: search }).toPromise();
  }
  cancelVerify(id, search) {
    return this.http.get('store/api/xmd/businessorder/cancelverify/' + id, { search: search }).toPromise();
  }
  getCode(search) {
    return this.http.get('store/app/order/getpaycode', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    })
  }
  pay(id, search) {
    return this.http.get('store/api/xmd/order/pay/' + id, { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  companysearch(search) {
    return this.http.get('store/api/xmd/customer/findbysale', { search: search }).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  importFav(id, search) {
    return this.http.get('store/api/xmd/businessorder/impfav/' + id, { search: search }).toPromise();
  }
 // 修改提货方式
  modifyorder(editorder) {
    return this.http.put('store/api/xmd/order/modifyorder', editorder).toPromise();
  }
  save(id, search) {
    return this.http.get('store/api/xmd/businessorder/save/' + id, { search: search }).toPromise();
  }
}
