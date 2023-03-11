import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { OrderapiService } from './../../order/orderapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';

@Component({
  selector: 'app-verifylist',
  templateUrl: './verifylist.component.html',
  styleUrls: ['./verifylist.component.scss']
})
export class VerifylistComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  start = new Date();
  end = new Date();
  maxDate = new Date();
  gridOptions: GridOptions;
  companys;
  requestparams = {
    start: '',
    end: '',
    buyerid: '',
    sellid: ''
  };
  ids;
  sellers;
  constructor(public settings: SettingsService, private datePipe: DatePipe, private orderApi: OrderapiService,
    private toast: ToasterService, private customerApi: CustomerapiService) {
    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems,
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      }
    };
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '登记单号', field: 'billno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'sellername', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'billgn', width: 70 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'tjine', width: 70 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'invoiceno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票日期', field: 'invoicedate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'realname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '邮寄地址', field: 'maddress', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收件人', field: 'shoujianren', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系电话', field: 'shoujiantel', width: 100 }
    ];
  }

  ngOnInit() {
  }
  queryDialog() {
    this.requestparams = {
      start: '',
      end: '',
      buyerid: '',
      sellid: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.companys = {};
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
  hideclassicModal() {
    this.classicModal.hide();
  }
  query() {
    this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    if (typeof (this.companys) === 'object') {
      this.requestparams.buyerid = this.companys['code'];
    } else {
      this.requestparams.buyerid = '';
    }
    this.orderApi.verifylist(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);
      this.hideclassicModal();
    });
  }
  verify() {
    this.ids = [];
    const params = {};
    const dets = this.gridOptions.api.getModel()['rowsToDisplay'];
    if (dets.length > 0) {
      for (let i = 0; i < dets.length; i++) {
        if (dets[i].selected) {
          this.ids.push(dets[i].data.id);
        }
      }
    }
    if (this.ids.length === 0) {
      this.toast.pop('warning', '请选择要审核的登记单！！！');
      return '';
    }
    params['ids'] = this.ids;
    this.orderApi.verifykaipiao(params).then(data => {
      this.query();
      this.toast.pop('success', '审核成功！');
    });
  }
}
