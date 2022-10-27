import { OrgdetailComponent } from './../../org/orgdetail/orgdetail.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { ReportService } from './../../report/report.service';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-xiaoshouwanglaiyuereport',
  templateUrl: './xiaoshouwanglaiyuereport.component.html',
  styleUrls: ['./xiaoshouwanglaiyuereport.component.scss']
})
export class XiaoshouwanglaiyuereportComponent implements OnInit {

  start = new Date();

  companys;
  current = this.storage.getObject('cuser');
  maxDate = new Date();

  requestparams = { customerid: '', moneyRange: '', start: this.datepipe.transform(this.start, 'y-MM-dd')};

  moneyRange = [{ value: '', label: '全部' }, { value: 0, label: '不等零' }, { value: 1, label: '大于零' },
  { value: 2, label: '等于零' }, { value: 3, label: '小于零' }];

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private datepipe: DatePipe, private reportApi: ReportService,private storage: StorageService) {

    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: false, // 排序
      enableRangeSelection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '客户编号', field: 'customerid', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 280 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方名称', field: 'wcustomername', width: 280 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '可使用余额', field: 'money', width: 100,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/xiaoshouwanglaireport/' + params.data.customerid + '">' + params.data.money + '</a>';
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '收款额', field: 'shoukuanjine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '订单发生额', field: 'dingdanjine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '提单发生额', field: 'tidanjine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '退货发生额', field: 'tuihuojine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售补差额', field: 'xsbuchajine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '账面余额', field: 'yue', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '公用抬头账户余额', field: 'actualjine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务负责人', field: 'realname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', width: 220 }
    ];
  }

  ngOnInit() {
  }

  listDetail() {
    if (typeof (this.companys) === 'object') {
      this.requestparams.customerid = this.companys['code'];
    } else {
      this.requestparams.customerid = '';
    }
    this.reportApi.money(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  };

  openQueryDialog() {
    this.showclassicModal();
  };

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = { customerid: '', moneyRange: '', start: '' };
    this.companys = undefined;
  };


  // 查询明细
  query() {
    this.requestparams['salemanid']=this.current.id;
    this.requestparams['orgid']=this.current.orgid;
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    // 设定运行查询，再清除页面data变量
    this.listDetail();
    this.hideclassicModal();
  };

  // 导出明细表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '税额抵扣表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
