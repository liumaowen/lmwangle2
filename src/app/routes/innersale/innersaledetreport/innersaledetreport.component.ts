import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ReportService } from './../../report/report.service';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { InnersaleapiService } from './../innersaleapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-innersaledetreport',
  templateUrl: './innersaledetreport.component.html',
  styleUrls: ['./innersaledetreport.component.scss']
})
export class InnersaledetreportComponent implements OnInit {

  maxDate = new Date();
  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  constructor(private innersaleApi: InnersaleapiService, public settings: SettingsService,
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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            if (params.data.billtype === 'BO') {// 机构代销
              return '<a target="_blank" href="#/businessorder/' + params.data.id + '">' + params.data.billno + '</a>';
            }else if (params.data.billtype === 'IS') {// 内部采购
              return '<a target="_blank" href="#/innersale/' + params.data.id + '">' + params.data.billno + '</a>';
            }else {
              return params.data.billno;
            }
          }else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'billstatus', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核', field: 'isv', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方机构', field: 'sorgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方机构', field: 'borgname', minWidth: 100 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'tcount', minWidth: 60 , aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tcount']) {
            return Number(params.data['tcount']);
          } else {
            return 0;
          }
        }},
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'tweight', minWidth: 60 , aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tweight']) {
            return Number(params.data['tweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 100 , aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2},
      /*{cellStyle: {"text-align": "center"}, headerName: '资源号', field: 'grno', width: 100},*/
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'realname', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单明细状态', field: 'iscancel', minWidth: 80 },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '电商定价', field: 'kaoheprice', minWidth: 80 ,
         valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'sellername', minWidth: 80 , colId: 'sellername'},
      { cellStyle: { 'text-align': 'center' }, headerName: '销售公司', field: 'buyername', minWidth: 80 , colId: 'buyername'}
    ];
    this.getMyRole();
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
    this.reportApi.innersaledet(this.requestparams).then((response) => {
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

    // this.gns = [{ value: '', label: '全部' }];
    // this.classifyApi.getarea().then((resource) => {
    //   console.log(resource.gn);
    //   resource.gn.forEach(element => {
    //     this.gns.push({
    //       value: element['id'],
    //       label: element['name']
    //     });
    //   });
    // });
    //		classifyApi.listBypid({pid:41}).$promise.then(function(response){
    //			this.cangku=response;
    //    	});
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
    // ngDialog.open({
    //   template: 'views/report/innersaledet_query.html',
    //   scope: this,
    //   className: 'ngdialog-theme-default ngdialog-width-600',
    //   closeByDocument: false,
    //   closeByEscape: false,
    //   showClose: true
    // });
    // //	转换时间格式
    // this.requestparams.start = $filter('date')(this.requestparams.start, 'yyyy-MM-dd');
    // this.requestparams.end = $filter('date')(this.requestparams.end, 'yyyy-MM-dd');
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

  data;

  //定义过滤之后的集合
  filterConditionObj = {}; //{chandi:[],width:[]}

  //赛选过滤方法
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

  // selectGnAction(key) {
  //   // 取消选择，则选项绑定变量变成null,以此为条件发出请求，null的会被忽略，导致服务端找不到参数出错
  //   if (!this.requestparams[key]) return;
  //   else {
  //     let gnid = this.requestparams.gnid;
  //     this.requestparams.gnid = gnid;
  //   }
  //   this.reportApi.getGoodscodeAttribute({ gnid: this.requestparams.gnid }).then((response) => {
  //     this.conditions = response;
  //     this.data = response;
  //     this.filter();
  //   });
  //   this.disabled = false;
  // };

  selectAction(key) {
    this.filter();
  }

  filters = {};
  conditions = null;

  disabled = true;

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.requestparams = { gn: '', cangkuid: '', borgid: '', sorgid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: '', cuserid: '', vuserid: '', id: '', start: undefined, end: undefined, isv: '' };
    // this.requestparams={};
    this.filters = {};
    this.conditions = null;
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

  // 创建内部销售单
  createInnersale() {
    if (confirm('你确定引入收藏夹中的货物创建内采单吗？')) {
      this.innersaleApi.createInnersale({ id: null }).then((data) => {
        this.router.navigateByUrl('innersale/' + data.innersale.id);
      });
    }
  };
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
        if (!myrole.some(item => item === 5)) {
          if (colde.colId === 'buyername' || colde.colId === 'sellername') {
            colde.hide = true;
            colde.suppressToolPanel = true;
          }
        }
      });
    }
  
}
