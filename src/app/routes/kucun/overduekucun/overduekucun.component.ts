import { GridOptions } from 'ag-grid/main';
import { KucunService } from './../kucun.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-overduekucun',
  templateUrl: './overduekucun.component.html',
  styleUrls: ['./overduekucun.component.scss']
})
export class OverduekucunComponent implements OnInit {
  kulingobj: any = {};
  search = {
    gn: '', chandi: '', orgid: '', salemanid: '', kuling: '', usernature: ''
  };
  kucunranges = [{ label: '全部库存（不包含已支付部分）', value: true }, { label: '非全款库存', value: false }];
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gns: any[];
  chandis: any[];
  orgs: any;
  saleman: any;
  usernatures: {};

  // 定义过滤之后的集合
  filterConditionObj = {};
  gridOptions: GridOptions;

  // 收藏夹对象
  bsModalRef: BsModalRef;

  constructor(public settings: SettingsService, private classifyapi: ClassifyApiService, private orgApi: OrgApiService,
    private kucunapi: KucunService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      // suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems,

    };


    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'realname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否全款', field: 'kuanstatus', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'usernature', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构库龄', field: 'orgkuling', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 220 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存重量', field: 'weight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存数量', field: 'num', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['num']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '处理方法', field: 'width', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '处理时限', field: 'width', width: 100 },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75, cellRenderer: (params) => {
      //     if (params.data && null != params.data.kucunid) {
      //       return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
      //     }
      //     return '';
      //   }
      // }
    ];

  }

  ngOnInit() {

  }

  // 查询库存明细表
  listDetail() {
    if (this.saleman) {
      this.search['salemanid'] = this.saleman['code'];
    }
    this.kucunapi.overduekucun(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 打开查询弹窗
  openclassicmodal() {
    this.getGnAndChandi();
    this.orgs = [{ label: '全部', value: '' }];
    this.usernatures = [{ label: '全部', value: '' }, { label: '直接用户', value: '0' }, { label: '流通商', value: '1' }, { label: '终端用户', value: '2' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    })
    this.search['isall'] = true;
    this.classicModal.show();
  }
  // 重置查询条件
  selectNull() {
    this.saleman = null;
    this.search = { gn: '', chandi: '', orgid: '', salemanid: '', kuling: '', usernature: '' };
    this.kulingobj = {};
  }
  // 查询
  select() {
    this.listDetail();
    this.closeclassicmodal();
  }
  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
    this.selectNull();
  }

  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gns = [];
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
  /**多选改变事件 */
  checkboxchange(event) {
    const array = [];
    for (const item in this.kulingobj) {
      if (this.kulingobj[item]) {
        if (Number(item) === 0) {
          array.push('15,29');
        }
        if (Number(item) === 1) {
          array.push('30,59');
        }
        if (Number(item) === 2) {
          array.push('60,89');
        }
        if (Number(item) === 3) {
          array.push('90');
        }
      }
    }
    this.search.kuling = array.join('a');
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
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }

  }

}
