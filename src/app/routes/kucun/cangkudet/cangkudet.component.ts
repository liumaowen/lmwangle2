import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { KucunService } from './../kucun.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cangkudet',
  templateUrl: './cangkudet.component.html',
  styleUrls: ['./cangkudet.component.scss']
})
export class CangkudetComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  filterConditionObj = {};
  gridOptions: GridOptions;
  search: Object= {name: ''};
  constructor(private kucunApi: KucunService, public settings: SettingsService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库性质', field: 'type', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'name', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货时间', field: 'tihuotime', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '出库费', field: 'chukufee', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储费', field: 'storagefeejine', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '支付方式', field: 'paytype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '区/县', field: 'countryname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否加工', field: 'isproduce', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否允许转货', field: 'zhuanhuo', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '地址', field: 'address', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系方式', field: 'contactway', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否协议库', field: 'xieyi', minWidth: 100 },
      //{ cellStyle: { 'text-align': 'center' }, headerName: '是否签订协议', field: 'signxieyi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '负责人', field: 'user', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '特殊提醒', field: 'warn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 80 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '关联公司', field: 'customername', minWidth: 90 ,
        cellRenderer: (params) => {
        if (params.data && null != params.data.customername) {
              return '<a target="_blank" href="#/customer/' + params.data.customerid + '/certmanagement">' + params.data.customername + '</a>';
         }
         return '';
        },
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '合作期限', field: 'hezuodate', minWidth: 90 ,colId: 'hezuodate'},
    ];
    this.getMyRole();
  }

  ngOnInit() {
  }

  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
    // 如果登陆的用户不是物流员，资源内勤，销售内勤，设置为不可见
    if (!myrole.some(item => item === 9 || item === 1 || item === 53 || item === 54)) {
      if (colde.colId === 'hezuodate' ) {
        colde.hide = true;
        colde.suppressToolPanel = true;
      }
    }
  });
  }
  
  openquery() {
    this.classicModal.show();
  }
  query() {
    this.kucunApi.cangkudet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }
  close() {
    this.classicModal.hide();
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '仓库明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
