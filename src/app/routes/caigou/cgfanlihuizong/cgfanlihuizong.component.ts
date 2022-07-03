import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CaigouService } from '../caigou.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-cgfanlihuizong',
  templateUrl: './cgfanlihuizong.component.html',
  styleUrls: ['./cgfanlihuizong.component.scss']
})
export class CgfanlihuizongComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  search: object = { month: '' };
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService) {
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
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'huizongmonth', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            const da = new Date(params.data['huizongmonth']);
            return da.getFullYear() + '-' + (da.getMonth() + 1);
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '合计未补贴金额', field: 'ybjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastyearwbjine'] && params.data['curryearwbjine']) {
            return Number(params.data['lastyearwbjine'].add(params.data['curryearwbjine']));
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '当月返回上年未补贴返利金额', field: 'curmonthlastyearwbjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['curmonthlastyearwbjine']) {
            return Number(params.data['curmonthlastyearwbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '上年未补贴金额', field: 'lastyearwbjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastyearwbjine']) {
            return Number(params.data['lastyearwbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '当月增加的未返返利金额', field: 'curmonthcurryearwbjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['curmonthcurryearwbjine']) {
            return Number(params.data['curmonthcurryearwbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '今年未补贴金额', field: 'curryearwbjine', minWidth: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['curryearwbjine']) {
            return Number(params.data['curryearwbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            if (params.data.status === 1) {
              return '展示状态';
            } else if (params.data.status === 2) {
              return '已提交';
            } else if (params.data.status === 3) {
              return '已审核';
            }
          }
        }
      }
    ];
  }

  ngOnInit() {
    const date = new Date();
    this.search['month'] = this.datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'y-MM-dd');
    this.getDetail();
  }
  getDetail() {
    this.caigouApi.getfanlihuizongdet(this.search).then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data);
    });
  }
  openquery() {
    this.selectNull();
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = { month: '' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    if (!this.search['month']) {
      this.toast.pop('error', '请选择月份！', '');
      return;
    }
    this.getDetail();
    this.classicModal.hide();
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  tijiao() {
    this.caigouApi.tijiao({}).then(data => {
      this.getDetail();
    });
  }
}
