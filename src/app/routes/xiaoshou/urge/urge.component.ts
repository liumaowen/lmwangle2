import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { OrgApiService } from './../../../dnn/service/orgapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ReportService } from './../../report/report.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-urge',
  templateUrl: './urge.component.html',
  styleUrls: ['./urge.component.scss']
})
export class UrgeComponent implements OnInit {
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  orgs: { label: string; value: string; }[];
  gns: { label: string; value: string; }[];
  data = [];
  disabled = true;
  requestparams = { gn: '', chandi: '', start: '', end: '', orgid: '' };
  filterConditionObj = {};
  fieldArr = [
    'chandi', // 产地
    'color', // 颜色
    'width', // 宽度
    'houdu', // 厚度 
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];
  cs = [];
  chandis = [];
  maxDate = new Date();
  start: Date = new Date();
  end: Date = new Date();
  constructor(public settings: SettingsService, private orgApi: OrgApiService, private datepipe: DatePipe,
    private toast: ToasterService, private classifyApi: ClassifyApiService, private reportApi: ReportService) {
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
      enableFilter: true
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return params.data.orgname;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '产品种类', field: 'urge', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 110 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 110, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      }
    ];
  }

  ngOnInit() {
  }
  listDetail() {
    this.reportApi.urge(this.requestparams).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  openQueryDialog() {
    this.orgs = [{ label: '全部', value: '' }];
    this.orgApi.listAll(0).then((response) => {
      response.forEach(element => {
        this.orgs.push({
          label: element.name,
          value: element.id
        });
      });
    });
    // 查找商品
    this.gns = [];
    // this.classifyApi.getGnAndChandi().then(data => {
    //   data.forEach(element => {
    //     this.gns.push({
    //       label: element.name,
    //       value: element
    //     });
    //   });
    // });
    this.showDialog();
  }
  // 品名选中改变
  selectGnAction(value) {
    this.cs = [];
    this.chandis = [];
    this.requestparams['gnid'] = value.id;
    this.requestparams['chandi'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.disabled = false;
  }
  // 打开查询弹窗
  showDialog() {
    this.classicModal.show();
  }
  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }
  // 查询
  query() {
    // console.log(this.requestparams);
    if (!this.start) {
      this.toast.pop('warning', '开始时间必须填写！');
      return;
    } else {
      this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
      this.listDetail();
      this.hideDialog();
    }
  }
  // 重置
  selectNull() {
    this.start = new Date();
    this.end = new Date();
    this.requestparams = { gn: '', chandi: '', start: '', end: '', orgid: '' };
    this.disabled = true;
    this.chandioptions = [];
  }
  // 导出功能
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      allColumns: false,
      onlySelected: false,
      columnGroups: true,
      skipGroups: true,
      suppressQuotes: false,
      fileName: '鼓励类销售汇总表.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
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
    this.requestparams['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.requestparams['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
