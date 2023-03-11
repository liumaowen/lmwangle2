import { environment } from './../../../../environments/environment';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { KucunService } from './../kucun.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kucunday',
  templateUrl: './kucunday.component.html',
  styleUrls: ['./kucunday.component.scss']
})
export class KucundayComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('downModal') private downModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  // aggird表格原型
  gridOptions: GridOptions;
  search: Object = { orgid: '', gn: '', chandi: '' };
  gns;
  chandis: any[];
  cs;
  // 定义下载传递时间
  date: Date;
  // 最大时间
  maxdate = new Date();
  constructor(public settings: SettingsService, private toasterService: ToasterService, private kucunapi: KucunService,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe) {
    this.gridOptions = {
      groupIncludeFooter: true,
      groupSuppressRow: true,
      enableFilter: true, // 过滤器
      groupDefaultExpanded: 1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      {
        cellStyle: { 'display': 'block' }, headerName: '流通库存', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '在库', field: 'pweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['pweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'display': 'block' }, headerName: '未产', headerClass: 'wis-ag-center',
            children: [
              {
                cellStyle: { 'text-align': 'right' }, headerName: '本月', field: 'currentweight', minWidth: 90, aggFunc: 'sum',
                valueGetter: (params) => {
                  if (params.data) {
                    return Number(params.data['currentweight']);
                  } else {
                    return '';
                  }
                }, valueFormatter: this.settings.valueFormatter3
              },
              {
                cellStyle: { 'text-align': 'right' }, headerName: '下月', field: 'nextweight', minWidth: 90, aggFunc: 'sum',
                valueGetter: (params) => {
                  if (params.data) {
                    return Number(params.data['nextweight']);
                  } else {
                    return '';
                  }
                }, valueFormatter: this.settings.valueFormatter3
              }
            ]
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '已付全款', field: 'payweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['payweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '流通小计', field: 'tpweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['tpweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '期货库存', headerClass: 'wis-ag-center',
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '在库', field: 'qweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['qweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'display': 'block' }, headerName: '未产', headerClass: 'wis-ag-center',
            children: [
              {
                cellStyle: { 'text-align': 'right' }, headerName: '本月', field: 'qcurrentweight', minWidth: 90, aggFunc: 'sum',
                valueGetter: (params) => {
                  if (params.data) {
                    return Number(params.data['qcurrentweight']);
                  } else {
                    return '';
                  }
                }, valueFormatter: this.settings.valueFormatter3
              },
              {
                cellStyle: { 'text-align': 'right' }, headerName: '下月', field: 'qnextweight', minWidth: 90, aggFunc: 'sum',
                valueGetter: (params) => {
                  if (params.data) {
                    return Number(params.data['qnextweight']);
                  } else {
                    return '';
                  }
                }, valueFormatter: this.settings.valueFormatter3
              }
            ]
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '已付全款', field: 'qpayweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['qpayweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'right' }, headerName: '期货小计', field: 'tqweight', minWidth: 90, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['tqweight']);
              } else {
                return '';
              }
            }, valueFormatter: this.settings.valueFormatter3
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '总库存', field: 'tweight', minWidth: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['tweight']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '60天以上库存', field: 'longweight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['longweight']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '占比', field: 'rate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否锁货', field: 'islock', minWidth: 80 }
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  querydata() {
    this.kucunapi.kucunday(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  query() {
    this.search = { orgid: '', gn: '', chandi: '' };
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      console.log('gns11', this.gns);
    });
    this.classicModal.show();
  }
  selectedgn(value) {
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    this.chandis = [];
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    console.log('c', value);
    this.search['chandiid'] = value;
  }
  close() {
    this.classicModal.hide();
  }
  queryd() {
    this.querydata();
    this.close();
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '库存日报表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  cloesd() {
    this.downModal.hide();
  }
  kucundayExport() {
    this.downModal.show();
  }
  download() {
    if (this.date) {
      // open('http://' + environment.server
      // + '-wiskind.oss-cn-shanghai.aliyuncs.com/kucunday/%E5%BA%93%E5%AD%98%E6%97%A5%E6%8A%A5'
      // + this.datepipe.transform(this.date, 'yyyy-MM-dd') + '.xls');
      this.kucunapi.downkucunday({ datestr: this.datepipe.transform(this.date, 'yyyy-MM-dd') }).then(data => {
        if (data.flag) {
          open(data['msg']);
        } else {
          this.toasterService.pop('error', data['msg']);
        }
      });
    } else {
      this.toasterService.pop('warning', '请填写文件时间！');
    }
    this.cloesd();
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
      this.search['chandi'] = this.chandioptions[0]['value'];
    }
  }
}
