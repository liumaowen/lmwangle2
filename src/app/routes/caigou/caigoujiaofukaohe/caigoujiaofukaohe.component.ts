import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';

@Component({
  selector: 'app-caigoujiaofukaohe',
  templateUrl: './caigoujiaofukaohe.component.html',
  styleUrls: ['./caigoujiaofukaohe.component.scss']
})
export class CaigoujiaofukaoheComponent implements OnInit {
  // 开始时间最大时间
  startmax: Date = new Date();
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  // 结束时间最大时间
  endmax: Date = new Date();

  // 开始时间
  start:Date;

  // 结束时间
  end: Date = new Date();;
  search: object = {
    start: '', end: '', gn: '', chandi: '',ziyuanwaiwuid: ''
  };
  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private caigouApi: CaigouService, 
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
      enableFilter: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
     // { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂负责人', field: 'ziyuanwaiwu', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '总体交付率', field: 'ziyuanwaiwuJiaofulvSum', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '交付率', field: 'jiaofulv', minWidth: 90 },
    ];
  }

  ngOnInit() {
    this.query();
  }

  selectedchandi(value) {
    this.search['chandiid'] = value;
  }

  selectstart() { }
  selectend() { }

  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null){
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.search['ziyuanwaiwuid'] instanceof Object) {
      this.search['ziyuanwaiwuid'] = this.search['ziyuanwaiwuid'].code;
    }
    console.log(this.search);
    this.caigouApi.cgjiaofukaohe(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.hideDialog();
  }
  data = [];

  gns: any[];
  cs: any[];
  chandis: any[];
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

  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;


  // 打开查询弹窗
  showDialog() {
    this.classicModal.show();
  }

  // 打开查询对话框
  openQueryDialog() {
    this.selectNull();
    this.gns = [];
    this.chandis = [];
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

  // 关闭查询弹窗
  hideDialog() {
    this.classicModal.hide();
  }

  // 重置
  selectNull() {
    this.search = {
      start: '', end: '', gn: '', chandi: '',ziyuanwaiwu: ''
    };
    
    this.start = null;
    this.chandioptions = [];
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
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }
}
