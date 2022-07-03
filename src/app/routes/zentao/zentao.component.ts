import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../core/settings/settings.service';
import { ZentaoService } from './zentao.service';

@Component({
  selector: 'app-zentao',
  templateUrl: './zentao.component.html',
  styleUrls: ['./zentao.component.scss']
})
export class ZentaoComponent implements OnInit {
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date  = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();

  // aggird表格原型
  gridOptions: GridOptions;
  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  // 查询条件对象
  search = {begin: '', end: ''};
  constructor(public settings: SettingsService, private datepipe: DatePipe, private toasterService: ToasterService,
    private service: ZentaoService) {
    // aggird实例对象
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
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'ZTP_NAME', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开始时间', field: 'ZTP_BEGIN', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '结束时间', field: 'ZTP_END', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '项目负责人', field: 'ZTP_PM', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '任务数量', field: 'ZTT_SUM', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '任务名称', field: 'ZTT_NAME', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '执行人', field: 'ZTT_USER', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '工时', field: 'ZTTM_CONSUMED', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '描述', field: 'ZTTM_WORK', minWidth: 250 },
      { cellStyle: { 'text-align': 'center' }, headerName: '记录时间', field: 'ZTTM_DATE', minWidth: 90 }
    ];
  }

  ngOnInit() {
  }
  showDialog() {
    this.search = {begin: '', end: ''};
    this.classicModel.show();
  }
  closeclassicmodal() {
    this.classicModel.hide();
  }
  query() {
    this.search['begin'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    this.service.query(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.closeclassicmodal();
    });
  }
  // 导出
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      allColumns: false,
      onlySelected: false,
      columnGroups: true,
      skipGroups: true,
      suppressQuotes: false,
      fileName: '禅道.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
