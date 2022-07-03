import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderapiService } from '../orderapi.service';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';

@Component({
  selector: 'app-qihuodaiyundet',
  templateUrl: './qihuodaiyundet.component.html',
  styleUrls: ['./qihuodaiyundet.component.scss']
})
export class QihuodaiyundetComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  start = new Date();
  end: Date;
  maxDate = new Date();
  companys = {};
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '', buyerid: '', salemanid: '', billno: ''
  };
  gridOptions: GridOptions;
  saleman: any = {};
  selectQihuodetWuliubaojia: any = [];
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  // 引入弹窗模型
  bsModalRef: BsModalRef;
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private orderApi: OrderapiService,
    private toast: ToasterService,
    private modalService: BsModalService) {
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
      rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group'
        ,
        minWidth: 60, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'billstatus', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户', field: 'buyername', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', minWidth: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startaddr', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'countyname', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'enddest', minWidth: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60},
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已报价量', field: 'ybaojiaweight', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否报价', field: 'iswuliuorder', minWidth: 80 }
    ];
  }
  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.orderApi.getqihuodaiyundet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }
  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', buyerid: '', salemanid: '', billno: ''
    };
    this.end = undefined;
    this.start = new Date();
    this.saleman = null;
    this.companys = null;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.saleman) === 'string' || !this.saleman) {
        this.requestparams['salemanid'] = '';
      } else if (typeof (this.saleman) === 'object') {
        this.requestparams.salemanid = this.saleman['code'];
      }
      if (typeof (this.companys) === 'string' || !this.companys) {
        this.requestparams['buyerid'] = '';
      } else if (typeof (this.companys) === 'object' && this.companys['code']) {
        this.requestparams['buyerid'] = this.companys['code'];
      }
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
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
      fileName: '期货代运汇总表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  /**通知专员报价弹窗 */
  showbaojiamodal() {
    const qihuodetids = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        qihuodetids.push(orderdetSelected[i].data.qihuodetid);
        this.selectQihuodetWuliubaojia.push({
          id: orderdetSelected[i].data.qihuodetid,
          guige: orderdetSelected[i].data['guige'], weight: orderdetSelected[i].data['weight'],
          baojialiang: orderdetSelected[i].data['weight'] - orderdetSelected[i].data['ybaojiaweight'] || 0,
          sumyibaojia: orderdetSelected[i].data['ybaojiaweight'] || 0
        });
      }
    }
    if (qihuodetids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的期货明细！！！');
      return;
    }
    this.modalService.config.class = 'modal-lg';
    // 通知物流报价弹窗的参数
    this.noticewuliuparams = {qihuodets: this.selectQihuodetWuliubaojia, detids: qihuodetids};
    this.bsModalRef = this.modalService.show(NoticewuliuyuanComponent);
    this.bsModalRef.content.parentThis = this;
  }
  wuliunoticehide() {
    this.bsModalRef.hide();
    this.listDetail();
  }
}
