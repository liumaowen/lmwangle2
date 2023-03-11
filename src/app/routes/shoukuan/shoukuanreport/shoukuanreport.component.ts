import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ReportService } from './../../report/report.service';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-shoukuanreport',
  templateUrl: './shoukuanreport.component.html',
  styleUrls: ['./shoukuanreport.component.scss']
})
export class ShoukuanreportComponent implements OnInit {

  start = new Date();

  maxDate = new Date();

  end: Date;

  requestparams = { start: this.datepipe.transform(this.start, 'y-MM-dd'), end: '', buyerid: '', sellerid: '', orgid: '', id: '', cuserid: '', vuserid: '' };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private datepipe: DatePipe, private reportApi: ReportService, private orgApi: OrgApiService, private customerApi: CustomerapiService, private toast: ToasterService) {

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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true , valueGetter: (params) => '合计'},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/receive/' + params.data.billid + '">' + params.data.billno + '</a>';
          }else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'shoukuanstatus', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款时间', field: 'actualdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员机构', field: 'salemanorgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'paycustomer', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款银行', field: 'shoukuanbankname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '线上/线下', field: 'paycustomerisonline', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款公司', field: 'receivecustomer', width: 160 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款账号', field: 'shoukuanaccount', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款类型', field: 'shoukuantype', width: 90 },
      /*
      {cellStyle: {"text-align": "center"}, headerName: '创建时间', field: 'cdate', width: 100},*/
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', width: 80 },
      /*{cellStyle: {"text-align": "center"}, headerName: '代理人', field: 'ausername', width: 80},*/
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 90 }
    ];


  }

  ngOnInit() {
  }

  listDetail() {
    console.log(this.requestparams);
    this.reportApi.shoukuan(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
    });
  };


  orgs = [];

  sellersResult = [];

  items = [{ value: '', label: '全部' }, { value: 1, label: '线上' }, { value: 0, label: '线下' }]
  openQueryDialog() {
    this.orgApi.listAll(0).then((response) => {
      let orglist = [{ value: '', label: '全部' }];
      response.forEach(element => {
        orglist.push({
          label: element.name,
          value: element.id
        })
      });
      this.orgs = orglist;
    });
    this.customerApi.findwiskind().then((response) => {
      let selllist = [{ value: '', label: '全部' }];
      response.forEach(element => {
        selllist.push({
          label: element.name,
          value: element.id
        })
      });
      this.sellersResult = selllist;
    });
    this.showclassicModal();
  }
  companys;

  cuser;

  vuser;

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = { start: this.datepipe.transform(this.start, 'y-MM-dd'), end: '', buyerid: '', sellerid: '', orgid: '', id: '', cuserid: '', vuserid: '' };
    this.companys = undefined;
    this.cuser = undefined;
    this.vuser = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams.start = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.requestparams.end = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (typeof (this.cuser) === 'object') { // 制单人
      this.requestparams['cuserid'] = this.cuser['code'];
    }
    if (typeof (this.vuser) === 'object') { // 审核人
      this.requestparams['vuserid'] = this.vuser['code'];
    }
    if (typeof (this.companys) === 'object') {//买方单位选中的数据
      this.requestparams.buyerid = this.companys['code'];
    }
    if (!this.requestparams.start) {
      // Notify.alert("开始时间必填！", 'warning');
      this.toast.pop('warnig', '开始时间必填！');
    } else {
      this.listDetail();
      this.hideclassicModal();
    }

  };

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '收款明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }


}
