import { ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ReportService } from './../../report/report.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { KucunService } from './../kucun.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chain',
  templateUrl: './chain.component.html',
  styleUrls: ['./chain.component.scss']
})
export class ChainComponent implements OnInit {
  isjump = true; // 入库单号是否可跳转，默认不可点
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private storage: StorageService, private reportApi: ReportService,
    private toast: ToasterService, private route: ActivatedRoute) {

    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'left' }, headerName: '单据编号', field: 'billno', minWidth: 70, cellRenderer: (params) => {
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'RK') {
            if (this.isjump) {
              return '<a target="_blank" href="#/ruku/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return params.data.billno;
            }
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'QH') {
            return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'MC') {
            return '<a target="_blank" href="#/matchcar/detail/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'XB') {
            return '<a target="_blank" href="#/xsbucha/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'AL') {
            return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'IS') {
            return '<a target="_blank" href="#/innersale/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'OR') {// 线上订单
            return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'BO') {// 线下订单
            return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'PO') {// 线下加工订单
            return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'TH') {// 提货单
            return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'PR') {// 加工单
            return '<a target="_blank" href="#/produce/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'XT') {// 销售退货
            return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          if (null != params.data.billno && params.data.billno.substring(0, 2) === 'KP') {// 发票
            return '<a target="_blank" href="#/salebill/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
          return params.data.billno;
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'billstatus', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '摘要', field: 'beizhu', minWidth: 200 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', minWidth: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据ID', field: 'billid', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细ID', field: 'detid', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '母卷捆包号', field: 'kunbaohaop', minWidth: 80 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '母卷库存id', field: 'kucunidp', minWidth: 50,
        cellRenderer: (params) => {
          if (!params.data) { return null; }
          if (params.data.kucunidp) {
            console.log(params.data);
            console.log(params.data.kucunidp);
            return '<a target="_blank" href="#/chain/' + params.data.kucunidp + '">' + params.data.kucunidp + '</a>';
          }
        }
     },
    ];

    if (this.route.params['value']) {
      this.requestparams['kucunid'] = this.route.params['value']['id'];
      this.listDetail();
    }
  }

  ngOnInit() {
    this.getMyRole();
  }
  /**获取用户角色 */
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      // 业务员不可跳转入库单
      if (myrole[i] === 10) {
        this.isjump = false;
      }
    }
  }
  //查询钢卷生命周期
  listDetail() {
    this.reportApi.chain(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);//网格赋值
    });
  };

  //获取查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;

  //查询条件
  requestparams = { kucunid: '', kunbaohao: '' };

  //打开查询弹窗
  openQueryDialog() {
    this.classicModal.show();
  }

  //关闭查询弹窗
  coles() {
    this.classicModal.hide();
  }

  //查询钢卷
  query() {
    if (this.requestparams['kucunid'] || this.requestparams['kunbaohao']) {
      this.listDetail();
      this.coles();
    }
    else this.toast.pop('warning', '请填写库存id或者捆包号')
  }

  //重选
  selectNull() {
    this.requestparams = { kucunid: '', kunbaohao: '' };
  }

}
