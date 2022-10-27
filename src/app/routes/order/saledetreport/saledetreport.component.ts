import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ReportService } from './../../report/report.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderapiService } from '../orderapi.service';
import { Router } from '@angular/router';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-saledetreport',
  templateUrl: './saledetreport.component.html',
  styleUrls: ['./saledetreport.component.scss']
})
export class SaledetreportComponent implements OnInit {
  companyIsWiskind: any = [];
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  start: Date = new Date();

  end: Date = new Date();

  maxDate: Date = new Date();

  billstatus = [{ value: '', label: '全部' }, { value: 1, label: '不含撤销' }, { value: 2, label: '实提(不含撤销和临调)' }];
  detstatus = [{ value: '', label: '全部' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }];

  requestparams =
    {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '',
      orgid: '', cuserid: '', id: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd'), buyerid: '', sellerid: '', billstatus: '', detstatus: ''
    };
  cusers: any;
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private datepipe: DatePipe, private reportApi: ReportService,
    private orderApi: OrderapiService, private storage: StorageService, private customerApi: CustomerapiService,
    private orgApi: OrgApiService, private toast: ToasterService, private classifyApi: ClassifyApiService, private router: Router) {
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
      enableFilter: true,
    }
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 72, pinned: 'left',
        checkboxSelection: (params) => params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'TH') {// 提货单
              return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (null != params.data.billno && params.data.billno.substring(0, 2) === 'OR') {// 线上
              return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (null != params.data.billno && params.data.billno.substring(0, 2) === 'BO') {// 线下
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (null != params.data.billno && params.data.billno.substring(0, 2) === 'PO') {// 加工
              return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (null != params.data.billno && params.data.billno.substring(0, 2) === 'XT') {// 退货
              return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else if (null != params.data.billno && params.data.billno.substring(0, 2) === 'XB') {// 销售补差
              return '<a target="_blank" href="#/xsbucha/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return params.data.billno;
            }
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'dantype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据状态', field: 'billstatus', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细状态', field: 'detstatus', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyername', width: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省份', field: 'province', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '地区', field: 'city', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢卷类型', field: 'ftype', width: 80 , colId: 'ftype'},
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'tweight', width: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['tweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '考核价', field: 'kaoheprice', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 70, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单吨（加/减）/元', field: 'fapiaochae', width: 70,
        cellRenderer: (params) => {
          if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
            return params.data['fapiaochae'];
          } else {
            return '';
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '开票单价', field: 'fapiaoprice', width: 70,
        cellRenderer: (params) => {
          if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
            return params.data['fapiaoprice'];
          } else {
            return '';
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '开票金额', field: 'fapiaojine', width: 70,
        cellRenderer: (params) => {
          if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
            return params.data['fapiaojine'];
          } else {
            return '';
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同性质', field: 'ordertype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'caigoutype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'sellername', width: 230 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款时间', field: 'paydate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'sdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否涉税开票', field: 'sheshuikaipiao', width: 75,
        cellRenderer: (params) => {
          if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
            return params.data['sheshuikaipiao'];
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '开票日期', field: 'kaipiaodate', width: 75,
        cellRenderer: (params) => {
          if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
            return params.data['kaipiaodate'];
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '对外开票日期', field: 'salebilldate', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'suppliername', width: 60 }
    ];
    this.getMyRole();

  }

  ngOnInit() {
    this.cuser = this.storage.getObject('cuser');
  }

  // 列表赋值
  listDetail() {
    this.reportApi.saledet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  }

  orgs = [];

  sellersResult = [];

  cangku = [];
  gns = [];

  // 查询对话框
  openQueryDialog() {
    // 卖方公司信息
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
    // 机构信息
    if (this.orgs.length < 1) {
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
    // 查找仓库
    if (this.cangku.length < 1) {
      this.cangku = [{ value: '', label: '全部' }];
      this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            value: element.id,
            label: element.name
          });
        });
      });
    }
    // 查找商品
    // if (this.gns.length < 1) {
    //   this.gns = [{ value: '', label: '全部' }];
    //   this.classifyApi.getarea().then((resource) => {
    //     resource['gn'].forEach(element => {
    //       this.gns.push({
    //         value: element.id,
    //         label: element.name
    //       });
    //     });
    //   });
    // }
    this.showdialog();
  }

  // 常量作为字段名
  // tslint:disable-next-line:member-ordering
  fieldArr = [
    'chandi', //  产地
    'color', // 颜色
    'width', // 宽度
    'houdu', // 厚度
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro' // 后处理
  ];

  data;

  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}

  // 赛选过滤方法
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      let otherFieldArr = this.fieldArr.filter(element => element != fieldElement);
      let queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.requestparams[otherField] == '' || dataElement[otherField] == this.requestparams[otherField];
          })) {
            let fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) == -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions;
      });
    });
  }

  selectGnAction(key) {
    this.requestparams.chandi = '';
    this.requestparams.color = '';
    this.requestparams.width = '';
    this.requestparams.houdu = '';
    this.requestparams.duceng = '';
    this.requestparams.caizhi = '';
    this.requestparams.ppro = '';
    // 取消选择，则选项绑定变量变成null,以此为条件发出请求，null的会被忽略，导致服务端找不到参数出错
    if (!this.requestparams[key]) {
      return;
    }
    // this.reportApi.getGoodscodeAttribute({ gnid: this.requestparams.gnid }).then((response) => {
    //   this.conditions = response;
    //   this.data = response;
    //   this.filter();
    // });
    this.disabled = false;
  }

  selectAction(key) {
    this.filter();
  }

  filters = {};
  conditions = null;

  disabled = true;

  cuser;

  suser;

  companys;
  // 查询提货单
  query() {
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.requestparams.cuserid = '';
    } else if (typeof (this.cuser) === 'object') {
      this.requestparams.cuserid = this.cuser['code'];
    }
    if (typeof (this.suser) === 'string' || !this.suser) {
      this.requestparams['salemanid'] = '';
    } else if (typeof (this.suser) === 'object') {
      this.requestparams['salemanid'] = this.suser['code'];
    }
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.requestparams['buyerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.requestparams.buyerid = this.companys['code'];
    }
    this.listDetail();
    this.hidedialog();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '',
      ppro: '', orgid: '', cuserid: '', id: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
      end: this.datepipe.transform(this.end, 'y-MM-dd'), buyerid: '', sellerid: '', billstatus: '', detstatus: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.cuser = undefined;
    this.suser = undefined;
    this.companys = undefined;
    this.disabled = undefined;
    this.attrs = [];
  }

  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '销售收入明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showdialog() {
    this.classicModal.show();
  }

  hidedialog() {
    this.classicModal.hide();
  }
  // 创建内部采购发票
  neicaigoufapiao: any = { salebillcustomerid: null, fapiaochae: null, beizhu: null };
  impdata: any = [];
  @ViewChild('createneicaigoudialog') private createneicaigoudialog: ModalDirective;

  showcreateneicaigoudialog() {
    this.impdata = [];
    this.findWiskind();
    const saleshourudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < saleshourudets.length; i++) {
      if (saleshourudets[i].data && saleshourudets[i].selected && saleshourudets[i].data['billno']) {
        this.impdata.push(saleshourudets[i].data);
      }
    }
    if (this.impdata.length === 0) {
      this.toast.pop('warning', '请选择销售收入明细！！！');
      return;
    }
    this.createneicaigoudialog.show();
  }

  hidecreateneicaigoudialog() {
    this.createneicaigoudialog.hide();
  }
  /**获取内部公司 */
  findWiskind() {
    this.customerApi.findwiskind().then((response) => {
      const paycustomerlists = [{ label: '请选择', value: '' }];
      for (let i = 1; i < response.length; i++) {
        if (response[i].id === 3453) {
          response.splice(i, 1);
        }
      }
      response.forEach(element => {
        paycustomerlists.push({
          label: element.name,
          value: element.id
        });
      });
      this.companyIsWiskind = paycustomerlists;
    });
  }
  reset() {
    this.neicaigoufapiao = { salebillcustomerid: null, fapiaochae: null, beizhu: null };
  }
  createneicaigoufapiao() {
    this.neicaigoufapiao.list = this.impdata;
    console.log(this.neicaigoufapiao);
    this.orderApi.createneicaigoufapiao(this.neicaigoufapiao).then((response) => {
      this.reset();
      this.router.navigateByUrl('neicaigoufapiao/' + response);
    });
  }
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
  // 获取用户角色，如果登陆的用户不是财务，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      // 如果登陆的用户是非财务人员，设置为不可见
      if (!myrole.some(item => item === 1 || item === 5 || item === 35)) {
        if (colde.colId === 'ftype' ) {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
    });
  }
}
