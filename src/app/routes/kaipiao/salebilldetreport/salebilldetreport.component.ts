import { ReportService } from './../../report/report.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { OrderapiService } from './../../order/orderapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-salebilldetreport',
  templateUrl: './salebilldetreport.component.html',
  styleUrls: ['./salebilldetreport.component.scss']
})
export class SalebilldetreportComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;

  start;

  end;

  vstart;

  vend;

  msg;


  maxDate = new Date();

  requestparams = {
    billgn: '',
    orgid: '',
    cuserid: '',
    billno: '',
    start: '',
    end: '',
    buyerid: '',
    status: '',
    sellid: '',
    vuserid: '',
    vstart: '',
    vend: ''
  };

  gridOptions: GridOptions;
  dgridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private customerApi: CustomerapiService,
    private reportApi: ReportService,
    private orderApi: OrderapiService,
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
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', width: 130 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/salebill/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开票品名', field: 'billgn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格/型号', field: 'guige', width: 93 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单位', field: 'unit', width: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '数量', field: 'tweight', width: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['tweight']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价（含税）', field: 'price', width: 110,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额（含税）', field: 'jine', width: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'realname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '快递单号', field: 'expressno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否到付', field: 'ispay', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '快递公司', field: 'express', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'invoiceno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开票日期', field: 'invoicedate', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '邮寄地址', field: 'maddress', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预邮寄日期', field: 'yexpressdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收票人', field: 'shoujianren', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收件人电话', field: 'shoujiantel', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'sellername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'type', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '税率', field: 'taxrate', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方税号', field: 'buyertax', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 150 },
    ];
    // 快递信息
    this.dgridOptions = {
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
    this.dgridOptions.groupSuppressAutoColumn = true;
    this.dgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收件人', field: 'shoujianren', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '固话', field: '', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '手机', field: 'shoujiantel', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省份', field: 'province', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '城市', field: 'city', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '县区', field: 'county', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '地址', field: 'maddress', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发货信息', field: 'sellername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'buyername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否返单（是/否）', field: '', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '登记单备注', field: 'beizhu', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号', field: 'invoiceno', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '快递公司', field: 'express', width: 100 }
    ];
  }

  cuser;

  vuser;

  companys;

  // 定义发票品名
  billgns = [{ label: '全部', value: '' },
  { label: '镀锌板', value: '镀锌板' },
  { label: '热镀锌卷', value: '热镀锌卷' },
  { label: '镀锌卷', value: '镀锌卷' },
  { label: '镀锌钢板', value: '镀锌钢板' },
  { label: '彩涂卷', value: '彩涂卷' },
  { label: '彩涂板', value: '彩涂板' },
  { label: '彩钢卷', value: '彩钢卷' },
  { label: '彩钢板', value: '彩钢板' },
  { label: '镀铝锌光板', value: '镀铝锌光板' },
  { label: '镀铝锌板', value: '镀铝锌板' },
  { label: '镀铝锌卷', value: '镀铝锌卷' }];

  // 定义发票状态
  statuss = [{ label: '全部', value: '' },
  { label: '开票中', value: '1' },
  { label: '已审核', value: '3' },
  { label: '已邮寄', value: '2' }];

  sellers;

  // 打开查询对话框
  openQueryDialog() {

    this.selectNull();
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ label: '全部', value: '' }];
      data.forEach(element => {
        sellerlist.push({
          label: element.name,
          value: element.id
        });
      });
      this.sellers = sellerlist;
    });
    this.showclassicModal();
  }

  // 查询发票
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    } else {
      this.requestparams.start = '';
    }
    if (this.end) {
      this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    } else {
      this.requestparams.end = '';
    }
    if (this.vstart) {
      this.requestparams.vstart = this.datePipe.transform(this.vstart, 'yyyy-MM-dd');
    } else {
      this.requestparams.vstart = '';
    }
    if (this.vend) {
      this.requestparams.vend = this.datePipe.transform(this.vend, 'yyyy-MM-dd');
    } else {
      this.requestparams.vend = '';
    }
    if (typeof (this.cuser) === 'object') {
      this.requestparams.cuserid = this.cuser['code'];
    } else {
      this.requestparams.cuserid = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.requestparams.vuserid = this.vuser['code'];
    } else {
      this.requestparams.vuserid = '';
    }
    if (typeof (this.companys) === 'object') {
      this.requestparams.buyerid = this.companys['code'];
    } else {
      this.requestparams.buyerid = '';
    }
    console.log(this.requestparams);
    // 设定运行查询，再清除页面data变量
    this.listDetail();

    this.hideclassicModal();
  }

  listDetail() {
    this.reportApi.salebilldet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
      this.dgridOptions.api.setRowData(response);
      const total = response.length;
      this.msg = ' 共' + total + '件 ';
    });
  }

  selectNull() {
    this.cuser = undefined;
    this.vuser = undefined;
    this.companys = undefined;
    this.start = undefined;
    this.end = undefined;
    this.vstart = undefined;
    this.vend = undefined;
    this.requestparams = {
      billgn: '',
      orgid: '',
      cuserid: '',
      billno: '',
      start: '',
      end: '',
      buyerid: '',
      status: '',
      sellid: '',
      vuserid: '',
      vstart: '',
      vend: ''
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
      fileName: '发票明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  // 导出入库单明细表
  dagExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '邮寄信息表.xls',
      columnSeparator: ''
    };
    this.dgridOptions.api.exportDataAsExcel(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  importMailingData() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    } else {
      this.requestparams.start = '';
    }
    if (this.end) {
      this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    } else {
      this.requestparams.end = '';
    }
    if (this.vstart) {
      this.requestparams.vstart = this.datePipe.transform(this.vstart, 'yyyy-MM-dd');
    } else {
      this.requestparams.vstart = '';
    }
    if (this.vend) {
      this.requestparams.vend = this.datePipe.transform(this.vend, 'yyyy-MM-dd');
    } else {
      this.requestparams.vend = '';
    }
    if (typeof (this.cuser) === 'object') {
      this.requestparams.cuserid = this.cuser['code'];
    } else {
      this.requestparams.cuserid = '';
    }
    if (typeof (this.vuser) === 'object') {
      this.requestparams.vuserid = this.vuser['code'];
    } else {
      this.requestparams.vuserid = '';
    }
    if (typeof (this.companys) === 'object') {
      this.requestparams.buyerid = this.companys['code'];
    } else {
      this.requestparams.buyerid = '';
    }
    this.orderApi.importMailingData(this.requestparams).then((response) => {
      window.open(response['url']);
    });
    this.hideclassicModal();
  }

  // 上传快递信息
  showUploaderModel() {
    this.uploaderModel.show();
  }
  hideUploaderModel(){
    this.uploaderModel.hide();
  }
  // 上传参数
  uploadParam: any = { module: 'addmailingdata', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = ".xls, application/xls";
  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.orderApi.addMailingData(addData).then(data => {
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.listDetail();
    this.hideUploaderModel();
  }

}
