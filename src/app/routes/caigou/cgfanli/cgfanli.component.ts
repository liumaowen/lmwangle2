import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CaigouService } from '../caigou.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { Cgorgtypes } from 'app/shared/const';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-cgfanli',
  templateUrl: './cgfanli.component.html',
  styleUrls: ['./cgfanli.component.scss']
})
export class CgfanliComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('bttypeModal') private bttypeModal: ModalDirective;
  @ViewChild('weightModal') private weightModal: ModalDirective;
  @ViewChild('priceModal') private priceModal: ModalDirective;
  @ViewChild('ybjineModal') private ybjineModal: ModalDirective;
  @ViewChild('beizhuModal') private beizhuModal: ModalDirective;
  @ViewChild('monthModal') private monthModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  queryandcreate = 0; // 0-创建，1-查询
  gridOptions: GridOptions;
  month: Date;
  supplier: any = {};
  cgfanli: object = { supplierid: '', bttype: '', beizhu: '', weight: '0', price: '0', gn: '', month: '', chandi: '', ybjine: '0',orgid: '' };
  orgtypes: any = Cgorgtypes;
  gns: any[];
  // 产地
  chandis: any[];
  gangchangs: any[];
  isChandi: boolean;
  cs: any[];
  modify: object = { type: 0, id: 0, bttype: '', weight: '', price: '', ybjine: '', beizhu: '' };
  search: object = { start: '', end: '', chandi: '', gn: '' };
  start: Date;
  end: Date;
  jinemsg: any;
  shenhe: object = { month: '' };
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private router: Router,
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
        cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data['month'];
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '补贴类型', field: 'bttype', minWidth: 90,
        onCellClicked: (params) => {
          if (params.data && params.data.ismodify === 1 && params.data.mtype !== 2) {
            this.modify['type'] = 1;
            this.modify['id'] = params.data.id;
            this.bttypeModal.show();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '享受补贴量（吨）', field: 'weight', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3,
        onCellClicked: (params) => {
          if (params.data && params.data.ismodify === 1 && params.data.mtype !== 2) {
            this.modify['type'] = 2;
            this.modify['id'] = params.data.id;
            this.weightModal.show();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '补贴单价', field: 'price', minWidth: 80,
        onCellClicked: (params) => {
          if (params.data && params.data.ismodify === 1 && params.data.mtype !== 2) {
            this.modify['type'] = 3;
            this.modify['id'] = params.data.id;
            this.priceModal.show();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '应补贴金额', field: 'ybjine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['ybjine']) {
            return Number(params.data['ybjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2,
        onCellClicked: (params) => {
          if (params.data) {
            this.modify['type'] = 6;
            this.modify['id'] = params.data.id;
            this.modify['jine'] = params.data.ybjine;
            this.jinemsg = '应补贴金额';
            this.ybjineModal.show();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已补贴金额', field: 'yibjine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yibjine']) {
            return Number(params.data['yibjine']);
          } else {
            return 0;
          }
        },
        // onCellClicked: (params) => {
        //   if (params.data) {
        //     this.modify['type'] = 4;
        //     this.modify['id'] = params.data.id;
        //     this.modify['jine'] = params.data.yibjine;
        //     this.jinemsg = '已补贴金额';
        //     this.ybjineModal.show();
        //   }
        // },
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '未补贴金额', field: 'wbjine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['wbjine']) {
            return Number(params.data['wbjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150,
        onCellClicked: (params) => {
          if (params.data && params.data.mtype !== 2) {
            this.modify['type'] = 5;
            this.modify['id'] = params.data.id;
            this.beizhuModal.show();
          }
        }
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: (params) => {
      //     if (params.data && params.data.status === 0 && params.data.mtype === 1) {
      //       return '<a target="_blank">删除</a>';
      //     } else {
      //       return '';
      //     }
      //   },
      //   onCellClicked: (params) => {
      //     if (params.data && params.data.status === 0 && params.data.mtype === 1) {
      //       sweetalert({
      //         title: '你确定要删除吗?',
      //         type: 'warning',
      //         showCancelButton: true,
      //         confirmButtonColor: '#23b7e5',
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         closeOnConfirm: false
      //       }, () => {
      //         this.caigouApi.delfanli(params.data.id).then(data => {
      //           this.getDetail();
      //         });
      //         sweetalert.close();
      //       });
      //     }
      //   }
      // },
      // { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'label', minWidth: 90 }
    ];
    this.getDetail();
  }

  ngOnInit() {
  }
  getDetail() {
    this.caigouApi.getfanlidet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  openquery() {
    this.selectNull();
    this.caigouApi.getchandi().then(data => {
      this.gangchangs = data;
    });
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = { start: '', end: '', chandiid: '', gn: '' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    // if (!this.search['start']) {
    //   this.toast.pop('warning', '请选择开始月份！', '');
    //   return;
    // }
    if (!this.search['end']) {
      this.toast.pop('warning', '请选择结束月份！', '');
      return;
    }
    if (this.start > this.end) {
      this.toast.pop('warning', '开始月份大于结束月份，请重新选择！', '');
      return;
    }
    console.log(this.search);
    this.getDetail();
    this.classicModal.hide();
  }
  showcreate() {
    this.cgfanli = { supplierid: '', bttype: '', beizhu: '', weight: '0', price: '0', gn: '', month: '', chandi: '', ybjine: '0',orgid:'' };
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   console.log(data);
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.chandis = [];
    this.createModal.show();
    this.month = new Date();
    this.supplier = {};
    this.selectmonth(this.month);
  }
  closeq() {
    this.createModal.hide();
  }
  selectmonth(value) {
    console.log(value);
    this.cgfanli['month'] = null;
    this.cgfanli['month'] = this.datepipe.transform(value, 'y-MM') + '-01';
  }
  selectedgn(value) {
    this.cs = [];
    this.chandis = [];
    this.cgfanli['gnid'] = value.id;
    this.cgfanli['chandiid'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
  }
  autocalcjine() {
    console.log(this.cgfanli['weight']);
    console.log(this.cgfanli['price']);
    if (this.cgfanli['price'] && this.cgfanli['weight']) {
      this.cgfanli['ybjine'] = this.cgfanli['weight'] * this.cgfanli['weight'];
    }
  }
  selectedchandi(value) {
    this.cgfanli['chandiid'] = value;
  }
  create() {
    if (!this.cgfanli['month']) {
      this.toast.pop('warning', '请选择返利月份！', '');
      return;
    }
    this.cgfanli['supplierid'] = this.supplier.code;
    if (!this.cgfanli['supplierid']) {
      this.toast.pop('warning', '请选择供应商！', '');
      return;
    }
    if (!this.cgfanli['gn']) {
      this.toast.pop('warning', '请选择品名！', '');
      return;
    }
    if (!this.cgfanli['chandi']) {
      this.toast.pop('warning', '请选择产地！', '');
      return;
    }
    if (!this.cgfanli['ybjine']) {
      this.toast.pop('warning', '请填写应补贴金额！', '');
      return;
    } else {
      // if (!/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.test(this.cgfanli['ybjine'])) {
      //   this.toast.pop('warning', '请正确填写应补贴金额！', '');
      //   return;
      // }
    }
    this.caigouApi.createcgfanli(this.cgfanli).then(data => {
      this.toast.pop('success', '添加成功！', '');
      this.getDetail();
      this.createModal.hide();
    });
  }
  submitmodify() {
    if (this.modify['type'] === 1) {
      if (!this.modify['bttype']) {
        this.toast.pop('warning', '请填写补贴类型再提交！', '');
        return;
      }
    } else if (this.modify['type'] === 2) {
      if (!this.modify['weight']) {
        this.toast.pop('warning', '请填写享受补贴量再提交！', '');
        return;
      }
    } else if (this.modify['type'] === 3) {
      if (!this.modify['price']) {
        this.toast.pop('warning', '请填写补贴单价再提交！', '');
        return;
      }
    } else if (this.modify['type'] === 4 || this.modify['type'] === 6) {
      if (!this.modify['jine']) {
        this.toast.pop('warning', '请填写数据后再提交！', '');
        return;
      }
      // else {
      //   if (!/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/.test(this.modify['jine'])) {
      //     this.toast.pop('warning', '请正确填写金额！', '');
      //     return;
      //   }
      // }
    } else if (this.modify['type'] === 5) {
      if (!this.modify['beizhu']) {
        this.toast.pop('warning', '请填写备注再提交！', '');
        return;
      }
    }
    this.caigouApi.modifyfanli(this.modify['id'], this.modify).then(data => {
      this.toast.pop('success', '修改成功！', '');
      this.getDetail();
      if (this.modify['type'] === 1) {
        this.bttypeModal.hide();
      } else if (this.modify['type'] === 2) {
        this.weightModal.hide();
      } else if (this.modify['type'] === 3) {
        this.priceModal.hide();
      } else if (this.modify['type'] === 4 || this.modify['type'] === 6) {
        this.ybjineModal.hide();
      } else if (this.modify['type'] === 5) {
        this.beizhuModal.hide();
      }
    });
  }
  bttypeclose() {
    this.bttypeModal.hide();
  }
  weightclose() {
    this.weightModal.hide();
  }
  priceclose() {
    this.priceModal.hide();
  }
  ybjinelose() {
    this.ybjineModal.hide();
  }
  beizhulose() {
    this.beizhuModal.hide();
  }
  selectstartmonth(value) {
    console.log('start', value.getTime());
    this.start = value.getTime();
    this.search['start'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectendmonth(value) {
    console.log('end', value.getTime());
    this.end = value.getTime();
    this.search['end'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  submitshenhe() {
    this.shenhe['month'] = '';
    this.monthModal.show();
  }
  submit() {
    if (!this.shenhe['month']) {
      this.toast.pop('warning', '请选择需审核月份！', '');
      return;
    }
    this.caigouApi.submitfanli(this.shenhe).then(data => {
      this.toast.pop('success', '提交成功！', '');
      this.getDetail();
      this.monthModal.hide();
    });
  }
  selectshenhemonth(value) {
    this.shenhe['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  closemonth() {
    this.monthModal.hide();
  }
  // 计算应补贴金额
  calcpjine() {
    if (this.cgfanli['price'] && this.cgfanli['weight'] && !isNaN(Number(this.cgfanli['weight'])) && !isNaN(Number(this.cgfanli['price']))) {
      this.cgfanli['ybjine'] = (parseFloat(this.cgfanli['weight']) * parseFloat(String(this.cgfanli['price']))).toFixed(2);
    }
  }
  showmdmgndialog(flag) {
    this.mdmgndialog.show();
    this.queryandcreate = flag;
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
    if (this.queryandcreate === 0) {
      this.cgfanli['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.cgfanli['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
      }
    } else {
      this.search['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
      }
    }
  }
}
