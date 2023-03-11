import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TiaohuoService } from '../tiaohuo.service';

@Component({
  selector: 'app-tiaohuoshouxi',
  templateUrl: './tiaohuoshouxi.component.html',
  styleUrls: ['./tiaohuoshouxi.component.scss']
})
export class TiaohuoshouxiComponent implements OnInit {
  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('shouxidialog') private shouxidialog: ModalDirective;
  constructor(public settings: SettingsService, private tiaohuoApi: TiaohuoService, private datepipe: DatePipe) {
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
          return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.orderbillno + '</a>';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'buyername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'usernature', width: 90,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data['usernature'] === 1) {
              return '直接用户';
            } else {
              return '贸易商';
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同月份', field: 'month', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际定金比例', field: 'shifubili1', width: 90 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '实际定金', field: 'shifudingjin', width: 90 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '约定定金比例', field: 'yufubili1', width: 90 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '约定定金', field: 'yufudingjin', width: 90 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '订单金额', field: 'tjine', width: 90 ,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '通知采购日期', field: 'noticecaigoudate', width: 120,
        cellRenderer: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['noticecaigoudate'], 'y-MM-dd');
          } else {
            return;
          }
        }
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '定金利息', field: 'dingjinlixi', width: 120 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '天数', field: 'count', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计息开始时间', field: 'startdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计息结束时间', field: 'enddate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单类型', field: 'ordertype', width: 100 },
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    console.log(this.search);
    // 从服务器获取数据赋值给网格
    this.tiaohuoApi.dingjinshouxi(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }

  show() {
    this.shouxidialog.show();
  }
  close() {
    this.shouxidialog.hide();
  }
  select() {
    this.search['start'] ? this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd') : '';
    this.search['end'] ? this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd') : '';
    console.log(this.search);
    this.listDetail();
    this.close();
  }

  calcdingjinshouxi() {
    if (confirm('你确定计算吗？')) {
      this.tiaohuoApi.calcdingjinshouxi(this.search).then((data) => {
      });
    }
  }

}
