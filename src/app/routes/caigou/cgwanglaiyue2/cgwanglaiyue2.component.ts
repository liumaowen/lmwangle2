import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-cgwanglaiyue2',
  templateUrl: './cgwanglaiyue2.component.html',
  styleUrls: ['./cgwanglaiyue2.component.scss']
})
export class Cgwanglaiyue2Component implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  gridOptions: GridOptions;
  // 结束时间最大时间
  endmax: Date = new Date();
  // 结束时间
  end: null;
  search: object = { moneyRange: '', end: '', orgid: '', supplierid: '' };
  ranges: any;
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private datepipe: DatePipe,
    private toast: ToasterService, private customerApi: CustomerapiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商编号', field: 'supplierid', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'suppliername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'wcustomername', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '付款金额', field: 'fukuanjine', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '发票金额', field: 'caigoujine', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '账户余额', field: 'yue', minWidth: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/cgwanglai2/' + params.data.supplierid + 'abc' + params.data.wcustomerid + '">'
            + params.data.yue + '</a>';
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 90 }
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  querydata() {
    this.caigouApi.getwanglaiyue2(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  showDialog() {
    this.search = { moneyRange: '', end: '', orgid: '', supplierid: '' };
    this.end = null;
    this.ranges = [{ id: '0', text: '不等于零' }, { id: '1', text: '大于零' }, { id: '2', text: '等于零' }, { id: '3', text: '大于零' }];
    this.findWiskind();
    this.classicModal.show();
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '财务往来余额表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  hideDialog() {
    this.classicModal.hide();
  }
  selectstart() { }
  query() {
    if (this.end !== null) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.querydata();
    this.hideDialog();
  }
  selecterange(value) {
    this.search['moneyRange'] = value.id;
  }

  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' })
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          })
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      })
    }
  }

}
