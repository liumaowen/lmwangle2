import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MaoliService } from './../maoli.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-maoli',
  templateUrl: './maoli.component.html',
  styleUrls: ['./maoli.component.scss']
})
export class MaoliComponent implements OnInit {
  //aggird 表格初始化对象
  gridOptions: GridOptions;
  aggFuncs; // 自定义合计
  constructor(public settings: SettingsService, private maoliApi: MaoliService, private datepipe: DatePipe,
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
      // {cellStyle: { 'text-align':  'center'}, headerName: '统计', field: 'tongji', minWidth: 90,hide:true,rowGroup:true},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售时间', field: 'saledate', minWidth: 90, enableRowGroup: true,
        cellRenderer: (params) => {
          // console.log(params.data);
          if (params && params.data && null != params.data['saledate']) {
            return params.data['saledate'];
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员机构', field: 'uorg', minWidth: 80, enableRowGroup: true },
      // { headerName: '所属机构', field: 'sorgname', minWidth: 155, cellRenderer: 'group', enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方机构', field: 'sorgname', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方机构', field: 'borgname', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方', field: 'scustomername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'bcustomername', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售类型', field: 'saletypename', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售类型', field: 'saletype', minWidth: 90, enableRowGroup: true,
        cellRenderer: (params) => {
          if (params.data && params.data.rukudate) {
            if (!params.data) return null
            if (params.data.saletype == 0) return '<a target="_blank" href="#/businessorder/' + params.data.billid + '">机构代销</a>'
            else if (params.data.saletype == 1) return '<a target="_blank" href="#/innersale/' + params.data.billid + '">内部采购</a>'
            else if (params.data.saletype == 2) return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">货物实提</a>'
            else if (params.data.saletype == 3) return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">销售退货</a>'
            else return null
          }
        }
      },

      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum2',
        valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },

      {
        cellStyle: { 'display': 'block' }, headerName: '实际毛利', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售', field: 'saleprice', minWidth: 60,
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                return params.data.saleprice;
              } else if (!params.data) {
                return '';
              } else {
                return '0';
              }
            },
            valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售费用', field: 'xsfeeprice', minWidth: 90, aggFunc: 'avg',
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.xsfeeprice) {
                  return params.data.xsfeeprice;
                } else {
                  return '0';
                }
              }
            },
            valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '销售费用金额', field: 'xsfeepricejine', minWidth: 90, aggFunc: 'sum2',
            valueGetter: (params) => Number(params.data['xsfeepricejine']) || Number(params.data['xsfeepricejine']) === 0 ?
              Number(params.data['xsfeepricejine']) : 0,
            // valueGetter: (params) => {
            //   if (params.data && params.data['xsfeepricejine']) {
            //     if (params.data['xsfeepricejine']) {
            //       return params.data['xsfeepricejine'];
            //     } else {
            //       return '0';
            //     }
            //   }
            //   console.log(params.data);
            // },
            // cellRenderer: this.settings.valueFormatter2
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '成本', field: 'chengben', minWidth: 60, aggFunc: 'avg',
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.chengben) {
                  return params.data.chengben;
                } else {
                  return '0';
                }
              }
            },
            valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购费用', field: 'cgfeeprice', minWidth: 90, aggFunc: 'avg',
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.cgfeeprice) {
                  return params.data.cgfeeprice;
                } else {
                  return '0';
                }
              }
            },
            valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '采购费用金额', field: 'cgfeepricejine', minWidth: 90, aggFunc: 'sum2',
            valueGetter: (params) => Number(params.data['cgfeepricejine']) || Number(params.data['cgfeepricejine']) === 0 ?
              Number(params.data['cgfeepricejine']) : 0
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '销售补差金额', field: 'xsbcjine', minWidth: 60,
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.xsbcjine) {
                  return params.data.xsbcjine;
                } else {
                  return '0';
                }
              }
            }

          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '采购补差金额', field: 'cgbcjine', minWidth: 60,
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.cgbcjine) {
                  return params.data.cgbcjine;
                } else {
                  return '0';
                }
              }
            }

          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '毛利单价', field: 'maoliprice', minWidth: 60, aggFunc: 'avg',
            cellRenderer: (params) => {
              if (params.data && params.data.saleprice) {
                if (params.data.maoliprice) {
                  return params.data.maoliprice;
                } else {
                  return '0';
                }
              }
            },
            valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '价格调整金额', field: 'pricebuchajine', minWidth: 100, aggFunc: 'sum2',
            valueGetter: (params) => {
              if (params.data && params.data['pricebuchajine']) {
                return Number(params.data['pricebuchajine']);
              } else {
                return 0;
              }
            },
            cellRenderer: this.settings.valueFormatter2,
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '毛利金额', field: 'maolijine', minWidth: 100, aggFunc: 'sum2',
            valueGetter: (params) => {
              if (params.data && params.data['maolijine']) {
                return Number(params.data['maolijine']);
              } else {
                return 0;
              }
            },
            //  valueFormatter: this.settings.valueFormatter,
            cellRenderer: this.settings.valueFormatter2,
            // cellRenderer: (params) => {
            //   if (params.data.maolijine) {
            //     return params.data.maolijine;
            //   } else {
            //     return '0';
            //   }
            // },
            // valueFormatter: this.settings.valueFormatter2, enableRowGroup: true
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '不含税利润', field: 'bhslirun', minWidth: 100, aggFunc: 'sum2',
            valueGetter: (params) => {
              if (params.data && params.data['saleprice'] && params.data['chengben'] && params.data['weight']) {
                return Number(params.data['saleprice']) * Number(params.data['weight']) / 1.13 -
                  Number(params.data['chengben']) * Number(params.data['weight']) / 1.13 -
                  Number(params.data['cgfeepricejine']) / 1.09 - Number(params.data['xsfeepricejine']) / 1.09;
              } else {
                return Number(params.data['maolijine']) / 1.13;
              }
            },
            cellRenderer: this.settings.valueFormatter2,

          },
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'kucunid', field: 'kucunid', minWidth: 75,
        cellRenderer: (params) => {
          if (!params.data) { return null; }
          if (null != params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          }
          else { return params.data.kucunid; }
        }, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 160, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 160,
        valueFormatter: this.settings.valueFormatter3, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 160, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orderbill', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaodesc', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '用户性质', field: 'usernature', minWidth: 80, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否期货', field: 'isqihuo', minWidth: 80, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '入库类型', field: 'rukutype', minWidth: 90, valueFormatter: (params) => {
          if (params.value === 0) { return '入库'; }
          else if (params.value === 1) { return '内部采购'; }
          else if (params.value === 2) { return '加工验收'; }
          else { return null; }
        }, enableRowGroup: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'rukudate', minWidth: 90, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '计算时间', field: 'calcdate', minWidth: 90, enableRowGroup: true },
    ];
    this.aggFuncs = {
      sum2: this.sumFunctions,
    };
  }

  ngOnInit() {
  }

  //查询弹窗组件
  @ViewChild('classicModal') private classicModal: ModalDirective;

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

  //导出aggird表格
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '销售毛利明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  //查询
  select() {
    let search = {};
    search["start"] = this.datepipe.transform(this.search['start'], 'y-MM-dd');
    if (this.search['end']) search["end"] = this.datepipe.transform(this.search['end'], 'y-MM-dd');
    if (this.search['shitistart']) search["shitistart"] = this.datepipe.transform(this.search['shitistart'], 'y-MM-dd');
    if (this.search['shitiend']) search["shitiend"] = this.datepipe.transform(this.search['shitiend'], 'y-MM-dd');
    if (this.search['saletype']) search["saletype"] = this.search['saletype'];
    if (this.search['salerid']) search["salerid"] = this.search['salerid']['code'];
    if (this.search['sorgid']) search["sorgid"] = this.search['sorgid'];
    if (this.search['buyerid']) search["buyerid"] = this.search['buyerid']['code'];
    if (this.search['borgid']) search["borgid"] = this.search['borgid'];
    if (this.search['salemanid']) search["salemanid"] = this.search['salemanid']['code'];
    if (this.search['kucunid']) search["kucunid"] = this.search['kucunid'];
    this.maoliApi.querymaoli(search).then(data => {
      console.log(data);
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

  //毛利计算
  @ViewChild("staticModal") private maoliModal: ModalDirective;

  //毛利查询对象
  mlsearch = {};

  //显示毛利弹窗
  showmaoli() {
    this.maoliModal.show();
  }

  //关闭毛利弹窗
  hidemaoli() {
    this.maoliModal.hide();
  }

  //毛利计算
  maolijisuan(isn) {
    let search = {};
    if (!this.mlsearch['start'] && !this.mlsearch['end']) this.toast.pop("error", "请填写开始时间和结束时间");
    else {
      search['start'] = this.datepipe.transform(this.mlsearch['start'], 'y-MM-dd');
      search['end'] = this.datepipe.transform(this.mlsearch['end'], 'y-MM-dd');
      search['isinnersale'] = isn;
      this.maoliApi.calcmaoli(search).then(data => {
        console.log(data)
        this.toast.pop('success', '计算成功！');
      })
      this.hidemaoli();
    }
  }

  //加工成本计算
  calcfpchengben() {
    this.maoliApi.calcfpchengben().then(data => {
      this.toast.pop("success", '计算成功！');
    })
      .catch(() => {
        this.toast.pop("error", "计算失败！")
      })
  }
  /**合计总数保留两位小数 */
  sumFunctions(values: any) {
    let result: any = 0;
    values.forEach(value => {
      result += Number(value);
    });
    result = String(result.toFixed(2));
    return result;
  }

}
