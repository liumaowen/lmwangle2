import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { StorageService } from './../../service/storage.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CaigouService } from '../../../routes/caigou/caigou.service';
import { CgbuchaapiService } from '../../../routes/cgbucha/cgbuchaapi.service';

@Component({
  selector: 'app-xmdcgbuchaimport',
  templateUrl: './xmdcgbuchaimport.component.html',
  styleUrls: ['./xmdcgbuchaimport.component.scss']
})
export class XmdCgbuchaimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  gridOptions: GridOptions;
  parentthis;
  saledet: object = { id: null, detids: [] };
  search: object = {start: '', end: '', chandi: '',gn: '', supplierid: ''};
  start: Date;
  end: Date;
  gangchangs: any[];
  chandioptions: any = [];
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService,
    private toast: ToasterService, private classifyApi: ClassifyApiService, private datepipe: DatePipe,
    private cgbuchaApi: CgbuchaapiService, private caigouApi: CaigouService) {
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
        enableFilter: true
      };
      this.gridOptions.onGridReady = this.settings.onGridReady;
      // this.gridOptions.groupUseEntireRow = true;
      this.gridOptions.groupSuppressAutoColumn = true;
      // 设置aggird表格列
      this.gridOptions.columnDefs = [
        { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'id', minWidth: 50, checkboxSelection: true },
        { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 100},
        { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 150 },
        { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '补贴类型', field: 'bttype', minWidth: 90},
        { cellStyle: { 'text-align': 'right' }, headerName: '享受补贴量（吨）', field: 'weight', minWidth: 100 },
        { cellStyle: { 'text-align': 'right' }, headerName: '补贴单价', field: 'price', minWidth: 80 },
        { cellStyle: { 'text-align': 'right' }, headerName: '应补贴金额', field: 'ybjine', minWidth: 100 },
        { cellStyle: { 'text-align': 'right' }, headerName: '已补贴金额', field: 'yibjine', minWidth: 100 },
        { cellStyle: { 'text-align': 'right' }, headerName: '未补贴金额', field: 'wbjine', minWidth: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150 }
      ];
    }

  ngOnInit() {
  }
  openquery() {
    this.selectNull();
    this.caigouApi.getchandi().then(data => {
      this.gangchangs = data;
    });
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = {start: '', end: '', chandi: '',gn: '' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    console.log('caigouModel', this.parentthis.caigouModel);
    this.search['supplierid'] = this.parentthis.caigouModel['supplierid'];
    if (!this.search['start']) {
      this.toast.pop('error', '请选择开始月份！', '');
      return;
    }
    if (!this.search['end']) {
      this.toast.pop('error', '请选择结束月份！', '');
      return;
    }
    if (this.start > this.end) {
      this.toast.pop('error', '开始月份大于结束月份，请重新选择！', '');
      return;
    }
    console.log(this.search);
    this.caigouApi.importfanli(this.search).then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data);
    });
    this.classicModal.hide();
  }
  selectstartmonth(value) {
    console.log('start', value.getTime());
    this.start = value.getTime();
    this.search['start'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectendmonth(value) {
    console.log('end', value.getTime());
    this.end = value.getTime();
    this.search['end'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 引入
  import() {
    this.saledet['detids'] = [];
    this.gridOptions.api.getModel().forEachNode(element => {
      if (element.isSelected()) {
        this.saledet['detids'].push(element.data.id);
      }
      // console.log('import', element);
    });
    this.saledet['id'] = this.parentthis.caigouModel.id;
    if (this.saledet['detids'].length === 0) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.cgbuchaApi.importfanli(this.saledet).then(data => {
      this.parentthis.querydata();
    });
    console.log('dets', this.saledet);
    // 父页面传递过来的
    console.log(this.parentthis);
    this.bsModalRef.hide();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[0]['value'];
    }
  }
}
