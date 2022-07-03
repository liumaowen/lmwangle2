import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { ReportService } from '../report.service';
import { GridOptions } from 'ag-grid';

@Component({
  selector: 'app-kucunstatistics',
  templateUrl: './kucunstatistics.component.html',
  styleUrls: ['./kucunstatistics.component.scss']
})
export class KucunstatisticsComponent implements OnInit {

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private reportService: ReportService) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 57,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存量', field: 'zaikuweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未产量', field: 'weichanweight', minWidth: 60 },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '年度月均销量', field: 'yearsaleweight', minWidth: 60,
         valueFormatter: this.settings.valueFormatter3
      },
      { 
         cellStyle: { 'text-align': 'center' }, headerName: '季度月均销量', field: 'monthsaleweight', minWidth: 60, 
         valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '推荐下单量', field: 'yuguweight', minWidth: 60 }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.reportService.getkucunstatistics().then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }

}
