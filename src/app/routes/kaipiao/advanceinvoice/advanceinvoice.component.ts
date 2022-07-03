import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanceinvoice',
  templateUrl: './advanceinvoice.component.html',
  styleUrls: ['./advanceinvoice.component.scss']
})
export class AdvanceinvoiceComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('kaipiaoModal') private kaipiaoModal: ModalDirective;
  @ViewChild('addrModal') private addrModal: ModalDirective;
  wuliuorder: any = {};
  start = new Date();
  end: Date;
  vstart: Date;
  vend: Date;
  customer = {};
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '', vstart: '', vend: '', customerid: '', sellerid: '', cuserid: '', orgid: ''
  };
  gridOptions: GridOptions;
  orgs = [];
  saleman: any = {};
  sellers: any = [];
  types: any = [{ value: '', label: '请选择发票类型' }, { value: '0', label: '增值税（普通）' }, { value: '1', label: '增值税（专用）' }];
  maxDate = new Date();
  minDate = new Date();
  finishdate = new Date();
  params: any = {};
  companys: any = {};
  addrs: any = [];
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  expresses: any = [];
  sellersResult: any = [];
  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private toast: ToasterService,
    private customerApi: CustomerapiService,
    private orderApi: OrderapiService,
    private orgApi: OrgApiService,
    private classifyApi: ClassifyApiService,
    private router: Router) {
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
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '申请单号', field: 'billno', width: 120,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/advanceinvoice/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '申请日期', field: 'cdate', width: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售合同号', field: 'orbill', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卖方公司', field: 'sname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '申请人', field: 'arealname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'bname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '开票品名', field: 'invoicegn', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单位', field: 'utit', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税单价', field: 'price', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '含税金额', field: 'jine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '其他单位', field: 'unitname', width: 80
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '其他单位重量', field: 'unitweight', width: 100, aggFunc: 'sum',
      //   valueGetter: (params) => {
      //     if (params.data['unitweight']) {
      //       return Number(params.data['unitweight']);
      //     } else {
      //       return 0;
      //     }
      //   }, valueFormatter: this.settings.valueFormatter
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '其他单位单价', field: 'unitprice', width: 80
      // },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '其他单位含税金额', field: 'unitjine', width: 100, aggFunc: 'sum',
      //   valueGetter: (params) => {
      //     if (params.data['unitjine']) {
      //       return Number(params.data['unitjine']);
      //     } else {
      //       return 0;
      //     }
      //   }, valueFormatter: this.settings.valueFormatter2
      // },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'invoiceno', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '开票时间', field: 'invoicedate', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已完成还单重量', field: 'hweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['hweight']) {
            return Number(params.data['hweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已完成还单金额', field: 'hjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['hjine']) {
            return Number(params.data['hjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未完成还单重量', field: 'wweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['wweight']) {
            return Number(params.data['wweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未完成还单金额', field: 'wjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['wjine']) {
            return Number(params.data['wjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '保证完成日期', field: 'finishdate', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否逾期', field: 'isoverdue', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '逾期产生税额', field: 'taxjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['taxjine']) {
            return Number(params.data['taxjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提前开票原因', field: 'reason', width: 110
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '客户款项', field: 'yue', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '复核人', field: 'checkname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '快递公司', field: 'express', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '发票收件人', field: 'shoujianren', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否到付', field: 'isarrivalpay', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '快递单号', field: 'expressno', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '收件人电话', field: 'shoujiantel', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '收件人地址', field: 'maddress', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否生成涉税凭证', field: 'isshpz', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否作废', field: 'isdel', width: 80
      }
    ];
    this.getorgs();
  }
  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.orderApi.getadvanceinvoicelist(this.requestparams).then((response) => {
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
    if (this.sellersResult.length < 1) {
      this.sellersResult = [{ value: '', label: '全部' }];
      this.customerApi.findwiskind().then((response) => {
        response.forEach(element => {
          this.sellersResult.push({
            value: element.id,
            label: element.name
          });
        });
      });
    }
    this.showclassicModal();
    this.selectNull();
  }

  selectNull() {
    this.requestparams = {
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '', vstart: '', vend: '', customerid: '', sellerid: '', cuserid: '', orgid: ''
    };
    this.end = undefined;
    this.start = new Date();
    this.vstart = undefined;
    this.vend = undefined;
    this.saleman = null;
    this.customer = null;
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
      if (this.vstart) {
        this.requestparams.vstart = this.datePipe.transform(this.vstart, 'yyyy-MM-dd');
      } else {
        this.requestparams.vstart = '';
      }
      if (this.vend) {
        this.requestparams.vend = this.datePipe.transform(this.vend, 'yyyy-MM-dd');
      } else {
        this.requestparams.vend = '';
      }
      if (typeof (this.saleman) === 'string' || !this.saleman) {
        this.requestparams['cuserid'] = '';
      } else if (typeof (this.saleman) === 'object') {
        this.requestparams.cuserid = this.saleman['code'];
      }
      if (typeof (this.customer) === 'string' || !this.customer) {
        this.requestparams['buyerid'] = '';
      } else if (typeof (this.customer) === 'object' && this.customer['code']) {
        this.requestparams['buyerid'] = this.customer['code'];
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
      fileName: '销售提前开票明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  /**查询弹窗 */
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  /**创建弹窗 */
  showaddmodal() {
    this.getseller();
    this.getexpresses();
    this.kaipiaoModal.show();
  }
  /**关闭创建弹窗 */
  hidekaipiaoModal() {
    this.kaipiaoModal.hide();
  }
  submitkaipiao() {
    if (typeof (this.companys) === 'object') {
      this.params.buyerid = this.companys['code'];
    } else {
      this.params.buyerid = '';
    }
    if (!this.params['buyerid']) {
      this.toast.pop('warning', '请填写买方！！！');
      return;
    }
    // if (!this.params['sellerid']) {
    //   this.toast.pop('warning', '请填写卖方！！！');
    //   return;
    // }
    if (!this.params['type']) {
      this.toast.pop('warning', '请选择发票类型！！！');
      return;
    }
    if (!this.params['reason']) {
      this.toast.pop('warning', '请填写提前开票原因！！！');
      return;
    }
    if (!this.params['maddressid'] && this.params['express'] !== '自领发票') {
      this.toast.pop('warning', '请选择邮寄地址！！！');
      return;
    }
    if (!this.params['express']) {
      this.toast.pop('warning', '请选择快递公司！！！');
      return;
    }
    this.params['finishdate'] = this.datePipe.transform(this.finishdate, 'y-MM-dd');
    this.orderApi.createadvance(this.params).then(data => {
      this.hidekaipiaoModal();
      this.router.navigate(['advanceinvoice', data['id']]);
    });
  }
  /**获取卖方公司 */
  getseller() {
    this.customerApi.findwiskind().then((data) => {
      const sellerlist = [{ value: '', label: '全部' }];
      data.forEach(element => {
        sellerlist.push({
          label: element.name,
          value: element.id
        });
      });
      this.sellers = sellerlist;
    });
  }
  showaddr(event) {
    if (!event['code']) {
      return;
    }
    this.params['buyerid'] = event['code'];
    this.findAddr(event['code']);
  }
  // 获取选择公司的送货地址
  findAddr(customerid) {
    if (customerid) {
      const search = { buyerid: customerid, ismailaddr: true };
      const arry = [{ label: '取消', value: '' }];
      this.orderApi.listAddresses(search).then((data) => {
        for (let i = 0; i < data.length; i++) {
          const address = {
            value: data[i].id, label: data[i].province + data[i].city + data[i].county
              + data[i].detail
          };
          arry.push(address);
        }
        this.addrs = arry;
      });
    }
  }
  // 弹出添加地址的对话框
  addAddrDialog() {
    if (!this.params['buyerid']) {
      this.toast.pop('warning', '请先选择买方公司！！！');
      return;
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.showaddrModal();
    this.getProvince();
  }
  showaddrModal() {
    this.addrModal.show();
  }
  hideaddrModal() {
    this.addrModal.hide();
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
    });
  }
  getcity() {
    this.citys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }
  getcounty() {
    this.countys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 开始往数据库中添加内容
  addAddr() {
    if (!this.addr['provinceid']) {
      this.toast.pop('warning', '请选择省份！');
      return;
    }
    if (!this.addr['cityid']) {
      this.toast.pop('warning', '请选择城市！');
      return;
    }
    if (!this.addr['countyid']) {
      this.toast.pop('warning', '请选择县区！');
      return;
    }
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！');
      return;
    }
    if (!this.addr['lianxiren']) {
      this.toast.pop('warning', '请填写联系人！');
      return;
    }
    if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.addr['phone'])) {
      this.toast.pop('warning', '请填写正确联系电话！');
      return;
    }
    this.addr['customerid'] = this.params['buyerid'];
    this.addr['ismailaddr'] = true;
    this.orderApi.addAddr(this.addr).then((data) => {
      this.hideaddrModal();
      this.findAddr(this.params['buyerid']);
    });
  }
  /**获取快递公司 */
  getexpresses() {
    this.classifyApi.listBypid({ pid: 3949 }).then((data) => {
      const lists = [{ label: '请选择快递公司', value: '' }];
      data.forEach(element => {
        lists.push({
          label: element['name'],
          value: element['name']
        });
      });
      this.expresses = lists;
    });
  }
}
