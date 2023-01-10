import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ColDef, GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { OrginterestService } from '../orginterest.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';


@Component({
  selector: 'app-orginterest',
  templateUrl: './orginterest.component.html',
  styleUrls: ['./orginterest.component.scss']
})
export class OrginterestComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  maxDate = new Date();
  start : Date;
  end : Date;
  orgs = [];
  requestparams = {start : '', end : '', orgid : '' };
  gridOptions: GridOptions;
  yufuGridOptions: GridOptions;
  kucunGridOptions: GridOptions;
  gnGridOptions: GridOptions;
  ziyuanKucunOptions: GridOptions;
  ziyuanGridOptions: GridOptions;
  constructor(
    public settings: SettingsService,
    private datepipe: DatePipe,
    private orgApi: OrgApiService,
    private orginterestService: OrginterestService) {
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
    this.yufuGridOptions = {
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
    this.kucunGridOptions = {
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
    this.gnGridOptions = {
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
    this.ziyuanKucunOptions = {
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
    this.ziyuanGridOptions = {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.yufuGridOptions.groupSuppressAutoColumn = true;
    this.kucunGridOptions.groupSuppressAutoColumn = true;
    this.gnGridOptions.groupSuppressAutoColumn = true;
    this.ziyuanKucunOptions.groupSuppressAutoColumn = true;
    this.ziyuanGridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '利息金额', field: 'tjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tjine']) {
            return Number(params.data['tjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预收利息', field: 'yushouinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yushouinterest']) {
            return Number(params.data['yushouinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预付利息', field: 'yufuinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yufuinterest']) {
            return Number(params.data['yufuinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存利息', field: 'kucuninterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucuninterest']) {
            return Number(params.data['kucuninterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
     // { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 120 },
    ];

    this.yufuGridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'customername', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '利息金额', field: 'yufuinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yufuinterest']) {
            return Number(params.data['yufuinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
    ];

    this.kucunGridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '利息金额', field: 'kucuninterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucuninterest']) {
            return Number(params.data['kucuninterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
    ];

    this.gnGridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '总金额', field: 'tjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tjine']) {
            return Number(params.data['tjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预付金额', field: 'yufuinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yufuinterest']) {
            return Number(params.data['yufuinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存金额', field: 'kucuninterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucuninterest']) {
            return Number(params.data['kucuninterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
    ];
    this.ziyuanKucunOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '总金额', field: 'tjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tjine']) {
            return Number(params.data['tjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
    ];
    this.ziyuanGridOptions.columnDefs = [
      // { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '中心', field: 'orgtype2', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '利息金额', field: 'tjine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tjine']) {
            return Number(params.data['tjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预收利息', field: 'yushouinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yushouinterest']) {
            return Number(params.data['yushouinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预付利息', field: 'yufuinterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yufuinterest']) {
            return Number(params.data['yufuinterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '库存利息', field: 'kucuninterest', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucuninterest']) {
            return Number(params.data['kucuninterest']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
     // { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 120 },
    ];
    this.getMyRole();
  }

  ngOnInit() {
    this.getorgs();
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

  listDetail() {
    this.orginterestService.getAllTable(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response.summaryList);
      this.yufuGridOptions.api.setRowData(response.yufuSummaryList);
      this.kucunGridOptions.api.setRowData(response.kucunSummaryList);
      this.gnGridOptions.api.setRowData(response.gnSummaryList);
      this.ziyuanKucunOptions.api.setRowData(response.ziyuanKucunSummary);
      this.ziyuanGridOptions.api.setRowData(response.ziyuanSummaryList);
    });
  };

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = { start : '', end : '', orgid : '' };
    this.start = null;
    this.end = null;
  }

  // 查询
  query() {
    if(this.start){
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    this.listDetail();
    this.hideclassicModal();
  }

  showclassicModal() {
    this.selectNull();
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  // 获取用户角色，如果登陆的用户不是财务，设置为不可见
  center:boolean = false;
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 71) {
        this.center = true;
      }
    }
  }

}
