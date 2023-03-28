import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { XmdoverdraftdetreportService } from './xmdoverdraftdetreport.service';

@Component({
  selector: 'app-xmdoverdraftdetreport',
  templateUrl: './xmdoverdraftdetreport.component.html',
  styleUrls: ['./xmdoverdraftdetreport.component.scss']
})
export class XmdoverdraftdetreportComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  vdatestart;
  vdateend;
  sedatestart;
  sedateend;
  cdatestart;
  cdateend;

  msg;
  maxDate = new Date();
  requestparams: any = {
    vdatestart: '',
    vdateend: '',
    sedatestart: '',
    sedateend: '',
    cdatestart: '',
    cdateend: '',
    orgid: '',
    customerid: '',
    salemanid: '',
    cuserid: '',
    billno: '',
    status: ''
  };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private OverdraftdetreportApi: XmdoverdraftdetreportService) {

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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data && null != params.data.id) {
            return '<a target="_blank" href="#/overdraft/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户单位', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'wcustomername', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '欠款金额', field: 'tjine', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['tjine']) {
            return Number(params.data['tjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已还金额', field: 'yijine', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['yijine']) {
            return Number(params.data['yijine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未还金额', field: 'weijine', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['weijine']) {
            return Number(params.data['weijine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '待审还款', field: 'hjine', width: 100,
        aggFunc: 'sum', valueGetter: (params) => {
          if (params.data && params.data['hjine']) {
            return Number(params.data['hjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '欠款日期', field: 'vdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预计还款日期', field: 'yedate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际还款日期', field: 'sedate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '超期天数', field: 'days', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodsmsg', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品类别', field: 'gntype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'reason', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款类型', field: 'paytype', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据状态', field: 'status', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '欠款分类', field: 'qiankuantype', width: 150 }
    ];
  }

  cuser;

  vuser;

  companys;
  // 定义状态
  statuss = [{ label: '全部', value: '' },
  { label: '已还款', value: '1' },
  { label: '未还款', value: '2' },
  { label: '作废', value: '3' }];


  buyers;

  // 打开查询对话框
  openQueryDialog() {
    this.selectNull();
    this.showclassicModal();
  }

  // 查询发票
  query() {
    if (this.vdatestart) {
      this.requestparams.vdatestart = this.datePipe.transform(this.vdatestart, 'yyyy-MM-dd');
    } else {
      this.requestparams.vdatestart = '';
    }
    if (this.vdateend) {
      this.requestparams.vdateend = this.datePipe.transform(this.vdateend, 'yyyy-MM-dd');
    } else {
      this.requestparams.vdateend = '';
    }

    if (this.sedatestart) {
      this.requestparams.sedatestart = this.datePipe.transform(this.sedatestart, 'yyyy-MM-dd');
    } else {
      this.requestparams.sedatestart = '';
    }
    if (this.sedateend) {
      this.requestparams.sedateend = this.datePipe.transform(this.sedateend, 'yyyy-MM-dd');
    } else {
      this.requestparams.sedateend = '';
    }

    if (this.cdatestart) {
      this.requestparams.cdatestart = this.datePipe.transform(this.cdatestart, 'yyyy-MM-dd');
    } else {
      this.requestparams.cdatestart = '';
    }
    if (this.cdateend) {
      this.requestparams.cdateend = this.datePipe.transform(this.cdateend, 'yyyy-MM-dd');
    } else {
      this.requestparams.cdateend = '';
    }

    if (this.requestparams['salemanid'] instanceof Object) {
      this.requestparams['salemanid'] = this.requestparams['salemanid'].code;
    }
    if (this.requestparams['customerid'] instanceof Object) {
      this.requestparams['customerid'] = this.requestparams['customerid'].code;
    }
    // 设定运行查询，再清除页面data变量
    this.listDetail();
    this.hideclassicModal();
  }

  listDetail() {
    this.OverdraftdetreportApi.det(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
      const total = response.length;
      this.msg = ' 共' + total + '件 ';
    });
  }

  selectNull() {
    this.vdatestart = null;
    this.vdateend = null;
    this.sedatestart = null;
    this.sedateend = null;
    this.cdatestart = null;
    this.cdateend = null;
    this.requestparams = {
      vdatestart: '',
      vdateend: '',
      sedatestart: '',
      sedateend: '',
      cdatestart: '',
      cdateend: '',
      orgid: '',
      customerid: '',
      salemanid: '',
      cuserid: '',
      billno: '',
      status: ''
    };
  }

  ngOnInit() {
  }

  // 导出入库单明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '新美达欠款明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

}
