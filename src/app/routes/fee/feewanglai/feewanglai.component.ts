import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from './../../report/report.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feewanglai',
  templateUrl: './feewanglai.component.html',
  styleUrls: ['./feewanglai.component.scss']
})
export class FeewanglaiComponent implements OnInit {

  maxDate = new Date();

  start = new Date(this.maxDate.getFullYear() + '-' + (this.maxDate.getMonth() + 1) + '-01');

  end;

  requestparams = { start: this.datePipe.transform(this.start, 'y-MM-dd'), end: '', feecustomerid: '', feeorgid: '' };

  gridOptions: GridOptions;

  companys;

  sellers;

  constructor(public settings: SettingsService,
    private reportApi: ReportService,
    private route: ActivatedRoute,
    private customerApi: CustomerapiService,
    private toast: ToasterService,
    private datePipe: DatePipe) {

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'TH') { // 提货单
            return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'XT') { // 退货
            return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'AL') { // 调拨单
            return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'FF') { // 费用付款单
            return '<a target="_blank" href="#/feefukuan/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          return params.data.billno;
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用机构', field: 'feeorgname', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '摘要', field: 'zhaiyao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'feetype', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'tweight', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '发生额', field: 'fashenge', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '余额', field: 'yue', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款情况', field: 'beizhu', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款单位', field: 'paycustomername', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已付款', field: 'yijine', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'customername', width: 220 }
    ];

    // 页面有参数，是在销售往来余额表跳转过来的
    if (this.route.params['value']['id']) {
      this.requestparams.feecustomerid = this.route.params['value']['id'];
      this.customerApi.getCustomer(this.route.params['value']['id']).then((response) => {
        let tem = { value: '', label: '' };
        tem.value = response['id'];
        tem.label = response['name'];
        this.companys = tem;
      });
      this.listDetail();
    }

  }

  ngOnInit() {
  }

  listDetail() {
    this.reportApi.feewanglai(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };

  // 查询
  query() {
    if (!this.start) {
      this.requestparams.start = '';
      this.toast.pop('warning', '开始时间必填！');
    } else {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.companys) === 'object') {
        this.requestparams.feecustomerid = this.companys['code'];
      }
      if (!this.requestparams.feecustomerid) {
        // Notify.alert("公司名称必填！", 'warning');
        this.toast.pop('warning', '公司名称必填！');
      } else {
        this.listDetail();
        this.hideclassicModal();
      }
    }

  };

  selectNull() {
    this.start = new Date(this.maxDate.getFullYear() + '-' + (this.maxDate.getMonth() + 1) + '-01');
    this.end = undefined;
    this.requestparams = { start: this.datePipe.transform(this.start, 'y-MM-dd'), end: '', feecustomerid: '', feeorgid: '' };
  }

  // 导出明细表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '费用往来明细表.csv',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  openQueryDialog() {
    this.showclassicModal();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ value: '', label: '全部' }];
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

}
