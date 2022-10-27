import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-cgwanglai',
  templateUrl: './cgwanglai.component.html',
  styleUrls: ['./cgwanglai.component.scss']
})
export class CgwanglaiComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  gridOptions: GridOptions;

  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date('2017-01-01');
  // 结束时间
  current = this.storage.getObject('cuser');
  end: null;
  search: object = { start: '', end: '', orgid: '', supplierid: '' };
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private datepipe: DatePipe,
    private toast: ToasterService, private customerApi: CustomerapiService, private route: ActivatedRoute,private storage: StorageService) {
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
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (!params.data) { return null; }
          if (params.data.billno) {
            let billType = params.data.billtype;
            if ('付款登记单' === billType) {
              billType = 'cgfukuan';
            } else if ('入库通知单' === billType) {
              billType = 'ruku';
            } else if ('补差通知单' === billType) {
              billType = 'cgbucha';
            } else if ('退货通知单' === billType) {
              billType = 'cgtuihuo';
            }
            return '<a target="_blank" href="#/' + billType + '/' + params.data.billid + '">' + params.data.billno + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库类别', field: 'zhaiyao', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 180 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '应付金额', field: 'yingfue', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实付金额', field: 'shifue', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预付余额', field: 'yufuyue', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'suppliername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'wiskername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号', field: 'invoiceno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核状态', field: 'status', minWidth: 80 }
    ];
  }

  ngOnInit() {
    if (this.route['params']) {
      const id = this.route['params']['value']['id'];
      this.search['supplierid'] = id.split('abc')[0];
      this.search['buyerid'] = id.split('abc')[1];
      this.search['start'] = '2017-01-01';
      console.log(this.search);
      this.querydata();

    }
  }
  querydata() {
    console.log(this.search);
    this.caigouApi.getwanglai(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  showDialog() {
    this.start = new Date('2017-01-01');
    this.end = null;
    this.search = { start: '', end: '', orgid: '', supplierid: '' };
    this.findWiskind();
    this.classicModal.show();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  selectstart() { }
  query() {
    this.search['orgid']=this.current.orgid;
    this.search['salemanid']=this.current.id;
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    if (this.search['supplierid'] === '') {
      this.toast.pop('warning', '请选择供应商！');
      return '';
    }
    this.querydata();
    this.hideDialog();
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '采购往来明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
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
