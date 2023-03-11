import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { KucunService } from '../kucun.service';

@Component({
  selector: 'app-saleandcaigou',
  templateUrl: './saleandcaigou.component.html',
  styleUrls: ['./saleandcaigou.component.scss']
})
export class SaleandcaigouComponent implements OnInit {

  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('dialog') private dialog: ModalDirective;

  constructor(public settings: SettingsService, private kucunapi: KucunService, private datepipe: DatePipe) {
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
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      // { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', minWidth: 80, field: 'chandi' },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', minWidth: 80, field: 'dantime' },
      { cellStyle: { 'text-align': 'center' }, headerName: '总订货量', minWidth: 80, field: 'caigouweight' },
      { cellStyle: { 'text-align': 'center' }, headerName: '工程量', minWidth: 80, field: 'gongchengweight' },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售量', minWidth: 80, field: 'saleweight' }
    ];
  }

  ngOnInit() { }

  // 获取网格中的数据
  listDetail() {
    // 从服务器获取数据赋值给网格
    this.kucunapi.getSaleAndCaigou(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    })
  }
  show() {
    this.dialog.show();
  }
  coles() {
    this.dialog.hide();
  }
  selectfors($event) {
    console.log(this.datepipe.transform($event, 'y-MM-dd'));
    this.search['start'] = this.datepipe.transform($event, 'y-MM-dd');
  }

  selectfore($event) {
    console.log(this.datepipe.transform($event, 'y-MM-dd'));
    this.search['end'] = this.datepipe.transform($event, 'y-MM-dd');
  }
  select() {
    console.log(this.search);
    if (!this.search['start']) {
      return;
    }
    if (!this.search['end']) {
      return;
    }
    this.listDetail();
    this.coles();
  }


}
