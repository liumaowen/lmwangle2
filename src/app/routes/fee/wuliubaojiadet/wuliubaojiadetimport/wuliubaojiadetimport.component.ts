import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeeapiService } from '../../feeapi.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { GridOptions, ColDef } from 'ag-grid/main';
import { SettingsService } from '../../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

@Component({
  selector: 'app-wuliubaojiadetimport',
  templateUrl: './wuliubaojiadetimport.component.html',
  styleUrls: ['./wuliubaojiadetimport.component.scss']
})
export class WuliubaojiadetimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;


  wuliuorderids : any;
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

  params = {};
  gridOptions: GridOptions;
  yfgridOptions: GridOptions; // 固定路线明细
  orgs = [];
  saleman: any = {};
  iswuliubu = true; // 是否是物流部的人员
  // 中选单列表弹窗对象
  bobsModalRef: BsModalRef;
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
    public bsModalRef: BsModalRef,
    private classifyApi: ClassifyApiService,
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
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '请购单号', field: 'purchaserequestno', minWidth: 100,
      },
      {
        cellClass: 'text-center', headerName: '起始地', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '省', field: 'startprovincename', minWidth: 80, menuTabs: ['filterMenuTab']
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '市', field: 'startcityname', minWidth: 80, menuTabs: ['filterMenuTab']
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '县', field: 'startcountyname', minWidth: 80, menuTabs: ['filterMenuTab']
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '详细地址', field: 'startarea', minWidth: 120, menuTabs: ['filterMenuTab']
          },
        ]
      },
      {
        cellClass: 'text-center', headerName: '目的地', headerClass: 'wis-ag-center',
        children: [
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
            cellStyle: { 'text-align': 'center' }, headerName: '详细地址', field: 'enddest', minWidth: 100, menuTabs: ['filterMenuTab']
          },
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerprice', headerName: '实付单价', field: 'innerprice',
        minWidth: 80, menuTabs: ['filterMenuTab'],valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'customername', headerName: '运费单位', field: 'customername',
        minWidth: 100, menuTabs: ['filterMenuTab']
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'wbaojiadate', minWidth: 110, menuTabs: ['filterMenuTab'] },
    ];
    // this.yfgridOptions = {
    //   groupDefaultExpanded: -1,
    //   suppressAggFuncInHeader: true,
    //   enableRangeSelection: true,
    //   rowDeselection: true,
    //   overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
    //   overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
    //   enableColResize: true,
    //   enableSorting: true,
    //   enableFilter: true,
    //   excelStyles: this.settings.excelStyles,
    //   rowSelection: 'multiple',
    //   getContextMenuItems: this.settings.getContextMenuItems
    // };
    // this.yfgridOptions.onGridReady = this.settings.onGridReady;
    // this.yfgridOptions.groupSuppressAutoColumn = true;
    // this.yfgridOptions.columnDefs = [
    //   {
    //     cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true,
    //     headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
    //   },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '起始地仓库', field: 'startcangkuname', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 130 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '目的地 省', field: 'endprovincename', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '目的地 市', field: 'endcityname', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '目的地 县', field: 'endcountyname', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '目的地仓库', field: 'endcangkuname', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '载重区间', field: 'weightrange', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'yuntype', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '竞价方式', field: 'ist', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '运费', field: 'price', width: 100 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '有效开始时间', field: 'effectivestarttime', minWidth: 110 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '有效结束时间', field: 'effectiveendtime', minWidth: 110 },
    // ];
    //this.getorgs();
  }

  ngOnInit() {
    setTimeout(() => {
      this.listDetail();
    }, 1000);
  }
  listDetail() {
    this.params['updateid'] = this.wuliuorderids[0]
    this.feeApi.wuliubaojiaRoute(this.wuliuorderids[0]).then((response) => {
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
  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }

  confirm(){
    const wuliuorderids2 = new Array();
    const wuliuorderlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < wuliuorderlist.length; i++) {
      if (wuliuorderlist[i].selected && wuliuorderlist[i].data) {
        if(wuliuorderlist[i].data.wuliuordertype !== 3){
          this.toast.pop('warning', '请选择已确认状态的数据');
          return;
        }
        wuliuorderids2.push(wuliuorderlist[i].data.id);
      }
    }
    if (wuliuorderids2.length !== 1) {
      this.toast.pop('warning', '请选择一条明细！');
      return;
    }
    this.params['confirmid'] = wuliuorderids2[0];
    this.feeApi.confirm(this.params).then(data => {
      this.toast.pop('success', '报价添加成功');
      this.listDetail();
      this.bsModalRef.hide();
    });
  }
}
