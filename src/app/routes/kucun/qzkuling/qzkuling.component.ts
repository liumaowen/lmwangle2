import { ToasterService } from 'angular2-toaster';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { KucunService } from '../kucun.service';

@Component({
  selector: 'app-qzkuling',
  templateUrl: './qzkuling.component.html',
  styleUrls: ['./qzkuling.component.scss']
})
export class QzkulingComponent implements OnInit {
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
            this.listDetail();
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '总库存', headerClass: 'wis-ag-center',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '库存重量', field: 'allweight', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄', field: 'allquanzhong', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄相比上月底增减', field: 'allreduce', minWidth: 150,
            valueFormatter: this.settings.valueFormatter,cellRenderer: (params) => {
                if (params.data && null != params.data.allreduce && undefined != params.data.allreduce && Number(params.data.allreduce)>0) {
                  return `<font color="red">${params.data.allreduce}</font>`;
                } else {
                  return params.data.allreduce;
                }
              },
          }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '期货', headerClass: 'wis-ag-center', colId: 'jiname',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '库存重量', field: 'qhweight', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄', field: 'qhquanzhong', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄相比上月底增减', field: 'qhreduce', minWidth: 150,
            valueFormatter: this.settings.valueFormatter,
            cellRenderer: (params) => {
                if (params.data && null != params.data.qhreduce && undefined != params.data.qhreduce && Number(params.data.qhreduce)>0) {
                  return `<font color="red">${params.data.qhreduce}</font>`;
                } else {
                  return params.data.qhreduce;
                }
              }
          }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '现货', headerClass: 'wis-ag-center',
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '库存重量', field: 'xhweight', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄', field: 'xhquanzhong', minWidth: 100,
            valueFormatter: this.settings.valueFormatter
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄相比上月底增减', field: 'xhreduce', minWidth: 150,
            valueFormatter: this.settings.valueFormatter,
            cellRenderer: (params) => {
                if (params.data && null != params.data.xhreduce && undefined != params.data.xhreduce && Number(params.data.xhreduce)>0) {
                  return `<font color="red">${params.data.xhreduce}</font>`;
                } else {
                  return params.data.xhreduce;
                }
              }
          }
        ]
      }
    ];
  }

  ngOnInit() {
  }

  // 网格赋值
  listDetail() {
    this.kucunApi.getqzkuling(this.search).then(data => {
      data.forEach(element => {
        element.qhreduce = element.qhreduce?element.qhreduce+'':'';
        element.xhreduce = element.xhreduce?element.xhreduce+'':'';
        element.allreduce = element.allreduce?element.allreduce+ '':'';
      });
      this.gridOptions.api.setRowData(data);
      this.gridOptions.columnApi.autoSizeAllColumns();
    });
  }
  query() {
    this.search = {};
    this.gridColumnApi.setColumnVisible('month', false);
    this.listDetail();
  }
  /**查询历史数据 */
  gethistory() {
    this.kucunApi.getqzkulingmonth().then(data => {
      data.forEach(element => {
        element.qhreduce = element.qhreduce?element.qhreduce+'':'';
        element.xhreduce = element.xhreduce?element.xhreduce+'':'';
        element.allreduce = element.allreduce?element.allreduce+ '':'';
      });
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
      fileName: '机构库存权重库龄.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
