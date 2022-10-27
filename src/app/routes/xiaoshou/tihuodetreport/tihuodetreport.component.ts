import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ReportService } from './../../report/report.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { XiaoshouapiService } from '../xiaoshouapi.service';

@Component({
  selector: 'app-tihuodetreport',
  templateUrl: './tihuodetreport.component.html',
  styleUrls: ['./tihuodetreport.component.scss']
})
export class TihuodetreportComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  cangku: { label: string; value: string; }[];
  flags: ({ label: string; value: string; } | { value: boolean; label: string; })[];
  gns: { label: string; value: string; }[];
  orgs: { label: string; value: string; }[];
  transportCompany: any[];
  names: ({ label: string; value: string; } | { value: number; label: string; })[];

  requestparams = {
    gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '',
    duceng: '', caizhi: '', ppro: '', id: '', start: '', end: '', shitistart: '', shitiend: '',
    buyerid: '', tihuotype: '', status: '', orgid: '', kunbaohao: '', saleorgid: '', grno: '', iscrm: '', isloan: '',tihuoinfo:''
  };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private reportApi: ReportService,
    private customerApi: CustomerapiService, private orgApi: OrgApiService,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe,
    private toast: ToasterService, private xiaoshouapiService: XiaoshouapiService) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            if (null != params.data.billno && (params.data.billno.substring(0, 2) === 'TH' || params.data.billno.substring(0, 2) === 'LD')) {// 提货单
              return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.billno + '</a>';
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
      { cellStyle: { 'text-align': 'center' }, headerName: '明细ID', field: 'tihuodetid', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyername', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户性质', field: 'usernature', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同性质', field: 'ordertype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同月份', field: 'ordermonth', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售合同号', field: 'orderbillno', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购月份', field: 'caigoumonth', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'caigoutype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备货', field: 'beihuo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '用途', field: 'yongtu', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否欠款', field: 'isloan', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '线上', field: 'isonline', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '主表状态', field: 'billstatus', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细状态', field: 'detstatus', minWidth: 90 },
      /* {cellStyle: {'text-align': 'center'}, headerName: '退货', field: 'isxstuihuo', width: 60},*/
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      /*{cellStyle: {'text-align': 'center'}, headerName: '数量', field: 'tcount', width: 60},*/
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
      {
        headerName: '销售', cellStyle: { 'text-align': 'center' },
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'pertprice', minWidth: 90,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售金额', field: 'jine', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['jine'] && params.data['billtype'] !== '退货') {
                return Number(params.data['jine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '退货单价', field: 'xstuihuoprice', minWidth: 90,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '退货金额', field: 'jine', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['jine'] && params.data['billtype'] === '退货') {
                return Number(params.data['jine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售补差', field: 'xsbuchaprice', minWidth: 90,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售补差金额', field: 'xsbuchajine', minWidth: 120, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['xsbuchajine']) {
                return Number(params.data['xsbuchajine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      {
        headerName: '费用', cellStyle: { 'text-align': 'center' },
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应付单价', field: 'yffeeprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应付金额', field: 'yffeejine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['yffeejine']) {
                return Number(params.data['yffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应收单价', field: 'ysfeeprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应收金额', field: 'ysfeejine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['ysfeejine']) {
                return Number(params.data['ysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      {
        headerName: '考核', cellStyle: { 'text-align': 'center' },
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '成本价', field: 'cprice', minWidth: 100,
            valueGetter: (params) => {
              if (params.data) {
                if (params.data['ischengben']) {
                  return params.data['cprice'];
                } else {
                  return '';
                }
              } else {
                return '';
              }
            },
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '考核定价', field: 'kaoheprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '线上价格', field: 'olprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '考核金额', field: 'kaohejine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['kaohejine']) {
                return Number(params.data['kaohejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '单吨毛利', field: 'maoliprice', minWidth: 100,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '考核毛利', field: 'maolijine', minWidth: 100, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['maolijine']) {
                return Number(params.data['maolijine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      {
        headerName: '钢卷', cellStyle: { 'text-align': 'center' },
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '鼓励类', field: 'urge', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: 'CRM登记', field: 'linkpro', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'lengths', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
          { cellStyle: { 'text-align': 'center' }, headerName: '漆膜', field: 'qimo', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 70 },
          { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 150 },
          { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 150 }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠单价', field: 'youhuiprice', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠金额', field: 'youhuijine', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否生成凭证', field: 'ispz', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员机构', field: 'orgname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员是否变更', field: 'issalechange', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'sorgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75,
        cellRenderer: function (params) {
          if (params.data) {
            if (null != params.data.kucunid) {
              return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
            }
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内采定价', field: 'innersaleprice', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'sellername', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '省份', field: 'province', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '城市', field: 'city', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '应收计数', field: 'ysfeedetcount', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '限时优惠', field: 'isyouhui', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '应付计数', field: 'yffeedetcount', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工方式', field: 'isproduce', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否维实产品', field: 'isweishiproduct', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构库龄', field: 'orgkuling', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调货方式', field: 'thtype', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货信息', field: 'tihuoinfo', minWidth: 100 }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    if (this.cuser) {
      this.requestparams['cuserid'] = this.cuser.code;
    }
    if (this.companys) {
      this.requestparams.buyerid = this.companys['code'];
    }
    if (this.saleman) {
      this.requestparams['salemanid'] = this.saleman['code'];
    }
    let date = new Date();
    if (!this.start) {
      this.requestparams.start = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01';
    } else {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (!this.end) {
      this.end = date;
    }
    if (this.end) this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    if (this.shitistart) this.requestparams.shitistart = this.datepipe.transform(this.shitistart, 'y-MM-dd');
    if (this.shitiend) this.requestparams.shitiend = this.datepipe.transform(this.shitiend, 'y-MM-dd');
    this.reportApi.tihuodet(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
    })
  }
  openQueryDialog() {

    this.names = [{ label: '全部', value: '' }, { value: 1, label: '已实提' }, { value: 2, label: '未实提' }, { value: 3, label: '已作废' }];
    this.customerApi.findwl().then(data => {
      this.transportCompany = data;
    });
    this.orgs = [{ label: '全部', value: '' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    });

    // 查找商品
    this.gns = [{ label: '全部', value: '' }];
    // this.classifyApi.getarea().then((resource) => {
    //   resource['gn'].forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element.id
    //     });
    //   });
    // });
    // 查找仓库
    this.cangku = [{ label: '全部', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
      response.forEach(element => {
        this.cangku.push({
          label: element.name,
          value: element.id
        });
      });
    });
    this.flags = [{ label: '全部', value: '' }, { value: false, label: '线下' }, { value: true, label: '线上' }];
    this.showDialog();
  }

  data = [];

  disabled = true;

  // 品名选中改变
  selectGnAction(key) {
    if (!this.requestparams[key]) return;
    else {
      let gnid = this.requestparams['gnid'];
    }
    this.reportApi.getGoodscodeAttribute({ gnid: this.requestparams['gnid'] }).then(data => {
      this.data = data;
      this.filter();
    });
    this.disabled = false;
  }

  // 常量作为字段名
  fieldArr = [
    'chandi', // 产地
    'color',// 颜色
    'width', // 宽度
    'houdu',// 厚度 
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];

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
      })
    });
  }

  maxDate = new Date();


  // 子类型选择
  selectAction(key) {
    this.filter();
  }

  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;


  // 打开查询弹窗
  showDialog() {
    this.classicModal.show();
  }

  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }
  getdiaobofee() {
    this.showDiaobofeeDialog();
  }
  // 调拨费弹窗重置
  selecdiaobotNull() {
    this.diaobostart = null;
    this.diaoboend = null;
    this.allotfeejine = '';
  }
  // 获取调拨费弹窗对象
  @ViewChild('getdiaobofeeModal') private getdiaobofeeModal: ModalDirective;
  diaobostart: Date;
  diaoboend: Date;
  allotfeejine = '';
  // 打开查询弹窗
  showDiaobofeeDialog() {
    this.selecdiaobotNull();
    this.getdiaobofeeModal.show();
  }

  // 关闭查询弹窗
  hideDiaobofeeDialog() {
    this.getdiaobofeeModal.hide();
  }
  /**获取调拨费 */
  diaoboquery() {
    const paramsdiaobo = { start: null, end: null };
    if (this.diaobostart) {
      paramsdiaobo.start = this.datepipe.transform(this.diaobostart, 'y-MM-dd');
    } else {
      this.toast.pop('warning', '开始时间必须填写！');
      return;
    }
    if (this.diaoboend) {
      paramsdiaobo.end = this.datepipe.transform(this.diaoboend, 'y-MM-dd');
    } else {
      this.toast.pop('warning', '结束时间必须填写！');
      return;
    }
    this.xiaoshouapiService.getdiaobofee(paramsdiaobo).then(data => {
      this.allotfeejine = data['allotfeejine'];
    });
  }
  cuser;

  companys;

  saleman;

  start: Date;
  end: Date;
  shitistart: Date;
  shitiend: Date;

  // 查询
  query() {
    if (!this.start) {
      this.toast.pop('warning', '开始时间必须填写！');
      return;
    } else {
      this.listDetail();
      this.hideDialog();
    }
  }

  // 重置
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.shitiend = null;
    this.shitistart = null;
    this.cuser = null;
    this.companys = null;
    this.saleman = null;
    this.requestparams = {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '',
      duceng: '', caizhi: '', ppro: '', id: '', start: '', end: '', shitistart: '', shitiend: '',
      buyerid: '', tihuotype: '', status: '', orgid: '', kunbaohao: '', saleorgid: '', grno: '', iscrm: '', isloan: '',tihuoinfo:''
    };
    this.disabled = true;
    this.attrs = [];
  }

  // 导出功能
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      allColumns: false,
      onlySelected: false,
      columnGroups: true,
      skipGroups: true,
      suppressQuotes: false,
      fileName: '提货明细表.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
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
