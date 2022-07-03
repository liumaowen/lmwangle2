import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

@Component({
  selector: 'app-importorder',
  templateUrl: './importorder.component.html',
  styleUrls: ['./importorder.component.scss']
})
export class ImportorderComponent implements OnInit {
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('updateDetModal') private updateDetModal: ModalDirective;
  // 接收父页面this对象
  componentparent;
  importtype;
  gnlist;
  gn;
  detids = [];
  invoicegn;
  params: any = {};
  advanceInvoiceDetId;
  finishdate: Date;
  search = { orderbillno: '' };
  gridOptions: GridOptions;
  constructor(
    public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private orderApi: OrderapiService,
    private classifyApi: ClassifyApiService,
    private datepipe: DatePipe,
    private numberPipe: DecimalPipe) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group',
        minWidth: 60, checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 60,
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '其他单位名称', field: 'unitname', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '其他单位重量', field: 'unitweight', width: 60,
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '其他单位单价', field: 'unitprice', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '捆包号', field: 'kunbaohao', width: 65
      },
    ];
  }

  ngOnInit() {
  }
  // 查询库存明细表
  listDetail() {
    this.orderApi.findorderdetbybillno(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 打开查询弹窗
  openclassicmodal() {
    this.selectNull();
    this.classicModal.show();
  }

  // 重置查询条件
  selectNull() {
    this.search = { orderbillno: '' };
  }
  // 查询
  select() {
    this.listDetail();
    this.closeclassicmodal();
  }
  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }
  import() {
    const ids = new Array();
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected) {
        ids.push(kucuns[i].data.id);
      }
    }
    if (ids.length === 0) {
      this.toast.pop('warning', '请选择要引入的货物!');
      return;
    }
    if (!this.search['orderbillno']) {
      this.toast.pop('warning', '请填写合同号!');
      return;
    }
    const params = { id: this.componentparent.salebill.id, orderbillno: this.search['orderbillno'], detids: ids };
    this.orderApi.importorder(params).then((data) => {
      this.componentparent.hideimportmodal();
    });
  }
  // 选中开票明细
  next(){
    this.params = {};
    if (!this.search['orderbillno']) {
      this.toast.pop('warning', '请填写合同号!');
      return;
    }
    const ids = new Array();
    const dets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < dets.length; i++) {
      if (dets[i].selected) {
        ids.push(dets[i].data.id);
        this.gn = dets[i].data.goodscode.gn;
        this.params.price = dets[i].data.pertprice;
        this.params.weight = dets[i].data.weight;
      }
    }
    if (ids.length !== 1) {
      this.toast.pop('warning', '请选择一条明细引入!');
      return;
    }
    this.detids = ids;
    // 打开修改明细弹窗
    this.openUpdateDet();
  }

  // 修改明细弹窗
  openUpdateDet(){
    this.classifyApi.getsalebill({ pid: this.gn }).then((gns) => {
      this.gnlist = [{ label: '请选择开票品名', value: '' }];
      gns.forEach(element => {
        this.gnlist.push({
          label: element['label'],
          value: element['label']
        });
      });
    });
    this.updateDetModal.show();
  }
  hidebillgnModal() {
    this.updateDetModal.hide();
  }
  // 作废提前开票明细
  cancelDet(){
    if(!this.params['invoicegn']){
      this.toast.pop('warning', '请选择开票品名!');
      return;
    }
    if(!this.params['price']){
      this.toast.pop('warning', '请填写含税单价!');
      return;
    }
    if(!this.params['weight']){
      this.toast.pop('warning', '请填写重量!');
      return;
    }
    if(!this.finishdate){
      this.toast.pop('warning', '请选择保证完成时间!');
      return;
    }
    this.params['advanceInvoiceId'] = this.componentparent.salebill.id;
    this.params['advanceInvoiceDetId'] = this.advanceInvoiceDetId;
    this.params['orderbillno'] = this.search['orderbillno'];
    this.params['detids'] = this.detids;
    this.params['finishdate']  = this.datepipe.transform(this.finishdate, 'y-MM-dd');
    this.orderApi.cancelDet(this.params).then((data) => {
      this.componentparent.hideimportmodal();
    });
  }
}
