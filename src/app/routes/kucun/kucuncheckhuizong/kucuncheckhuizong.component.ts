import { Component, OnInit, ViewChild } from '@angular/core';
import { KucunService } from '../kucun.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';

@Component({
  selector: 'app-kucuncheckhuizong',
  templateUrl: './kucuncheckhuizong.component.html',
  styleUrls: ['./kucuncheckhuizong.component.scss']
})
export class KucuncheckhuizongComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  gridOptions: GridOptions;
  ckitems;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: null;
  // 结束时间
  end: null;
  search: object = { start: '', end: '', cangkuid: '' };
  constructor(private kucunApi: KucunService, public settings: SettingsService, private userapi: UserapiService, private datepipe: DatePipe,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库性质', field: 'type', minWidth: 120, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库负责人', field: 'realname', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否签订协议', field: 'signxieyi', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP库存量', field: 'weight', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库库存量', field: 'weight2', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '差异数量', field: 'differences', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 100 },
    ];
  }

  ngOnInit() {
  }
  querydata() {
    this.kucunApi.findhuizong(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  showDialog() {
    if (!this.ckitems) {
      this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    this.start = null;
    this.end = null;
    this.search = { start: '', end: '', cangkuid: '' };
    this.classicModal.show();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  selectstart() { }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }
    if (this.end !== null) {
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    this.querydata();
    this.hideDialog();
  }

  submitverify() {
    const checkdatas = new Array();
    const showdata = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    // 获得所有选中的待提货物如果没有选中则不允许添加提货人
    for (let i = 0; i < showdata.length; i++) {
      if (showdata[i].data && showdata[i].selected) {
        const m = {};
        m['kucuncheckid'] = showdata[i].kucuncheckid;
        m['type'] = showdata[i].type;
        m['name'] = showdata[i].name;
        m['realname'] = showdata[i].realname;
        m['signxieyi'] = showdata[i].signxieyi;
        m['weight'] = showdata[i].weight;
        m['weight2'] = showdata[i].weight2;
        m['differences'] = showdata[i].differences;
        m['month'] = showdata[i].month;
        m['beizhu'] = showdata[i].beizhu;
        m['cangkuid'] = showdata[i].cangkuid;
        checkdatas.push(m);
      }
    }
    if (checkdatas.length === 0) {
      this.toast.pop('warning', '请选择要提交审核的数据！');
      return;
    }
    if (confirm('你确定提交审核吗？')) {
      this.kucunApi.submitVerify({ kucuncheck: checkdatas }).then(data => {
        this.toast.pop('success', '请选择要提交审核的数据！');

      })
    }
  }
}
