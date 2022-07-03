import { Router } from '@angular/router';
import { AllotapiService } from './../allotapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { element } from 'protractor';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ReportService } from './../../report/report.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-allotdetreport',
  templateUrl: './allotdetreport.component.html',
  styleUrls: ['./allotdetreport.component.scss']
})
export class AllotdetreportComponent implements OnInit {

  requestparams = {
    billno: '', expcangkuid: '', impcangkuid: '', chandi: '', color: '', width: '', houdu: '',
    duceng: '', caizhi: '', ppro: '', orgid: '', cuserid: '', vuserid: '', id: '', start: '', end: '',
    shitistart: '', shitiend: '', daohuostart: '', daohuoend: '', expstatus: '', impstatus: ''
  };

  // 限制最大时间不能超过今天
  endmax: Date = new Date();

  // 查询开始时间
  start: Date;

  // 查询结束时间
  end: Date;

  // 实提查询开始时间
  shitistart: Date;

  // 实提查询结束时间
  shitiend: Date;

  // 调入开始时间
  drstart: Date;

  // 调入结束时间
  drend: Date;

  // 机构的数组
  items = new Array();

  // 仓库的数组
  ckitems = new Array();

  // 调入状态数组
  dritems = [{ value: '', label: '全部' }, { value: 1, label: '已调入' }, { value: 2, label: '未调入' }];

