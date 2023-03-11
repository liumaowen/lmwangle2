import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { BanksmsapiService } from 'app/routes/banksms/banksmsapi.service';
import * as moment from 'moment';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';

@Component({
  selector: 'app-banksms',
  templateUrl: './banksms.component.html',
  styleUrls: ['./banksms.component.scss']
})
export class BanksmsComponent implements OnInit {


  @ViewChild('classicModal') private classicModal: ModalDirective;

  @ViewChild('createModal') private createModal: ModalDirective;

  dealTypes = [{ label: '全部', value: '' }, { label: '收入', value: 1 }, { label: '支出', value: 2 }];

  endmax = new Date();

  start;

  end;

  dealDate;

  model = {};

  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  querys: object = { page: 1, count: 30 };

  dealtypes = { 1: '收入', 2: '支出' };
  gridOptions: GridOptions;
  constructor(private BankSmsApi: BanksmsapiService,
    private toast: ToasterService,
    public settings: SettingsService,
    private datePipe: DatePipe) {
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
        { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'dealtime', width: 150 },
        { cellStyle: { 'text-align': 'center' }, headerName: '银行', field: 'sendertag', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '尾号', field: 'tailnumber', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '来款/付款单位', field: 'dealer', width: 150 },
        { cellStyle: { 'text-align': 'center' }, headerName: '来款', field: 'laikuan', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '付款', field: 'fukuan', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '余额', field: 'yue', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: '', width: 130 },
        { cellStyle: { 'text-align': 'center' }, headerName: '经手人', field: 'crealname', width: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '用途说明', field: 'useremark', width: 100 }
      ];
    this.querydata();
  }

  ngOnInit() {
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['page'] = event.page;
    this.querys['count'] = event.itemsPerPage;
    this.querydata();
  }

  // 查询时序表数据
  querydata() {
    this.BankSmsApi.query(this.querys).then(data => {
      console.log(data);
      const banksms = data.json();
      this.gridOptions.api.setRowData(banksms.list);
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = banksms.data;
    });
  }

  openQueryDialog() {
    this.showclassicModal();
  }

  query() {
    if (this.start) {
      this.querys['cdateS'] = this.datePipe.transform(this.start, 'y-MM-dd');
    } else {
      this.querys['cdateS'] = '';
    }
    if (this.end) {
      this.querys['cdateE'] = this.datePipe.transform(this.end, 'y-MM-dd');
    } else {
      this.querys['cdateE'] = '';
    }
    this.querys['page'] = 1;
    this.querydata();
    this.hideclassicModal();
  }

  selectNull() {
    this.start = undefined;
    this.end = undefined;
    this.querys = { page: 1, count: 30 };
  }

  add() {
    if (this.dealDate) {
      this.model['dealDate'] = this.datePipe.transform(this.dealDate, 'y-MM-dd');
    } else {
      this.model['dealDate'] = '';
      this.toast.pop('warning', '请选择交易日期');
      return;
    }
    if (!this.model['dealHour'] || !this.model['dealMinute']) {
      this.toast.pop('warning', '请填写交易时间');
      return;
    }
    if (!/^([0-1]?\d|2[0-3])$/.test(this.model['dealHour'])) {
      this.toast.pop('warning', '交易时间小时填写不正确，请重新填写！');
      return;
    }
    if (!/^[0-5]?\d$/.test(this.model['dealMinute'])) {
      this.toast.pop('warning', '交易时间分钟填写不正确，请重新填写！');
      return;
    }
    if (!this.model['sender']) {
      this.toast.pop('warning', '请填写银行电话');
      return;
    }
    if (!/^\d{5,}$/.test(this.model['sender'])) {
      this.toast.pop('warning', '银行电话填写不正确，请重新填写！');
      return;
    }
    if (!this.model['tailnumber']) {
      this.toast.pop('warning', '请填写账户号码后4位');
      return;
    }
    if (!/^\d{4}$/.test(this.model['tailnumber'])) {
      this.toast.pop('warning', '账户号码后4位填写不正确，请重新填写！');
      return;
    }
    if (!this.model['amount']) {
      this.toast.pop('warning', '请填写交易金额');
      return;
    }
    if (!/^-?(0|[1-9]\d*)(.\d{1,2})?$/.test(this.model['amount'])) {
      this.toast.pop('warning', '交易金额填写不正确，请重新填写！');
      return;
    }
    if (this.model['yue']) {
      if (!/^(0|[1-9]\d*)(.\d{1,2})?$/.test(this.model['yue'])) {
        this.toast.pop('warning', '账户余额填写不正确，请重新填写！');
        return;
      }
    }
    if (!this.model['dealer']) {
      this.toast.pop('warning', '请填写交易账户');
      return;
    }
    if (!/^.{2,}$/.test(this.model['dealer'])) {
      this.toast.pop('warning', '交易账户填写不正确，请重新填写！');
      return;
    }
    if (this.model['amount'] === 0) {
      this.toast.pop('warning', '金额不能为零！');
      return;
    }

    const models = Object.assign({}, this.model);
    const dealDate = models['dealDate'];
    const dealHour = models['dealHour'];
    const dealMinute = models['dealMinute'];
    const shoukuan = models['shoukuan'];
    delete models['dealDate'];
    delete models['dealHour'];
    delete models['dealMinute'];
    delete models['shoukuan'];
    console.log('models', models);
    console.log('this.model', this.model);
    models['dealtype'] = models['amount'] > 0 ? 1 : 2;

    let params;
    if (shoukuan) {
      if (models['amount'] < 0) {
        this.toast.pop('warning', '自动收款时金额不能为负！');
        return;
      }
      params = {
        shoukuan: 1
      };
    }

    const dealTime = dealDate + ' ' + dealHour + ':' + dealMinute;

    models['dealtime'] = moment(dealTime).valueOf();

    this.BankSmsApi.save(params, models).then(data => {
      this.querys['page'] = 1;
      this.querydata();
      this.toast.pop('success', '操作成功！');
      this.hidecreateModal();
    });

  }

  resetModel() {
    this.dealDate = undefined;
    this.model = {};
  }

  openAddDialog() {
    this.showcreateModal();
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }
  agridExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '银行收支记录明细.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

}
