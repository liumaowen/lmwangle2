import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ErpkaoheService } from '../erpkaohe.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-lirunkaohe',
  templateUrl: './lirunkaohe.component.html',
  styleUrls: ['./lirunkaohe.component.scss']
})
export class LirunkaoheComponent implements OnInit {
  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('lirunkaohedialog') private lirunkaohedialog: ModalDirective;
  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private datepipe: DatePipe) {
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
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname',
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.orgname;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname' },
      {
        cellClass: 'text-center', headerClass: '', headerName: '当月参与考核利润', field: 'canyukaohelirun',
        minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum',
      },
      {
        cellClass: 'text-center', headerClass: '', headerName: 'ERP利润', field: 'erplirun',
        minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum',
      },
      {
        cellClass: 'text-center', headerName: '非备货利润', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '正常价格', headerClass: 'wis-ag-center',
            children: [
              {
                cellClass: 'text-center ', headerName: '常规产品', field: 'changgui',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              },
              {
                cellClass: 'text-center ', headerName: '维实', field: 'weishi',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              },
              {
                cellClass: 'text-center ', headerName: '淀川盛馀', field: 'dcshengyu',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              },
              {
                cellClass: 'text-center ', headerName: '创新产品', field: 'innovate',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              },
            //   {
            //     cellClass: 'text-center ', headerName: '钢品吨毛利≥100', field: 'gpmtlirun',
            //     minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            //     aggFunc: 'sum',
            //   },
              {
                cellClass: 'text-center', headerName: '钢品常规吨毛利<100', field: 'gpchanggui',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              },
              {
                cellClass: 'text-center', headerName: '钢品特殊吨毛利<100', field: 'gpteshu',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
              }
            ]
          },
          {
            cellClass: 'text-center ', headerName: '总经理特批', field: 'tepi',
            minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum',
          },
          {
            cellClass: 'text-center ', headerName: '低于指导价', headerClass: 'wis-ag-center',field: 'ltlirun',
            children: [
                {
                    cellClass: 'text-center ', headerName: '总', field: 'ltzong',
                    minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                    aggFunc: 'sum',
                },
                {
                    cellClass: 'text-center ', headerName: '正', field: 'ltzheng',
                    minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                    aggFunc: 'sum',
                },
                {
                    cellClass: 'text-center ', headerName: '负', field: 'ltfu',
                    minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                    aggFunc: 'sum',
                },
                {
                    cellClass: 'text-center ', headerName: '负', headerClass: 'wis-ag-center',field: 'ltlirun',
                    children: [
                        {
                            cellClass: 'text-center ', headerName: '常规产品', field: 'cgchanpin',
                            minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                            aggFunc: 'sum',
                        },
                        {
                            cellClass: 'text-center ', headerName: '维实/创新产品/淀川盛馀', field: 'weishichuangxin',
                            minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                            aggFunc: 'sum',
                        }
                    ]
                }
            ]
          }
        ]
      },
      {
        cellClass: 'text-center ', headerName: '线下现货销售价格低于同期线上定价', headerClass: 'wis-ag-center',field: 'ltlirun',
        children: [
            {
                cellClass: 'text-center ', headerName: '常规产品', field: 'changgui1',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
            },
            {
                cellClass: 'text-center ', headerName: '特殊产品', field: 'teshu',
                minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
                aggFunc: 'sum',
            }
        ]
      },
      {
        cellClass: 'text-center ', headerName: '备货利润', field: 'bhlirun',
        minWidth: 80, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum',
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '线上', field: 'onlinelirun', enableRowGroup: true,
        aggFunc: 'sum',valueFormatter: this.settings.valueFormatter2
      },
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.lirunkaohe(this.search).then((data) => {
      // data.forEach(element => {
      //   element.lirunjixiao = element.lirunjixiao.toFixed(2);
      // });
      this.gridOptions.api.setRowData(data);
    });
  }

  show() {
    this.lirunkaohedialog.show();
  }
  close() {
    this.lirunkaohedialog.hide();
  }
  select() {
    this.search['start'] ? this.search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd') : '';
    this.search['end'] ? this.search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd') : '';
    console.log(this.search);
    this.listDetail();
    this.close();
  }

}
