import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { ErpkaoheService } from './../erpkaohe.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-lirunjixiao',
  templateUrl: './lirunjixiao.component.html',
  styleUrls: ['./lirunjixiao.component.scss']
})
export class LirunjixiaoComponent implements OnInit {
  monthDate: any;
  querymonth = null;
  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('lirundialog') private lirundialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  // 数量绩效上传信息及格式
  uploadParam: any = { module: 'assessment', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  updatestart = null;
  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService,
    private datepipe: DatePipe, private toast: ToasterService) {
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
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', headerClass: 'wis-ag-center', field: 'orgname', minWidth: 80,
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.orgname;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', headerClass: 'wis-ag-center', minWidth: 80, field: 'salemanname' },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', headerClass: 'wis-ag-center', minWidth: 80, field: 'yuefen' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量合计', headerClass: 'wis-ag-center', field: 'heji',
        enableRowGroup: true, minWidth: 80,
        aggFunc: 'sum'
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '线上销售', headerClass: 'wis-ag-center', field: 'xhonline',
        enableRowGroup: true, minWidth: 80,
        aggFunc: 'sum'
      },
      {
        cellClass: 'text-center', headerName: '常规产品', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '现货', field: 'xianhuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '期货', field: 'qihuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
        ]
      },
      {
        cellClass: 'text-center', headerName: '市场调货', field: 'tiaohuo',
        minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum'
      },
      {
        cellClass: 'text-center', headerName: '淀川盛馀', field: 'dianchuan',
        minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum'
      },
      {
        cellClass: 'text-center', headerName: '维实', field: 'weishi',
        minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
        aggFunc: 'sum'
      },
      {
        cellClass: 'text-center', headerName: '创新产品', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '洁彩', field: 'jiecai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '恒牧', field: 'hengmu',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '抗菌', field: 'kangjun',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '至彩', field: 'zhicai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '辉彩', field: 'huicai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '泰得', field: 'taide',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
        ]
      },
      {
        cellClass: 'text-center', headerName: '钢品（单吨利润<100）', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '常规现货', field: 'gpxianhuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '常规期货', field: 'gpqihuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '淀川盛馀', field: 'gpdianchuan',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '维实', field: 'gpweishi',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '洁彩', field: 'gpjiecai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '恒牧', field: 'gphengmu',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '抗菌', field: 'gpkangjun',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '至彩', field: 'gpzhicai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '辉彩', field: 'gphuicai',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '泰得', field: 'gptaide',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
        ]
      },
      {
        cellClass: 'text-center', headerName: '总经理特批（创新产品）', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-center', headerName: '现货', field: 'tpxianhuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          },
          {
            cellClass: 'text-center', headerName: '期货', field: 'tpqihuo',
            minWidth: 80, editable: false, valueFormatter: this.settings.valueFormatter, enableRowGroup: true,
            aggFunc: 'sum'
          }
        ]
      }
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.lirunjixiao(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  show() {
    this.lirundialog.show();
    this.search = {};
    this.querymonth = null;
    this.search['month'] = this.datepipe.transform(new Date(), 'y-MM') + '-01';
  }
  close() {
    this.lirundialog.hide();
  }
  /**选择月份*/
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  select() {
    if (!this.search['month']) { this.toast.pop('warning', '请选择月份！'); return; }
    console.log(this.search);
    this.listDetail();
    this.close();
  }
  /**选择月份*/
  selectmonth1(value) {
    this.updatestart = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.erpkaoheapi.upload(this.updatestart, addData).then(data => {
        this.search['month'] = this.updatestart;
        this.listDetail();
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideDialog();
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  showupload() {
    this.uploaderModel.show();
    this.updatestart = this.datepipe.transform(new Date(), 'y-MM') + '-01';
    this.monthDate = new Date();
  }
}
