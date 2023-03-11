import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { CouponService } from '../coupon.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CaigouService } from 'app/routes/caigou/caigou.service';

@Component({
  selector: 'app-couponlist',
  templateUrl: './couponlist.component.html',
  styleUrls: ['./couponlist.component.scss']
})
export class CouponlistComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  public totalItems: number;
  public currentPage = 1;
  search: any = { pagenum: 1, pagesize: 10 };
  // ngtable的表格数据
  singleData = [];
  customers = [];
  // 开始时间
  start = new Date(); // 设定页面开始时间默认值
  end = new Date();
  maxDate = new Date();
  companys = {};
  chandis = [];
  @ViewChild('customerdialog') private customerdialog: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(private toast: ToasterService, private datepipe: DatePipe,
     private couponApi: CouponService, private caigouApi: CaigouService) {
    this.querydata();
  }

  ngOnInit() {
  }
  // 分页点击查询
  pageChanged(event: any): void {
    this.search['pagenum'] = event.page;
    this.search['pagesize'] = event.itemsPerPage;
    this.querydata();
  }
  // 查询数据
  querydata() {
    this.couponApi.getmain(this.search).then(data => {
      this.totalItems = data.headers.get('total');
      this.singleData = data.json();
      this.singleData.forEach(ele => {
        const cus = ele.customername;
        if (cus) {
          const cusarray = cus.split(',');
          if (cusarray.length > 2 ) {
            const three = cusarray[2] ? '，' + cusarray[2] : '';
            ele.customername1 = cusarray[0] + '，' + cusarray[1] + three;
          } else {
            ele.customername1 = cus;
          }
        }
      });
    });
  }
  verify(id) {
    this.couponApi.verify(id).then(data => {
      this.querydata();
    });
  }
  refuseverify(id) {
    this.couponApi.refuseverify(id).then(data => {
      this.querydata();
    });
  }
  showmore(item) {
    const cus = item.customername;
    if (cus) {
      this.customers = cus.split(',');
      this.customerdialog.show();
    } else {
      this.toast.pop('warning', '没有客户名称^~^');
      return '';
    }
  }
  showmore1(item) {
    item.isshowmore = !item.isshowmore;
    if (item.isshowmore) {
      const cus = item.customername;
      if (cus) {
        const cusarray = cus.split(',');
        if (cusarray.length > 2 ) {
          const three = cusarray[2] ? '，' + cusarray[2] : '';
          item.customername1 = cusarray[0] + '，' + cusarray[1] + three;
        } else {
          item.customername1 = cus;
        }
      }
    } else {
      item.customername1 = item.customername;
    }
  }
  hidecustomer() {
    this.customerdialog.hide();
  }
  addopen() {
    // this.caigouApi.getchandi().then(data => {
    //   this.chandis = [];
    //   data.forEach(element => {
    //     this.chandis.push({value: element.id, label: element.text});
    //   });
    // });
    this.classicModal.show();
  }

  coles() {
    this.classicModal.hide();
  }
  query() {
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.search['customerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.search['customerid'] = this.companys['code'];
    }
    this.search.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.search['pagenum'] = 1;
    this.querydata();
    this.coles();
  }
  selectNull() {
    this.search['chandi'] = '';
    this.search['start'] = '';
    this.search['end'] = '';
    this.search['customerid'] = '';
    this.start = new Date();
    this.end = new Date();
    this.companys = undefined;
    this.chandioptions = [];
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
