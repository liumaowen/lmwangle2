import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService } from 'ngx-bootstrap';
import { SettingsService } from 'app/core/settings/settings.service';
import { ToasterService } from 'angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';

import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';
import { MatchcarService } from '../matchcar.service';

@Component({
  selector: 'app-matchcar',
  templateUrl: './matchcarwuliu.component.html',
  styleUrls: ['./matchcarwuliu.component.scss']
})
export class MatchcarwuliuComponent implements OnInit {
  ckitems: any;
  items: any;
  auser: any;
  feecustomer: any;
  requestparams: any = { startdate: '', enddate: ''};
  @ViewChild('searchdialog') private searchdialog: ModalDirective;
  gridOptions: GridOptions;
  startdate: any;
  enddate: any;
  typeyun: any;
  status = [{ label: '全部', value: '' }, { label: '汽运', value: '汽运' }, { label: '船运', value: '船运' }, { label: '铁运', value: '铁运' }];
  constructor(public settings: SettingsService, private toast: ToasterService, private userapi: UserapiService,
    private modalService: BsModalService, private matchcarApi: MatchcarService, private router: Router, private datepipe: DatePipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提单编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/tihuo/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'sellername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'typeyun', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cusername', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人员', field: 'ausername', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户单位', field: 'buyername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物流名称', field: 'feecustomername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货地址', field: 'tihuoaddr', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卸货地址', field: 'destination', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际吨位', field: 'tweight', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际单价', field: 'innerprice', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际总金额', field: 'innerjine', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '系统单价', field: 'price', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '系统总金额', field: 'jine', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '金额税差', field: 'taxjine', minWidth: 90 },
    ];
  }
  ngOnInit() {
    this.listdetail();
  }

  //查询
  showsearchdialog() {
     this.items = [{ value: '', label: '全部' }];
      this.userapi.searchjigou(0).then(data => {
        data.forEach(element => {
          this.items.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    this.ckitems = [{ value: '', label: '全部' }];
    this.userapi.cangkulist().then(data => {
      data.forEach(element => {
        this.ckitems.push(
          {
            value: element['id'],
            label: element['name']
          }
        );
      });
    });
    this.searchdialog.show();
  }
  hidesearchdialog() {
    this.searchdialog.hide();
  }
  listdetail() {
    if (this.auser) {
      this.requestparams['auserid'] = '';
      this.requestparams['auserid'] = this.auser['code'];
    }
    if(this.feecustomer){
      this.requestparams['feecustomerid'] = '';
      this.requestparams['feecustomerid'] = this.feecustomer['code'];
    }
    if (this.enddate) {
      this.requestparams.enddate = this.datepipe.transform(this.enddate, 'y-MM-dd');
    }
    if (this.startdate) {
      this.requestparams.startdate = this.datepipe.transform(this.startdate, 'y-MM-dd');
    }
    console.log(this.requestparams);
    this.matchcarApi.matchcarwuliu(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
      this.hidesearchdialog();
    });
  }
}
