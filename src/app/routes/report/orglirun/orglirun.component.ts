import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { CustomerapiService } from '../../customer/customerapi.service';
import { OrderapiService } from '../../order/orderapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { ReportService } from '../report.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { start } from 'repl';

@Component({
  selector: 'app-orglirun',
  templateUrl: './orglirun.component.html',
  styleUrls: ['./orglirun.component.scss']
})
export class OrglirunComponent implements OnInit {

  // start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  // end: Date = new Date();
  month : Date = new Date();

  // maxDate: Date = new Date();

  requestparams:any =
    {
      //start: this.datepipe.transform(this.start, 'y-MM-dd'),
      // start: this.datepipe.transform(this.start, 'y-MM-dd'),
      // end: this.datepipe.transform(this.end, 'y-MM-dd'),
      month: this.datepipe.transform(this.month, 'y-MM-dd'),
      orgid:''
    };

  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private datepipe: DatePipe, private orderApi: OrderapiService,
    private customerApi: CustomerapiService, private orgApi: OrgApiService, private classifyApi: ClassifyApiService,
    private toast: ToasterService,private reportService: ReportService,) {
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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 120 ,
        cellRenderer: (params) => {
        if (params.data) {
          return params.data['orgname'];
        } else {
          return '合计';
        }
      }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '当月实提量', field: 'shiticount', width: 120, 
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['shiticount']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市场调货利润（含税）', field: 'tihuolirun', width: 140,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['tihuolirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '非市场调货利润（含税）', field: 'feitiaohuolirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['feitiaohuolirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '低于指导价（含税）', field: 'dzhidaojialirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['dzhidaojialirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备货利润（含税）', field: 'beihuolirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['beihuolirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '特殊利润（含税）', field: 'teshulirun', width: 150,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['teshulirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构创造利润（含税）', field: 'jigoulirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['jigoulirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构利息', field: 'jigoulixi', width: 120,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['jigoulixi']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构息后创造利润', field: 'xihoulirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['xihoulirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单吨息后创造利润', field: 'ddxihoulirun', width: 180,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['ddxihoulirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      
    ];

  }

  ngOnInit() {
    console.log();
    this.listDetail();
    //半小时刷新一次
    setInterval(() => {this.listDetail()},1800000);
  }
  


  // 列表赋值
  listDetail() {
    this.reportService.orglirun(this.requestparams).then((response) => {
      console.log(response);
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

    // 定义orgid的值
    orgid = [{ label: '请选择机构', value: '' }, { label: '上海销售一部', value: 660 }, { label: '上海销售三部', value: 663 },{ label: '山东销售一部', value: 666 },
    { label: '山东销售一部', value: 665 }, { label: '佛山万事达', value: 661 }, { label: '山东销售二部', value: 667 }, { label: '山东销售三部', value: 668 }, 
    { label: '上海销售二部', value: 662 }];

  companys;
  // 查询
  query() {
    // this.requestparams.start = this.datepipe.transform(this.start, 'yyyy-MM-dd');
    // this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    //this.requestparams.month = this.datepipe.transform(this.month, 'yyyy-MM-dd');
    console.log(this.requestparams);
    this.listDetail();
    this.hidedialog();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      // start: this.datepipe.transform(this.start, 'y-MM-dd'),
      // end: this.datepipe.transform(this.end, 'y-MM-dd'),
      month: this.datepipe.transform(this.month, 'y-MM-dd'),
      orgid:''
    };
    // this.start = new Date();
    // this.end = new Date();
  }

  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '机构利润报表.xls',
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

  selectmonth(value) {
    this.requestparams['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }

}
