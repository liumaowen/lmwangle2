import { SelectComponent } from 'ng2-select';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerapiService } from './../../customer/customerapi.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-cginvoicedet',
  templateUrl: './cginvoicedet.component.html',
  styleUrls: ['./cginvoicedet.component.scss']
})
export class CginvoicedetComponent implements OnInit {

  @ViewChild('defaultGroup') public nselect: SelectComponent;
  @ViewChild('classicModal') classicModal: ModalDirective;
  @ViewChild('createModal') createModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  gridOptions: GridOptions;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start = new Date();
  // 结束时间
  end = new Date();
  // 开始时间最大时间
  istartmax: Date = new Date();
  // 结束时间最大时间
  iendmax: Date = new Date();
  // 开始时间
  istart: null;
  // 结束时间
  iend: null;
  // 开始时间最大时间
  vstartmax: Date = new Date();
  // 结束时间最大时间
  vendmax: Date = new Date();
  // 开始时间
  vstart: null;
  // 结束时间
  vend: null;
  search: object = {
    start: this.datepipe.transform(this.start, 'y-MM-dd'), end: this.datepipe.transform(this.end, 'y-MM-dd'),
     istart: '', iend: '', vstart: '', vend: '', billno: '',
    sorgid: '', cuserid: '', supplierid: '', invoiceno: ''
  };
  invoicedatemax: Date = new Date();
  invoicedate: Date = new Date();
  create: object = { invoiceno: '', count: '', invoicedate: '', supplierid: '', gn: '', beizhu: '', orgid: '' };
  gns = [];
  statuss;
  // 上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  excelStyles = [
    {
    //  必填 样式的ID，该id是唯一的字符串
      id: 'invoicenostr',
      dataType:'string'
    }];
  constructor(private caigouApi: CaigouService, public settings: SettingsService, private datepipe: DatePipe,
    private classifyapi: ClassifyApiService,private customerApi: CustomerapiService, private toast: ToasterService, private router: Router) {
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
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/cginvoice/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
          // return '<a target="_blank" href="#/cginvoice/' + params.data.id + '">' + params.data.billno + '</a>';
        }
        // , onCellClicked: (params) => {
        //   this.router.navigate(['cginvoice', params.data.id]);
        // }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票日期', field: 'invoicedate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '发票号码', field: 'invoiceno', minWidth: 120,cellClass: ['invoicenostr'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyer', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'billgn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单位', field: 'unit', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '含税单价', field: 'price', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '含税金额', field: 'jine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '不含税金额', field: 'bjine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['bjine']) {
            return Number(params.data['bjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '税额', field: 'tax', minWidth: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tax']) {
            return Number(params.data['tax']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '金额差异', field: 'tjinedif', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'sorgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'status', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '登记日期', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '生成凭证', field: 'ispingzheng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂负责人', field: 'gcleader', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据号', field: 'rukuno', minWidth: 100 }
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  querydata() {
    this.caigouApi.getcginvoice(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  query() {
    if (this.start !== null) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.istart !== null) {
      this.search['istart'] = this.datepipe.transform(this.istart, 'y-MM-dd');
    }
    if (this.iend !== null) {
      this.search['iend'] = this.datepipe.transform(this.iend, 'y-MM-dd');
    }
    if (this.vstart !== null) {
      this.search['vstart'] = this.datepipe.transform(this.vstart, 'y-MM-dd');
    }
    if (this.vend !== null) {
      this.search['vend'] = this.datepipe.transform(this.vend, 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.querydata();
    this.hideDialog();
  }
  selectestatus(value) {
    this.search['status'] = value.id;
  }
  showDialog() {
    this.search = {
      start: '', end: '', istart: '', iend: '', vstart: '', vend: '', billno: '',
      sorgid: '', cuserid: '', supplierid: '', invoiceno: '', status: ''
    };
    this.statuss = [{ id: '0', text: '开票中' }, { id: '1', text: '待审核' }, { id: '2', text: '已审核' }, { id: '3', text: '未审核' }];
    this.start = null;
    this.end = null;
    this.istart = null;
    this.iend = null;
    this.vstart = null;
    this.vend = null;
    this.findWiskind();
    this.classicModal.show();
    this.nselect.active = [];
  }
  hideDialog() {
    this.classicModal.hide();
  }
  selectstart() { }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '采购发票明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  open() {
    const gnlist = new Array();
    this.classifyapi.listBypid({ pid: 2 }).then(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const gn = { id: data[i]['id'] + '', text: data[i]['name'] };
        gnlist.push(gn);
      }
      this.gns = gnlist;
    });
    // this.gns = [{ id: '3', text: '彩涂' }, { id: '4', text: '镀锌' }, { id: '5', text: '镀铝锌' }, { id: '5870', text: '冷轧' },
    // { id: '5934', text: '热轧' }, { id: '6040', text: '压型钢板' }, { id: '6415', text: '铝镁锰' }, { id: '6307', text: '覆膜板' },
    // { id: '7132', text: '镀锌檩条' }, { id: '7918', text: '不锈钢' }, { id: '8615', text: '复合板' }, { id: '9160', text: '折弯件' },
    // { id: '8318', text: '锌铝镁' }];
    this.findWiskind();
    this.createModal.show();
  }
  close() {
    this.createModal.hide();
  }
  selectinvoicedate() { }
  createinvoice() {
    if (this.create['supplierid'] instanceof Object) {
      this.create['supplierid'] = this.create['supplierid'].code;
    } else {
      this.create['supplierid'] = null;
    }
    if (this.create['supplierid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    if (this.create['sorgid'] === '') {
      this.toast.pop('error', '请选择发票机构！', '');
      return;
    }
    if (this.invoicedate) {
      this.create['invoicedate'] = this.datepipe.transform(this.invoicedate, 'y-MM-dd');
    }
    if (this.create['invoiceno'] === '') {
      this.toast.pop('warning', '发票号码必填！');
      return '';
    }
    if (this.create['count'] === '') {
      this.toast.pop('warning', '发票数必填！');
      return '';
    }
    // if (this.create['gn'] === '') {
    //   this.toast.pop('warning', '请选择品名！');
    //   return '';
    // }
    console.log('create1', this.create);
    this.caigouApi.createcginvoice(this.create).then(data => {
      this.close();
      // this.toast.pop('success', '新建采购发票单成功！');
      this.router.navigate(['cginvoice', data.id]);
    });
  }
  selectegn(value) {
    this.create['gn'] = value.text;
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
            

  showHexiaoUploader() {
    this.uploaderModel.show();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.caigouApi.hexiaoinvoice(addData).then(data => {
        this.hideuploadDialog();
        this.querydata();
        this.toast.pop('success', '采购发票核销成功！\n\n'+data['msg']);
      });
    }
  }

  // 关闭上传弹窗
  hideuploadDialog() {
    this.uploaderModel.hide();
  }
}
