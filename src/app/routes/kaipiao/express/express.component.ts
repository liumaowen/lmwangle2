import { Component, OnInit, ViewChild } from '@angular/core';
import { UserapiService } from '../../../dnn/service/userapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { OrderapiService } from './../../order/orderapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';

@Component({
  selector: 'app-express',
  templateUrl: './express.component.html',
  styleUrls: ['./express.component.scss']
})
export class ExpressComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  customer: any;
  results: Array<any>;
  type = {
    flag: null
  };
  express = {};
  gridOptions: GridOptions;
  sellers;
  search = { sellerid: '' };
  constructor(private userapi: UserapiService, private toast: ToasterService, public settings: SettingsService,
    private orderApi: OrderapiService, private customerApi: CustomerapiService) {
    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      onRowSelected: (event) => { },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
    };
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '登记单号', field: 'billno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'invoiceno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开票日期', field: 'invoicedate', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'seller', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '快递公司', field: 'express', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '邮寄地址', field: 'maddress', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收票人', field: 'shoujianren', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收件人电话', field: 'shoujiantel', width: 100 }
    ];
  }

  ngOnInit() {
  }
  queryDialog() {
    this.type['flag'] = '1';
    this.customer = {};
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ label: '全部', value: '' }];
      data.forEach(element => {
        sellerlist.push({
          label: element.name,
          value: element.id
        });
      });
      this.sellers = sellerlist;
    });
    this.classicModal.show();
  }
  checkall() {
    this.gridOptions.api.selectAll();
  }
  addDialog() {
    this.express = {};
    const ids = new Array();
    const express = new Array();
    const sellerids = new Array();
    const dets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    if (dets.length > 0) {
      for (let i = 0; i < dets.length; i++) {
        if (dets[i].selected) {
          let flag = false;
          let isseller = false;
          ids.push(dets[i].data.id);
          for (let j = 0; j < express.length; j++) {
            if (express[j] === dets[i].data.express) {
              flag = true;
            }
          }
          for (let j = 0; j < sellerids.length; j++) {
            if (sellerids[j] === dets[i].data.sellerid) {
              isseller = true;
            }
          }
          if (!flag) {
            express.push(dets[i].data.express);
          }
          if (!isseller) {
            sellerids.push(dets[i].data.sellerid);
          }
        }
      }
    }
    if (ids.length === 0) {
      this.toast.pop('warning', '请选择登记单');
      return '';
    }
    if (express.length > 1) {
      this.toast.pop('warning', '请选择相同快递公司的登记单');
      return '';
    }
    if (sellerids.length > 1) {
      this.toast.pop('warning', '请选择相同卖方公司的登记单');
      return '';
    }
    this.express['ids'] = ids;
    this.express['express'] = express[0];
    this.express['sellerid'] = sellerids[0];
    this.addModal.show();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }
  findcustomer(event) {
    console.log('type', this.type);
    const search = {
      isonline: null,
      search: null
    };
    if (this.type['flag'] === '1') {
      search['isonline'] = false;
    } else {
      search['isonline'] = true;
    }
    search['search'] = event['query'];
    this.userapi.findcustomer(search).then(data => {
      this.results = [];
      data.json().forEach(element => {
        this.results.push({
          name: element.company,
          code: element.id
        });
      });
    });
  }
  query() {
    console.log(this.customer);
    if (!this.customer['code']) {
      this.toast.pop('warning', '请选择客户单位！！！');
      return;
    }
    // const querys = {};
    this.search['customerid'] = this.customer['code'];
    this.orderApi.queryexpress(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
      this.hideclassicModal();
    });
  }
  hideaddModal() {
    this.addModal.hide();
  }
  add() {
    if (!this.express['expressno']) {
      this.toast.pop('warning', '请添加快递单号！！！');
      return;
    }
    console.log(this.express);
    this.express['customerid'] = this.customer['code'];
    this.orderApi.addexpress(this.express).then((data) => {
      if (!data['flag']) {
        this.toast.pop('error', data['msg']);
      }else {
        this.toast.pop('success', '添加成功！');
      }
      this.query();
      this.hideaddModal();
    });
  }
}
