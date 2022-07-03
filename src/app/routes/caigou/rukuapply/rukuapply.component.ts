import { QihuoService } from './../../qihuo/qihuo.service';
///<reference path="../../../../../node_modules/@angular/router/src/router.d.ts"/>
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-rukuapply',
  templateUrl: './rukuapply.component.html',
  styleUrls: ['./rukuapply.component.scss'],
  providers: [DatePipe, DecimalPipe]
})

export class RukuapplyComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  queryandcreate = 0; // 0-创建，1-查询
  attrs = [];
  caigouSelected = new Array<any>();
  rukuapply: object = { beizhu: '', kind: '', month: '', gn: '', chandi: '' };
  dantypes;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start: Date = new Date();

  // 结束时间
  end: Date = new Date();
  gridOptions: GridOptions;
  search: object = {
    start: '', end: '', billno: '', cuserid: '', gn: '', chandi: '', classifys: ''
  };

  gns: any[];
  // 产地
  chandis: any[];
  gangchangs: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  types: any;
  kinds: any;
  rukuapplytypes: any;
  jiaohuoaddrs: any[];
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService, private qihuoapi: QihuoService) {
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
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/rukuapply/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 150,
      //   valueGetter: (params) => {
      //     if (params.data && params.data['sellername']) {
      //       return params.data['sellername'];
      //     } else {
      //       return '合计';
      //     }
      //   }
      // },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'month', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同性质', field: 'kind', minWidth: 90 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'type', minWidth: 90 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '单据类别', field: 'dantype', minWidth: 90 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'finish', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '数量', field: 'weight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '入库量', field: 'rukuweight', aggFunc: 'sum', minWidth: 80,
        valueGetter: (params) => {
          if (params.data && params.data['rukuweight']) {
            return Number(params.data['rukuweight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      // {
      //   cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'tuihuoweight', aggFunc: 'sum', minWidth: 80,
      //   valueGetter: (params) => {
      //     if (params.data && params.data['tuihuoweight']) {
      //       return Number(params.data['tuihuoweight']);
      //     } else {
      //       return 0;
      //     }
      //   }, valueFormatter: this.settings.valueFormatter
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '是否备货', field: 'beihuo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', minWidth: 80 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 70 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 120 }
    ];
  }
  selectstart() { }
  selectend() { }
  // 新建入库申请单
  showcreate() {
    this.rukuapply = { beizhu: '', kind: '', month: '', gn: '', chandi: '' };
    this.types = [{ id: '0', text: '工程单' }, { id: '1', text: '市场调货' }, { id: '2', text: '库存销售' }];
    this.kinds = [{ id: '1', text: '期货' }, { id: '2', text: '现货' }];
    // this.rukuapplytypes = [{ id: '1', text: '工程单' }, { id: '2', text: '库存销售' }, { id: '3', text: '市场调货' }];
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
    this.caigouApi.getchandi().then(data => {
      this.gangchangs = data;
    });
    this.createModal.show();
  }
  selectetype(value) {
    this.rukuapply['type'] = value.id;
  }
  selectekind(value) {
    this.rukuapply['kind'] = value.id;
  }
  // selectecaigoutype(value) {
  //   this.rukuapply['caigoutype'] = value.id;
  // }
  selectmonth(value) {
    this.rukuapply['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectegangchang(value) {
    this.rukuapply['chandiid'] = value.id;
    this.rukuapply['chandi'] = value.text;
    this.jiaohuoaddrs = [];
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.rukuapply['chandiid']) {
          console.log('确定产地的', element);
          // 交货地址
          element.attr.jiaohuoaddr.forEach(addr => {
            this.jiaohuoaddrs.push({
              value: addr.value,
              label: addr.value
            });
          });
        }
      });
    });
  }
  selectNull() {
    this.search = {
      start: '', end: '', billno: '', cuserid: '', gn: '', chandi: '', classifys: ''
    };
    this.start = new Date();
    this.end = new Date();
    this.chandis = [];
    this.chandioptions = [];
  }
  create() {
    if (!this.rukuapply['type']) {
      this.toast.pop('error', '请选择采购类型！', '');
      return;
    }
    if (!this.rukuapply['kind']) {
      this.toast.pop('error', '请选择合同性质！', '');
      return;
    }
    // if (!this.rukuapply['caigoutype']) {
    //   this.toast.pop('error', '请选择采购类型！', '');
    //   return;
    // }
    if (!this.rukuapply['month']) {
      this.toast.pop('error', '请选择合同月份！', '');
      return;
    }
    // if (!this.rukuapply['jiaohuoaddr']) {
    //   this.toast.pop('error', '请填写交货地点！', '');
    //   return;
    // }
    if (!this.rukuapply['chandi']) {
      this.toast.pop('error', '请填写产地！', '');
      return;
    }
    // if (this.rukuapply['dantype'] === undefined) {
    //   this.toast.pop('warning', '请选择单据类别！');
    //   return '';
    // }
    if (this.rukuapply['sellerid'] instanceof Object) {
      this.rukuapply['sellerid'] = this.rukuapply['sellerid'].code;
    } else {
      this.rukuapply['sellerid'] = null;
    }
    if (this.rukuapply['sellerid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    console.log(this.rukuapply);
    this.caigouApi.rukucreate(this.rukuapply).then(data => {
      this.router.navigate(['rukuapply', data.id]);
    });
  }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    // if (this.search['classifys']) {
    //   this.search['classifys'] = '[' + this.search['classifys'] + ']';
    // }
    if (this.search['cuserid'] instanceof Object) {
      this.search['cuserid'] = this.search['cuserid'].code;
    }
    // if (this.search['salemanid'] instanceof Object) {
    //   this.search['salemanid'] = this.search['salemanid'].code;
    // }
    // if (this.search['sellerid'] instanceof Object) {
    //   this.search['sellerid'] = this.search['sellerid'].code;
    // }
    this.caigouApi.getrukuapplydet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }
  close() {
    this.classicModal.hide();
  }
  ngOnInit() {
    this.query();
  }
  // 打开查询对话框
  openquery() {
    this.dantypes = [{ value: '0', label: '甲单' }, { value: '1', label: '乙单' }, { value: '2', label: '丙单' }];
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
  closeq() {
    this.createModal.hide();
  }
  // 合同上传弹窗
  excelUploader() {
    this.uploaderModel.show();
  }
  //合同上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls', 'pdf'] };
  // 设置上传的格式
  accept = null;// ".xls, application/xls";
  // 上传成功执行的回调方法
  matchgrno($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.caigouApi.matchgrno(addData).then(data => {
        this.toast.pop('success', '共匹配' + data.count + '条采购明细');
      });
    }
    this.hideDialog();
  }
  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  finishdet() {
    const caigous = this.gridOptions.api.getModel()['rowsToDisplay'];
    this.caigouSelected = [];
    for (let i = 0; i <= caigous.length - 1; i++) {
      if (caigous[i].selected) {
        if (caigous[i].data.finish === '完成') {
          this.toast.pop('warning', '请不要选择完成的采购明细！');
          return;
        }
        console.log(caigous[i]);
        this.caigouSelected.push(caigous[i].data.caigoudetid);
      }
    }
    if (this.caigouSelected.length <= 0) {
      this.toast.pop('warning', '请选择要完成的采购明细！');
      return;
    }
    if (confirm('你确定将' + (this.caigouSelected.length) + '件采购明细做完成操作吗？')) {
      console.log(this.caigouSelected);
      this.caigouApi.finishDets(this.caigouSelected).then(data => {
        this.toast.pop('success', '操作成功！');
        this.query();
      });
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    if (this.queryandcreate === 0) {
      this.rukuapply['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.rukuapply['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
      }
    } else {
      this.search['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
      }
    }
  }
  showmdmgndialog(flag) {
    this.queryandcreate = flag;
    this.mdmgndialog.show();
  }
}
