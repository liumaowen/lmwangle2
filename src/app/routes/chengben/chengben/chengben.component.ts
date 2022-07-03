import { SettingsService } from './../../../core/settings/settings.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import { ChengbenService } from './../chengben.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chengben',
  templateUrl: './chengben.component.html',
  styleUrls: ['./chengben.component.scss']
})
export class ChengbenComponent implements OnInit {
  //aggird 表格初始化对象
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private chengbenApi: ChengbenService, private datepipe: DatePipe, private userapi: UserapiService,
    private toast: ToasterService) {
    //aggird实例对象
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
    //设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true,
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.gn;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月库存量', field: 'lastkucunweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastkucunweight']) {
            return Number(params.data['lastkucunweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '上月库存金额', field: 'lastkucunjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastkucunjine']) {
            return Number(params.data['lastkucunjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购量', field: 'caigouweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['caigouweight']) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购金额', field: 'caigoujine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['caigoujine']) {
            return Number(params.data['caigoujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购金额(不含税)', field: 'notaxcaigoujine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxcaigoujine']) {
            return Number(params.data['notaxcaigoujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购补差金额', field: 'cgbuchajine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cgbuchajine']) {
            return Number(params.data['cgbuchajine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购补差金额(不含税)', field: 'notaxcgbuchajine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxcgbuchajine']) {
            return Number(params.data['notaxcgbuchajine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '外购承兑贴息', field: 'chengdui', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['chengdui']) {
            return Number(params.data['chengdui']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购费用', field: 'cgfeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cgfeejine']) {
            return Number(params.data['cgfeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购费用(不含税)', field: 'notaxcgfeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxcgfeejine']) {
            return Number(params.data['notaxcgfeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工重量', field: 'jiagongweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jiagongweight']) {
            return Number(params.data['jiagongweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工成本金额', field: 'jiagongchengbenjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jiagongchengbenjine']) {
            return Number(params.data['jiagongchengbenjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工成本金额(不含税)', field: 'notaxjiagongchengbenjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxjiagongchengbenjine']) {
            return Number(params.data['notaxjiagongchengbenjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '加权单价', field: 'jiaquanprice', minWidth: 60, enableRowGroup: true ,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售成本', field: 'salechengben', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['salechengben']) {
            return Number(params.data['salechengben']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售数量', field: 'saleweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['saleweight']) {
            return Number(params.data['saleweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售收入', field: 'saleshouru', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['saleshouru']) {
            return Number(params.data['saleshouru']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售收入(不含税)', field: 'notaxsaleshouru', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxsaleshouru']) {
            return Number(params.data['notaxsaleshouru']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售费用(含税)', field: 'xsfeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xsfeejine']) {
            return Number(params.data['xsfeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售费用(含税/1.10)', field: 'notaxxsfeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['notaxxsfeejine']) {
            return Number(params.data['notaxxsfeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存量', field: 'kucunweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunweight']) {
            return Number(params.data['kucunweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存金额', field: 'kucunjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunjine']) {
            return Number(params.data['kucunjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月毛利', field: 'salemaoli', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['salemaoli']) {
            return Number(params.data['salemaoli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月吨毛利', field: 'persalemaoli', minWidth: 60, enableRowGroup: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return null;
          } else if (isNaN(params.value)) {
            return 'NaN';
          } else {
            return (params.data.salemaoli / params.data.saleweight).toFixed(2);
          }
        },
      }
    ];
    this.search();
  }
  ngOnInit() {
  }
  search() {
    this.chengbenApi.listchengben().then(data => {
      data.forEach(element => {
        element.persalemaoli = (element.salemaoli / element.saleweight).toFixed(2);
      });
      this.gridOptions.api.setRowData(data);
    })
  }
  model: Object;
  modifyLastkucun(params, isjine) {
    console.log(params);
    const id = params.data.id;
    this.model = null;
    if (isjine) {
      this.model = { isjine: isjine, lastkucunjine: params.newValue };
    } else {
      this.model = { isjine: isjine, lastkucunweight: params.newValue };
    }

    this.chengbenApi.modifyLastkucun(id, this.model).then(data => {
    });
  }

}
