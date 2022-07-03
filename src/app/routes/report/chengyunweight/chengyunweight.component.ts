import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chengyunweight',
  templateUrl: './chengyunweight.component.html',
  styleUrls: ['./chengyunweight.component.scss']
})
export class ChengyunweightComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  model: any = {};
  requestparams: any = {};
  gridOptions: GridOptions;
  isopen = false;
  start = new Date();
  end: Date;
  constructor(public settings: SettingsService,
    private reportService: ReportService,
    private datepipe: DatePipe) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100,
      valueGetter: (params) => {
        if (params.data) {
          return params.data['orgname'];
        } else {
          return '合计';
        }
      },
      valueFormatter: this.settings.valueFormatter },
      { cellStyle: { 'text-align': 'center' }, headerName: '1月份', field: 'month1', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month1']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '2月份', field: 'month2', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month2']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '3月份', field: 'month3', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month3']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '4月份', field: 'month4', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month4']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '5月份', field: 'month5', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month5']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '6月份', field: 'month6', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month6']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '7月份', field: 'month7', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month7']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '8月份', field: 'month8', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month8']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '9月份', field: 'month9', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month9']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '10月份', field: 'month10', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month10']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '11月份', field: 'month11', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month11']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '12月份', field: 'month12', minWidth: 100,
      aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['month12']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    if (this.start) {
      this.requestparams['year'] = this.datepipe.transform(this.start, 'y');
    }
    this.reportService.getchengyunweight(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }

  selectNull() {
    this.start = new Date();
    this.requestparams = {};
  }

  // 查询
  query() {
    this.listDetail();
    this.hideclassicModal();
  }
  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '物流运输承运量统计表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  selectyear(event: Date) {
    this.start = event;
  }
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
}
