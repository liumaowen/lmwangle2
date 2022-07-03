import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { KucunService } from '../kucun.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tudufenxi',
  templateUrl: './tudufenxi.component.html',
  styleUrls: ['./tudufenxi.component.scss']
})
export class TudufenxiComponent implements OnInit {

  search: any = {};
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private kucunapi: KucunService, private datepipe: DatePipe) {
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
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', minWidth: 80, field: 'gn' },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', minWidth: 80, field: 'chandi' },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', minWidth: 80, field: 'houdu' },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', minWidth: 80, field: 'width' },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', minWidth: 80, field: 'color' },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', minWidth: 80, field: 'duceng' },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', minWidth: 80, field: 'caizhi' },
      { cellStyle: { 'text-align': 'center' }, headerName: '区域', minWidth: 80, field: 'areaname' },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存量', minWidth: 80, field: 'kucunweight' },
      { cellStyle: { 'text-align': 'center' }, headerName: '未产量', minWidth: 80, field: 'weichanweight' },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售量', minWidth: 80, field: 'saleweight' }
    ];
    this.listDetail();
  }
  ngOnInit() {
  }
  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.kucunapi.dinghuoFenxi(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

}
