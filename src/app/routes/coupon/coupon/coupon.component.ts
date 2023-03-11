import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { CouponService } from '../coupon.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('boundsModal') private boundsModal: ModalDirective;
  @ViewChild('applyModal') private applyModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  // aggird表格原型
  gridOptions: GridOptions;
  coupon= {};
  applycoupon = {};
  chandis = [];
  values = [];
  cangkus = [];
  kinds = [{value: 0, label: '普通钢厂专属'}, {value: 1, label: '活动专属'}, {value: 2, label: '新人专属'}, {value: 3, label: '主推钢厂专属'}];
  types;
  customer = {};
  issaleman = false;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  // 结束时间
  end: Date = new Date();
  coupons = [];
  selectedCoupon = [];
  // 标记跳出循环
  mark;
  bounds : number;
  constructor(private couponApi: CouponService, private datepipe: DatePipe, private toast: ToasterService, private router: Router,
    public settings: SettingsService) {
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
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '面值', field: 'couponvalue', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'typelabel', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '券种', field: 'kindlabel', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'enablelabel', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (params.data.enable) {
            return '<a target="_blank">停用</a>';
          } else {
            return '<a target="_blank">启用</a>';
          }
        },
        onCellClicked: (params) => {
          if (params.data.enable) {
            if (confirm('你确定要停用吗?')) {
              this.couponApi.disable(params.data.id).then(data => {
                this.toast.pop('success', '停用成功！');
                this.getAllCoupon();
              });
            }
          }else {
            if (confirm('你确定要启用吗?')) {
              this.couponApi.enable(params.data.id).then(data => {
                this.toast.pop('success', '启用成功！');
                this.getAllCoupon();
              });
            }
          }
        }
      }
    ];
    this.getAllCoupon();
  }

  ngOnInit() {
    this.getMyRole();
  }
  getAllCoupon() {
    this.couponApi.getAllCoupon().then(data => {
     // console.log(data);
    //  for (let index = 0; index < data.length; index++) {
    //    const element = data[index];
    //    if (element['chandiname'] && element['gn']) {
    //      element['chandiandgn'] = element['chandiname'] + '(' + element['gn'] + ')';
    //    }
    //  }
      this.coupons = data;
      this.gridOptions.api.setRowData(data);
    });
  }
  showDialog() {
    this.coupon = { type: 0 };
    this.couponApi.getterm().then(data => {
      this.chandis = data['chandis'];
      this.cangkus = data['cangkus'];
      this.values = data['values'];
    });
    this.createModal.show();
    this.chandioptions = [];
  }
  close() {
    this.createModal.hide();
  }
  create() {
    // console.log(this.coupon);
    // if (this.start) {
    //   this.coupon['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    //   this.coupon['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    // }
    if (!this.coupon['valueid']) {
      this.toast.pop('warning', '请选择面值！');
      return;
    }
    console.log(this.coupon);
    if (this.coupon['kind'] === 1 || this.coupon['kind'] === 2) {
      if (this.coupon['chandi']) {
        delete this.coupon['chandi'];
      }
      if (this.coupon['gn']) {
        delete this.coupon['gn'];
      }
      if (this.coupon['cangkuid']) {
        delete this.coupon['cangkuid'];
      }
    }else {
      if (this.coupon['type'] === 0) {
        if (!this.coupon['chandi']) {
          this.toast.pop('warning', '请选择产地！');
          return;
        }
      }else {
        if (this.coupon['chandi']) {
          delete this.coupon['chandi'];
        }
        if (this.coupon['gn']) {
          delete this.coupon['gn'];
        }
        if (this.coupon['cangkuid']) {
          delete this.coupon['cangkuid'];
        }
      }
    }
    if (!this.coupon['kind'] && this.coupon['kind'] !== 0) {
      this.toast.pop('warning', '请选择券种！');
      return;
    }
    if (this.coupon['kind'] === 0 || this.coupon['kind'] === 3) {
      if (this.coupon['type'] === 1) {
        this.toast.pop('warning', '该券种只允许创建单价优惠券！');
        return;
      }
    }
    this.couponApi.create(this.coupon).then(data => {
      console.log(data);
      this.getAllCoupon();
      this.createModal.hide();
    });
  }
  selectechandi(e) {
    this.coupon['chandiid'] = e.id;
    this.coupon['chandi'] = e.text;
  }
  selectstart() {
    this.endmax = this.start;
    this.end = this.start;
  }
  selectend() { }
  onChecked(e) {
    console.log(e);
    if (e.checked) {
      this.selectedCoupon.push(e.id);
    } else {
      for (let i = 0; i < this.selectedCoupon.length; i++) {
        if (this.selectedCoupon[i] === e.id) {
          this.selectedCoupon.splice(i, 1);
        }
      }
    }
    console.log(this.selectedCoupon);
  }
  gosend() {
    const ids = new Array();
    const couponlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    let count = 0;
    let kind = -1;
    for (let i = 0; i < couponlist.length; i++) {
      if (couponlist[i].selected && couponlist[i].data) {
        // console.log('saasaa', couponlist[i]);
        if (!couponlist[i].data.enable) {
          this.toast.pop('warning', '停用的优惠券不能发放!');
          return;
        }
        if (couponlist[i].data.kind === 2) {
          this.toast.pop('warning', '新人优惠券不允许手动发放!');
          return;
        }
        if (kind !== -1 && kind !== couponlist[i].data.kind) {
          if (kind === 3 || couponlist[i].data.kind === 3) {
            this.toast.pop('warning', '主推钢厂的优惠券不能与其他类型优惠券一起发放!');
            return;
          }else {
            kind = couponlist[i].data.kind;
          }
        }else {
          kind = couponlist[i].data.kind;
        }
        count++;
        ids.push(couponlist[i].data.id);
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要发放的优惠券!');
      return;
    }
    console.log(kind);
    this.router.navigate(['sendcoupon', { couponvalueids: ids, kind: kind }]);
    // if (this.selectedCoupon.length === 0) {
    //   this.toast.pop('warning', '请选择要发放的优惠券！');
    //   return;
    // }
    // this.router.navigate(['sendcoupon', { couponvalueids: this.selectedCoupon }]);
  }
  showBoundsModal(){
    this.coupon['value']='';
    this.couponApi.beforeBounds(this.coupon).then(data => {
      this.bounds = data.bounds;
    });
    this.boundsModal.show();
  }
  hideBoundsModal(){
    this.boundsModal.hide();
  }
  submit(){
    this.couponApi.updateBounds(this.coupon).then(data => {
      this.hideBoundsModal();
    });
  }
  showapplyModal(){
    const ids = new Array();
    const couponlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    let kind = -1;
    for (let i = 0; i < couponlist.length; i++){
      if (couponlist[i].selected && couponlist[i].data){
        if (!couponlist[i].data.enable) {
          this.toast.pop('warning', '停用的优惠券不能申请！！！');
          return;
        }
        if (kind !== -1 && kind !== couponlist[i].data.kind) {
          if (kind === 3 || couponlist[i].data.kind === 3) {
            this.toast.pop('warning', '主推钢厂的优惠券不能与其他类型优惠券一起发放！！！');
            return;
          }else {
            kind = couponlist[i].data.kind;
          }
        }else {
          kind = couponlist[i].data.kind;
        }
        ids.push(couponlist[i].data.id);
      }  
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要发放的优惠券！！！');
      return;
    }
    this.applycoupon['couponids'] = ids;
    this.applyModal.show();
    
  }
  hideapplyModal(){
    this.applyModal.hide();
  }

  apply(){
    if (typeof (this.customer) === 'object') {
      this.applycoupon['customerid'] = this.customer['code'];
    } else {
      this.applycoupon['customerid'] = '';
    }
    this.applycoupon['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.applycoupon['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    if(!this['customer']){
      this.toast.pop('warning' , '请填写客户名称！！！');
      return;
    }
    if(!this.applycoupon['number']){
      this.toast.pop('warning' , '请填写发放数量！！！');
      return;
    }
    if(!this.applycoupon['beizhu']){
      this.toast.pop('warning' , '请填写发放原因！！！');
      return;
    }
    console.log(this.applycoupon);
    this.couponApi.submitVerify(this.applycoupon).then(data => {
      this.hideapplyModal();
    })
  }
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 10) {
        this.issaleman = true;
      }
    }
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
    this.coupon['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.coupon['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
