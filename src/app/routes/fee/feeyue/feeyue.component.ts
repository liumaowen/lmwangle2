import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { ReportService } from './../../report/report.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-feeyue',
  templateUrl: './feeyue.component.html',
  styleUrls: ['./feeyue.component.scss']
})
export class FeeyueComponent implements OnInit {

  start = new Date();

  moneyRange = [
    { value: '', label: '取消' },
    { value: 0, label: '不等零' },
    { value: 1, label: '大于零' },
    { value: 2, label: '等于零' },
    { value: 3, label: '小于零' }];

  requestparams = {
    customerid: '',
    moneyRange: '',
    start: this.datePipe.transform(this.start, 'y-MM-dd')
  };

  companys;

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private reportApi: ReportService,
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
    }

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '公司编号', field: 'customerid', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'customername', width: 280 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款公司', field: 'paycustomername', width: 280 },
      //{ cellStyle: { 'text-align': 'center' }, headerName: '费用机构', field: 'orgname', width: 280 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '费用余额', field: 'money', width: 100,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/feewanglai/' + params.data.customerid + '">' + params.data.money + '</a>';
        }, valueFormatter: this.settings.valueFormatter2
      },
      // {
      //   cellStyle: { 'text-align': 'right' }, headerName: '总费用', field: 'feejine', width: 120,
      //   valueFormatter: this.settings.valueFormatter2
      // },
      // {
      //   cellStyle: { 'text-align': 'right' }, headerName: '费用金额', field: 'yijine', width: 120,
      //   valueFormatter: this.settings.valueFormatter2
      // },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '查询余额', field: 'yue', width: 120,
        valueFormatter: this.settings.valueFormatter2
      }
    ];

  }

  ngOnInit() {
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
      fileName: '费用往来余额表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  listDetail() {
    if (typeof (this.companys) === 'object') {
      this.requestparams.customerid = this.companys['code'];
    } else {
      this.requestparams.customerid = '';
    }
    this.requestparams['start'] = this.datePipe.transform(this.start, 'y-MM-dd');
    this.reportApi.feeyue(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

  // 查询明细

  query() {
    // 设定运行查询，再清除页面data变量	
    this.listDetail();
    this.hideclassicModal();
  };

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.start = new Date();
    this.requestparams = { customerid: '', moneyRange: '', start: this.datePipe.transform(this.start, 'y-MM-dd') };
    this.companys = undefined;
  };

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
