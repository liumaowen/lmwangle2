import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ChengbenService } from '../chengben.service';
import { DatePipe } from '@angular/common';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-onechengben',
  templateUrl: './onechengben.component.html',
  styleUrls: ['./onechengben.component.scss']
})
export class OnechengbenComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('checkdataModal') private checkdataModal: ModalDirective;
  gridOptions: GridOptions;
  model: Object;
  searchparam: object = { month: '' };
  checkdata = [];
  constructor(public settings: SettingsService, private onechengbenApi: ChengbenService,
    private datepipe: DatePipe, private userapi: UserapiService, private toast: ToasterService) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '入库日期', field: 'rukudate', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 60, enableRowGroup: true },
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
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60,
        enableRowGroup: true
      },
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
        cellStyle: { 'text-align': 'center' }, headerName: '上月价格补差金额', field: 'lastbuchajine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastbuchajine']) {
            return Number(params.data['lastbuchajine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月入库量', field: 'rukuweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['rukuweight']) {
            return Number(params.data['rukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月入库单价', field: 'rukuprice', minWidth: 60, enableRowGroup: true,
        // aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['rukuprice']) {
            return Number(params.data['rukuprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月入库金额', field: 'rukujine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['rukujine']) {
            return Number(params.data['rukujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '今年未到返利', field: 'wffanli', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['wffanli']) {
            return Number(params.data['wffanli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存返利', field: 'wfkucunfanli', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['wfkucunfanli']) {
            return Number(params.data['wfkucunfanli']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '去年已到返利', field: 'lastyifan', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['lastyifan']) {
            return Number(params.data['lastyifan']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购退货单价', field: 'cgtuihuoprice', minWidth: 60, enableRowGroup: true,
        //  aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cgtuihuoprice']) {
            return Number(params.data['cgtuihuoprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购退货重量', field: 'cgtuihuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cgtuihuoweight']) {
            return Number(params.data['cgtuihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购退货金额', field: 'cgtuihuojine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['cgtuihuojine']) {
            return Number(params.data['cgtuihuojine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购费用单价', field: 'caigoufeeprice', minWidth: 60, enableRowGroup: true,
        //aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['caigoufeeprice']) {
            return Number(params.data['caigoufeeprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购费用金额', field: 'caigoufeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['caigoufeejine']) {
            return Number(params.data['caigoufeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter
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
        cellStyle: { 'text-align': 'center' }, headerName: '本月加工量', field: 'produceweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['produceweight']) {
            return Number(params.data['produceweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月加工成本金额', field: 'producejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['producejine']) {
            return Number(params.data['producejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售量', field: 'saleweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['saleweight']) {
            return Number(params.data['saleweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售单价', field: 'saleprice', minWidth: 60, enableRowGroup: true,
        //aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['saleprice']) {
            return Number(params.data['saleprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售金额', field: 'salejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['salejine']) {
            return Number(params.data['salejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售补差金额', field: 'xsbuchajine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xsbuchajine']) {
            return Number(params.data['xsbuchajine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售退货单价', field: 'xstuihuoprice', minWidth: 60, enableRowGroup: true,
        //aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xstuihuoprice']) {
            return Number(params.data['xstuihuoprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售退货重量', field: 'xstuihuoweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xstuihuoweight']) {
            return Number(params.data['xstuihuoweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售退货金额', field: 'xstuihuojine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xstuihuojine']) {
            return Number(params.data['xstuihuojine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售退货费用单价', field: 'xstuihuofeeprice', minWidth: 60, enableRowGroup: true,
        // aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xstuihuofeeprice']) {
            return Number(params.data['xstuihuofeeprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售退货费用金额', field: 'xstuihuofeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xstuihuofeejine']) {
            return Number(params.data['xstuihuofeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货费用单价', field: 'tihuofeeprice', minWidth: 60, enableRowGroup: true,
        //  aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tihuofeeprice']) {
            return Number(params.data['tihuofeeprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货费用金额', field: 'tihuofeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tihuofeejine']) {
            return Number(params.data['tihuofeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '调拨费用单价', field: 'allotfeeprice', minWidth: 60, enableRowGroup: true,
        //  aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['allotfeeprice']) {
            return Number(params.data['allotfeeprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '调拨费用金额', field: 'allotfeejine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['allotfeejine']) {
            return Number(params.data['allotfeejine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售费用单价', field: 'xsfeeprice', minWidth: 60, enableRowGroup: true,
        //  aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xsfeeprice']) {
            return Number(params.data['xsfeeprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售费用金额', field: 'xsfeejine', minWidth: 60, enableRowGroup: true,
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
        cellStyle: { 'text-align': 'center' }, headerName: '销售收入', field: 'xsshouru', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xsshouru']) {
            return Number(params.data['xsshouru']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售成本', field: 'xschengben', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['xschengben']) {
            return Number(params.data['xschengben']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '毛利金额', field: 'maolijine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['maolijine']) {
            return Number(params.data['maolijine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '吨毛利', field: 'maoliprice', minWidth: 60, enableRowGroup: true,
        valueGetter: (params) => {
          if (params.data && params.data['maoliprice']) {
            return Number(params.data['maoliprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月库存量', field: 'kucunweight', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunweight']) {
            return Number(params.data['kucunweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '本月库存金额', field: 'kucunjine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kucunjine']) {
            return Number(params.data['kucunjine']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '价格补差金额', field: 'pricebuchajine', minWidth: 60, enableRowGroup: true,
        aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['pricebuchajine']) {
            return Number(params.data['pricebuchajine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      }


    ];

  }
  ngOnInit() {
    this.search();
  }
  search() {
    this.onechengbenApi.listonechengben(this.searchparam).then(data => {
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }

  modifyLastkucun(params, isjine) {
    console.log(params);
    const id = params.data.id;
    this.model = null;
    if (isjine) {
      this.model = { isjine: isjine, lastkucunjine: params.newValue };
    } else {
      this.model = { isjine: isjine, lastkucunweight: params.newValue };
    }

    this.onechengbenApi.modifyLastkucun(id, this.model).then(data => {
    });
  }
  openquery() {
    this.selectNull();
    this.classicModal.show();
  }
  selectNull() {
    this.searchparam = { month: '' };
  }
  close() {
    this.classicModal.hide();
  }
  selectmonth(value) {
    this.searchparam['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 查询检查数据显示
  getcheckdata() {
    this.onechengbenApi.getcheckdata().then(data => {
      this.checkdata = data;
    });
  }
  checkdatashow() {
    this.getcheckdata();
    this.checkdataModal.show();
  }
  checkdataclose() {
    this.checkdataModal.hide();
  }

}
