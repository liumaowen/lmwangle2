import { ReportService } from '../../../routes/report/report.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { OrgApiService } from '../../service/orgapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-customerchaoqiimport',
  templateUrl: './customerchaoqiimport.component.html',
  styleUrls: ['./customerchaoqiimport.component.scss']
})
export class CustomerchaoqiimportComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('jixiaoShareModal') private jixiaoShareModal: ModalDirective;
  gridOptions: GridOptions; 


  parent;
  
  requestparams = {};

  saleuser;

  start;

  end;

  endmax = new Date();

  constructor(public settings: SettingsService,
    public bsModalRef: BsModalRef,
    private datePipe: DatePipe,
    private reportApi: ReportService,
    private toast: ToasterService,
    private orgApi: OrgApiService) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      localeText: this.settings.LOCALETEXT,
    };

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '名称', field: 'NAME', width: 250 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否线上', field: 'isonline', width: 150,
        cellRenderer: (params) => {
          return params.data.isonline ? '是' : '否';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '未购买天数', field: 'daydiff2', width: 150 },
    ];
  }

  ngOnInit() {
  }

  openQueryDialog() {
    this.selectNull();
    this.showclassicModal();

  }

  // 清空
  selectNull() {
    this.requestparams = {};
    this.saleuser = undefined;
    this.start = undefined;
    this.end = undefined;
  }

  // 查询
  query() {
    if (this.start) {
      this.requestparams['start'] = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    }
    if (this.end) {
      this.requestparams['end'] = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }
    if (typeof (this.saleuser) === 'object') {
      this.requestparams['salemanid'] = this.saleuser['code'];
    } else {
      this.requestparams['salemanid'] = '';
    }
    this.requestparams['ismycustomer'] = true;
    this.reportApi.customerlist(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response);
      // ngDialog.close();
      this.hideclassicModal();
    });
  }

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '客户信息.csv',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  submitShow(){
    const customerList = this.gridOptions.api.getModel()['rowsToDisplay'];
    if(customerList.length<1){
      this.toast.pop('warning', '请选择客户！');
      return;
    }
    this.jixiaoShareModal.show();
  }
  closeJixiaoShare(){
    this.jixiaoShareModal.hide();
  }
  confirm(){
    const customerList = this.gridOptions.api.getModel()['rowsToDisplay'];
    const data = new Array();
    if(this.requestparams['isshare'] === null || this.requestparams['isshare'] === undefined){
      this.toast.pop('warning', '请选择是否绩效共享！');
      return;
    }
    for (let i = 0; i < customerList.length; i++) {
      data.push(customerList[i].data);
    }
    this.requestparams['data'] = data;
    this.reportApi.submitChange(this.requestparams).then((response) => {
      this.closeJixiaoShare();
    });
  }

}
