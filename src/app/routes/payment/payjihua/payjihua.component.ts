import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { Router } from '@angular/router';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { PaymentapiService } from '../paymentapi.service';
import { now } from 'moment';

@Component({
  selector: 'app-payjihua',
  templateUrl: './payjihua.component.html',
  styleUrls: ['./payjihua.component.scss']
})
export class PayjihuaComponent implements OnInit {
  payjihua: object = {
    gnid: '', gn: '', chandi: '', jihuaweight: '',
    jihuapayjine: '', month: '', beizhu: '',sorgid: '',sorg: {name: ''}
  };
  gridOptions: GridOptions;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gns: any[];
  // 产地
  chandis: any[];
  @ViewChild('queryModal') private queryModal: ModalDirective;
  search: Object = { month: '' };
  @ViewChild('updateModal') private updateModal: ModalDirective;
  jsonpay: object = { jihuaweight: '', jihuapayjine: '', beizhu: '' };
  constructor(public settings: SettingsService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private paymenApi: PaymentapiService,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
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
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'sorg.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂', field: 'chandi', minWidth: 70 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '计划订货量（吨）', field: 'jihuaweight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jihuaweight']) {
            return Number(params.data['jihuaweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '计划收款金额（元）', field: 'jihuapayjine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jihuapayjine']) {
            return Number(params.data['jihuapayjine']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已付款', field: 'yifukuan', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yifukuan']) {
            return Number(params.data['yifukuan']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '待付款', field: 'jihuaweight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jihuaweight']) {
            return Number(params.data['jihuapayjine'] - params.data['yifukuan']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款要求', field: 'beizhu', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 100,
        cellRenderer: (params) => {
          return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
          console.log(params);
          if ('你确定要删除吗？') {
            this.paymenApi.removePayjihua(params.data.id).then(data => {
              this.search['month'] = this.datepipe.transform(now(), 'y-MM') + '-01';
              this.query();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 100,
        cellRenderer: (params) => {
          return '<a target="_blank">更新</a>';
        },
        onCellClicked: (params) => {
          if ('你确定要更新吗？') {
            this.showupdate(params.data.id);
          }
        }
      }
    ];
  }
  ngOnInit() {
  }
  // 新建采购单
  showcreate() {
    this.payjihua = {
      gnid: '', gn: '', chandi: '', jihuaweight: '',
      jihuapayjine: '', month: '', beizhu: '',sorgid: ''
    };
    this.gns = [];
    // this.getGnAndChandi();
    this.payjihua['sorg'] = {};
    this.createModal.show();
  }
  closecreate() {
    this.createModal.hide();
  }
  create() {
    this.paymenApi.createpayjihua(this.payjihua).then(dataa => {
      this.closecreate();
      this.search['month'] = this.datepipe.transform(now(), 'y-MM') + '-01';
      this.query();
    });
  }
  selectmonth(e) {
    console.log(e);
    this.payjihua['month'] = this.datepipe.transform(e, 'y-MM-dd');
  }
  getGnAndChandi() {
    this.classifyApi.getGnAndChandi().then((data) => {
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  selectedgn(value) {
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  query() {
    this.paymenApi.queryPayjihua(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.closequery();
    });
  }
  showupdate(payjihuaid) {
    this.paymenApi.getPayjihua(payjihuaid).then(data => {
      this.payjihua = data;
    });
    this.updateModal.show();
  }
  closeupdate() {
    this.updateModal.hide();
  }
  updatePayjihua() {
    this.jsonpay['jihuaweight'] = this.payjihua['jihuaweight'];
    this.jsonpay['jihuapayjine'] = this.payjihua['jihuapayjine'];
    this.jsonpay['beizhu'] = this.payjihua['beizhu'];
    if (confirm('你确定要修改吗？')) {
      this.paymenApi.updatePayjihua(this.payjihua['id'], this.jsonpay).then(data => {
        this.closeupdate();
        this.search['month'] = this.datepipe.transform(now(), 'y-MM') + '-01';
        this.query();
      });
    }
  }
  showquery() {
    this.search['month'] = null;
    this.queryModal.show();
  }
  closequery() {
    this.queryModal.hide();
  }
  selectquerymonth(e) {
    this.search['month'] = this.datepipe.transform(e, 'y-MM-dd');
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
    this.payjihua['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.payjihua['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
