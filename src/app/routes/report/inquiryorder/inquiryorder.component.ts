import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-inquiryorder',
  templateUrl: './inquiryorder.component.html',
  styleUrls: ['./inquiryorder.component.scss']
})
export class InquiryorderComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;

  start;
  end;
  maxDate = new Date();

  gridOptions: GridOptions;

  search = { start: '', end: '' };

  constructor(public settings: SettingsService,
    private orderApi: OrderapiService,
    private datePipe: DatePipe,
  ) {

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
      // { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户公司名称', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户类型', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '手机号', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '对接业务员', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品品名', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品规格', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否复购', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '跟踪情况状态', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未成交原因', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'wcustomername', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data && null != params.data.id) {
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'OR') {// 线上
              return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'BO') {// 线下
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'PO') {// 加工
              return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'QH') {// 加工
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            return params.data.billno;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'salemanname', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'customername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'wcustomername', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'salemanname', width: 75 }
    ];
  }

  ngOnInit() {
  }
  // 打开查询对话框
  openQueryDialog() {
    this.showclassicModal();
  }

  // 查询明细
  query() {
    if (this.start) {
      this.search['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    } else {
      this.search['start'] = '';
    }
    if (this.end) {
      this.search['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    } else {
      this.search['end'] = '';
    }
    this.orderApi.findxundandetail(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
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
      fileName: '欠款明细表.xls',
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
  selectNull() {
    this.start = null;
    this.end = null;
    this.search = { start: '', end: '' };
  }






}
