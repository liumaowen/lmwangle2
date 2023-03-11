import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { ModalDirective } from 'ngx-bootstrap';
import { BusinessorderapiService } from './../businessorderapi.service';

@Component({
  selector: 'app-overdraftreport',
  templateUrl: './overdraftreport.component.html',
  styleUrls: ['./overdraftreport.component.scss']
})
export class OverdraftreportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  progress = { riqi: '' };
  constructor(public settings: SettingsService, private datepipe: DatePipe, private toast: ToasterService,
    private businessorderApi: BusinessorderapiService) {
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
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'riqi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计算单位', field: 'customer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '公司', field: 'wcustomer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '超期一个月', field: 'qixian', width: 100 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '欠款金额', field: 'jine', width: 100 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '利率', field: 'rate', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', width: 60 },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '利息', field: 'lixi', width: 90 ,
         valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodsmsg', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品类别', field: 'gntype', width: 90 }
    ];
  }

  ngOnInit() {
  }
  openQueryDialog() {
    this.progress = { riqi: '' };
    this.classicModal.show();
  }
  selectmonth(value) {
    this.progress['riqi'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  query() {
    if (this.progress['riqi'] === '') {
      this.toast.pop('warning', '请选择月份！');
      return;
    }
    this.businessorderApi.queryoverdraftprogress(this.progress).then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data); // 网格赋值
      this.closeq();
    });
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
      fileName: '欠款利息表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  closeq() {
    this.classicModal.hide();
  }
}
