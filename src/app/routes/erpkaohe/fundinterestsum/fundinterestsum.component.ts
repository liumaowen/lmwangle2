import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ErpkaoheService } from './../erpkaohe.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-fundinterestsum',
  templateUrl: './fundinterestsum.component.html',
  styleUrls: ['./fundinterestsum.component.scss']
})
export class FundinterestsumComponent implements OnInit {
  start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  end: Date;
  maxDate = new Date();
  search: any = {start: this.datePipe.transform(this.start, 'y-MM-dd'), end: '',};
  buyer = [];
  orgs = [];
  saleman;
  gridOptions: GridOptions;
  @ViewChild('yanqidialog') private yanqidialog: ModalDirective;

  constructor(public settings: SettingsService, private erpkaoheapi: ErpkaoheService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private datePipe: DatePipe, private toast: ToasterService,) {
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
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 90,
        cellRenderer: (params) => {
          if (params.data && params.data.id) {
            return '<a target="_blank" href="#/erpkaohe/fundinterestsum/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '登记日期', field: 'cdate', width: 110 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '期货订单号码', field: 'qihuobillno', width: 110,
        cellRenderer: (params) => {
          if (params.data && params.data.orderid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.qihuobillno + '</a>';
          } else {
            return null;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', width: 90 },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '利息', field: 'jine', width: 80 ,
         valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实付利息', field: 'shifujine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['shifujine']) {
            return Number(params.data['shifujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', width: 100 }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.erpkaoheapi.fundinterestsumdet(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });

  }

  getOrgs() {
    this.orgApi.listAll(0).then((response) => {
      const orglists = [{ label: '全部', value: '' }];
      response.forEach(element => {
        orglists.push({
          label: element.name,
          value: element.id
        });
      });
      this.orgs = orglists;
    });
  }

  show() {
    this.getOrgs();
    this.selectNull();
    this.yanqidialog.show();
  }
  close() {
    this.yanqidialog.hide();
  }
  select() {
    if (this.start) {
      this.search.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.search.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.search.end = '';
      }
      if (typeof (this.buyer) === 'object') {
        this.search.buyerid = this.buyer['code'];
      } else {
        this.search.buyerid = '';
      }
      if (typeof (this.saleman) === 'object') {
        this.search.salemanid = this.saleman['code'];
      } else {
        this.search.salemanid = '';
      }
      this.listDetail();
      this.close();
    } else {
      this.toast.pop('warning', '开始时间必填！');
      return;
    }
  }
  selectNull() {
    this.buyer = undefined;
    this.saleman = undefined;
    this.search['start'] = undefined;
    this.search['end'] = undefined;
    this.search = { buyerid: '', salemanid: '', orgid: '', qihuobillno: '' };
  }
}
