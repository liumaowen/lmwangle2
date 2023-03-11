import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-jsbuchadetails',
  templateUrl: './jsbuchadetails.component.html',
  styleUrls: ['./jsbuchadetails.component.scss']
})
export class JsbuchadetailsComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  gridOptions: GridOptions;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  // 结束时间
  end: null;
  types: any[];
  search: object = { start: '', end: '', orgid: '', sorgid: '', type: '', cuserid: '' };
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private datepipe: DatePipe,
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
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/jsbucha/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'type', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供货机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品大类', field: 'gnname', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据状态', field: 'status', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 80 },
    ];
  }

  ngOnInit() {
  }
  querydata() {
    this.caigouApi.findjsbuchadetils(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  selectNull() {
    this.search = { start: '', end: '', orgid: '', sorgid: '', cuserid: '', type: '' };
  }
  showDialog() {
    this.start = null;
    this.end = null;
    this.search = { start: '', end: '', orgid: '', sorgid: '', cuserid: '', type: '' };
    this.types = [{ id: '', text: '' }, { id: '1', text: '退补' }, { id: '2', text: '质量异议' }, { id: '3', text: '其他' }];
    this.classicModal.show();
  }
  hideDialog() {
    this.classicModal.hide();
  }

  selected(value) {
    this.search['type'] = value.id;
  }

  selectstart() { }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['orgid'] instanceof Object) {
      this.search['orgid'] = this.search['orgid'].code;
    }
    if (this.search['sorgid'] instanceof Object) {
      this.search['sorgid'] = this.search['sorgid'].code;
    }
    console.log(this.search);
    this.querydata();
    this.hideDialog();
  }
}
