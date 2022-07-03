import { CaigouService } from './../../../routes/caigou/caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../service/storage.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-jsbuchaimport',
  templateUrl: './jsbuchaimport.component.html',
  styleUrls: ['./jsbuchaimport.component.scss']
})
export class JsbuchaimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('priceModal') private priceModal: ModalDirective;
  parentthis;
  gridOptions: GridOptions;
  saledet: object= {jsbuchaid: null, detids: [], jine: '', beizhu: ''};
  search: Object= {kubaohao: '', sorgid: '', grno: ''};
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService,
    private caigouApi: CaigouService, private toast: ToasterService) {
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
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: event2 => {
        console.log(event2);
      }
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'id', minWidth: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '提单编号', field: 'billno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户', field: 'buyer', minWidth: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 90 ,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60 ,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '底漆', field: 'beiqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'xiubian', minWidth: 90 }
    ];
  }

  ngOnInit() {
  }
  openquery() {
    this.search = {kunbaohao: ''};
    this.classicModal.show();
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    this.search['sorgid'] = this.parentthis.buchaModel.sorgid;
    this.caigouApi.gettihuodet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }
  closeprice() {
    this.priceModal.hide();
  }
  import() {
    this.saledet = {jsbuchaid: null, detids: [], jine: '', beizhu: ''};
    this.gridOptions.api.getModel().forEachNode(element => {
      if (element.isSelected()) {
        this.saledet['detids'].push(element.data.id);
      }
      // console.log('import', element);
    });
    this.saledet['jsbuchaid'] = this.parentthis.buchaModel.id;
    if (this.saledet['detids'].length === 0) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.priceModal.show();
  }
  yinru() {
    if (this.saledet['jine'] === '') {
      this.toast.pop('error', '请填写金额！', '');
      return;
    }
    this.caigouApi.buchaimportdet(this.saledet).then(data => {
      this.parentthis.querydata();
    });
    this.bsModalRef.hide();
  }
}
