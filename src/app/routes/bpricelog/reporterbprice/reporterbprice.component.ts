import { BpricelogapiService } from './../bpricelogapi.service';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporterbprice',
  templateUrl: './reporterbprice.component.html',
  styleUrls: ['./reporterbprice.component.scss']
})
export class ReporterbpriceComponent implements OnInit {

  gridOptions: GridOptions;

  requestparams = { gnid: '', chandiid: '', start: this.datePipe.transform(new Date(), 'y-MM-dd') };

  constructor(public settings: SettingsService, private datePipe: DatePipe, private bpricelogApi: BpricelogapiService) {

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
      { cellStyle: { 'text-align': 'center' }, headerName: '调整日期', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库地区', field: 'area1', width: 90 },
      {
        headerName: '基础规格', cellStyle: { 'text-align': 'center' },
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houduname', width: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'widthname', width: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'ducengname', width: 90 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhiname', width: 90 }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '调价前价格', field: 'preprice', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调价后价格', field: 'price', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调价幅度', field: 'diffprice', width: 100 }
    ];

    this.listDetail();
  }

  ngOnInit() {
  }

  listDetail() {
    this.bpricelogApi.reportBpricelog(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

}
