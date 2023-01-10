import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ReportService } from '../report.service';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-intercompany',
  templateUrl: './intercompany.component.html',
  styleUrls: ['./intercompany.component.scss']
})
export class IntercompanyComponent implements OnInit {

  maxDate = new Date();
  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  constructor(public settings: SettingsService,
    private reportApi: ReportService, private classifyApi: ClassifyApiService, private toast: ToasterService,
    private router: Router, private datepipe: DatePipe, private orgApi: OrgApiService) {

    this.start = new Date(); // 设定页面开始时间默认值

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
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orderbillno', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'billstatus', minWidth: 50 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '审核', field: 'isv', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60 ,
        valueFormatter: this.settings.valueFormatter3
      },
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2},
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 100
        ,valueFormatter: this.settings.valueFormatter2
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单日期', field: 'orderdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单明细状态', field: 'detstatus', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售公司', field: 'sellername', minWidth: 80 }
    ];
  }

  ngOnInit() {
  }

  start;
  end;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering
  requestparams = { gn: '', cangkuid: '', borgid: '', sorgid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: '', cuserid: '', vuserid: '', id: '', start: '', end: '', isv: '' };

  // 状态
  // tslint:disable-next-line:member-ordering
  names = [{ value: '', label: '全部' }, { value: 1, label: '已审核/已付款(含撤销)' }, { value: 2, label: '未审核/未付款(含取消)' }];

  // 单据类型
  // tslint:disable-next-line:member-ordering
  billtype = [{ value: '', label: '全部' }, { value: 1, label: '内部采购' }, { value: 2, label: '机构代销' }];

  // 导出明细表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '内采明细表.csv',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }
  listDetail() {
    this.reportApi.intercompanydet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  cangku;

  gns;
  orgs;

  @ViewChild('classicModal') private classicModal: ModalDirective;

  openQueryDialog() {
    this.orgs = [{ value: '', label: '全部' }];
    this.orgApi.listAll(0).then(data => {
      data.forEach(element => {
        this.orgs.push({
          value: element['id'],
          label: element['name']
        });
      });
    })
    this.cangku = [{ value: '', label: '全部' }];
    this.classifyApi.cangkulist().then((response) => {
      response.forEach(element => {
        this.cangku.push({
          value: element['id'],
          label: element['name']
        });
      });
    });
    this.classicModal.show();
  };

  coles() {
    this.classicModal.hide();
  }

  //常量作为字段名
  fieldArr = [
    'chandi',//产地
    'color',//颜色
    'width', //宽度
    'houdu',//厚度 
    'duceng', //镀层
    'caizhi', //材质
    'ppro'//后处理
  ];
  disabled = true;

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.requestparams = { gn: '', cangkuid: '', borgid: '', sorgid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: '', cuserid: '', vuserid: '', id: '', start: undefined, end: undefined, isv: '' };
    // this.requestparams={};
    this.cuser = undefined;
    this.vuser = undefined;
    this.attrs = [];
  };
  // 查询明细
  query() {
    this.requestparams['start'] = this.datepipe.transform(this.start, 'yyyy-MM-dd');
    if (this.end) this.requestparams['end'] = this.datepipe.transform(this.end, 'yyyy-MM-dd');
    console.log(this.requestparams);
    // this.requestparams.start = $filter('date')(this.requestparams.start, 'yyyy-MM-dd');
    // this.requestparams.end = $filter('date')(this.requestparams.end, 'yyyy-MM-dd');
    if (!this.requestparams.start) {
      this.toast.pop('warning', '开始时间必填！');
      // Notify.alert('开始时间必填！', 'warning');
    } else {
      if (typeof (this.cuser) === 'object') {
        this.requestparams.cuserid = this.cuser['code'];
      } else {
        this.requestparams.cuserid = '';
      }
      if (typeof (this.vuser) === 'object') {
        this.requestparams.vuserid = this.vuser['code'];
      } else {
        this.requestparams.vuserid = '';
      }
      // 设定运行查询，再清除页面data变量
      this.listDetail();
      this.coles();
      // ngDialog.close();
      // 			this.selectNull();
    }
  };

  // 通过用户模糊查询用户信息（制单人的选择）
  // tslint:disable-next-line:member-ordering
  cuser = {};
  // tslint:disable-next-line:member-ordering
  vuser = {};
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.requestparams['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.requestparams[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.requestparams[element['value']] = element['defaultval'];
      }
    }
  }
  
}
