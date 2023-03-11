import { OrgApiService } from '../../../dnn/service/orgapi.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ReportService } from '../report.service';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderapiService } from 'app/routes/order/orderapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-intercompany',
  templateUrl: './intercompany.component.html',
  styleUrls: ['./intercompany.component.scss']
})
export class IntercompanyComponent implements OnInit {

  disabled = true;
  start = new Date();
  end;
  orderstart: Date;
  orderend: Date;
  requestparams = { gn: '', chandi: '', orgid: '', cuserid: '', vuserid: '', id: '', start: undefined, end: undefined, orderstart: undefined, orderend: undefined };
  maxDate = new Date();
  
  cuser = {};
  vuser = {};

  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  @ViewChild('updateneicaigoudialog') private updateneicaigoudialog: ModalDirective;
  attrs = [];
  constructor(public settings: SettingsService,
    private reportApi: ReportService, private classifyApi: ClassifyApiService, private toast: ToasterService,private orderApi: OrderapiService,
    private router: Router, private datepipe: DatePipe, private orgApi: OrgApiService) {
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
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 72, pinned: 'left',
        checkboxSelection: (params) => params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orderbillno', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单状态', field: 'billstatus', minWidth: 50 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '审核', field: 'isv', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60 , aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2},
      { 
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 100,aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return '';
          }
        }
        ,valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单吨（加/减）/元', field: 'fapiaochae', minWidth: 70,
        // cellRenderer: (params) => {
        //   if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
        //     return params.data['fapiaochae'];
        //   } else {
        //     return '';
        //   }
        // },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '开票单价', field: 'fapiaoprice', minWidth: 70,
        // cellRenderer: (params) => {
        //   if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
        //     return params.data['fapiaoprice'];
        //   } else {
        //     return '';
        //   }
        // },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '开票金额', field: 'fapiaojine', minWidth: 70,
        // cellRenderer: (params) => {
        //   if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
        //     return params.data['fapiaojine'];
        //   } else {
        //     return '';
        //   }
        // },
        valueFormatter: this.settings.valueFormatter2
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '日期', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '下单日期', field: 'orderdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单明细状态', field: 'detstatus', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售公司', field: 'sellername', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否涉税开票', field: 'sheshuikaipiao', minWidth: 75,
        // cellRenderer: (params) => {
        //   if (params.data && (this.cuser['admin'] || this.cuser['finance'])) {
        //     return params.data['sheshuikaipiao'];
        //   } else {
        //     return '';
        //   }
        // }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '标记（测试）', field: 'neibudetid', minWidth: 80 },
    ];
  }

  ngOnInit() {
  }
  listDetail() {
    this.reportApi.intercompanydet(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  };

  @ViewChild('classicModal') private classicModal: ModalDirective;

  openQueryDialog() {
    this.classicModal.show();
  };

  coles() {
    this.classicModal.hide();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.start = new Date();
    this.end = null;
    this.requestparams = { gn: '', chandi: '', orgid: '', cuserid: '', vuserid: '', id: '', start: undefined, end: undefined, orderstart: undefined, orderend: undefined };
    this.cuser = undefined;
    this.vuser = undefined;
    this.attrs = [];
    this.orderstart = null;
    this.orderend = null;
  };
  // 查询明细
  query() {
    this.requestparams['start'] = this.datepipe.transform(this.start, 'yyyy-MM-dd');
    if (this.end) this.requestparams['end'] = this.datepipe.transform(this.end, 'yyyy-MM-dd');
    if (this.orderstart) this.requestparams['orderstart'] = this.datepipe.transform(this.orderstart, 'y-MM-dd');
    if (this.orderend) this.requestparams['orderend'] = this.datepipe.transform(this.orderend, 'y-MM-dd');
    if (!this.requestparams.start) {
      this.toast.pop('warning', '开始时间必填！');
      // Notify.alert('开始时间必填！', 'warning');
    } else {
      if (typeof (this.cuser) === 'object') {
        this.requestparams.cuserid = this.cuser['code'];
      } else {
        this.requestparams.cuserid = '';
      }
      if (typeof (this.vuser) === 'object') {
        this.requestparams.vuserid = this.vuser['code'];
      } else {
        this.requestparams.vuserid = '';
      }
      // 设定运行查询，再清除页面data变量
      this.listDetail();
      this.coles();
    }
  };

  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.requestparams['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.requestparams[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.requestparams[element['value']] = element['defaultval'];
      }
    }
  }
  // 创建内部采购发票
  neicaigoufapiao: any = { fapiaochae: null, beizhu: null };
  reset() {
    this.neicaigoufapiao = { fapiaochae: null, beizhu: null };
  }
  impdata: any = [];
  @ViewChild('createneicaigoudialog') private createneicaigoudialog: ModalDirective;
  showcreateneicaigoudialog() {
    this.impdata = [];
    const saleshourudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    let sellerid = undefined;
    let buyerid = undefined;
    for (let i = 0; i < saleshourudets.length; i++) {
      if (saleshourudets[i].data && saleshourudets[i].selected && saleshourudets[i].data.price) {
        if(!sellerid){
          sellerid = saleshourudets[i].data.sellerid
        }
        if(!buyerid){
          buyerid = saleshourudets[i].data.buyerid
        }
        if(!saleshourudets[i].data.sellerid){
          this.toast.pop('warning', '请选择已创建合同的明细！！！');
          return;
        }
        if(sellerid !== saleshourudets[i].data.sellerid){
          this.toast.pop('warning', '请选择同一个销售公司的明细！！！');
          return;
        }
        if(buyerid !== saleshourudets[i].data.buyerid){
          this.toast.pop('warning', '请选择同一个采购公司的明细！！！');
          return;
        }
        this.impdata.push(saleshourudets[i].data);
      }
    }
    if (this.impdata.length === 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    this.createneicaigoudialog.show();
  }
  createneicaigoufapiao() {
    this.neicaigoufapiao.list = this.impdata;
    console.log(this.neicaigoufapiao);
    this.orderApi.createneicaigoufapiao(this.neicaigoufapiao).then((response) => {
      this.reset();
      this.router.navigateByUrl('neicaigoufapiao/' + response);
    });
  }
  hidecreateneicaigoudialog() {
    this.createneicaigoudialog.hide();
  }
  params = {};
  impdataids = [];
  updateDandunDialog(){
    this.impdataids = [];
    const saleshourudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < saleshourudets.length; i++) {
      if (saleshourudets[i].data && saleshourudets[i].selected && saleshourudets[i].data.fapiaochae) {
        this.impdataids.push(saleshourudets[i].data.id);
      }
    }
    if (this.impdataids.length === 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    this.params['middleids'] = this.impdataids;
    this.updateneicaigoudialog.show();
  }
  hideupdateneicaigoudialog(){
    this.updateneicaigoudialog.hide();
  }
  updateDandun(){
    this.params['fapiaochae'] = this.neicaigoufapiao['fapiaochae'];
    this.params['beizhu'] = this.neicaigoufapiao['beizhu'];
    this.orderApi.updateDandun(this.params).then((response) => {
      this.hideupdateneicaigoudialog();
    });
  }
}
