import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CouponService {

  constructor(private http: Http) { }
  getterm(): Promise<any> {
    return this.http.get('store/api/coupon/term').toPromise().then(data => {
      return data.json() as any;
    });
  }
  create(coupon): Promise<any> {
    return this.http.post('store/api/coupon', coupon).toPromise().then(data => {
      return data.json();
    });
  }
  getAllCoupon(): Promise<any> {
    return this.http.get('store/api/coupon').toPromise().then(data => {
      return data.json() as any;
    });
  }
  createmycoupon(coupon): Promise<any> {
    return this.http.post('store/api/mycoupon/createmycoupon', coupon).toPromise();
  }
  getcouponlist(search): Promise<any> {
    return this.http.get('store/api/coupon/getcouponlist', { search: search }).toPromise().then(data => {
      return data.json() as any;
    });
  }
  verify(id): Promise<any> {
    return this.http.get('store/api/mycoupon/verify/' + id).toPromise().then();
  }
  refuseverify(id): Promise<any> {
    return this.http.delete('store/api/mycoupon/' + id).toPromise().then();
  }
  getmain(search): Promise<any> {
    return this.http.get('store/api/mycoupon', { search: search }).toPromise().then();
  }
  enable(id): Promise<any> {
    return this.http.get('store/api/coupon/enable/' + id).toPromise().then();
  }
  disable(id): Promise<any> {
    return this.http.get('store/api/coupon/disable/' + id).toPromise().then();
  }
  updateBounds(coupon): Promise<any> {
    return this.http.put('store/api/coupon/updatebounds', coupon).toPromise().then(data => {
      return data.json();
    });
  }
  submitVerify(coupon): Promise<any> {
    return this.http.post('store/api/coupon/applycoupon' , coupon).toPromise().then(data => {
      return data.json() as any[];
    });
  }
  beforeBounds(coupon): Promise<any> {
    return this.http.get('store/api/coupon/getbounds' , coupon).toPromise().then(data => {
      return data.json() as any[];
    });
  }
}
