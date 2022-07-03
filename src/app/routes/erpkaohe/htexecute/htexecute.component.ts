import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { ErpkaoheService } from './../erpkaohe.service';

@Component({
  selector: 'app-htexecute',
  templateUrl: './htexecute.component.html',
  styleUrls: ['./htexecute.component.scss']
})
export class HtexecuteComponent implements OnInit {
  search: any = {};
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '合同日期', field: 'monthdate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同重量', field: 'htweight', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已下单重量', field: 'yicaigouweight', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'saleprice', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同金额', field: 'tjine', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已入库重量', field: 'yirukuweight', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未入库重量', field: 'weirukuweight', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '已提重量', field: 'yitihuoweight', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未提重量', field: 'weitizhongliang', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '定金金额', field: 'shifudingjin', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金比例', field: 'shifurate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
    ];
    this.listDetail();
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.htexecute(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }

}
