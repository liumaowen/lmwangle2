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
  selector: 'app-bankuailirun',
  templateUrl: './bankuailirun.component.html',
  styleUrls: ['./bankuailirun.component.scss']
})
export class BankuailirunComponent implements OnInit {


  start: Date = new Date();
  y:any = new Date().getFullYear();
  m:any = new Date().getMonth();
  startDate :any = this.datepipe.transform(new Date(this.y,this.m,1),'y-MM-dd');

  end: Date = new Date();

  maxDate: Date = new Date();
  month:Date = new Date();

  requestparams =
    {
      // start: this.startDate,
      // end: this.datepipe.transform(this.end, 'y-MM-dd'),
      month: this.datepipe.transform(this.month, 'y-MM-dd'),
      bankuai:''
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
      { cellStyle: { 'text-align': 'center' }, headerName: '大类', field: 'gn', width: 120 ,
      cellRenderer: (params) => {
        if (params.data) {
          return params.data['gn'];
        } else {
          return '合计';
        }
      }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市场调货利润（含税）', field: 'tihuolirun', width: 160,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['tihuolirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '非市场调货利润（含税）', field: 'feitiaohuolirun', width: 170,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['feitiaohuolirun']);
        } else {
          return '';
        }
      }, 
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '低于指导价（含税）', field: 'dzhidaojialirun', width: 150,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['dzhidaojialirun']);
        } else {
          return '';
        }
      },
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备货利润（含税）', field: 'beihuolirun', width: 150,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '总毛利', field: 'zmaoli', width: 150,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['zmaoli']);
        } else {
          return '';
        }
      },
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源可分配', field: 'ziyuanfp', width: 170,
      aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['ziyuanfp']);
        } else {
          return '';
        }
      },
      valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '板块', field: 'bankuai', width: 150 },
      
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
    this.reportService.bankuailirun(this.requestparams).then((response) => {
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
    bankuai = [{ label: '请选择板块', value: '' }, { label: '资源中心', value: 1 }];

  companys;
  // 查询
  query() {
    // this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    // this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    // this.requestparams.month = this.datepipe.transform(this.month, 'y-MM-dd');
    console.log(this.requestparams);
    this.listDetail();
    this.hidedialog();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      month: this.datepipe.transform(this.month, 'y-MM-dd'),
      // start: this.datepipe.transform(this.start, 'y-MM-dd'),
      // end: this.datepipe.transform(this.end, 'y-MM-dd'),
      bankuai:''
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
      fileName: '板块利润报表.xls',
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
