import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from 'app/core/settings/settings.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { Router } from '@angular/router';
import { WuliuscoreapiService } from '../wuliuscore/wuliuscoreapi.service';

@Component({
  selector: 'app-wuliusupplier',
  templateUrl: './wuliusupplier.component.html',
  styleUrls: ['./wuliusupplier.component.scss']
})
export class WuliusupplierComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('supplierModal') private supplierModal: ModalDirective;
  search: object = {};
  model: object = {customerid: null, suppliertype: null};
  suppliertypes;
  gridOptions: GridOptions;
  constructor(
    public settings: SettingsService,
    private WuliuscoreApi: WuliuscoreapiService,
    private toast: ToasterService,
    private fb: FormBuilder,
    private matchcarAPi: MatchcarService,
    private addressparseService: AddressparseService,
    private classifyApi: ClassifyApiService,
    private router: Router,
    private datepipe: DatePipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.classifyApi.listBypid({ pid: 14064 }).then((data) => {
      const categorylist = [{ label: '请选择供应商分类', value: '' }];
      data.forEach(element => {
        categorylist.push({
          label: element.name,
          value: element.id
        });
      });
      this.suppliertypes = categorylist;
    });

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '物流供应商分类', field: 'name', minWidth: 80 ,
        onCellClicked: (params) => {
          if(params.data.actualfeecustomerid){
            this.model['customerid'] = params.data.actualfeecustomerid;
            this.supplierModal.show();
          }
        }
    },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '供应商名称', field: 'actualfeename', minWidth: 110,
        cellRenderer: (params) => {
          if (params.data && params.data.actualfeecustomerid) {
            return '<a target="_blank" href="#/customer/' + params.data.actualfeecustomerid + '/zixin">' + params.data.actualfeename + '</a>';
          } else {
            return '';
          }
        }
    },
      { cellStyle: { 'text-align': 'center' }, headerName: '合作期限', field: 'hezuolimit', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '营业执照', field: 'businesslicense', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '道路运输许可证授权委托函', field: 'roadpermit', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '授权委托函', field: 'proxystatement', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '打款资料', field: 'paymentinformation', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货及时性', field: 'thjishixing', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '安全性', field: 'safegrade', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '赔偿能力', field: 'compensate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 90 },
    ];
  }

  ngOnInit() {
    this.query();
  }

  queryDialog(){
    this.classicModal.show();
  }
  hideclassicModal(){
    this.classicModal.hide();
  }
  query() {
    this.WuliuscoreApi.findsupplier(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.hideclassicModal();
    });
  }
  closeSupplierModal(){
    this.supplierModal.hide();
  }
  confirm(){
    this.WuliuscoreApi.updateSupplierType(this.model).then(data => {
      this.toast.pop('success', '供应商分类修改成功！');
      this.query();
      this.closeSupplierModal();
    });
  }
}
