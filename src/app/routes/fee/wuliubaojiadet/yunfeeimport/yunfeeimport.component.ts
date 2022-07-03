import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { Router } from '@angular/router';
import { FeeapiService } from '../../feeapi.service';

@Component({
  selector: 'app-yunfeeimport',
  templateUrl: './yunfeeimport.component.html',
  styleUrls: ['./yunfeeimport.component.scss']
})
export class YunfeeimportComponent implements OnInit {
  parentthis: any;
  gridOptions: GridOptions;
  list: any = [];
  // 运费对象
  yunfeeModel = { startarea: '', endarea: ''};
  @ViewChild('classicModal') private classicModal: ModalDirective;
  constructor(public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private feeapiService: FeeapiService,
    private router: Router,
    private datepipe: DatePipe) {
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
      rowSelection: 'multiple',
      localeText: this.settings.LOCALETEXT
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true,
       headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 省', field: 'endprovincename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 市', field: 'endcityname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地 县', field: 'endcountyname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '载重区间', field: 'weightrange', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运输类型', field: 'yuntype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '运费', field: 'price', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '报价时间', field: 'baojiadate', width: 125 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效开始时间', field: 'effectivestarttime', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '有效结束时间', field: 'effectiveendtime', minWidth: 110 },
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      this.getlist();
    }, 0);
  }
  /**获取物流竞价明细 */
  getlist() {
    this.feeapiService.queryyunfeelist(this.yunfeeModel).then(data => {
      this.gridOptions.api.setRowData(data);
      this.list = data;
      if (!data.length) {
        this.toast.pop('info', '没有查询到固定路线！');
      }
    });
  }
  /**确定 */
  confirm() {
    const params = [];
    const sectiondetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的固定路线明细
    for (let i = 0; i < sectiondetSelected.length; i++) {
      if (sectiondetSelected[i].data && sectiondetSelected[i].selected) {
        params.push(sectiondetSelected[i].data.id);
      }
    }
    if (params.length < 1) {
      this.toast.pop('warning', '请选择固定路线明细！！！');
      return;
    }
    this.feeapiService.wuliuorderimportyunfee(params).then(data => {
      this.bsModalRef.hide();
      this.parentthis.listDetail();
    });
  }
  showquerymodel() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  query() {
    this.getlist();
    this.hideclassicModal();
  }
}
