import { DatePipe, DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { KucunService } from '../kucun.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-kucuncustomer',
  templateUrl: './kucuncustomer.component.html',
  styleUrls: ['./kucuncustomer.component.scss']
})
export class KucuncustomerComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  requestparams = {};
  saleuser;
  constructor(
    public settings: SettingsService,private datepipe: DatePipe,private datePipe: DatePipe,public numberPipe: DecimalPipe,
    private kucunApi: KucunService ,private toast: ToasterService,) {
    this.gridOptions = {
      enableFilter: true, // 过滤器
      rowSelection: 'multiple', // 多选单选控制 single
      rowDeselection: true, // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true, // 列宽可以自由控制
      enableSorting: true, // 排序
      localeText: this.settings.LOCALETEXT,
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      animateRows: true
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
    { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 90,enableRowGroup: true},
    { cellStyle: { 'text-align': 'center' }, headerName: '流通商未付款待提货库存量', field: 'weight', width: 250,enableRowGroup: true,},
    { cellStyle: { 'text-align': 'center' }, headerName: ' 相比上月底增减 ', field: 'kucuncha', width: 150,enableRowGroup: true,
      cellRenderer: (params) => {
        console.log(params);
        if( params.data['kucuncha']>0) {
          return `<font color="red">${params.data['kucuncha']}</font>`;
         }else{
          return params.data['kucuncha']
         }
      }, valueFormatter: this.settings.valueFormatter        
    }
    ];
   
  }
  ngOnInit() {
    this.query();
  }
  progress = { month: '' };
  openQueryDialog() {
    this.progress = { month: '' };
    this.classicModal.show();
  }
  selectmonth(value) {
    this.progress['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 查询
  query() {
    // if (this.progress['riqi'] === '') {
    //   this.toast.pop('warning', '请选择月份！');
    //   return;
    // }
    console.log(this.progress);
    console.log(111);

    this.kucunApi.kucuncustomer(this.progress).then((response) => {
      this.gridOptions.api.setRowData(response);// 网格赋值
      this.hideclassicModal();
    });
  }
  hideclassicModal() {
    this.classicModal.hide();
  }

}
