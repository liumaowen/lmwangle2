import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { QualityobjectionService } from '../qualityobjection.service';

@Component({
  selector: 'app-qualityobjection',
  templateUrl: './qualityobjection.component.html',
  styleUrls: ['./qualityobjection.component.scss'],
  providers: [DatePipe]
})

export class QualityobjectionComponent implements OnInit {
  qualityobjection: object = { typeid: '', miaoshu: ''};
  types = [];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  search: object = {
    start: '', end: '', billno: '', cuserid: '',  supplierid: '', kunbaohao: '', typeid: ''
  };
  constructor(public settings: SettingsService, private qualityobjectionApi: QualityobjectionService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService) {
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
          if (params && params.data && null != params.data.billid) {
            return '<a target="_blank" href="#/qualityobjection/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '提单号', field: 'tihuobillno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.tihuobillid) {
            return '<a target="_blank" href="#/tihuo/' + params.data.tihuobillid + '">' + params.data.tihuobillno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'buyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'suppliername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '异议类型', field: 'typename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '异议描述', field: 'miaoshu', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户要求', field: 'cusdemand', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '邮寄样板快递单号', field: 'expressnumber', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
        valueFormatter: this.settings.valueFormatter },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源中心赔付金额', field: 'rsjine', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源中心赔付单号', field: 'rsbillno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售赔付金额', field: 'salejine', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售赔付单号', field: 'salebillno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提报类型', field: 'subtype', minWidth: 80 },
    ];
    this.gettype();
  }
  ngOnInit() {
    this.query();
  }
  // 新建采购单
  showcreate() {
    this.createNull();
    this.createModal.show();
  }
  closeq() {
    this.createModal.hide();
  }
  createNull() {
    this.qualityobjection = { typeid: '', miaoshu: ''};
  }
  create() {
    // if (this.qualityobjection['supplierid'] instanceof Object) {
    //   this.qualityobjection['supplierid'] = this.qualityobjection['supplierid'].code;
    // } else {
    //   this.qualityobjection['supplierid'] = null;
    // }
    // if (this.qualityobjection['supplierid'] === null) {
    //   this.toast.pop('error', '请填写供应商！');
    //   return;
    // }
    if (!this.qualityobjection['typeid']) {
      this.toast.pop('error', '请选择异议类型！');
      return;
    }
    // if (!this.qualityobjection['miaoshu']) {
    //   this.toast.pop('error', '请填写异议描述！');
    //   return;
    // }
    // if (!this.qualityobjection['cusdemand']) {
    //   this.toast.pop('error', '请填写客户要求！');
    //   return;
    // }
    this.qualityobjectionApi.create(this.qualityobjection).then(data => {
      this.router.navigate(['qualityobjection', data.id]);
    });
  }
  selectNull() {
    this.search = {
      start: '', end: '', billno: '', cuserid: '',  supplierid: '', kunbaohao: '', typeid: ''
    };
    this.start = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1);
    this.end = new Date();
  }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.qualityobjectionApi.getqualitydet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }
  // 打开查询对话框
  openquery() {
    this.selectNull();
    this.classicModal.show();
  }
  close() {
    this.classicModal.hide();
  }
  /**获取异议类型 */
  gettype() {
    this.types = [];
    this.classifyApi.listclassify('qualityobjection_type').then(data => {
      data.forEach(element => {
        this.types.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }
  subtypes = [
    { label: '提单质量异议', value: 1 },
    { label: '库存质量异议', value: 2 }
  ];
}
