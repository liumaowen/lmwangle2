import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { XiaoshouapiService } from '../xiaoshouapi.service';


@Component({
  selector: 'app-releasedet',
  templateUrl: './releasedet.component.html',
  styleUrls: ['./releasedet.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ReleasedetComponent implements OnInit {
  private gridApi;
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  search: any = {
    start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: this.datepipe.transform(this.end, 'y-MM-dd')
  };
  // aggird表格原型
  gridOptions: GridOptions;
  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  constructor(public settings: SettingsService, private xiaoshouapiService: XiaoshouapiService,
    private datepipe: DatePipe) {
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
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '释放日期', field: 'rdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同编号', field: 'orderbillno', minWidth: 100,
      cellRenderer: function (params) {
        if (params.data && params.data.orderbillno) {
          if (params.data.orderbillno.substring(0, 2) === 'QH') {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
          } else if (params.data.orderbillno.substring(0, 2) === 'BO') {
            return '<a target="_blank" href="#/businessorder/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
          } else {
            return '<a target="_blank" href="#/order/' + params.data.orderbillid + '">' + params.data.orderbillno + '</a>';
          }
        } else {
          return '';
        }
      }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '释放原因', field: 'reason', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'rukudate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核状态', field: 'statusname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起息日', field: 'startdate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计息天数', field: 'days', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资金占用利息', field: 'zijinlixi', minWidth: 100 },
    ];
  }

  ngOnInit() {
    this.getlist();
  }
  getlist() {
    this.xiaoshouapiService.releaselist(this.search).then(data => {
      this.classicModel.hide();
      this.gridOptions.api.setRowData(data);
    });
  }
  selectNull() {
    this.search = {
      start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd')
    };
    this.start = new Date();
    this.end = new Date();
  }
  showDialog() {
    this.selectNull();
    this.classicModel.show();
  }
  // 关闭弹窗
  coles() {
    this.classicModel.hide();
  }
  querylist() {
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    this.search.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.getlist();
    this.classicModel.hide();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
}
