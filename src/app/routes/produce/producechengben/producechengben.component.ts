import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid';
import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ProduceapiService } from './../produceapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producechengben',
  templateUrl: './producechengben.component.html',
  styleUrls: ['./producechengben.component.scss']
})
export class ProducechengbenComponent implements OnInit {

  requestparams = { kucunid: '', kunbaohao: '' };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private produceApi: ProduceapiService, private toast: ToasterService, private route: ActivatedRoute) {

    this.gridOptions = {
      rowData: null, // 行数据
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: false, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    };

    this.gridOptions.columnDefs = [

      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'RK') {
            return '<a target="_blank" href="#/ruku/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'AL') {
            return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'IS') {
            return '<a target="_blank" href="#/innersale/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'BO') { // 线下订单
            return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          return params.data.billno;
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', width: 140 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'billstatus', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '摘要', field: 'beizhu', width: 400 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 60,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 70,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 70,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据ID', field: 'billid', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细ID', field: 'detid', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', width: 50 }
    ];

    if (this.route.params['value']['id']) {
      this.requestparams['fid'] = this.route.params['value']['id'];
      this.listDetail();
    } else {
      this.toast.pop('warning', '成品id不能为空');
    }

  }

  ngOnInit() {
  }

  listDetail() {
    this.produceApi.showchengben(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  openQueryDialog() {
    this.showChainQuery();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams['kucunid'] = '';
    this.requestparams['kunbaohao'] = '';
  };

  // 查询明细
  query() {
    this.listDetail();
    this.hideChainQuery();
  }

  // 导出Excel表格
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '基料成本计算.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showChainQuery() {
    this.classicModal.show();
  }

  hideChainQuery() {
    this.classicModal.hide();
  }

}
