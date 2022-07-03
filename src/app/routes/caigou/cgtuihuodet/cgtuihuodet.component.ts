import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ToasterService} from 'angular2-toaster/angular2-toaster';
import { CaigouService } from '../caigou.service';
import { ActivatedRoute, Router } from '@angular/router';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-cgtuihuodet',
  templateUrl: './cgtuihuodet.component.html',
  styleUrls: ['./cgtuihuodet.component.scss']
})
export class CgtuihuodetComponent implements OnInit {

  cgtuihuo: Object = {supplier: '',org:{}};
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private toast: ToasterService, private caigouApi: CaigouService,
              private actroute: ActivatedRoute) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 100,
        valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '采购金额', field: 'jine', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 100,
        valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'goodscode.width', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'goodscode.color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 100 }
    ];
    this.getcgtuihuo();
  }

  ngOnInit() {
  }
  getcgtuihuo() {
    this.caigouApi.cgtuihuo(this.actroute.params['value']['id']).then(data => {
      this.cgtuihuo = data.cgtuihuo;
      console.log(data);
      console.log(this.cgtuihuo);
      console.log(data.list);
      this.gridOptions.api.setRowData(data.list);
    });
  }
  verify() {
    this.caigouApi.verifytuihuo(this.actroute.params['value']['id']).then(data => {
      this.getcgtuihuo();
    });
  }
}
