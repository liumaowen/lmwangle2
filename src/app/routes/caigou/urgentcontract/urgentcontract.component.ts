import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';

@Component({
  selector: 'app-urgentcontract',
  templateUrl: './urgentcontract.component.html',
  styleUrls: ['./urgentcontract.component.scss']
})
export class UrgentcontractComponent implements OnInit {

  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  orgs: any[];
  saleman: any;
  buyer = {};
  seller = {};
  gns: any[];
  chandis: any[];

  constructor(public settings: SettingsService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private classifyapi: ClassifyApiService) {
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
      // rowSelection: 'multiple',
      getContextMenuItems: this.settings.getContextMenuItems,
      
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , width: 60, valueGetter: (params) => '合计'},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合同号', field: 'billno', width: 120,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/qihuo/' + params.data.qihuoid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方', field: 'buyer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'month', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 250 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量（吨）', field: 'caigouweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '内部交期', field: 'jiaohuoqixian', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '通知采购日期', field: 'noticecaigoudate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '首次入库日期', field: 'firstrukudate', width: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '累计入库量', field: 'yirukuweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['yirukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '首次提货日期', field: 'tihuodate', width: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提货重量', field: 'sumshitiweight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['sumshitiweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      }
    ];
  }

  ngOnInit() {
  }
  listDetail() {
    // 从服务器获取数据赋值给网格
    console.log(this.search);
    this.caigouApi.listurgentcontract(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  showgcinfodialog() {
    this.search = {};
    this.getGnAndChandi();
    this.orgs = [{ label: '全部', value: '' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    })
    this.gcinfodialog.show();
  }



  closegcinfodialog() {
    this.gcinfodialog.hide();
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }

   //钢厂进货管制查询
   getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gns = [];
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  selectedgn(value) {
    this.chandis = [];
    console.log(value);
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }

  selectNull() {
    this.seller = {};
    this.buyer = {};
    this.saleman = null;
    this.search = { month: '', orgid: '', salemanid: '', buyerid: '', sellerid: '' };
  };

  searchurgentcontract() {
    if (this.saleman) {
      this.search['salemanid'] = this.saleman['code'];
    }
    if (typeof (this.buyer) === 'string' || !this.buyer) {
      this.search['buyerid'] = '';
    } else if (typeof (this.buyer) === 'object' && this.buyer['code']) {
      this.search.buyerid = this.buyer['code'];
    }
    if (typeof (this.seller) === 'string' || !this.seller) {
      this.search['sellerid'] = '';
    } else if (typeof (this.seller) === 'object' && this.seller['code']) {
      this.search.sellerid = this.seller['code'];
    }
    this.listDetail();
    this.closegcinfodialog();
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
