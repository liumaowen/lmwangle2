import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from '../../customer/customerapi.service';

@Component({
  selector: 'app-customerbehavior',
  templateUrl: './customerbehavior.component.html',
  styleUrls: ['./customerbehavior.component.scss']
})
export class CustomerbehaviorComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  gridOptions: GridOptions;
  query = { buyerid: '', orgid: '',salemanid: '',onlinestart: '',onlineend: '',ordercdatestart: '',ordercdateend: '' };
  companys = {};
  qcompanys = {};
  endmax = new Date();
  saleuser;
  constructor(public settings: SettingsService, private datePipe: DatePipe,
    private customerApi: CustomerapiService,) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'customername', width: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户类型', field :'usernature', width: 130},
      { cellStyle: { 'text-align': 'center' }, headerName: '业务负责人', field: 'salename', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '上线时间', field: 'customercdate', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计购买数量', field: 'tweight', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '累计访问量', field: 'browsecount', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '最后成交时间', field: 'orderlastcdate', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '常用钢厂1', field: 'chandi1', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '常用钢厂2', field: 'chandi2', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '常用钢厂3', field: 'chandi3', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '用户等级', field: 'grade', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否停用', field: 'customerisdel', width: 90 }
    ];
  }

  ngOnInit() {
  }
  openQueryDialog() {
    this.selectNull();
    this.showclassicModal();
  }
  closeQueryDialog() {
    this.selectNull();
    this.hideclassicModal();
  }
  showclassicModal() {
    this.classicModal.show();
  }
  hideclassicModal() {
    this.classicModal.hide();
  }
  
  selectNull() {
    this.saleuser = {};
    this.qcompanys = {};
    this.query = { buyerid: '', orgid: '', salemanid: '', onlinestart: '', onlineend: '', ordercdatestart: '', ordercdateend: '' };
  };
  querys() {
    if (this.query['onlinestart']) {
      this.query['onlinestart'] = this.datePipe.transform(this.query['onlinestart'], 'yyyy-MM-dd');
    }
    if (this.query['onlineend']) {
      this.query['onlineend'] = this.datePipe.transform(this.query['onlineend'], 'yyyy-MM-dd');
    }
    if (this.query['ordercdatestart']) {
      this.query['ordercdatestart'] = this.datePipe.transform(this.query['ordercdatestart'], 'yyyy-MM-dd');
    }
    if (this.query['ordercdateend']) {
      this.query['ordercdateend'] = this.datePipe.transform(this.query['ordercdateend'], 'yyyy-MM-dd');
    }
    if (typeof (this.qcompanys) === 'string' || !this.qcompanys) {
      this.query['buyerid'] = '';
    } else if (typeof (this.qcompanys) === 'object' && this.qcompanys['code']) {
      this.query.buyerid = this.qcompanys['code'];
    }
    if (typeof (this.saleuser) === 'object' && this.saleuser['code']) {
      this.query['salemanid'] = this.saleuser['code'];
    } else {
      this.query['salemanid'] = '';
    }
    this.customerApi.customerbehavior(this.query).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  search() {
    this.querys();
    this.hideclassicModal();
  }
  closeq() {
    this.addModal.hide();
  }
}
