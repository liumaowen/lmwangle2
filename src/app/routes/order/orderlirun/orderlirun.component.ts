import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { UserapiService } from '../../../dnn/service/userapi.service';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ReportService } from 'app/routes/report/report.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';

@Component({
  selector: 'app-maoli',
  templateUrl: './orderlirun.component.html',
  styleUrls: ['./orderlirun.component.scss']
})
export class OrderlirunComponent implements OnInit {
  //aggird 表格初始化对象
  gridOptions: GridOptions;
  aggFuncs; // 自定义合计
  chandioptions: any = [];
  sellersResult: any = [];
  constructor(public settings: SettingsService,private datepipe: DatePipe,
    private reportApi: ReportService,
    private customerApi: CustomerapiService,
    private userapi: UserapiService, private toast: ToasterService) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '订单签订日期', field: 'cdate', minWidth: 90, enableRowGroup: true,},
      { cellStyle: { 'text-align': 'center' }, headerName: '线上/线下', field: 'isonline', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'buyername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'sellername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'thweight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['thweight']);
          } else {
            return 0;
          }
        },valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单价', field: 'feeprice', minWidth: 60, enableRowGroup: true ,
      valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '机构成本单价', field: 'chengbenprice', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售单价', field: 'saleprice', minWidth: 160, enableRowGroup: true,
      valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售补差金额', field: 'xbjine', minWidth: 160,aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['xbjine']);
          } else {
            return 0;
          }
        },valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '外部销售毛利（含税）', field: 'maoli', minWidth: 160, enableRowGroup: true,aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['maoli']);
          } else {
            return 0;
          }
        },valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否实提', field: 'isshiti', minWidth: 90, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否低于指导价', field: 'zhidaojiagedesc', minWidth: 90, enableRowGroup: true },
    ];
    this.aggFuncs = {
      sum2: this.sumFunctions,
    };
  }

  ngOnInit() {
  }

  //查询弹窗组件
  @ViewChild('classicModal') private classicModal: ModalDirective;
   // 品名选择弹窗
   @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;

  //限制最大时间
  maxDate: Date = new Date();

  //查询的对象
  search = {
    start: this.getfirstday(),
    end: null,
    shitistart: null,
    shitiend: null,
    saletype: null,
    salerid: null,
    sorgid: null,
    buyerid: null,
    borgid: null,
    salemanid: null
  };

  //查询
  query() {
    if (this.sellersResult.length < 1) {
      this.sellersResult = [{ value: '', label: '全部' }];
      this.customerApi.findwiskind().then((response) => {
        response.forEach(element => {
          this.sellersResult.push({
            value: element.id,
            label: element.name
          });
        });
      });
    }
    if (!this.items) {
      this.items = [{ value: '', label: '全部' }];
      this.userapi.searchjigou(0).then(data => {
        data.forEach(element => {
          this.items.push({
            value: element['id'],
            label: element['name']
          })
        });
      })
    }
    this.classicModal.show();
  }

  //关闭查询弹窗
  coles() {
    this.classicModal.hide();
  }

  //查询
  select() {
    let search = {};
    console.log(this.sellersResult);
    console.log(this.search);
    search["start"] = this.datepipe.transform(this.search['start'], 'y-MM-dd');
    if (this.search['end']) search["end"] = this.datepipe.transform(this.search['end'], 'y-MM-dd');
    if (this.search['shitistart']) search["shitistart"] = this.datepipe.transform(this.search['shitistart'], 'y-MM-dd');
    if (this.search['shitiend']) search["shitiend"] = this.datepipe.transform(this.search['shitiend'], 'y-MM-dd');
    //if (this.search['sallerid']) search["sallerid"] = this.sellersResult['value'];
    if (this.search['orgid']) search["orgid"] = this.search['orgid'];
    if (this.search['buyerid']) search["buyerid"] = this.search['buyerid']['code'];
    if (this.search['salemanid']) search["salemanid"] = this.search['salemanid']['code'];
    if (this.search['kucunid']) search["kucunid"] = this.search['kucunid'];
    if (this.search['billno']) search["billno"] = this.search['billno'];
    if (this.search['kunbaohao']) search["kunbaohao"] = this.search['kunbaohao'];
    if (this.search['gn']) search["gn"] = this.search['gn'];
    if (this.search['chandi']) search["chandi"] = this.search['chandi'];
    if (this.search['iskuisun']) search["iskuisun"] = this.search['iskuisun'];
    console.log(this.search);
    this.reportApi.querylirun(search).then(data => {
      this.gridOptions.api.setRowData(data);
    })
    this.coles();
  }

  //清除查询接口
  selectNull() {
    this.search = {
      start: this.getfirstday(),
      end: null,
      shitistart: null,
      shitiend: null,
      saletype: null,
      salerid: null,
      sorgid: null,
      buyerid: null,
      borgid: null,
      salemanid: null
    };
  }

  //获取当月第一天
  getfirstday() {
    let day: Date = new Date();
    day.setDate(1);
    return day;
  }

  //卖方机构。买方机构列表数组
  items;

  /**合计总数保留两位小数 */
  sumFunctions(values: any) {
    let result: any = 0;
    values.forEach(value => {
      result += Number(value);
    });
    result = String(result.toFixed(2));
    return result;
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }

}
