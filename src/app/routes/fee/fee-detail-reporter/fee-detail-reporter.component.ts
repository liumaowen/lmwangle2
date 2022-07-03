import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FeeapiService } from '../feeapi.service';
const sweetalert = require('sweetalert');
@Component({
  selector: 'app-fee-detail-reporter',
  templateUrl: './fee-detail-reporter.component.html',
  styleUrls: ['./fee-detail-reporter.component.scss']
})
export class FeeDetailReporterComponent implements OnInit {

  start = new Date();

  maxDate = new Date();

  end: Date;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  requestparams = {
    cuserid: '',
    feecustomerid: '',
    paycustomerid: '',
    type: '',
    billtype: '',
    accountdirection: '',
    payorreceive: '',
    start: this.datePipe.transform(this.start, 'y-MM-dd'),
    end: '',
    orgid: ''
  };
  gridOptions: GridOptions;

  companyOfCode;

  cuser;

  types = [{ label: '全部', value: '' },
  { label: '汽运费', value: '1' },
  { label: '铁运费', value: '2' },
  { label: '船运费', value: '3' },
  { label: '出库费', value: '4' },
  { label: '开平费', value: '5' },
  { label: '纵剪费', value: '6' },
  { label: '销售运杂费', value: '7' },
  { label: '包装费', value: '8' },
  { label: '仓储费', value: '9' },
  { label: '保险费', value: '10' },
  { label: '押车费', value: '11' }]; // 定义费用类型

  billtypes = [{ label: '全部', value: '' },
  { label: '提货单', value: '提货单' },
  { label: '调拨单', value: '调拨单' }]; // 单据类型

  accountdirections = [{ label: '全部', value: '' },
  { label: '采购', value: '1' },
  { label: '销售', value: '2' }];

  payorreceives = [{ label: '全部', value: '' },
  { label: '应付', value: '1' },
  { label: '应收', value: '2' }];

  paycustomers = [];

  constructor(public settings: SettingsService,
    private datePipe: DatePipe,
    private feeApi: FeeapiService,
    private customerApi: CustomerapiService,
    private toast: ToasterService) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 56, checkboxSelection: true, colId: 'check' },
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'feeid', minWidth: 70,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.billtype === '提货单') {
              return '<a target="_blank" href="#/tihuo/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '入库单') {
              return '<a target="_blank" href="#/ruku/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '调拨单') {
              return '<a target="_blank" href="#/allot/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '销售退货单') {
              return '<a target="_blank" href="#/xstuihuo/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else if (params.data.billtype === '在途运单') {
              return '<a target="_blank" href="#/zaituruku/' + params.data.billid + '">' + params.data.feeid + '</a>';
            } else {
              return params.data.feeid;
            }
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'types', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'cgtype', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否审核', field: 'isv', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据编号', field: 'billno', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流约车单编号', field: 'matchcarbillno', minWidth: 120,
        cellRenderer: (params) => {
          if (params.data && params.data.matchcarid) {
            return '<a target="_blank" href="#/matchcar/detail/' + params.data.matchcarid + '">' + params.data.matchcarbillno + '</a>';
          }
        }, colId: 'matchcarbillno'
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '物流员', field: 'wuliuusername', minWidth: 80, colId: 'wuliuusername' },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startaddr', minWidth: 80, colId: 'startaddr' },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'endaddr', minWidth: 80, colId: 'endaddr' },
      { cellStyle: { 'text-align': 'center' }, headerName: '约车单创建时间', field: 'matchcarcdate', minWidth: 100, colId: 'matchcarcdate' },
      { cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'perprice', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实付单价', field: 'innerprice', minWidth: 90,
        valueGetter: (params) => {
          if (params.data && params.data['innerprice']) {
            return Number(params.data['innerprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2, colId: 'innerprice'
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实付金额', field: 'innerjine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['innerjine']) {
            return Number(params.data['innerjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2, colId: 'innerjine'
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '系统金额', field: 'jine', minWidth: 70, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已付金额', field: 'yifujine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['yifujine']) {
            return Number(params.data['yifujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '未付金额', field: 'weifujine', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weifujine']) {
            return Number(params.data['weifujine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'tcount', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['tcount']) {
            return Number(params.data['tcount']);
          } else {
            return 0;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务单位', field: 'buyname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际费用单位', field: 'actualfeecustomername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付费单位', field: 'payname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '描述', field: 'miaoshu', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '鼓励类', field: 'urge', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 75,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 75
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 75 }
    ];
    this.getMyRole();

  }

  ngOnInit() {
  }

  listDetail() {
    this.feeApi.feedetail(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  // 获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      // 如果登陆的用户是业务员，设置为不可见
      if (myrole.some(item => item === 10)) {
        if (colde.colId === 'innerjine' || colde.colId === 'innerprice') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
      // 如果登陆的用户是非物流员，设置为不可见
      if (!myrole.some(item => item === 9 || item === 1)) {
        if (colde.colId === 'matchcarbillno' || colde.colId === 'wuliuusername' || colde.colId === 'startaddr'
          || colde.colId === 'endaddr' || colde.colId === 'matchcarcdate') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
    });
  }
  openQueryDialog() {
    this.selectNull();
    this.customerApi.findwiskind().then((data) => {
      const paycustomerlist = [{ label: '全部', value: '' }];
      data.forEach(element => {
        paycustomerlist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.paycustomers = paycustomerlist;
    });
    this.showclassicModal();
  }

  selectNull() {
    this.requestparams = {
      cuserid: '',
      feecustomerid: '',
      paycustomerid: '',
      type: '',
      billtype: '',
      accountdirection: '',
      payorreceive: '',
      start: this.datePipe.transform(this.start, 'y-MM-dd'),
      end: '',
      orgid: ''
    };

    this.companyOfCode = undefined;

    this.cuser = undefined;
    this.end = undefined;
    this.start = new Date();
  }

  // 查询提货单
  query() {
    if (this.start) {
      this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
      if (this.end) {
        this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
      } else {
        this.requestparams.end = '';
      }
      if (typeof (this.cuser) === 'object') {
        this.requestparams.cuserid = this.cuser['code'];
      } else {
        this.requestparams.cuserid = '';
      }
      if (typeof (this.companyOfCode) === 'object') {
        this.requestparams.feecustomerid = this.companyOfCode['code'];
      } else {
        this.requestparams.feecustomerid = '';
      }
      console.log(this.requestparams);
      this.listDetail();
      this.hideclassicModal();
    } else {
      this.toast.pop('warning', '开始时间必填！');
    }
  };

  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '费用汇总表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }



  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  // 批量处理费用
  batchHandleFee() {
    const feecollectids = [];
    const feeSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < feeSelected.length; i++) {
      if (feeSelected[i].data && feeSelected[i].selected) {
        feecollectids.push(feeSelected[i].data.feeid);
      }
    }
    if (feecollectids.length < 1) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    sweetalert({
      title: '你确定要批量处理费用吗',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.feeApi.batchHandleFee({ feecollectids: feecollectids }).then(() => {
        this.toast.pop('success', '操作成功');
        this.listDetail();
      });
      sweetalert.close();
    });
  }


}
