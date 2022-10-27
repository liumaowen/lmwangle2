import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'app/core/settings/settings.service';
import { QihuoService } from '../../qihuo.service';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid';
import { ModalDirective } from 'ngx-bootstrap';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-gongchengdetail',
  templateUrl: './gongchengdetail.component.html',
  styleUrls: ['./gongchengdetail.component.scss']
})
export class GongchengdetailComponent implements OnInit {
  gridOptions: GridOptions;
  search: any = { start: null, end: null, buyerid: '' };
  qihuodetids = new Array();
  current = this.storage.getObject('cuser');

  @ViewChild('setfinishdesc') private setfinishdesc: ModalDirective;
  @ViewChild('searchdialog') private searchdialog: ModalDirective;
  // 开始时间
  start = new Date(); // 设定页面开始时间默认值
  end = new Date();
  maxDate = new Date();
  constructor(public settings: SettingsService, private datepipe: DatePipe, private qhuoApi: QihuoService, private toast: ToasterService,private storage: StorageService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      //rowDeselection: true,
      rowSelection: 'multiple', // 多选单选控制
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      // { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 60, suppressMenu: true, checkboxSelection: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同编号', field: 'billno', minWidth: 60, cellRenderer: (params) => {
          if (params.data && null != params.data.orderid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.billno + '</a>';
          }
          return '';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '签单月份', field: 'ordercdate', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构名称', field: 'orgname', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '项目名称', field: 'projectname', minWidth: 60
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '所属行业', field: 'categoryname', minWidth: 60
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '地区', field: 'jiaohuoaddr', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订货量', field: 'dinghuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['dinghuoweight']) {
            return Number(params.data['dinghuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      }
    ];
  }

  ngOnInit() {
  }

  //获取数据
  listDetail() {
    this.qhuoApi.gongchengdetail(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  openquery() {
    this.searchdialog.show();
  }
  closequery() {
    this.searchdialog.hide();
  }
  select() {
    this.search['salemanid']=this.current.id;
    this.search['orgid']=this.current.orgid;
    if (!this.start) {
      this.toast.pop('warning', '请填写开始时间');
      return;
    }
    if (!this.end) {
      this.toast.pop('warning', '请填写结束时间');
      return;
    }
    if (this.search['buyerid']) {
      this.search['buyerid'] = this.search['buyerid']['code'];
    }
    // if (this.search['salemanid']) {
    //   this.search['salemanid'] = this.search['salemanid']['code'];
    // }
    this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    console.log(this.search);
    this.listDetail();
    this.closequery();
  }

}
