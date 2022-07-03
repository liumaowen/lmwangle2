import { Component, OnInit, ViewChild } from '@angular/core';
// OnChanges, DoCheck, AfterContentInit, AfterContentChecked,AfterViewInit, AfterViewChecked, OnDestroy
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions, ColDef } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { SellproService } from '../sellpro.service';
import { SelectComponent } from 'ng2-select';
import { StorageService } from 'app/dnn/service/storage.service';


@Component({
  selector: 'app-projectuserhuizong',
  templateUrl: './projectuserhuizong.component.html',
  styleUrls: ['./projectuserhuizong.component.scss'],
  providers: [DatePipe, DecimalPipe]
})
export class ProjectuserhuizongComponent implements OnInit {
  private gridApi;
  @ViewChild('chandi') public chandi: SelectComponent;
  @ViewChild('weight') public weight: SelectComponent;
  @ViewChild('status') public status: SelectComponent;
  // OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit,AfterViewChecked, OnDestroy
  search: object = {
    orgid: '',
    cuserid: '',
    month: null,
    areaid: '',
    isorgsummary: false
  };
  iscrm = false;
  isorgleader = false;
  isarealeader = false;
  months = '';
  areas: any = []; // 机构区域
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();

  // aggird表格原型
  gridOptions: GridOptions;

  // 弹窗
  @ViewChild('classicModal') private classicModel: ModalDirective;
  orgs: any[];
  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');
  constructor(public settings: SettingsService, private sellproApi: SellproService,
    private datepipe: DatePipe, private storage: StorageService,
    private toast: ToasterService, private numberPipe: DecimalPipe) {
    // aggird实例对象
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
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, field: 'group', rowGroup: true, headerName: '合计', hide: true,
       valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属板块', field: 'areaname', minWidth: 100,
       cellRenderer: (params) => {
        if (params.data) {
          return params.data.areaname;
        } else {
          return '合计';
        }
       }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '总登记项目量', field: 'allregisteredcount', minWidth: 120, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['allregisteredcount']);
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
      { cellStyle: { 'text-align': 'center' }, headerName: '总终止项目量', field: 'allendcount', minWidth: 120, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['allendcount']);
        } else {
          return '';
        }
      }, valueFormatter: (params) => {
        try {
          return this.numberPipe.transform(params.value, '1.0-0');
        } catch (error) {
          return null;
        }
      } },
      { cellStyle: { 'text-align': 'center' }, headerName: '总成交项目量', field: 'alldealcount', minWidth: 120, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['alldealcount']);
        } else {
          return '';
        }
      }, valueFormatter: (params) => {
        try {
          return this.numberPipe.transform(params.value, '1.0-0');
        } catch (error) {
          return null;
        }
      } },
      { cellStyle: { 'text-align': 'center' }, colId: 'yuenewcount', headerName: '新增项目量', field: 'yuenewcount',
       minWidth: 100, aggFunc: 'sum',
       valueGetter: (params) => {
         if (params.data) {
           return Number(params.data['yuenewcount']);
         } else {
           return '';
         }
       }, valueFormatter: (params) => {
         try {
           return this.numberPipe.transform(params.value, '1.0-0');
         } catch (error) {
           return null;
         }
       } },
      { cellStyle: { 'text-align': 'center' }, colId: 'yueendcount', headerName: '终止项目量', field: 'yueendcount',
       minWidth: 100, aggFunc: 'sum',
       valueGetter: (params) => {
         if (params.data) {
           return Number(params.data['yueendcount']);
         } else {
           return '';
         }
       }, valueFormatter: (params) => {
         try {
           return this.numberPipe.transform(params.value, '1.0-0');
         } catch (error) {
           return null;
         }
       } },
      { cellStyle: { 'text-align': 'center' }, colId: 'yuedealcount', headerName: '成交项目量', field: 'yuedealcount',
       minWidth: 100, aggFunc: 'sum',
       valueGetter: (params) => {
         if (params.data) {
           return Number(params.data['yuedealcount']);
         } else {
           return '';
         }
       }, valueFormatter: (params) => {
         try {
           return this.numberPipe.transform(params.value, '1.0-0');
         } catch (error) {
           return null;
         }
       } },
      { cellStyle: { 'text-align': 'center' }, headerName: '当前跟踪项目量', field: 'currentgzcount', minWidth: 100, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['currentgzcount']);
        } else {
          return '';
        }
      }, valueFormatter: (params) => {
        try {
          return this.numberPipe.transform(params.value, '1.0-0');
        } catch (error) {
          return null;
        }
      } },
      { cellStyle: { 'text-align': 'center' }, headerName: '应更新项目量', field: 'yinggxcount', minWidth: 100, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['yinggxcount']);
        } else {
          return '';
        }
      }, valueFormatter: (params) => {
        try {
          return this.numberPipe.transform(params.value, '1.0-0');
        } catch (error) {
          return null;
        }
      } },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际更新项目量', field: 'yigxcount', minWidth: 100, aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['yigxcount']);
        } else {
          return '';
        }
      }, valueFormatter: (params) => {
        try {
          return this.numberPipe.transform(params.value, '1.0-0');
        } catch (error) {
          return null;
        }
      } },
      { cellStyle: { 'text-align': 'center' }, colId: 'score', headerName: '质量得分', field: 'score', minWidth: 100, aggFunc: 'sum' }
    ];
  }

  ngOnInit() {
    this.search['month'] = this.datepipe.transform(new Date(), 'y-MM-dd');
    this.getlist();
  }
  getlist() {
    this.sellproApi.getprojectsummary(this.search).then(data => {
      this.classicModel.hide();
      let arraylist = data['list'];
      this.iscrm = data['iscrm'];
      this.isorgleader = data['isorgleader'];
      this.isarealeader = data['isarealeader'];
      if (arraylist.length && (this.iscrm || this.isorgleader || this.isarealeader)) {
        arraylist = arraylist.splice(0, arraylist.length - 1);
      }
      this.gridOptions.api.setRowData(arraylist);
    });
  }
  selectNull() {
    this.search = {
      orgid: '',
      cuserid: '',
      month: '',
      areaid: '',
      isorgsummary: false
    };
    this.areas = [];
  }
  showDialog() {
    this.selectNull();
    this.sellproApi.listarea('org_area').then(data => {
      data.forEach(element => {
        this.areas.push({value: element.value, label: element.name});
      });
    });
    this.classicModel.show();
  }
  // 关闭弹窗
  coles() {
    this.classicModel.hide();
  }
  querylist() {
    if (!this.search['month']) {
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    this.months = new Date(this.search['month']).getMonth() + 1 + '月';
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      if (colde.colId === 'yuenewcount') {
        colde.headerName = this.months + '新增项目量';
      }
      if (colde.colId === 'yueendcount') {
        colde.headerName = this.months + '终止项目量';
      }
      if (colde.colId === 'yuedealcount') {
        colde.headerName = this.months + '成交项目量';
      }
      if (colde.colId === 'score') {
        colde.headerName = this.months + '质量得分';
      }
    });
    this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    this.sellproApi.getprojectsummary(this.search).then(data => {
      this.classicModel.hide();
      let arraylist = data['list'];
      this.iscrm = data['iscrm'];
      this.isorgleader = data['isorgleader'];
      this.isarealeader = data['isarealeader'];
      if (arraylist.length && (this.iscrm || this.isorgleader || this.isarealeader)) {
        arraylist = arraylist.splice(0, arraylist.length - 1);
      }
      this.gridOptions.api.setRowData(arraylist);
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
}
