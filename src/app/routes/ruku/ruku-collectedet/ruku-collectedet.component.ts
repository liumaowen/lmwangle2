import { UserapiService } from './../../../dnn/service/userapi.service';
import { RukuService } from './../ruku.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-ruku-collectedet',
  templateUrl: './ruku-collectedet.component.html',
  styleUrls: ['./ruku-collectedet.component.scss']
})
export class RukuCollectedetComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;

  // 查询条件
  search: Object = { classifys: {}, orgid: '', grno: '', type: '', supplierid: '', start: '', end: '', cuserid: '', gn: '', chandi: '' };
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  // 结束时间
  end: Date = new Date();
  // 表格设置
  gns: any[];
  // 产地
  chandis: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  // 规格
  attrs: any;
  types: any[];
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, public rukuapi: RukuService, public userapi: UserapiService, private datepipe: DatePipe,
    private customerApi: CustomerapiService,
    private classifyApi: ClassifyApiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
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
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'rukucollectdetid', minWidth: 60 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 60,
        cellRenderer: (params) => {
          if (!params.data) { return null; }
          if (params.data.rukucollectdetid) {
            let billType = params.data.type;
            if ('采购退款（费用）' === billType || '采购退款（利息）' === billType || '跨月结算价格调整' === billType || '采购退款（返利）' === billType|| 
                 '外购承兑贴息(其他)' === billType || '价格调整' === billType || '自办承兑贴息(其他)' === billType || '采购退款（索赔）' === billType
                 || 'PJ补差' === billType) {
              billType = 'cgbucha';
            }
            if('入库汇总' === billType){
              billType = 'ruku';
            }
            return '<a target="_blank" href="#/' + billType + '/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'type', minWidth: 120,
        cellRenderer: (params) => {
          // console.log(params.data);
          if (params && params.data && null != params.data['type']) {
            return params.data['type'];
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库日期', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate2', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '成本', field: 'price', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 90},
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主表备注', field: 'beizhu', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细备注', field: 'zbeizhu', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '生成凭证', field: 'ispingzheng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', minWidth: 75 }
    ];

    this.listDetail();
  }

  ngOnInit() {
  }
  selectstart() { }
  selectend() { }
  // 获取入库汇总明细表信息
  listDetail() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    this.rukuapi.rukucollect(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 关闭查询弹窗
  close() {
    this.classicModal.hide();
  }

  // 清除数据按钮
  selectNull() {
    this.search = { classifys: {}, orgid: '', grno: '', type: '', supplierid: '', start: '', end: '', cuserid: '', gn: '', chandi: '' };
    this.start = new Date();
    this.end = new Date();
    this.chandis = [];
    this.attrs = [];
  }
  // 查询按钮
  query() {
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.listDetail();
    this.close();
  }
  // 打开查询对话框
  openquery() {
    this.selectNull();
    this.types = [{ id: '0', text: '入库汇总' }, { id: '1', text: '补差插行' }];
    this.showGuige = false;
    this.isChandi = false;
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      // console.log('gns11', this.gns);
    });
    this.findWiskind();
    this.classicModal.show();
  }
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    if (this.chandis.length > 0) {
      this.chandis = [];
    }
    this.showGuige = false; // 选择品名时
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    // console.log('this.cs', this.cs);
    this.cs = value.attrs;
    // console.log('this.cs', this.cs);
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    // console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    console.log('c', value);
    this.search['classifys'] = [];
    this.search['chandiid'] = value;
    this.attrs = [];
    this.classifyApi.getAttrs(value).then(data => {
      // console.log('guige', data);
      this.attrs = data;
    });
    this.showGuige = true;
    // console.log('attr', this.attrs);
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
    console.log('op', this.search);
  }
  selectetype(value) {
    this.search['type'] = value.id;
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '入库汇总表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  //查询采购单位
  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' })
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          })
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      })
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.search['gn'] = item.itemname;
    this.search['classifys'] = {};
    this.attrs = [];
    this.attrs = attrs;
    this.showGuige = true;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      element['options'].unshift({ value: '', label: '全部' });
    }
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.search['classifys'][element['value']] = element['defaultval'];
      }
    }
  }
}
