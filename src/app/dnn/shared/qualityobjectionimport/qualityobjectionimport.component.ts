import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { ClassifyApiService } from '../../service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { QualityobjectionService } from 'app/routes/qualityobjection/qualityobjection.service';
import { identity } from 'lodash';
import { InnersaleapiService } from 'app/routes/innersale/innersaleapi.service';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { XsbuchaapiService } from 'app/routes/xiaoshou/xsbuchaapi.service';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { StorageService } from 'app/dnn/service/storage.service';


@Component({
  selector: 'app-qualityobjection',
  templateUrl: './qualityobjectionimport.component.html',
  styleUrls: ['./qualityobjectionimport.component.scss'],
  providers: [DatePipe,QualityobjectionService]
})

export class QualityobjectionimportComponent implements OnInit {
  qualityobjection: object = { typeid: '', miaoshu: ''};
  types = [];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  parent;
  innersale;//内采
  buchaModel;//机构结算补差
  xsbucha;//销售补差
  qualityModel;//现货
  qhqualityModel;//期货
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  current = this.storage.getObject('cuser');
  search: object = {
    start: '', end: '', billno: '', cuserid: '',  supplierid: '', kunbaohao: '', typeid: ''
  };
  constructor(public bsModalRef: BsModalRef,public settings: SettingsService, private qualityobjectionApi: QualityobjectionService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService, private innersaleApi: InnersaleapiService,
    private caigouApi : CaigouService, private xsbuchaApi: XsbuchaapiService,private orderApi: OrderapiService,private storage: StorageService) {
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
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100, checkboxSelection: true,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80},
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
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 80 }
    ];
    this.gettype();
  }
  ngOnInit() {
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
    if(this.innersale){
      this.search['status'] = '4#5#6#7';
    }
    if(this.buchaModel){
      this.search['status'] = '4#5#6#7';
    }
    if(this.xsbucha){
      this.search['status'] = '4#6';
    }
    if(this.qualityModel){
      this.search['status'] = '4#6';
    }
    if(this.qhqualityModel){
      this.search['status'] = '4#6';
    }
    this.search['orgid'] = this.current.orgid;
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
  confirm(){
    const detids = new Array();
    const zhiliangyiyis = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < zhiliangyiyis.length; i++) {
      if (zhiliangyiyis[i].selected && zhiliangyiyis[i].data) {
        console.log(zhiliangyiyis[i].data.billid);
        detids.push(zhiliangyiyis[i].data.billid);
      }
    }
    if (detids.length <= 0) {
      this.toast.pop('warning', '请选择要关联的质量异议');
      return '';
    }
    this.search['id'] = detids[0];
    console.log(detids[0]);
    //内部采购
    if(this.innersale){
      this.innersale['zhiliangyiyiid'] = detids[0];
      this.innersaleApi.updatezhiliangyiyi(this.innersale).then(data => {
        if (data) {
          this.bsModalRef.hide();
          this.parent.listDetail();
        }
      });
    }
    //结算补差
    if(this.buchaModel){
      this.buchaModel['zhiliangyiyiid'] = detids[0];
      this.caigouApi.updateJsbucha(this.buchaModel).then(data => {
        if (data) {
          this.bsModalRef.hide();
          this.parent.querydata();
        }
      });
    }
    //销售补差
    if(this.xsbucha){
      this.xsbucha['zhiliangyiyiid'] = detids[0];
      this.xsbuchaApi.updatezhiliangyiyi(this.xsbucha).then(data => {
        if (data) {
          this.bsModalRef.hide();
          this.parent.listDetail();
        }
      });
    }
    //现货
    if(this.qualityModel){
      this.qualityModel['zhiliangyiyiid'] = detids[0];
      this.orderApi.qualityUpdate(this.qualityModel).then(data => {
        if (data) {
          this.bsModalRef.hide();
          this.parent.listDetail();
        }
      });
    }
    //期货
    if(this.qhqualityModel){
      this.qhqualityModel['zhiliangyiyiid'] = detids[0];
      this.orderApi.qualityUpdate(this.qhqualityModel).then(data => {
        if (data) {
          this.bsModalRef.hide();
          this.parent.getqihuomodel();
        }
      });
    }
    
  }
}
