import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cginvoiceing',
  templateUrl: './cginvoiceing.component.html',
  styleUrls: ['./cginvoiceing.component.scss']
})
export class CginvoiceingComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  // @ViewChild('createModal') createModal: ModalDirective;
  parentthis;
  gridOptions: GridOptions;
  search: object = { supplierid: '', grno: '' };
  tweight = 0;
  tjine = 0;
  invoicedatemax: Date = new Date();
  invoicedate: Date = new Date();
  create: object = { rukuids: [], tuihuoids: [], buchaids: [], id: '' };
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private datepipe: DatePipe,
    private toast: ToasterService, public bsModalRef: BsModalRef) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
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
      onRowSelected: event2 => {
        console.log(event2);
        if (event2.node['selected']) {
          this.tweight = this.tweight + Number(event2.node.data.weight);
          this.tjine = this.tjine + Number(event2.node.data.jine);
        } else {
          this.tweight = this.tweight - Number(event2.node.data.weight);
          this.tjine = this.tjine - Number(event2.node.data.jine);
        }
      }
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'beizhu', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购单位', field: 'buyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80 }
    ];
  }

  ngOnInit() {
  }
  querydata() {
    this.search['supplierid'] = this.parentthis.cginvoice['supplierid'];
    // this.search['gn'] = this.parentthis.cginvoice['billgn']; 20200213 lmw 去掉品名参数
    // this.search['orgid'] = this.parentthis.cginvoice['orgid'];
    this.caigouApi.getcginvoiceing(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.hideDialog();
  }
  showDialog() {
    this.search = { supplierid: '', grno: '' };
    this.classicModal.show();
  }
  import() {
    this.create = { rukuids: [], tuihuoids: [], buchaids: [], id: '' };
    let list = [];
    const ids = new Array();
    const buchaids = new Array();
    const tuihuoids = new Array();
    list = this.gridOptions.api.getSelectedNodes();
    if (list.length === 0) {
      this.toast.pop('warning', '请选择相应货物！');
      return '';
    } else {
      console.log('select', list);
      for (let i = 0; i < list.length; i++) {
        if (list[i].data.type === 1) {
          ids.push(list[i].data.billid);
        } else if (list[i].data.type === 2) {
          tuihuoids.push(list[i].data.billid);
        } else if (list[i].data.type === 3) {
          buchaids.push(list[i].data.billid);
        }
      }
      this.create['id'] = this.parentthis.cginvoice['id'];
      this.create['rukuids'] = ids;
      this.create['tuihuoids'] = tuihuoids;
      this.create['buchaids'] = buchaids;
    }
    console.log('create', this.create);
    this.caigouApi.importinvoice(this.create).then(data => {
      this.parentthis.querydata();
    });
    this.bsModalRef.hide();
  }
  hideDialog() {
    this.classicModal.hide();
  }
}
