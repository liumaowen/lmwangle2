import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ReportService } from 'app/routes/report/report.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { DatePipe } from '@angular/common';
import { XiaoshouapiService } from '../xiaoshouapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-yanqitihuo',
  templateUrl: './yanqitihuo.component.html',
  styleUrls: ['./yanqitihuo.component.scss']
})
export class YanqitihuoComponent2 implements OnInit {
  names:any;
  flags:any;
  requestparams = {start: '', end: ''};
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private yanqitihuoApi: XiaoshouapiService, private customerApi: CustomerapiService, private orgApi: OrgApiService, private classifyApi: ClassifyApiService, private reportApi: ReportService, private toast: ToasterService, private datepipe: DatePipe) {
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
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      { cellStyle: { 'text-align': 'center' }, headerName: '提单创建日期', field: 'tihuocdate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '期货单号', field: 'qihuobillno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'kehutype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金比例', field: 'shijirate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月利率', field: 'monthrate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库龄', field: 'kuling', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', minWidth: 60},
      { cellStyle: { 'text-align': 'center' }, headerName: '资金利息', field: 'zijinlixi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同月份', field: 'salemonth', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同金额', field: 'htjine', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金', field: 'shijidingjin', minWidth: 70 }
    ];

    this.listDetail();
  }


  ngOnInit() {
  }

  listDetail() {
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    if (this.end) this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.yanqitihuoApi.yanqitihuo(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  openQueryDialog() {
    this.names = [{ label: '全部', value: '' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }, { value: 3, label: '已作废' }];
    this.flags = [{ label: '全部', value: '' }, { value: false, label: '线下' }, { value: true, label: '线上' }];
    this.showDialog();
  }

  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 打开查询弹窗
  showDialog() {
    this.classicModal.show();
  }

  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  start: Date = new Date();
  end: Date;
  // 查询
  query() {
    if (!this.start) {
      this.toast.pop('warning', '开始时间必须填写！');
      return;
    } else {
      this.listDetail();
      this.hideDialog();
    }
  }
  // 重置
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.requestparams = { start: '', end: ''};
  }
 
}
