import { Component, OnInit, ViewChild } from '@angular/core';
import { FeeapiService } from '../feeapi.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { Editor } from 'primeng/primeng';

@Component({
  selector: 'app-maycurloan',
  templateUrl: './maycurloan.component.html',
  styleUrls: ['./maycurloan.component.scss']
})
export class MaycurloanComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  @ViewChild('refreshmaycurModel') private refreshmaycurModel: ModalDirective;
  @ViewChild('hkdialog') private hkdialog: ModalDirective;
  gridOptions: GridOptions;

  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start = new Date();
  //是否还款
  isrepayment: Boolean = null;
  // 结束时间
  end: null;
  //还款时间
  hdate = new Date();
  search: object = { start: '', end: '', isrepayment: '' };
  maycurloan = {};
  requestparams = {
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: ''
  };
  constructor(private feeApi: FeeapiService, public settings: SettingsService, private userapi: UserapiService, private datePipe: DatePipe,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列

    this.gridOptions.columnDefs = [
      { cellStyle: { "text-align": "left" }, headerName: '选择', minWidth: 100, checkboxSelection: true, suppressMenu: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'formcode', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'paydate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '公司', field: 'companyname', minWidth: 220 },
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'orgname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '类型', field: 'type', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '摘要', field: 'comment', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '往来单位', field: 'contactname', minWidth: 100 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 100 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '核销金额', field: 'hjine', minWidth: 100 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '未核销金额', field: 'whjine', minWidth: 100 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'paybankname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '经手人', field: 'username', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vuser', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款人/公司', field: 'customername', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '到期日', field: 'expectrepaydate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '还款日', field: 'hdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '超期天数', field: 'overduedays', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否生成凭证', field: 'iskhpz', minWidth: 100 },
    ];
  }
  ngOnInit() {
  }
  querydata() {
    this.feeApi.findloan(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  //同步对话框
  openRefreshDialog() {
    this.start = null;
    this.end = null;
    this.search = { start: '', end: '' };
    this.refreshmaycurModel.show();
  }
  hiderefreshmaycurModel() {
    this.refreshmaycurModel.hide();
  }
  ckitems;
  //查询对话框
  openQueryDialog() {
    this.start = null;
    this.end = null;
    this.isrepayment = null;
    this.search = { start: '', end: '', isrepayment: '' };
    this.classicModal.show();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  //查询
  query() {
    if (this.start) {
      this.search['start'] = this.datePipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null) {
      this.search['end'] = this.datePipe.transform(this.end, 'y-MM-dd');
    }
    if (this.isrepayment != null) {
      this.search['isrepayment'] = this.isrepayment;
    } else {
      this.search['isrepayment'] = '';
    }
    this.querydata();
    this.hideDialog();
  }


  /**同步 */
  refreshmaycur() {
    this.feeApi.create(this.search).then(data => {
      if (data) {
        this.requestparams.start = this.search['start'];
        this.requestparams.end = this.search['end'];
        this.querydata();
        this.toast.pop('success', '同步成功！');
      }
    });
    this.hiderefreshmaycurModel();
  }

  queryrefresh() {
    if (this.start) {
      this.search['start'] = this.datePipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end) {
      this.search['end'] = this.datePipe.transform(this.end, 'y-MM-dd');
    }
    this.refreshmaycur();
  }

  //还款日期对话框
  openhkDialog() {
    let ids = new Array();
    let maycurloanlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < maycurloanlist.length; i++) {
      if (maycurloanlist[i].selected && maycurloanlist[i].data) {
        ids.push(maycurloanlist[i].data.id);
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要还款的借款单！！！');
      return;
    }
    this.maycurloan['ids'] = ids;
    this.hkdialog.show();
  }
  close() {
    this.hkdialog.hide();
  }
  submit() {
    if (this.hdate) {
      this.maycurloan['hdate'] = this.datePipe.transform(this.hdate, 'y-MM-dd');
    }
    this.feeApi.huankuan(this.maycurloan).then(data => {
      this.toast.pop('success', '还款成功！');
      this.close();
      this.querydata();
    });
  }

}
