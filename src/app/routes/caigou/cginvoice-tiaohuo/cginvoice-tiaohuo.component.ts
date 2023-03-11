import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CaigouService } from '../caigou.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';

@Component({
  selector: 'app-cginvoice-tiaohuo',
  templateUrl: './cginvoice-tiaohuo.component.html',
  styleUrls: ['./cginvoice-tiaohuo.component.scss']
})
export class CginvoiceTiaohuoComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  // aggird表格原型
  gridOptions: GridOptions;
  search: object = { supplierid: '', gn: '', orgid: '' };
  gns;
  constructor(public settings: SettingsService, private caigouApi: CaigouService, private classifyApi: ClassifyApiService) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      // { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 80,
      //   valueGetter: (params) => {
      //     if (params.data && params.data['billno']) {
      //       return params.data['billno'];
      //     } else {
      //       return '合计';
      //     }
      //   }
      // },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂负责人', field: 'gcleader', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建日期', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '到票日期', field: 'dpdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '超期天数', field: 'chaoqi', minWidth: 150 },
      
    ];
    this.querydata();
  }

  ngOnInit() {
  }
  querydata() {
    this.caigouApi.cginvoicetiaohuo().then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  showDialog() {
    this.search = { supplierid: '', gn: '', orgid: '' };
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      console.log('gns11', this.gns);
    });
    this.classicModal.show();
  }
  selectedgn(value) {
    this.search['gn'] = value.id;
  }
  query() {
    if (this.search['supplierid'] instanceof Object) {
      this.search['supplierid'] = this.search['supplierid'].code;
    }
    this.querydata();
    this.hideDialog();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '调货未到票明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
