import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ReportService } from './../../report/report.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-orderdetreport',
  templateUrl: './orderdetreport.component.html',
  styleUrls: ['./orderdetreport.component.scss']
})
export class OrderdetreportComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  companys = {};

  cuser = {};

  vuser = {};
  cangku: any[] = [];
  sellersResult: any = [];
  orgs: any = [];
  gns: any = [];
  msg: string;
  total: { count: number; };
  // 开始时间
  start = new Date(); // 设定页面开始时间默认值

  end = new Date();
  filters = {};
  conditions = null;
  disabled = true;
  requestparams = {
    gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '',
    ppro: '', orgid: '', cuserid: '', id: '', start: this.datepipe.transform(this.start, 'y-MM-dd'),
    end: this.datepipe.transform(this.end, 'y-MM-dd'), buyerid: '', sellerid: ''
  };

  data;
  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}
  maxDate = new Date();

  // 0制单中、1核算运费中、2待付款"、3待提货、6完成、7取消、8撤销

  billtype = [{ value: '98', label: '有效订单' }, { value: '99', label: '已成交' }, { value: '90', label: '全部' },
  { value: 0, label: '制单中' }, { value: 1, label: '核算运费中' }, { value: 2, label: '待付款' },
  { value: 3, label: '待提货' }, { value: 6, label: '完成' },
  { value: 7, label: '取消' }, { value: 8, label: '撤销' }];

  isonline = [{ value: '', label: '全部' }, { value: 0, label: '线下' }, { value: 1, label: '线上' }];

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private reportApi: ReportService,
    private customerApi: CustomerapiService,
    private classifyApi: ClassifyApiService,
    private orgApi: OrgApiService,
    private datepipe: DatePipe,
    private toast: ToasterService,
    private numberPipe: DecimalPipe) {


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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'OR') {// 线上
              return '<a target="_blank" href="#/order/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'BO') {// 线下
              return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'PO') {// 加工
              return '<a target="_blank" href="#/proorder/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'QH') {// 加工
              return '<a target="_blank" href="#/qihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
            }
            return params.data.billno;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否关联CRM', field: 'islinkpro', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否通知采购', field: 'isnoticecaigou', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'billstatus', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细状态', field: 'iscancel', width: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'billtype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'dantype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'transporttype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品类别', field: 'urge', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '支付类型', field: 'paytype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实付定金比例', field: 'shifudingjinbili', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格性质', field: 'guigexingzhi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 200 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaodesc', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 80 },
      // tslint:disable-next-line:max-line-length
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'tcount', width: 60, aggFunc: 'sum', valueGetter: (params) => {

          if (params.data) {
            return Number(params.data['tcount']);
          } else {
            return '';
          }
        }, valueFormatter: (params) => {
          try {
            return this.numberPipe.transform(params.value, '1.0-0');
          } catch (error) {
            return null;
          }
        }
      },
      // tslint:disable-next-line:max-line-length
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
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      // tslint:disable-next-line:max-line-length
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '考核价', field: 'kaoheprice', width: 65,
        valueFormatter: this.settings.valueFormatter2
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系地址', field: 'contactaddr', width: 100 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系方式', field: 'contactway', width: 65 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '联系人', field: 'contactman', width: 65 },
      /*{cellStyle: {"text-align": "center"}, headerName: '毛利单价', field: 'maoliprice', width: 65},
      {cellStyle: {"text-align": "center"}, headerName: '考核毛利', field: 'maolijine', width: 65},*/
      {
        cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyername', width: 120,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/xiaoshouwanglaireport/' + params.data.buyerid + '">' +
              params.data.buyername + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'sellername', width: 120 },
      /* {cellStyle: {"text-align": "center"}, headerName: '资源号', field: 'grno', width: 100},*/
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', width: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储费计算方式', field: 'settletype', width: 150 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估仓储费', field: 'storagefee', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['storagefee']) {
            return Number(params.data['storagefee']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 75,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.kucunid) {
              return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
            }
            return params.data.kucunid;
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '调货类型', field: 'thtype', width: 150 },

    ];

    this.listDetail();
  }

  ngOnInit() {
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
      fileName: '订单明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  listDetail() {
    console.log(this.requestparams);
    if (!this.requestparams['billtype']) {
      this.requestparams['billtype'] = 98;
    }
    if (this.requestparams['billtype'] === 90) {
      this.requestparams['billtype'] = '';
    }
    this.reportApi.orderdet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
      const count = response;
      this.total = { count: 0 };
      for (let i = 0; i < count.length; i++) {
        this.total.count = this.total.count + count[i].tcount;
      }
      this.msg = ' 共' + this.total.count + '件 ';
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
    this.show();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicModal: ModalDirective;
  show() {
    this.classicModal.show();
  }

  coles() {
    this.classicModal.hide();
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
  // 赛选过滤方法
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      let otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
      let queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.requestparams[otherField] === '' || dataElement[otherField] === this.requestparams[otherField];
          })) {
            const fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) === -1) {
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
  query() {
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.requestparams['buyerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.requestparams.buyerid = this.companys['code'];
    }
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.requestparams['cuserid'] = '';
    } else if (typeof (this.cuser) === 'object') {
      this.requestparams.cuserid = this.cuser['code'];
    }
    this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    this.listDetail();
    this.coles();
  }

  selectNull() {
    this.requestparams = {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '',
      caizhi: '', ppro: '', orgid: '', cuserid: '', id: '', start: '', end: '', buyerid: '', sellerid: ''
    };
    this.conditions = null;
    this.start = new Date();
    this.end = new Date();
    this.cuser = undefined;
    this.companys = undefined;
    this.disabled = true;
    this.attrs = [];
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
}
