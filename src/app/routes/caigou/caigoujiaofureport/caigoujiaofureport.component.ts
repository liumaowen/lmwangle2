import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CaigouService } from '../caigou.service';

@Component({
  selector: 'app-caigoujiaofureport',
  templateUrl: './caigoujiaofureport.component.html',
  styleUrls: ['./caigoujiaofureport.component.scss']
})
export class CaigoujiaofureportComponent implements OnInit {
  // 开始时间最大时间
  startmax: Date = new Date();

  // 结束时间最大时间
  endmax: Date;

  // 开始时间
  start: Date;

  // 结束时间
  end: Date = new Date();
  @ViewChild('querydialog') private querydialog: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;

  gridOptions: GridOptions;

  gns: any[];

  cs: any[];

  chandis: any[];

  search: object = {
    start: '', end: '', month: '', gnid: '', chandiid: '', grno: '', orgid: '', salemanid: ''
  };
  chandioptions: any = [];
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService) {
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
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂下单月份', field: 'caigoumonth', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购类型', field: 'caigoutype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '期货合同日期', field: 'ordercdate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '通知采购日期', field: 'noticecaigoudate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内部交期', field: 'jiaohuodate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购日期', field: 'cdate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '最后到货日期', field: 'lastrukudate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交付情况', field: 'jiaofuqingkuang', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同状态', field: 'hetongstatus', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交付比例', field: 'jiaofubili', minWidth: 90 },
      { cellStyle: { 'text-align': 'right' }, headerName: '资源号', field: 'grno', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '是否急单', field: 'isurgent', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '厚度', field: 'houdu', minWidth: 90 },
      { cellStyle: { 'text-align': 'right' }, headerName: '宽度', field: 'width', minWidth: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '面漆', field: 'beiqi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同量', field: 'orderweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库量', field: 'rukuweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salemanname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂负责人', field: 'ziyuanwaiwu', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构负责人交付日期', field: 'orgjiaohuodate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂负责人交付日期', field: 'ziyuanwaiwujiaohuodate', minWidth: 80 },
    ];
  }

  ngOnInit() {
    this.query();
  }

  // 打开查询对话框
  openquerydialog() {
    this.selectNull();
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      // console.log('gns11', this.gns);
    });
    this.querydialog.show();
  }
  close() {
    this.querydialog.hide();
  }
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    this.search['gnid'] = value.id;
    this.search['chandiid'] = '';
    this.cs = value.attrs;
    this.chandis = [];
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    console.log(this.chandis);
  }
  selectNull() {
    this.search = {
      gnid: '', chandiid: '', grno: '', orgid: '', salemanid: ''
    };
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectedchandi(value) {
    this.search['chandiid'] = value;
  }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    } else {
      this.search['start'] = this.datepipe.transform(new Date(), 'y-MM') + '-01';
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['salemanid'] instanceof Object) {
      this.search['salemanid'] = this.search['salemanid'].code;
    }
    if (!this.search['month']) {
      this.search['month'] = this.datepipe.transform(new Date(), 'y-MM') + '-01';
    }
    console.log(this.search);
    this.caigouApi.caigoujiaofu(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.close();
  }
  selectstart() { }
  selectend() { }

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
      this.search['chandi'] = this.chandioptions[0]['value'];
    }
  }

}
