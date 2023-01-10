import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-kucunfanlidet',
  templateUrl: './kucunfanlidet.component.html',
  styleUrls: ['./kucunfanlidet.component.scss']
})
export class KucunfanlidetComponent implements OnInit {
  search: any = {month: ''};
  gridOptions: GridOptions;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;

  constructor(public settings: SettingsService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: "multiple",
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      localeText: this.settings.LOCALETEXT,
      animateRows: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90,
      cellRenderer: function (params) {
        if (params.data) {
          return params.data.gn;
        } else {
          return '合计';
        }
      } },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 90,aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data && params.data['weight']) {
          return Number(params.data['weight']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter3 },
      { cellStyle: { 'text-align': 'center' }, headerName: '到库日期', field: 'daokudate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库日期', field: 'rukudate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存返利', field: 'wfjine', minWidth: 90,aggFunc: 'sum',
      valueGetter: (params) => {
        if (params.data && params.data['wfjine']) {
          return Number(params.data['wfjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 90 }
    ];
  }


  ngOnInit() {
  }
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.caigouApi.listkucunfanlidet(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM');
  }
  showgcinfodialog() {
    this.gcinfodialog.show();
  }
  closegcinfodialog() {
    this.gcinfodialog.hide();
  }
  searchkucunfanlidet() {
    if (!this.search['month']) {
        this.toast.pop('warning', '请选择月份！', '');
        return;
    }
    this.listDetail();
    this.closegcinfodialog();
  }


}
