import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';
import { Cgorgtypes } from 'app/shared/const';
import { StorageService } from 'app/dnn/service/storage.service';

@Component({
  selector: 'app-jinhuoguanzhi',
  templateUrl: './jinhuoguanzhi.component.html',
  styleUrls: ['./jinhuoguanzhi.component.scss']
})
export class JinhuoguanzhiComponent implements OnInit {

  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;
  @ViewChild('addBuchaPriceDialog') private addBuchaPriceDialog: ModalDirective;
  @ViewChild('showAddYichanDialog') private showAddYichanDialog: ModalDirective;
  @ViewChild('showAddJiesuanDialog') private showAddJiesuanDialog: ModalDirective;
  @ViewChild('showuploadprice') private showuploadprice: ModalDirective;
  @ViewChild('showuploadbeizhu') private showuploadbeizhu: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  gns: any[];
  chandis: any[];
  caigoutypes: any[];
  isurgent: any[];
  orgs: any[];
  saleman: any;
  params = {};
  orgtypes: any = Cgorgtypes;
  seller;

  constructor(public settings: SettingsService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private classifyapi: ClassifyApiService, private toast: ToasterService,private storage: StorageService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: "multiple",
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems,
      onColumnResized: () => {
        this.tabelPostion();
      },
      onColumnMoved: () => {
        this.tabelPostion();
      },
      onGridReady: () => {
        if (this.storage.getObject('permanent_jinhuoguanzhiTablePosition')) {
          this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_jinhuoguanzhiTablePosition'));
        }
      }
    };

