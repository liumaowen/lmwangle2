import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SelectComponent } from 'ng2-select';
import { DatePipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { WuliuscoreapiService } from './wuliuscoreapi.service';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';

@Component({
  selector: 'app-wuliuscore',
  templateUrl: './wuliuscore.component.html',
  styleUrls: ['./wuliuscore.component.scss']
})
export class WuliuscoreComponent implements OnInit {
  querys: any = {iscollect: false};
  start = new Date();
  end: any;
  maxDate = new Date();
  wlcustomer = {};
  gridOptions: GridOptions;
  name = '';
  @ViewChild('queryModal') private queryModal: ModalDirective;
  constructor(
    private WuliuscoreApi: WuliuscoreapiService,
    private toast: ToasterService,
    private router: Router,
    private datePipe: DatePipe,
    public settings: SettingsService,
  ) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '序号', field: 'id', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data) {
            return params.rowIndex + '';
          } else {
            return '合计';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流供应商', field: 'transcompanyname',
        minWidth: 100, cellRenderer: (params) => {
          if (params.data && params.data.transcompanyid) {
            return '<a target="_blank" href="#/customer/' + params.data.transcompanyid + '/zixin">' + params.data.transcompanyname + '</a>';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提单号', field: 'tihuono',
        minWidth: 80, cellRenderer: (params) => {
          if (params.data && params.data.tihuoid) {
            return '<a target="_blank" href="#/tihuo/' + params.data.tihuoid + '">' + params.data.tihuono + '</a>';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '评价日期', field: 'cdate',
        minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '评价人', field: 'eusername',
        minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '资信及运营情况', field: 'zixin',
        minWidth: 110, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货及时性', field: 'thjishixing',
        minWidth: 110, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货量分', field: 'tihuoweight',
        minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '货物安全分', field: 'goodssafe',
        minWidth: 100, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '赔偿能力', field: 'ability',
        minWidth: 80, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运费支付频率', field: 'paypinlv',
        minWidth: 110, aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '总评分', field: 'totalscore',
        minWidth: 80, aggFunc: 'sum'
      },
    ];
  }

  ngOnInit() {
    this.querys.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    this.listDetail();
  }
  /**查询列表 */
  listDetail() {
    if (this.querys['iscollect']) {
      this.name = '汇总';
    } else {
      this.name = '明细';
    }
    this.WuliuscoreApi.query(this.querys).then(data => {
      this.gridOptions.api.setRowData(data); // 网格赋值
    });
  }

  /**查询弹窗 */
  queryDialog() {
    this.start = new Date();
    this.end = '';
    this.wlcustomer = null;
    this.querys['iscollect'] = false;
    this.queryModal.show();
  }
  /**关闭查询弹窗 */
  hidequeryModal() {
    this.queryModal.hide();
  }
  /**查询确定 */
  query() {
    if (this.start) {
      this.querys.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    } else {
      this.querys.start = '';
    }
    if (this.end) {
      this.querys.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    } else {
      this.querys.end = '';
    }
    if (typeof (this.wlcustomer) === 'string' || !this.wlcustomer) {
      this.querys['transcompanyid'] = '';
    } else if (typeof (this.wlcustomer) === 'object' && this.wlcustomer['code']) {
      this.querys['transcompanyid'] = this.wlcustomer['code'];
    }
    this.listDetail();
    this.hidequeryModal();
  }
}
