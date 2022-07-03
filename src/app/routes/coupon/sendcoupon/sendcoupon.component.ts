import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap';
import { CustomerapiService } from '../../customer/customerapi.service';
import { CouponService } from '../../coupon/coupon.service';
import { ToasterService } from 'angular2-toaster';
import { CaigouService } from '../../caigou/caigou.service';

@Component({
  selector: 'app-sendcoupon',
  templateUrl: './sendcoupon.component.html',
  styleUrls: ['./sendcoupon.component.scss']
})
export class SendcouponComponent implements OnInit {
  @ViewChild('queryModal') queryModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gridOptions: GridOptions;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  // 结束时间
  end: Date = new Date();
  // 是否发送消息
  ismsgsend: Boolean = false;
  coupon = { count: 1 };
  usernatures = [];
  search = {};
  values = [];
  coupons = [];
  chandis = [];
  kind = '-1';
  // 标记跳出循环
  mark;
  constructor(private actroute: ActivatedRoute, private router: Router, public settings: SettingsService, private datepipe: DatePipe,
    private customerApi: CustomerapiService, private couponApi: CouponService, private toast: ToasterService,
    private caigouApi: CaigouService) {
    this.coupon['couponids'] = this.actroute.params['value']['couponvalueids'].split(',');
    this.kind = this.actroute.params['value']['kind'];
    this.couponApi.getcouponlist({ couponvalueids: this.actroute.params['value']['couponvalueids'] }).then(data => {
      this.coupons = data;
    });
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: (params) => {
        const result = [
          { // custom item
            name: '全选',
            action: () => {
              this.mark = true;
              params.api.selectAll();
              this.mark = false;
            }
          },
          {
            name: '全不选',
            action: () => {
              this.mark = true;
              params.api.deselectAll();
              this.mark = false;
            }
          },
          'copy',
          {
            name: '自适应',
            action: () => {
              params.columnApi.autoSizeAllColumns();
            }
          }
        ];
        return result;
      }
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', minWidth: 43, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'usernature', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未登录天数', field: 'saleman', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未下单天数', field: 'nobuyday', minWidth: 80 }
    ];
  }

  ngOnInit() {
  }
  selectstart() {
    this.endmax = this.start;
    this.end = this.start;
  }
  selectend() { }
  showQuery() {
    this.chandioptions = [];
    this.search = {};
    this.usernatures = [{ value: 0, label: '直接用户' }, { value: 1, label: '流通商' }];
    this.queryModal.show();
  }
  query() {
    if (this.search['usernature'] !== undefined) {
      if (this.search['usernature'] === 0) {
        this.coupon['usernature'] = '直接用户';
      } else {
        this.coupon['usernature'] = '流通商';
      }
    } else {
      this.coupon['usernature'] = '全部客户';
    }
    if (this.search['minday']) {
      if (this.search['maxday']) {
        this.coupon['nopayday'] = this.search['minday'] + '天至' + this.search['maxday'] + '天未下单的';
      } else {
        this.coupon['nopayday'] = this.search['minday'] + '天以上未下单的';
      }
    } else {
      if (this.search['maxday']) {
        this.coupon['nopayday'] = this.search['maxday'] + '天以下未下单的';
      }
    }
    this.customerApi.findcustomerbynature(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.queryModal.hide();
    });
  }
  a() {
    if (this.ismsgsend) {
      this.coupon['issend'] = true;
    }
  }
  b(e) {
    if (e) {
      this.coupon['issendnewuser'] = false;
    }else {
      this.coupon['issendnewuser'] = true;
    }
  }
  send() {
    if (this.start) {
      this.coupon['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.coupon['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    this.seleckcustomer();
  }
  close() {
    this.queryModal.hide();
  }
  // 选择客户
  seleckcustomer() {
    this.coupon['usernature'] = '';
    const ids = new Array();
    const customers = this.gridOptions.api.getModel()['rowsToDisplay'];
    let count = 0;
    if (this.kind !== '3') {
      for (let i = 0; i < customers.length; i++) {
        if (customers[i].selected && customers[i].data) {
          count++;
          ids.push(customers[i].data.customerid);
        }
      }
      if (ids.length <= 0) {
        this.toast.pop('warning', '请选择将发放的客户!');
        return;
      }
    }else {
      delete this.coupon['nopayday'];
      this.coupon['usernature'] = '全部客户';
      this.coupon['kind'] = this.kind;
    }
    console.log('hello');
    console.log(this.coupon);
    console.log('world');
    this.coupon['customerids'] = ids;
    this.couponApi.createmycoupon(this.coupon).then(data => {
      this.toast.pop('success', '优惠券发放成功，大量订单即将袭来.');
      this.router.navigate(['coupon']);
    });
  }
  selectechandi(e) {
    this.search['chandiid'] = e.id;
    this.search['chandi'] = e.text;
  }
  selectall() {
    this.gridOptions.api.selectAll();
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
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
    }
  }
}