    this.gridOptions.columnDefs = [
      // { field: 'group', rowGroup: true, headerName: '合计', hide: false, valueGetter: (params) => '合计' },
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      { cellStyle: { "text-align": "left" }, headerName: '选择', width: 30, checkboxSelection: true, suppressMenu: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购合同号', field: 'billno', width: 90,
        cellRenderer: (params) => {
          if (params.data) {
            return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'gcid', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交货地点', field: 'jiaohuoaddr', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'gcmonth', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 90,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'caigoutype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '采购量', field: 'caigouweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['caigouweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '钢厂合同量', field: 'gchtweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['gchtweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购单价', field: 'price', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '入库量', field: 'chanchuweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['chanchuweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未入库量', field: 'weirukuweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weirukuweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已产量', field: 'yichanweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['yichanweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未产量', field: 'weichanchuweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weichanchuweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '欠交量', field: 'qianjiaoliang', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['qianjiaoliang']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产出率', field: 'chanchurate', width: 90 },

      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否完成', field: 'isfinish', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否急单', field: 'isurgent', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合约号', field: 'contractno', width: 90 },
     // { cellStyle: { 'text-align': 'center' }, headerName: '补差单价', field: 'buchaprice', width: 90 },
     // { cellStyle: { 'text-align': 'center' }, headerName: '补差金额', field: 'buchajine', width: 90 },
      //{ cellStyle: { 'text-align': 'center' }, headerName: '结算单价', field: 'jiesuanprice', width: 90 },
     // { cellStyle: { 'text-align': 'center' }, headerName: '实际成本金额', field: 'actualcostjine', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '在途重量', field: 'zaituweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['zaituweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已到票重量', field: 'invoiceweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['invoiceweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '已到票金额', field: 'invoicejine', width: 90, aggFunc: 'sum',
      //   valueGetter: (params) => {
      //     if (params.data) {
      //       return Number(params.data['invoicejine']);
      //     } else {
      //       return 0;
      //     }
      //   }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      // },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未到票重量', field: 'noinvoiceweight', width: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['noinvoiceweight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '未到票金额', field: 'noinvoicejine', width: 90, aggFunc: 'sum',
      //   valueGetter: (params) => {
      //     if (params.data) {
      //       return Number(params.data['noinvoicejine']);
      //     } else {
      //       return 0;
      //     }
      //   }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '预估费用单价', field: 'yuguprice', width: 90,
      // enableRowGroup: true, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估返利金额', field: 'yugufanlijine', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['yugufanlijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估返利节点', field: 'yugufanlijiedian', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交货仓库', field: 'jhcangku', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内部交期', field: 'jiaohuodate', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '退货量', field: 'tuihuoweight', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠单价', field: 'youhuiprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '考核单价', field: 'kaoheprice', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu2', width: 90 },
    ];
  }

  ngOnInit() {
    this.caigouApi.listjinhuoguozhi(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);  
    });
  }
  // 储存表格状态列
  tabelPostion() {
    this.storage.setObject('permanent_jinhuoguanzhiTablePosition', this.gridOptions.columnApi.getColumnState());
  }
  listDetail() {
    // 从服务器获取数据赋值给网格
    console.log(this.search);
    this.caigouApi.listjinhuoguozhi(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }
  //钢厂进货管制查询
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gns = [];
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  selectedgn(value) {
    this.chandis = [];
    console.log(value);
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  showgcinfodialog() {
    this.search = {};
    this.caigoutypes = [{ label: '工程单', value: 1 }, { label: '库存销售', value: 2 }];
    this.isurgent = [{ label: '是', value: 1 }, { label: '否', value: 0 }];
    // this.getGnAndChandi();
    this.orgs = [{ label: '全部', value: '' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    })
    this.gcinfodialog.show();
  }
  closegcinfodialog() {
    this.gcinfodialog.hide();
  }
  selectmonth(value) {
    this.search['gcmonth'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }
  selectmonth2(value) {
    this.search['gcmonth2'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }
  selectNull() {
    this.search = {
       gn: '', chandi: '', caigoutype:'',orgid:'',isurgent:'',saleman:{}
    };
    this.saleman = null;
  }
  searchjinhuoguanzhi() {
    // if (this.search['gnid']) {
    //   this.search['gnid'] = this.search['gnid']['id'];
    // }
    if (this.saleman) {
      this.search['salemanid'] = this.saleman['code'];
    }
    if(this.search['gcmonth'] === null || this.search['gcmonth2'] === null){
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    if(this.seller){
      this.search['sellerid'] = this.seller['code'];
    }
    this.listDetail();
    this.closegcinfodialog();
  }

  showAddBuchaPriceDialog() {
    this.addBuchaPriceDialog.show();
  }
  closeAddBuchaPriceDialog() {
    this.addBuchaPriceDialog.hide();
  }

  // 填写补差单价
  addBuchaPrice(){
    let caigoudetids = new Array();
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].selected && selected[i].data && selected[i].data['caigoudetid']) {
        caigoudetids.push(selected[i].data['caigoudetid']);
      }
    }
    if (caigoudetids.length === 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    if(this.params['buchaprice'] === null || this.params['buchaprice'] === undefined){
      this.toast.pop('warning', '请填写补差单价！！！');
      return;
    }
    this.params['caigoudetids'] = caigoudetids;
    this.caigouApi.batchUpdateCaigouDet(this.params).then((data) => {
      if(data){
        this.listDetail();
        this.closeAddBuchaPriceDialog();
      }
    });
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
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
  showAddYichan(){
    this.showAddYichanDialog.show();
  }
  closeAddYichanDialog(){
    this.showAddYichanDialog.hide();
  }
  addyichan(){
    let caigoudetids = new Array();
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].selected && selected[i].data && selected[i].data['caigoudetid']) {
        caigoudetids.push(selected[i].data['caigoudetid']);
      }
    }
    if (caigoudetids.length === 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    if(this.params['yichanweight'] === null || this.params['yichanweight'] === undefined){
      this.toast.pop('warning', '请填写已产量！！！');
      return;
    }
    this.params['caigoudetids'] = caigoudetids;
    this.caigouApi.batchUpdateYichan(this.params).then((data) => {
      if(data){
        this.listDetail();
        this.closeAddYichanDialog();
      }
    });
  }
  showAddJiesuan(){
    this.showAddJiesuanDialog.show();
  }
  closeAddJiesuan(){
    this.showAddJiesuanDialog.hide();
  }
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  uploadyouhuiprice(){
    this.showuploadprice.show();
  }
  uploadbeizhu(){
    this.showuploadbeizhu.show();
  }
  hideuploadprice(){
    this.showuploadprice.hide();
  }
  hideuploadbeizhu(){
    this.showuploadbeizhu.hide();
  }
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.caigouApi.uploadprice(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.hideuploadprice();
      });
    }
  }
  uploads2($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.caigouApi.uploadbeizhu2(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.hideuploadbeizhu();
      });
    }
  }
}
  