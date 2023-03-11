import { QihuoService } from './../../qihuo/qihuo.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { OrderapiService } from '../orderapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-jingliaoorderdetail',
  templateUrl: './jingliaoorderdetail.component.html',
  styleUrls: ['./jingliaoorderdetail.component.scss'],
  providers: [DatePipe, DecimalPipe]
})

export class JingliaoorderdetailComponent implements OnInit {
  companys = {};
  orgs: any = [];
  dantypes;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  search: object = {
    start: '', end: '', billno: '', orgid: '', cuserid: '', salemanid: '', buyerid: '',
    kehuid: '', gn: '', classifys: '', chandi: '', grno: ''
  };

  gns: any[];
  // 产地
  chandis: any[];
  gangchangs: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  // 规格
  attrs: any;
  constructor(public settings: SettingsService, private orderapi: OrderapiService,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService,
    private orgApi: OrgApiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'QH') {// 加工
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            return params.data.billno;
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'dantype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'qihuostatus', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'saleprice', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '净料类型', field: 'materialtype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 100 }
    ];
  }
  selectNull() {
    this.search = {
      start: '', end: '', billno: '', cuserid: '', salemanid: '', buyerid: '',
      kehuid: '', gn: '', chandi: '', classifys: '', grno: ''
    };
    this.chandis = [];
    this.chandioptions = [];
  }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.search['buyerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.search['buyerid'] = this.companys['code'];
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['salemanid'] instanceof Object) {
      this.search['salemanid'] = this.search['salemanid'].code;
    }

    this.orderapi.jingliaoorderlist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }
  close() {
    this.classicModal.hide();
  }
  ngOnInit() {
    // this.query();
  }
  // 打开查询对话框
  openquery() {
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.selectNull();
    this.showGuige = false;
    this.isChandi = false;
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.orgs = [{ value: '', label: '全部' }];
      this.orgApi.listAll(0).then((response) => {
        response.forEach(element => {
          this.orgs.push({
            value: element.id,
            label: element.name
          });
        });
      });
    this.classicModal.show();
  }
  selectedgn(value) {
    this.cs = [];
    if (this.chandis.length > 0) {
      this.chandis = [];
    }
    this.showGuige = false; // 选择品名时
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
  }
  selectedchandi(value) {
    this.search['classifys'] = [];
    this.search['chandiid'] = value;
    this.attrs = [];
    // this.classifyApi.getAttrs(value).then(data => {
    //   this.attrs = data;
    // });
    // this.showGuige = true;
  }
  selectedguige(value, id) {
    if (this.search['classifys'].length > 0) {
      for (let i = 0; i < this.search['classifys'].length; i++) {
        if (this.search['classifys'][i].name === id) {
          this.search['classifys'].splice(i, 1);
        }
      }
    }
    this.search['classifys'].push({ name: id, value: value });
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
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
