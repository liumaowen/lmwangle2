import { ReportService } from '../../report/report.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-customerchange',
  templateUrl: './customerchange.component.html',
  styleUrls: ['./customerchange.component.scss']
})
export class CustomerchangeComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions; 


  parent;
  
  requestparams = {};

  saleuser;

  start;

  end;

  endmax = new Date();

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private reportApi: ReportService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      localeText: this.settings.LOCALETEXT,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '名称', field: 'NAME', width: 250 },
      { cellStyle: { 'text-align': 'center' }, headerName: '原机构', field: 'beforeorg', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '原业务员', field: 'beforeuser', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未购买天数', field: 'daydiff', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '现机构', field: 'afterorg', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '现业务员', field: 'afteruser', width: 150 },
      {cellStyle: { 'text-align': 'center' }, headerName: '是否线上', field: 'isonline', width: 150},
      { cellStyle: { 'text-align': 'center' }, headerName: '是否共享', field: 'isshare', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '变更日期', field: 'vdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'changestatus', width: 150 }      
    ];
  }

  ngOnInit() {
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
      fileName: '客户信息.csv',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  // 清空
  selectNull() {
    this.requestparams = {};
    this.saleuser = undefined;
    this.start = undefined;
    this.end = undefined;
  }
  // 查询
  query() {
    if (this.start) {
      this.requestparams['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    }
    if (this.end) {
      this.requestparams['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }
    this.reportApi.customerchange(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
      this.hideclassicModal();
    });
  }
}
