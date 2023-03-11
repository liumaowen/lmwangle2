import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SellproService } from '../sellpro.service';

@Component({
  selector: 'app-daylogdiff',
  templateUrl: './daylogdiff.component.html',
  styleUrls: ['./daylogdiff.component.scss']
})
export class DaylogdiffComponent implements OnInit {
  private gridApi1;
  private gridApi2;
  chijiaogridOptions: GridOptions;
  notijiaogridOptions: GridOptions;
  search: any = {};
  chijiaocolumnDefs: any = [];
  notijiaocolumnDefs: any = [];
  col = { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'username', minWidth: 100};
  @ViewChild('classicModal') private classicModal: ModalDirective;
  model: any = {};
  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private sellproApi: SellproService,
    private datepipe: DatePipe) {

    this.chijiaogridOptions = {
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
      animateRows: true,
    };
    this.chijiaogridOptions.onGridReady = this.settings.onGridReady;
    this.chijiaogridOptions.groupSuppressAutoColumn = true;
    this.chijiaogridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '板块', field: 'centerorg', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'username', minWidth: 100}
    ];
    this.notijiaogridOptions = {
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
      animateRows: true,
    };
    this.notijiaogridOptions.onGridReady = this.settings.onGridReady;
    this.notijiaogridOptions.groupSuppressAutoColumn = true;
    this.notijiaogridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '板块', field: 'centerorg', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'username', minWidth: 100}
    ];
  }

  ngOnInit() {
    this.chijiaocolumnDefs = this.chijiaogridOptions.columnDefs;
    this.notijiaocolumnDefs = this.notijiaogridOptions.columnDefs;
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectNull() {
    this.search = {
      month: ''
    };
  }
  querylist() {
    if (!this.search['month']) {
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    this.sellproApi.getdifflist(this.search).then(data => {
      const chijiaomax = data['chijiaomax'];
      const chijiaolist = data['chijiaolist'];
      const notijiaomax = data['notijiaomax'];
      const notijiaolist = data['notijiaolist'];
      this.model = data;
      const originalchijiaocol = JSON.parse(JSON.stringify(this.chijiaocolumnDefs));
      const originalnotijiaocol = JSON.parse(JSON.stringify(this.chijiaocolumnDefs));
      const colyuanshi = this.col;
      if (chijiaomax > 0) {
        for (let i = 0; i < chijiaomax; i++) {
          const col = JSON.parse(JSON.stringify(colyuanshi));
          col['headerName'] = '第' + (i + 1) + '次迟交';
          col['field'] = 'chijiaoworkdate' + (i + 1);
          originalchijiaocol.push(col);
        }
        this.chijiaogridOptions.columnDefs = originalchijiaocol;
      }
      if (notijiaomax > 0) {
        for (let i = 0; i < notijiaomax; i++) {
          const col = JSON.parse(JSON.stringify(colyuanshi));
          col['headerName'] = '第' + (i + 1) + '次未提交';
          col['field'] = 'notijiaoworkdate' + (i + 1);
          originalnotijiaocol.push(col);
        }
        this.notijiaogridOptions.columnDefs = originalnotijiaocol;
      }
      this.gridApi1.setColumnDefs(this.chijiaogridOptions.columnDefs);
      this.gridApi2.setColumnDefs(this.notijiaogridOptions.columnDefs);
      this.chijiaogridOptions.api.setRowData(chijiaolist);
      this.notijiaogridOptions.api.setRowData(notijiaolist);
      this.chijiaogridOptions.columnApi.autoSizeAllColumns();
      this.notijiaogridOptions.columnApi.autoSizeAllColumns();
      this.coles();
    });
  }
  showDialog() {
    this.selectNull();
    this.classicModal.show();
  }
  // 关闭弹窗
  coles() {
    this.classicModal.hide();
  }
  onGridReady1(params) {
    this.gridApi1 = params.api;
    params.api.sizeColumnsToFit();
  }
  onGridReady2(params) {
    this.gridApi2 = params.api;
    params.api.sizeColumnsToFit();
  }
}
