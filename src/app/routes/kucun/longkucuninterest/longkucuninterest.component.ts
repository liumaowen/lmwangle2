import { ToasterService } from 'angular2-toaster';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { KucunService } from '../kucun.service';

@Component({
  selector: 'app-longkucuninterest',
  templateUrl: './longkucuninterest.component.html',
  styleUrls: ['./longkucuninterest.component.scss']
})
export class LongkucuninterestComponent implements OnInit {
  gridOptions: GridOptions;
  search: any = {};
  isshowmonth = true;
  private gridApi;
  private gridColumnApi;
  constructor(public settings: SettingsService,
     private toast: ToasterService,
    private kucunApi: KucunService,
    public numberPipe: DecimalPipe,
    private orgApi: OrgApiService) {

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
      animateRows: true
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.month) {
            return '<a>' + params.data.month + '</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.month) {
            const mon = params.data.month.substr(0, 4) + '-' + params.data.month.substr(4) + '-01';
            this.search['month'] = mon;
            this.listDetail(2);
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 80
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '总库存', field: 'allweight', minWidth: 80,
      valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '长期库存', headerClass: 'wis-ag-center', colId: 'longkucun',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '期货', field: 'qhweight', minWidth: 80,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '现货', field: 'xhweight', minWidth: 80,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '长期库存合计', field: 'longkucuntotal', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '相比递减', field: 'addandreduce', minWidth: 100,
            valueFormatter: this.settings.valueFormatter, colId: 'addandreduce',
            valueGetter: (params) => params.data.addandreduce,
            cellRenderer: (params) => {
              if (params && params.data && null != params.data.addandreduce) {
                if (params.data.addandreduce > 0) {
                  return `<span style="color:red;">${params.data.addandreduce}</span>`;
                } else {
                  return params.data.addandreduce + '';
                }
              } else {
                return '';
              }
            },
          }
        ]
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长期库存量占比', field: 'longkucunrate', minWidth: 100
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长期库存吨资金利息', field: 'duninterest', minWidth: 120,
      valueFormatter: this.settings.valueFormatter
      }
    ];
  }

  ngOnInit() {
  }

  // 网格赋值
  listDetail(flag) {
    this.kucunApi.getlongkucuninterest(this.search).then(data => {
      let lastdate = '';
      if (this.search['month']) {
        const lastdateobj = this.settings.getlastdate(new Date(this.search['month']));
        lastdate = lastdateobj.lastmonth + '.' + lastdateobj.lastdate;
      } else {
        const lastdateobj = this.settings.getlastdate(null);
        lastdate = lastdateobj.lastmonth + '.' + lastdateobj.lastdate;
      }
      this.gridOptions.columnDefs.forEach(colde => {
        if (colde['colId'] === 'longkucun') {
          colde['children'].forEach(ele => {
            if (ele['colId'] === 'addandreduce') {
              ele.headerName = '相比' + lastdate + '递减';
            }
          });
        }
      });
      this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
      this.gridOptions.api.setRowData(data);
      if (flag === 1) {
        this.gridColumnApi.setColumnVisible('month', false);
      }
      this.gridOptions.columnApi.autoSizeAllColumns();
    });
  }
  query() {
    this.search = {};
    this.listDetail(1);
  }
  /**查询历史数据 */
  gethistory() {
    this.kucunApi.getongkucuninterestmonth().then(data => {
      this.gridColumnApi.setColumnVisible('month', true);
      this.gridOptions.api.setRowData(data);
      this.gridOptions.columnApi.autoSizeAllColumns();
      if (!data.length) {
        this.toast.pop('info', '没有历史数据！');
      }
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  // 导出
  imp() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '机构长期库存&吨利息.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
