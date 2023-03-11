import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DingdingService } from '../dingding.service';
import { DatePipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-summarytudutriplog',
  templateUrl: './summarytudutriplog.component.html',
  styleUrls: ['./summarytudutriplog.component.scss']
})
export class SummaryTudutriplogComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  requestparams: any = {};
  month: Date;
  user: any;
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private dingdingService: DingdingService,
    private orgApi: OrgApiService,
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '填报人', field: 'username', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'orgname', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份 ', field: 'month', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出差天数', field: 'sumdays', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效出差天数', field: 'sumvaliddays', minWidth: 120 },
    ];
  }

  ngOnInit() {
  }

  find() {
    this.dingdingService.summaryFind(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

  openQueryDialog() {
    this.selectNull();
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  selectNull() {
    this.user = null;
    this.requestparams = [];
  }

  // 查询
  query() {
    if (typeof (this.user) === 'string' || !this.user) {
      this.requestparams.userid = '';
    } else if (typeof (this.user) === 'object') {
      this.requestparams.userid = this.user['code'];
    }
    this.find();
    this.hideclassicModal();
  }

  selectmonth(value) {
    let month = this.datePipe.transform(value, 'y-MM-dd');
    this.requestparams['month'] = month;
    console.log(this.requestparams);
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
      fileName: '涂镀工作日报/出差日志提交记录汇总.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

}
