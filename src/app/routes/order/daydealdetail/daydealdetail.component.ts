import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { CustomerapiService } from '../../customer/customerapi.service';
import { OrderapiService } from '../../order/orderapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-daydealdetail',
  templateUrl: './daydealdetail.component.html',
  styleUrls: ['./daydealdetail.component.scss']
})
export class DaydealdetailComponent implements OnInit {


  start: Date = new Date();

  end: Date = new Date();

  maxDate: Date = new Date();

  billstatus = [{ value: '', label: '全部' }, { value: 1, label: '不含撤销' }, { value: 2, label: '实提(不含撤销和临调)' }];
  detstatus = [{ value: '', label: '全部' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }];

  requestparams =
    {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd')
    };

  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private datepipe: DatePipe, private orderApi: OrderapiService,
    private customerApi: CustomerapiService, private orgApi: OrgApiService, private classifyApi: ClassifyApiService,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    }
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
     
      { cellStyle: { 'text-align': 'center' }, headerName: '是否工作日', field: 'workday', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'orderdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效订单量', field: 'yxordernum', width: 100,
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '成交订单量', field: 'cjordernum', width: 100,
      valueFormatter: this.settings.valueFormatter2 },
      
    ];

  }

  ngOnInit() {
  }

  // 列表赋值
  listDetail() {
    this.orderApi.daydealdetail(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  }

  orgs = [];

  sellersResult = [];

  cangku = [];
  gns = [];

  // 查询对话框
  openQueryDialog() {
    this.showdialog();
  }

  data;

  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}


  filters = {};
  conditions = null;

  disabled = true;

  cuser;

  suser;

  companys;
  // 查询
  query() {
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    console.log(this.requestparams);
    this.listDetail();
    this.hidedialog();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd')
    };
    this.start = new Date();
    this.end = new Date();
  }

  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '日常接单及成交情况表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showdialog() {
    this.classicModal.show();
  }

  hidedialog() {
    this.classicModal.hide();
  }

}
