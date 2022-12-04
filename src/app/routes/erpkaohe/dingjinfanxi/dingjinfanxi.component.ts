import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OnInit, Component, ViewChild } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { ErpkaoheService } from './../erpkaohe.service';

@Component({
  selector: 'app-dingjinfanxi',
  templateUrl: './dingjinfanxi.component.html',
  styleUrls: ['./dingjinfanxi.component.scss']
})
export class DingjinfanxiComponent implements OnInit {
  search: any = {};
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private datepipe: DatePipe) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '期货订单号码', field: 'billno', width: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'kehutype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格性质', field: 'guigetype', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同重量', field: 'htweight', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同金额', field: 'htjine', width: 120,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金比例', field: 'shijidingjinrate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '返息开始时间', field: 'dingjincdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '期货入库重量', field: 'qihuorukuweight', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '返息结束时间', field: 'firstrukudate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '期限', field: 'qixian', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月利率', field: 'monthrate', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '返息金额', field: 'fanxianjine', width: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'dingjinmonth', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cusername', width: 100 }
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.dingjinfanxi(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }
  @ViewChild('fanxidialog') private fanxidialog: ModalDirective;
  show() {
    this.fanxidialog.show();
  }
  close() {
    this.fanxidialog.hide();
  }
  select() {
    this.search['start'] ? this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd') : '';
    this.search['end'] ? this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd') : '';
    console.log(this.search);
    this.listDetail();
    this.close();
  }
}