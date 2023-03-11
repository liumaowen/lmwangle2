import { IsTranslatedPipe } from './../../../dnn/shared/pipe/is-translated.pipe';
import { AllotapiService } from './../allotapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-allot',
  templateUrl: './allot.component.html',
  styleUrls: ['./allot.component.scss']
})
export class AllotComponent implements OnInit {

  gridOptions: GridOptions;

  search = {
    pagenum: 1,
    pagesize: 10000
  };

  constructor(public settings: SettingsService, private allotapi: AllotapiService, private ispipe: IsTranslatedPipe) {
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
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '调拨单号', field: 'billno', minWidth: 90,
        cellRenderer: (params) => {
          if (!params.data) { return null; }
          if (params.data.billno) {
            return '<a target="_blank" href="#/allot/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cuser.realname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建日期', field: 'cdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出人', field: 'vuser.realname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出时间', field: 'vdate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '确认到货人', field: 'cperson.realname', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否到货', field: 'status', minWidth: 80,
        valueGetter: parmas => {
          if (parmas.data['status']) {
            return '是';
          } else if (parmas.data['status']) {
            return '否';
          } else {
            return null;
          }
          // return this.ispipe.transform(parmas.data['status']);
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '到货时间', field: 'arrivedate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出仓库', field: 'expcangku.name', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调入仓库', field: 'impcangku.name', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '总吨位', field: 'tweight', minWidth: 80 }
    ];



  }

  ngOnInit() {
    this.listquery();
  }

  listquery() {
    this.allotapi.list(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

}
