import {GridOptions} from 'ag-grid/main';
import {ModalDirective} from 'ngx-bootstrap';
import {SettingsService} from '../../../core/settings/settings.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {XmdGoodscodeService} from './xmdgoodscode.service';

@Component({
  selector: 'app-xmdgoodscode',
  templateUrl: './xmdgoodscode.component.html',
  styleUrls: ['./xmdgoodscode.component.scss']
})
export class XmdGoodscodeComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  maxDate = new Date();
  requestparams: any = {
    mdmno: '',
  };

  gridOptions: GridOptions;

  constructor(public settings: SettingsService,
              private xmdgcApi: XmdGoodscodeService) {

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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {cellStyle: {'text-align': 'center'}, headerName: '物料编码', field: 'id', width: 100},
      {cellStyle: {'text-align': 'center'}, headerName: '品名', field: 'gn', width: 80},
      {cellStyle: {'text-align': 'center'}, headerName: '产地', field: 'chandi', width: 75},
      {cellStyle: {'text-align': 'center'}, headerName: '宽度', field: 'width', width: 75},
      {cellStyle: {'text-align': 'center'}, headerName: '厚度', field: 'houdu', width: 75},
      {cellStyle: {'text-align': 'center'}, headerName: '材质', field: 'caizhi', width: 75},
      {cellStyle: {'text-align': 'center'}, headerName: '颜色', field: 'color', width: 150},
      {cellStyle: {'text-align': 'center'}, headerName: '镀层', field: 'duceng', width: 75},
      {cellStyle: {'text-align': 'center'}, headerName: '表面处理', field: 'matsurfacetreatment', width: 120},
      {cellStyle: {'text-align': 'center'}, headerName: '后处理', field: 'ppro', width: 120},
      {cellStyle: {'text-align': 'center'}, headerName: '物料描述', field: 'guige', width: 380},
    ];
  }

  // 打开查询对话框
  openQueryDialog() {
    this.selectNull();
    this.showclassicModal();
  }

  // 查询发票
  query() {
    this.listDetail();
    this.hideclassicModal();
  }

  listDetail() {
    this.xmdgcApi.query(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data); // 网格赋值
    });
  }

  selectNull() {
    this.requestparams = {
      mdmno: ''
    };
  }

  ngOnInit() {
  }

  // 导出入库单明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '欠款明细表.xls',
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

}
