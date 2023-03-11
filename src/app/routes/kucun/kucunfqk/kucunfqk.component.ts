import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FavoritelistComponent } from '../../../dnn/shared/favoritelist/favoritelist.component';
import { StorageService } from '../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { KucunService } from '../kucun.service';
import { UserapiService } from '../../../dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../../caigou/caigou.service';
import { Router } from '@angular/router';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-kucunfqk',
  templateUrl: './kucunfqk.component.html',
  styleUrls: ['./kucunfqk.component.scss']
})
export class KucunfqkComponent implements OnInit {
  gridOptions: GridOptions;
  search: any = {};
  querymonth = null;

  @ViewChild('fqkkucundialog') private fqkkucundialog: ModalDirective;
  // 收藏夹对象
  bsModalRef: BsModalRef;

  constructor(public settings: SettingsService, private toast: ToasterService, private userapi: UserapiService,
    private kucunapi: KucunService, private storage: StorageService, private modalService: BsModalService,
    private numberpipe: DecimalPipe, private caigouApi: CaigouService, private router: Router, private classifyapi: ClassifyApiService,
    private datepipe: DatePipe,) {

    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
    };

    // this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 70, checkboxSelection: false },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存总量', field: 'weight', width: 120, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellClass: 'text-center', headerName: '流通商', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '重量', field: 'ltweight',
            width: 100, editable: false,valueGetter: (params) => {
              if (params.data && params.data['ltweight']) {
                return Number(params.data['ltweight']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter3,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '平均库龄', field: 'ltpjkuling',
            width: 100, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true
          },
          {
            cellClass: 'text-center', headerName: '最大库龄', field: 'ltmaxkuling',
            width: 100, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true
          }
        ]
      },
      {
        cellClass: 'text-center', headerName: '非流通商', headerClass: 'wis-ag-center',enableRowGroup: true,
        children: [
          {
            cellClass: 'text-center', headerName: '重量', field: 'fltweight',
            width: 100, editable: false,valueGetter: (params) => {
              if (params.data && params.data['fltweight']) {
                return Number(params.data['fltweight']);
              } else {
                return 0;
              }
            },  valueFormatter: this.settings.valueFormatter3, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '平均库龄', field: 'fltpjkuling',
            width: 100, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true
          },
          {
            cellClass: 'text-center', headerName: '最大库龄', field: 'fltmaxkuling',
            width: 100, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true
          }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '无主库存', field: 'wzweight', width: 100,
      valueGetter: (params) => {
        if (params.data && params.data['wzweight']) {
          return Number(params.data['wzweight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3, aggFunc: 'sum' },
      { cellStyle: { 'text-align': 'center' }, headerName: '平均库龄', field: 'wzpjkuling', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '最大库龄', field: 'wzmaxkuling', width: 100 },
      
    ];

  }

  ngOnInit() {
    this.listDetail();
  }


  // 查询库存明细表
  listDetail() {
    this.kucunapi.getfqkkucun().then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  }

   // 查询库存明细表
   listSearch(month) {
    this.kucunapi.getfqksearch(month).then((response) => {
      this.gridOptions.api.setRowData(response);//网格赋值
    });
  }

  /**选择月份*/
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  select() {
     if (!this.search['month']) {this.toast.pop('warning', '请选择月份！'); return; }
    console.log(this.search);
    this.listSearch(this.search);
    this.close();
  }

  show() {
    this.fqkkucundialog.show();
    this.search = {};
    this.querymonth = null;
    this.search['month'] = this.datepipe.transform(new Date(), 'y-MM') + '-01';
  }

  close() {
    this.fqkkucundialog.hide();
  }
}