  // 调出状态数组
  dcitems = [{ value: '', label: '全部' }, { value: 1, label: '已调出' }, { value: 2, label: '未调出' }];

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private reportapi: ReportService, private orgapi: OrgApiService,
    private router: Router, private classifyapi: ClassifyApiService, private datepipe: DatePipe,
    private toast: ToasterService, private allotapi: AllotapiService) {

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

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 90,
        cellRenderer: (params) => {
          if (params.data) {
            if (null != params.data.billno && params.data.billno.substring(0, 2) === 'AL') {
              return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return params.data.billno;
            }
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建日期', field: 'cdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出时间', field: 'vdate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调入时间', field: 'arrivedate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'tihuoshitidate', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否备货', field: 'beihuo', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用记账方向', field: 'accountdirection', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出仓库', field: 'expcangkuname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调入仓库', field: 'impcangkuname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调出状态', field: 'expstatus', minWidth: 60 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '调入状态', field: 'impstatus', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调入状态', field: 'allottypename', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'cgtype', width: 70 },
      {
        cellClass: 'text-center', headerName: '费用', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应付单价', field: 'yffeeprice', minWidth: 70,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购应付金额', field: 'yffeejine', minWidth: 80,
            aggFunc: 'sum', valueGetter: (params) => {
              // console.log(params);
              if (params.data && null !== params.data['cgyffeejine']) {
                return Number(params.data['cgyffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售应付金额', field: 'yffeejine', minWidth: 80,
            aggFunc: 'sum', valueGetter: (params) => {
              // console.log(params);
              if (params.data && null !== params.data['xsyffeejine']) {
                return Number(params.data['xsyffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '应收单价', field: 'ysfeeprice', minWidth: 95,
            valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购应收金额', field: 'ysfeejine', minWidth: 70,
            aggFunc: 'sum', valueGetter: (params) => {
              if (params.data && params.data['cgysfeejine']) {
                return Number(params.data['cgysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售应收金额', field: 'ysfeejine', minWidth: 70,
            aggFunc: 'sum', valueGetter: (params) => {
              if (params.data && params.data['xsysfeejine']) {
                return Number(params.data['xsysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      {
        cellClass: 'text-center', headerName: '销售退货费用', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购应付金额', field: 'xsthyffeejine', minWidth: 80,
            aggFunc: 'sum', valueGetter: (params) => {
              // console.log(params);
              if (params.data && null !== params.data['xsthcgyffeejine']) {
                return Number(params.data['xsthcgyffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售应付金额', field: 'xsthyffeejine', minWidth: 80,
            aggFunc: 'sum', valueGetter: (params) => {
              // console.log(params);
              if (params.data && null !== params.data['xsthxsyffeejine']) {
                return Number(params.data['xsthxsyffeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购应收金额', field: 'xsthysfeejine', minWidth: 70,
            aggFunc: 'sum', valueGetter: (params) => {
              if (params.data && params.data['xsthcgysfeejine']) {
                return Number(params.data['xsthcgysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售应收金额', field: 'xsthysfeejine', minWidth: 70,
            aggFunc: 'sum', valueGetter: (params) => {
              if (params.data && params.data['xsthxsysfeejine']) {
                return Number(params.data['xsthxsysfeejine']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter2
          }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '鼓励类', field: 'urge', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 60 },
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
      // { cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'cprice', minWidth: 60 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'kucunid', field: 'kucunid', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否加工', field: 'isfp', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 60 }
    ];
  }

  ngOnInit() {
    // this.listDetail();
  }

  // 调拨明细表查询数据
  listDetail() {
    this.reportapi.allotdet(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('classicModal') private classicmodal: ModalDirective;

  // 打开查询弹窗
  openclassicmodal() {
    if (this.items.length < 2) {
      this.queryjigou();
    }
    this.cangkulist();
    this.classicmodal.show();
  }

  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicmodal.hide();
  }

  // 重选重置查询条件
  cuser;
  vuser;
  selectNull() {
    this.requestparams = {
      billno: '', expcangkuid: '', impcangkuid: '', chandi: '', color: '', width: '', houdu: '',
      duceng: '', caizhi: '', ppro: '', orgid: '', cuserid: '', vuserid: '', id: '', start: '', end: '',
      shitistart: '', shitiend: '', daohuostart: '', daohuoend: '', expstatus: '', impstatus: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.drstart = undefined;
    this.drend = undefined;
    this.cuser = undefined;
    this.vuser = undefined;
  }

  // 查询条件
  select() {
    if (this.start) {
      this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      if (this.end) { this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd'); }
      if (this.shitistart) { this.requestparams['shitistart'] = this.datepipe.transform(this.shitistart, 'y-MM-dd'); }
      if (this.shitiend) { this.requestparams['shitiend'] = this.datepipe.transform(this.shitiend, 'y-MM-dd'); }
      if (this.drstart) { this.requestparams['daohuostart'] = this.datepipe.transform(this.drstart, 'y-MM-dd'); }
      if (this.drend) { this.requestparams['daohuoend'] = this.datepipe.transform(this.drend, 'y-MM-dd'); }

      if (this.cuser) {
        if (typeof (this.cuser) === 'object') {
          this.requestparams['cuserid'] = this.cuser['code'];
        } else if (typeof (this.cuser) === 'string') {
          this.requestparams['cuserid'] = '';
          this.toast.pop('warning', '输入的人员名称有误，请重新选择');
        }
      } else {
        this.requestparams['cuserid'] = '';
      }
      if (this.vuser) {
        if (typeof (this.vuser) === 'object') {
          this.requestparams['vuserid'] = this.vuser['code'];
        } else if (typeof (this.vuser) === 'string') {
          this.requestparams['vuserid'] = '';
          this.toast.pop('warning', '输入的人员名称有误，请重新选择');
        }
      } else {
        this.requestparams['vuserid'] = '';
      }
      console.log(this.requestparams)
      // 给查询条件赋值
      this.listDetail();
      this.closeclassicmodal();
    } else {
      this.toast.pop('error', '请填写开始时间');
    }
  }

  // 查询机构
  queryjigou() {
    this.orgapi.listAll(0).then(data => {
      data.forEach(element => {
        this.items.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }

  // 获取仓库列表信息
  cangkulist() {
    this.classifyapi.changkulist().then(data => {
      data.forEach(element => {
        this.ckitems.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }

  // 创建调拨单
  createAllot() {
    const model = {};
    this.allotapi.create(model).then(data => {
      // { queryParams: { page: 1 } }
      this.router.navigateByUrl('allot/' + data['id']);
    });
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
      fileName: '调拨明细表.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

}
