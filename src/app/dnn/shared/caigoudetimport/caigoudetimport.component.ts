import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../../../routes/caigou/caigou.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-caigoudetimport',
  templateUrl: './caigoudetimport.component.html',
  styleUrls: ['./caigoudetimport.component.scss']
})
export class CaigoudetimportComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('jiesuantypeModal') private jiesuantypeModal: ModalDirective;
  parentthis;
  saledet: object = { caigouid: null, detids: [] };
  msg;
  tweight = '0';
  search: Object = {
    classifys: {}, orgid: '', billno: '', buyerid: '', start: '', end: '', cuserid: '', gn: ''
  };
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  // 结束时间
  end: Date = new Date();
  // 表格设置
  gns: any[];
  // 产地
  chandis: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  // 规格
  attrs: any;
  jstype: object = {};
  gridOptions: GridOptions;


  constructor(public bsModalRef: BsModalRef, public settings: SettingsService,
    private toast: ToasterService, private caigouApi: CaigouService,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
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
      onRowSelected: event2 => {
        if (event2.node['selected']) {
          this.tweight = this.tweight['add'](event2.node.data.weight);
          this.msg = '--已选择' + this.tweight + '吨';
        } else {
          this.tweight = Number(this.tweight)['sub'](event2.node.data.weight);
          this.msg = '--已选择' + this.tweight + '吨';
        }
      }
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'id', minWidth: 50, checkboxSelection: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户', field: 'kehuname', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', minWidth: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已采购量', field: 'yicaigouweight', minWidth: 100,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已入库量', field: 'yirukuweight', minWidth: 100,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '底漆', field: 'beiqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'xiubian', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度公差', field: 'houdugongcha', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '表面处理', field: 'ppro', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度公差', field: 'widthgongcha', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '数量公差', field: 'weightgongcha', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交货仓库', field: 'jhcangku', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单备注', field: 'beizhu', minWidth: 100 }
    ];

  }

  ngOnInit() {
    //this.query();
    setTimeout(() => {
      console.log(this.parentthis.cgbsModalRef);
    }, 2000);
  }
 
  // import() {
  //   this.saledet['detids'] = [];
  //   this.gridOptions.api.getModel().forEachNode(element => {
  //     if (element.isSelected()) {
  //       this.saledet['detids'].push(element.data.id);
  //     }
  //   });
  //   if (this.saledet['detids'].length === 0) {
  //     this.toast.pop('error', '请选择相关明细！', '');
  //     return;
  //   }
  //   if (this.parentthis.isrukuapply) {
  //     this.saledet['id'] = this.parentthis.rukuapply.id;
  //     this.caigouApi.importdetrukuapply(this.saledet).then(data => {
  //       this.parentthis.getrukuapply();
  //     });
  //   } else if (this.parentthis['tasklist'] && this.parentthis['tasklist']['producemode'] === 3) {
  //     // 引入销售的成品明细来匹配成品
  //     this.saledet['tasklistid'] = this.parentthis['tasklist']['id'];
  //     this.caigouApi.importfpdet(this.saledet).then(data => {
  //       this.parentthis.getdetail();
  //     });
  //   } else {
  //     this.saledet['caigouid'] = this.parentthis.caigou.id;
  //     this.caigouApi.importdet(this.saledet).then(data => {
  //       this.parentthis.getcaigou();
  //     });
  //   }
  //   this.bsModalRef.hide();
  // }
  import() {
    this.saledet['detids'] = [];
    this.gridOptions.api.getModel().forEachNode(element => {
      if (element.isSelected()) {
        this.saledet['detids'].push(element.data.id);
      }
    });
    if (this.saledet['detids'].length === 0) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    if (this.parentthis.isrukuapply) {
      this.saledet['id'] = this.parentthis.rukuapply.id;
      this.caigouApi.importdetrukuapply(this.saledet).then(data => {
        this.parentthis.getrukuapply();
      });
      this.bsModalRef.hide();
    } else if (this.parentthis['tasklist'] && this.parentthis['tasklist']['producemode'] === 3) {
      // 引入销售的成品明细来匹配成品
      this.saledet['tasklistid'] = this.parentthis['tasklist']['id'];
      this.caigouApi.importfpdet(this.saledet).then(data => {
        this.parentthis.getdetail();
      });
      this.bsModalRef.hide();
    } else {
      this.saledet['caigouid'] = this.parentthis.caigou.id;
      this.jstypeShow();
    }
  }
  openquery() {
    this.selectNull();
    this.showGuige = false;
    this.isChandi = false;
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.classicModal.show();
  }
  close() {
    this.classicModal.hide();
  }
  selectstart() { }
  selectend() { }
  selectNull() {
    this.search = { classifys: {}, orgid: '', billno: '', buyerid: '', start: '', end: '', cuserid: '', gn: '' };
    this.jstype = {};
    this.start = new Date();
    this.end = new Date();
    this.chandis = [];
  }
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    if (this.chandis.length > 0) {
      this.chandis = [];
    }
    this.showGuige = false; // 选择品名时
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    // console.log('this.cs', this.cs);
    this.cs = value.attrs;
    // console.log('this.cs', this.cs);
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    // console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    console.log('c', value);
    this.search['classifys'] = [];
    this.search['chandiid'] = value;
    this.attrs = [];
    this.classifyApi.getAttrs(value).then(data => {
      // console.log('guige', data);
      this.attrs = data;
    });
    this.showGuige = true;
    // console.log('attr', this.attrs);
  }
  selectedguige(value, id) {
    if (this.search['classifys'].length > 0) {
      for (let i = 0; i < this.search['classifys'].length; i++) {
        if (this.search['classifys'][i].name === id) {
          this.search['classifys'].splice(i, 1);
        }
      }
    }
    this.search['classifys'].push({ name: id, value: value });
    // console.log('op', this.search);
  }
  query() {
    console.log(this.parentthis);
    this.close();
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    if (this.search['buyerid'] instanceof Object) {
      this.search['buyerid'] = this.search['buyerid'].code;
    }
    if (this.parentthis['tasklist'] && this.parentthis['tasklist']['producemode'] === 3) {
      this.search['weishi'] = 1;
    } else {
      this.search['weishi'] = 0;
    }
    this.caigouApi.getqihuodet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.search['gn'] = item.itemname;
    this.search['classifys'] = {};
    this.attrs = [];
    this.attrs = attrs;
    this.showGuige = true;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      element['options'].unshift({ value: '', label: '全部' });
    }
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.search['classifys'][element['value']] = element['defaultval'];
      }
    }
  }
  jstypeShow(){
    this.jiesuantypeModal.show();
  }
  jiesuantypclose(){
    this.jiesuantypeModal.hide();
  }
  confirmjstype(){
    this.saledet['caigouid'] = this.parentthis.caigou.id;
    this.saledet['jiesuantype'] = this.jstype['jiesuantype'];
    this.caigouApi.importdet(this.saledet).then(data => {
      this.parentthis.getcaigou();
    });
    this.bsModalRef.hide();
  }
}
