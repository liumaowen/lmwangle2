import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeeapiService } from './../feeapi.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { GridOptions, ColDef } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { BiddingorderimportComponent } from './biddingorderimport/biddingorderimport.component';
import { YunfeeimportComponent } from './yunfeeimport/yunfeeimport.component';
const sweetalert = require('sweetalert');
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { YunfeeapiService } from '../../yunfee/yunfeeapi.service';

@Component({
  selector: 'app-wuliubaojiadet',
  templateUrl: './wuliubaojiadet.component.html',
  styleUrls: ['./wuliubaojiadet.component.scss']
})
export class WuliubaojiadetComponent implements OnInit {
  @ViewChild('changegudingModal') private changegudingModal: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('refreshmaycurModel') private refreshmaycurModel: ModalDirective;
  @ViewChild('wuliuorderModel') private wuliuorderModel: ModalDirective;
  @ViewChild('mohuModal') private mohuModal: ModalDirective;
  @ViewChild('matchgudingDialog') private matchgudingDialog: ModalDirective;
  @ViewChild('sccnewdialog') private sccnewdialog: ModalDirective;


  minweights: any = []; // 载重区间最小值
  maxweights: any = []; // 载重区间最大值
  wuliuorder: any = {}; // 物流报价对象
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end: Date;
  maxDate = new Date();
  wlcustomer = {};
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '', customerid: '', salemanid: '', orgid: '', isdel: false
  };
  changegudingparams = {
    minweight: '', maxweight: '', wuliuorderid: ''
  };

  gridOptions: GridOptions;
  yfgridOptions: GridOptions; // 固定路线明细
  orgs = [];
  saleman: any = {};
  iswuliubu = true; // 是否是物流部的人员
  // 中选单列表弹窗对象
  bobsModalRef: BsModalRef;
  wuliuorderdetids: any = [];
  iswuliuorder = true; // 查询中选单页面判断是否来源于物流竞价
  mohubaojia: any = {}; // 模糊报价对象
  provinces = [];
  citys = [];
  countys = [];
  provinces1 = [];
  citys1 = [];
  countys1 = [];
  transporttype = [{ label: '请选择。。。', value: null }, { label: '汽运', value: 1 }, { label: '铁运', value: 2 }, { label: '船运', value: 3 }];
  count = 0;
  sumweight = '0';
  matchgudingData: any = {};
  wlcustomers = [];
  isshowInput: Boolean = false;
  baojiatypes = [{ label: '单价', value: 'UNIT' }, { label: '总价', value: 'TOTAL' }];
  jiaoqis = [{ label: '无需填写', value: 'NONE' }, { label: '填写相对交期', value: 'RELATIVE' }, { label: '填写固定交期', value: 'ABSOLUTE' }];
  sccbaojia: any = { beizhu: null, baojiatype: 'UNIT', baojiaaccount: 3, jiezhidate: null, jiaohuo: 'RELATIVE' };
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private feeApi: FeeapiService,
    private toast: ToasterService,
    private addressparseService: AddressparseService,
    private orgApi: OrgApiService,
    private bsModalService: BsModalService,
    private classifyApi: ClassifyApiService,
    private qihuoapi: QihuoService,
    private router: Router,
    private customerapi: CustomerapiService
  ) {
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
      rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT,
      onRowSelected: (params) => {
        if (params.node['selected']) {
          if (params.data) {
            this.count += 1;
            this.sumweight = (Number(this.sumweight) + Number(params.node.data.weight)).toFixed(3);
          }
        } else {
          if (params.data) {
            this.count = this.count - 1;
            this.sumweight = (Number(this.sumweight) - Number(params.node.data.weight)).toFixed(3);
          }
        }
      },
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, colId: 'group', headerName: '选择', field: 'group'
        , menuTabs: ['filterMenuTab'],
        minWidth: 60, checkboxSelection: true, headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.billno && params.data.billno.substring(0, 2) === 'QH' && params.data.billid) {
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno && params.data.billno.substring(0, 2) === 'BO' && params.data.billid) {
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno && params.data.billno.substring(0, 2) === 'LD' && params.data.billid) { // 临调
              return '<a target="_blank" href="#/ldorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno && params.data.billno.substring(0, 2) === 'AL' && params.data.billid) { // 调拨
              return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno && params.data.billno.substring(0, 2) === 'PO' && params.data.billid) { // 加工订单
              return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (params.data.billno && params.data.billno.substring(0, 2) === 'ZT' && params.data.billid) { // 在途
              return '<a target="_blank" href="#/zaituruku/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              console.log(params.data.billno.substring(0, 2));
              return params.data.billno;
            }
          }
        },
        // menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '竞价类别', field: 'billtype', minWidth: 100, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '请购单号', field: 'purchaserequestno', minWidth: 100,
        menuTabs: ['filterMenuTab'], cellRenderer: function (params) {
          if (params.data) {
            if (params.data['biddingorderid']) {
              return '<a>' + params.data.purchaserequestno + '</a>';
            } else {
              return params.data.purchaserequestno;
            }
          }
        }, onCellClicked: (data) => {
          if (data.data['biddingorderid']) {
            this.gozhongxuandan(data.data['biddingorderid']);
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'wuliuordertypename', minWidth: 60, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户', field: 'buyername', minWidth: 100, menuTabs: ['filterMenuTab'] },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流员', field: 'notifiername', minWidth: 100, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', minWidth: 100, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', minWidth: 120, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'provincename', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'cityname', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'countyname', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地仓库', field: 'startcangname', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'enddest', minWidth: 100, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '目的地仓库', field: 'endcangkuname', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '报价方式', field: 'ist', minWidth: 80, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '系统单价', field: 'price', minWidth: 80, menuTabs: ['filterMenuTab'],
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '系统总价', field: 'jine', minWidth: 80, menuTabs: ['filterMenuTab'],
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerprice', headerName: '实付单价', field: 'innerprice',
        minWidth: 80, menuTabs: ['filterMenuTab'],valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerjine', headerName: '实付总价', field: 'innerjine',
        minWidth: 80, menuTabs: ['filterMenuTab'],valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'customername', headerName: '运费单位', field: 'customername',
        minWidth: 100, menuTabs: ['filterMenuTab']
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 200, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, menuTabs: ['filterMenuTab'] },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3, menuTabs: ['filterMenuTab']
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 57, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 60, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'baojiadate', minWidth: 110, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '预计发货时间', field: 'fahuodate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '零散发货', field: 'ispieces', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货人', field: 'shouhuouser', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货人电话', field: 'shouhuophone', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '指定收货签字人', field: 'isshouhuosign', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isshouhuosign ? '是' : '否';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '签字人', field: 'signuser', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '签字人电话', field: 'signphone', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货人', field: 'xhlianxiren', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货人电话', field: 'xhlianxirenphone', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否加工', field: 'isjiagong', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工成品规格', field: 'cpguige', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 110, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否约车', field: 'ismatchcar', minWidth: 80, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 80, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否作废', field: 'isdel', minWidth: 80, menuTabs: ['filterMenuTab'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选供应商', field: 'bidding_supplier', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '中选价格', field: 'bidding_price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier_name2', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价', field: 'supplier2_price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier_name3', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价', field: 'supplier3_price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier_name4', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价', field: 'supplier4_price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier_name5', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价', field: 'supplier5_price', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价审批时间', field: 'vdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'oneweight', minWidth: 80 }
    ];
    this.yfgridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      rowSelection: 'multiple',
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.yfgridOptions.onGridReady = this.settings.onGridReady;
    this.yfgridOptions.groupSuppressAutoColumn = true;
    this.yfgridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true,
        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地仓库', field: 'startcangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 省', field: 'endprovincename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 市', field: 'endcityname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 县', field: 'endcountyname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地仓库', field: 'endcangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '载重区间', field: 'weightrange', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'yuntype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '竞价方式', field: 'ist', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费', field: 'price', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效开始时间', field: 'effectivestarttime', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效结束时间', field: 'effectiveendtime', minWidth: 110 },
    ];
    this.getorgs();
  }

  ngOnInit() {
    this.listDetail();
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
    this.getweightrange();
  }

  results = [];

  searchSccCusstomer($event) {
    const searchs = { name: $event['query'] };
    this.customerapi.findsccwlsearch(searchs).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.name,
          code: element.id,
          sccid: element.sccid
        });
      });
    });
  }

  /**
   * 获取载重区间值
   */
  getweightrange() {
    this.minweights = [{ label: '请选择', value: null }];
    this.classifyApi.listclassify('yunfee_weightrange').then(data => {
      data.forEach(e => {
        this.minweights.push({ label: e['name'], value: e['name'] });
      });
      this.maxweights = this.minweights;
    });
  }

  listDetail() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 9 || item === 1)) { // 物流专员和管理员
      this.iswuliubu = true;
    } else {
      this.gridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'innerprice' || colde.colId === 'customername' || colde.colId === 'group' || colde.colId === 'innerjine') {
          colde.hide = true;
        }
      });
      this.iswuliubu = false;
    }
    this.feeApi.wuliubaojiadet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  /**获取机构 */
  getorgs() {
    this.orgs = [{ value: '', label: '全部' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          value: element.id,
          label: element.name
        });
      });
    });
  }

  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }

  openRefreshDialog() {
    this.showrefreshmaycurModel();
  }

  selectNull() {
    this.changegudingparams = {
      minweight: '', maxweight: '', wuliuorderid: ''
    };
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', customerid: '', salemanid: '', orgid: '', isdel: false
    };
    this.end = undefined;
    this.start = new Date();
    this.saleman = null;
    this.wlcustomer = null;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.saleman) === 'string' || !this.saleman) {
        this.requestparams['salemanid'] = '';
      } else if (typeof (this.saleman) === 'object') {
        this.requestparams.salemanid = this.saleman['id'];
      }
      if (typeof (this.wlcustomer) === 'string' || !this.wlcustomer) {
        this.requestparams['customerid'] = '';
      } else if (typeof (this.wlcustomer) === 'object' && this.wlcustomer['code']) {
        this.requestparams['customerid'] = this.wlcustomer['code'];
      }
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  }
  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '物流竞价明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  /**竞价转固定路线弹窗 */
  // showchangegudingModal(){
  //   this.changegudingModal.show();
  // }
  hidechangegudingModal() {
    this.changegudingModal.hide();
  }

  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }
  showrefreshmaycurModel() {
    this.refreshmaycurModel.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  hiderefreshmaycurModel() {
    this.refreshmaycurModel.hide();
  }
  /**填写报价弹窗 */
  showbaojiamodal() {
    let sumweight = 0;
    const wuliuorderids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        sumweight = sumweight + orderdetSelected[i].data.weight;
        wuliuorderids.push(orderdetSelected[i].data.id);
        if (orderdetSelected[i].data.wuliuordertype !== 1 && !(orderdetSelected[i].data.wuliuordertype === 3 &&
          orderdetSelected[i].data.billtype === '固定路线')) {
          this.toast.pop('warning', '只有已通知状态下或已确认固定路线的物流竞价才可以手动报价！！！');
          return;
        }
      }
    }
    if (wuliuorderids.length < 1) {
      this.toast.pop('warning', '请选择物流竞价明细！！！');
      return;
    }
    if (wuliuorderids.length > 1) {
      this.toast.pop('warning', '请选择一条物流竞价明细！！！');
      return;
    }
    this.wlcustomer = null;
    this.wuliuorder = {};
    this.wuliuorder['wuliuorderids'] = wuliuorderids;
    this.wuliuorder['sumweight'] = sumweight;
    this.wuliuorderModel.show();
  }
  /**关闭报价弹窗 */
  closewuliuorderdialog() {
    this.wuliuorderModel.hide();
  }
  // 计算金额
  calinnerjine() {
    if (this.wuliuorder['innerprice']) {
      this.wuliuorder['innerjine'] = (parseFloat(this.wuliuorder['innerprice']) * parseFloat(this.wuliuorder['sumweight'])).toFixed(2);
    }
  }
  calinnerprice() {
    if (this.wuliuorder['innerjine']) {
      this.wuliuorder['innerprice'] = (parseFloat(this.wuliuorder['innerjine']) / parseFloat(this.wuliuorder['sumweight'])).toFixed(2);
    }
  }
  addwuliuorder() {
    if (this.wuliuorder['ist'] === undefined) {
      this.toast.pop('warning', '请选择报价方式！！！');
      return;
    }
    if (this.wuliuorder['innerprice'] === undefined || this.wuliuorder['innerprice'] === null) {
      this.toast.pop('warning', '请填写单价！！！');
      return;
    }
    if (this.wuliuorder['innerjine'] === undefined || this.wuliuorder['innerjine'] === null) {
      this.toast.pop('warning', '请填写金额！！！');
      return;
    }
    if (!this.wuliuorder['beizhu']) {
      this.toast.pop('warning', '请填写备注！！！');
      return;
    }
    if (typeof (this.wlcustomer) === 'string' || !this.wlcustomer) {
      this.wuliuorder['wlcustomerid'] = '';
    } else if (typeof (this.wlcustomer) === 'object' && this.wlcustomer['code']) {
      this.wuliuorder['wlcustomerid'] = this.wlcustomer['code'];
    }
    if (!this.wuliuorder['wlcustomerid']) {
      this.toast.pop('warning', '请选择物流公司！！！');
      return;
    }
    this.feeApi.addwuliubaojia(this.wuliuorder).then(data => {
      this.toast.pop('success', '报价添加成功');
      this.closewuliuorderdialog();
      this.listDetail();
    });
  }
  // 竞价转固定路线
  changeguding() {
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      // if(i > 2){
      //   this.toast.pop('warning', '只能选择一条竞价明细转固定路线！！！');
      //     return;
      // }
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        //竞价类别为SCC询价
        if (orderdetSelected[i].data.billtype != 'SCC询价') {
          this.toast.pop('warning', '请选择SCC询价的订单！！！');
          return;
        }
        if (orderdetSelected[i].data.wuliuordertype === 4) {
          this.toast.pop('warning', '请选择已确认的明细转为固定路线！！！');
          return;
        }
        if (orderdetSelected[i].data.wuliuordertype === 1) {
          this.toast.pop('warning', '请选择已确认的明细转为固定路线！！！');
          return;
        }

        wuliuorderdetids.push(orderdetSelected[i].data.id);
        this.changegudingparams.wuliuorderid = orderdetSelected[i].data.id;
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择需要转为固定路线的期货明细！！！');
      return;
    }
    if (wuliuorderdetids.length > 1) {
      this.toast.pop('warning', '只能选择一条需要转为固定路线的期货明细！！！');
      return;
    }
    this.changegudingModal.show();
  }

  createguding() {
    console.log(this.changegudingparams);
    this.feeApi.changeguding(this.changegudingparams).then(data => {
      this.toast.pop('success', '转固定路线成功');
      this.hidechangegudingModal();
      this.listDetail();
    });
  }

  // 中选单列表
  showbiddingorder() {
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        wuliuorderdetids.push(orderdetSelected[i].data.id);
        if (orderdetSelected[i].data.wuliuordertype !== 4) {
          this.toast.pop('warning', '请选择已发送SCC的明细！！！');
          return;
        }
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择物流竞价明细！！！');
      return;
    }
    this.wuliuorderdetids = wuliuorderdetids;
    this.bsModalService.config.class = 'modal-all';
    this.bobsModalRef = this.bsModalService.show(BiddingorderimportComponent);
    this.bobsModalRef.content.parentthis = this;
  }
  /**SCC请购物流竞价服务 */
  SCCgetprice() {
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        if (orderdetSelected[i].data.wuliuordertype === 4) {
          this.toast.pop('warning', '请选择没有竞价的明细同步到SCC！！！');
          return;
        }
        if (orderdetSelected[i].data.wuliuordertype === 3) {
          this.toast.pop('warning', '请选择已通知的明细同步到SCC！！！');
          return;
        }
        wuliuorderdetids.push(orderdetSelected[i].data.id);
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择需要询价的期货明细！！！');
      return;
    }
    this.wuliuorder['wuliuorderdetids'] = wuliuorderdetids;
    this.feeApi.sccgetprice(this.wuliuorder).then(data => {
      this.toast.pop('success', 'SCC询价成功');
      this.closewuliuorderdialog();
      this.listDetail();
    });
  }
  SCCnewdialog() {
    this.sccnewdialog.show();
  }
  hidesccnewDialog() {
    this.sccnewdialog.hide();
  }

  showInput() {
    this.isshowInput = !this.isshowInput;
  }
  addwlcustomer(e) {
    console.log(this.wlcustomers);
    if (!e) {
      return;
    }
    let i = 0;
    this.wlcustomers.forEach(element => {
      if (e.code === element.wlcustomerid) {
        this.toast.pop('warning', '重复添加！');
        i++;
      }
    });
    if (i > 0) {
      return;
    }
    if (e) {
      this.wlcustomers.push({ wlcustomerid: e.code, wlcustomername: e.name, sccid: e.sccid });
    }
  }
  delwlcustomer(id) {
    for (let index = 0; index < this.wlcustomers.length; index++) {
      if (id === this.wlcustomers[index].wlcustomerid) {
        this.wlcustomers.splice(index, 1);
      }
    }
    console.log(this.wlcustomers);
  }
  SCCgetpricenew() {
    console.log(this.sccbaojia);
    const wuliuorderdetids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。

    console.log(this.sccbaojia.jiezhidate);
    if (this.sccbaojia.jiezhidate === null) {
      this.toast.pop('warning', '请选择报价截止时间！！！');
      return;
    }
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        if (orderdetSelected[i].data.wuliuordertype === 8) {
          this.toast.pop('warning', '请选择没有竞价的明细同步到SCC！！！');
          return;
        }
        if (orderdetSelected[i].data.wuliuordertype === 3) {
          this.toast.pop('warning', '请选择已通知的明细同步到SCC！！！');
          return;
        }
        wuliuorderdetids.push(orderdetSelected[i].data.id);
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择需要询价的期货明细！！！');
      return;
    }
    if (this.wlcustomers.length < 1) {
      this.toast.pop('warning', '请选择需要报价供应商！！！');
      return;
    }
    this.sccbaojia.wuliuorderdetids = wuliuorderdetids;
    this.sccbaojia.suppliers = this.wlcustomers;
    let sds = this.datePipe.transform(this.sccbaojia.jiezhidate,"yyyy-MM-dd");
    this.sccbaojia.jiezhidate = new Date(sds + ' 23:59:59');
    this.feeApi.sccgetpricenew(this.sccbaojia).then(data => {
      this.toast.pop('success', 'SCC询价成功');
      this.closewuliuorderdialog();
      this.listDetail();
    });
  }
  /**
   * 物流竞价明细作废
   */
  zuofei() {
    const wuliuorderdetids = [];
    const wuliuorderdetbillnos = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        wuliuorderdetids.push(orderdetSelected[i].data.id);
        wuliuorderdetbillnos.push(orderdetSelected[i].data.billno);
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    sweetalert({
      title: '你确定要作废吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.feeApi.zuofei(wuliuorderdetids).then(data => {
        this.toast.pop('success', '作废成功');
        this.listDetail();
      });
      sweetalert.close();
    });
  }
  /**打开引入固定路线弹窗 */
  showyunfeemodal() {
    this.bsModalService.config.class = 'modal-all';
    this.bobsModalRef = this.bsModalService.show(YunfeeimportComponent);
    this.bobsModalRef.content.parentthis = this;
  }
  /**跳转scc中选单 */
  gozhongxuandan(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      if (environment.ismenhu) {
        window.open(`${environment.mainappUrl}`, '_self');
        return;
      }
      this.router.navigateByUrl('/passport/login');
      return;
    }
    const url = `${environment.sccUrl}`;
    if (url) {
      const esystem = window.open(`${url}#/buy/bidding-management/${id}`);
      const setToken = () => {
        esystem.postMessage({ type: 'wsdtoken', data: token }, url);
      };
      const timer = setInterval(setToken, 100);
      const timeOutr = setTimeout(() => {
        if (timer) {
          clearInterval(timer);
        }
      }, 5000);
      window.addEventListener('message', (e: any) => {
        if (e.data === 'wsdloginsuccess') {
          window.removeEventListener('message', setToken, true);
          clearTimeout(timeOutr);
          clearInterval(timer);
        }
      }, true);
    }
  }
  /**打开模糊报价弹窗 */
  showmohumodal() {
    this.getProvince();
    this.mohubaojia = { ist: false, yuntype: '' };
    this.mohuModal.show();
  }
  hidemohuModal() {
    this.mohuModal.hide();
  }
  /**
   * 起始地根据详细地址自动识别省市县
   */
  selectedenddest(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.mohubaojia['startprovinceid'] = '';
      this.mohubaojia['startcityid'] = '';
      this.mohubaojia['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.mohubaojia['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.mohubaojia['startprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.mohubaojia['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.mohubaojia['startcityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.mohubaojia['startcountyid'] = addressObj['countyValue'];
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  /**
   * 目的地根据详细地址自动识别省市县
   */
  selectedenddest1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys1 = []; this.countys1 = [];
      this.mohubaojia['endprovinceid'] = '';
      this.mohubaojia['endcityid'] = '';
      this.mohubaojia['endcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces1.length) {
          this.mohubaojia['endprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.mohubaojia['endprovinceid'], this.citys1).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.mohubaojia['endcityid'] = addressObj['cityValue'];
                this.getpcc(this.mohubaojia['endcityid'], this.countys1).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.mohubaojia['endcountyid'] = addressObj['countyValue'];
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }
  getcity1() {
    this.citys = [];
    delete this.mohubaojia['startcityid'];
    delete this.mohubaojia['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.mohubaojia['startprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  getcounty1() {
    this.countys = [];
    delete this.mohubaojia['startcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.mohubaojia['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getcity2() {
    this.citys1 = [];
    delete this.mohubaojia['endcityid'];
    delete this.mohubaojia['endcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.mohubaojia['endprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys1.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys1 = [];
    });
  }

  getcounty2() {
    this.countys1 = [];
    delete this.mohubaojia['endcountyid'];
    this.classifyApi.getChildrenTree({ pid: this.mohubaojia['endcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys1.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getProvince() {
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
      this.provinces1 = this.provinces;
      this.citys1 = [];
      this.countys1 = [];
    });
  }
  /**保存模糊报价 */
  addmohu() {
    if (this.provinces.length) {
      if (!this.mohubaojia['startprovinceid']) {
        this.toast.pop('warning', '请把起始地省填写完成!');
        return;
      }
    }
    if (this.citys.length) {
      if (!this.mohubaojia['startcityid']) {
        this.toast.pop('warning', '请把起始地市填写完成!');
        return;
      }
    }
    if (this.countys.length) {
      if (!this.mohubaojia['startcountyid']) {
        this.toast.pop('warning', '请把起始地县填写完成!');
        return;
      }
    }
    if (this.provinces1.length) {
      if (!this.mohubaojia['endprovinceid']) {
        this.toast.pop('warning', '请把目的地省填写完成!');
        return;
      }
    }
    if (this.citys1.length) {
      if (!this.mohubaojia['endcityid']) {
        this.toast.pop('warning', '请把目的地市填写完成!');
        return;
      }
    }
    if (this.countys1.length) {
      if (!this.mohubaojia['endcountyid']) {
        this.toast.pop('warning', '请把目的地县填写完成!');
        return;
      }
    }
    if (!this.mohubaojia['weight']) {
      this.toast.pop('warning', '请把重量填写完成!');
      return;
    }
    if (!this.mohubaojia['yuntype']) {
      this.toast.pop('warning', '请把运输类型填写完成!');
      return;
    }
    this.feeApi.createmohubaojia(this.mohubaojia).then(data => {
      this.toast.pop('success', '创建成功');
      this.listDetail();
      this.hidemohuModal();
    });
  }
  /**打开匹配固定路线弹窗 */
  showMatchgudingDialog() {
    this.matchgudingData = {};
    const wuliuorderdetids = [];
    const pccid = new Set();
    const transporttypes = new Set();
    let sumweight = '0';
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        if (orderdetSelected[i].data.isdel === '是') {
          this.toast.pop('warning', '已作废的不允许选择！！！');
          return;
        }
        if (orderdetSelected[i].data.wuliuordertype !== 1) {
          this.toast.pop('warning', '请选择已通知的竞价明细！！！');
          return;
        }
        wuliuorderdetids.push(orderdetSelected[i].data.id);
        const startandend = orderdetSelected[i].data['startarea'] + '#' + orderdetSelected[i].data['provincename'] +
          orderdetSelected[i].data['cityname'] + orderdetSelected[i].data['countyname'];
        pccid.add(startandend);
        transporttypes.add(orderdetSelected[i].data['transporttype']);
        sumweight = (Number(sumweight) + Number(orderdetSelected[i].data.weight)).toFixed(3);
      }
    }
    if (wuliuorderdetids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    if (pccid.size > 1) {
      this.toast.pop('warning', '请选择起始地目的地一致的明细！！！');
      return;
    }
    if (transporttypes.size > 1) {
      this.toast.pop('warning', '请选择运输方式一致的明细！！！');
      return;
    }
    this.matchgudingData['wuliuorderdetids'] = wuliuorderdetids;
    this.matchgudingData['sumweight'] = sumweight;
    this.matchgudingDialog.show();
    /**匹配固定路线*/
    this.qihuoapi.matchSection(this.matchgudingData).then(data => {
      this.yfgridOptions.api.setRowData(data);
      if (!data.length) {
        this.toast.pop('info', '没有匹配到固定路线！');
      }
    });
  }
  /**关闭匹配固定路线弹窗 */
  closematchgudingDialog() {
    this.matchgudingDialog.hide();
  }
  // 匹配固定路线
  yunfeeIsYes() {
    const sectionids = [];
    const orderdetSelected = this.yfgridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        sectionids.push(orderdetSelected[i].data.id);
      }
    }
    if (sectionids.length < 1) {
      this.toast.pop('warning', '请选择匹配到的固定路线！！！');
      return;
    }
    if (sectionids.length > 1) {
      this.toast.pop('warning', '只能选择一条固定路线！！！');
      return;
    }
    const params = {
      sectionid: sectionids[0], wuliuorderdetids: this.matchgudingData['wuliuorderdetids'],
      sumweight: this.matchgudingData['sumweight']
    };
    this.feeApi.matchguding(params).then(() => {
      this.listDetail();
      this.closematchgudingDialog();
    });
  }
  /**转运价参考价 */
  toyunjiacankao() {
    const wuliuorderids = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的物流竞价明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        wuliuorderids.push(orderdetSelected[i].data.id);
      }
    }
    if (wuliuorderids.length < 1) {
      this.toast.pop('warning', '请选择竞价明细！！！');
      return;
    }
    const params = { wuliuorderids: wuliuorderids };
    this.feeApi.createyunpricecankao(params).then(() => {
      this.toast.pop('success', '成功转成运价参考值！');
    });
  }


}
