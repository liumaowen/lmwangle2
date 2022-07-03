import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'app/core/settings/settings.service';
import { QualityobjectionService } from '../../qualityobjection.service';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';

@Component({
  selector: 'app-tihuodetimport',
  templateUrl: './tihuodetimport.component.html',
  styleUrls: ['./tihuodetimport.component.scss'],
  providers: [BusinessorderapiService]
})
export class TihuodetimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  gridOptions: GridOptions;
  parentThis;
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1); // 设定页面开始时间默认值
  // 结束时间
  end: Date = new Date();
  requestparams = {billno: '', start: '', end: '', kunbaohao: '', supplierid: null};
  buyer: any; // 买方
  constructor(
    public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private qualityApi: QualityobjectionService,
    private datepipe: DatePipe,
    private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
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
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 80, checkboxSelection: true, headerCheckboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'suppliername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'sellername', width: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 260 },
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 90 ,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100 ,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 120 ,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'shitidate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90 }
    ];

  }

  ngOnInit() {
    setTimeout(() => {
      this.query();
    }, 0);
  }
  getDetail() {
    this.qualityApi.gettihuodet(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  query() {
    if (this.start) {
      this.requestparams['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.requestparams['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (this.buyer instanceof Object) {
      this.requestparams['buyerid'] = this.buyer['code'];
    } else {
      this.requestparams['buyerid'] = '';
    }
    if (this.requestparams['supplierid'] instanceof Object) {
      this.requestparams['supplierid'] = this.requestparams['supplierid'].code;
    } else {
      this.requestparams['supplierid'] = '';
    }
    this.getDetail();
    this.hideDialog();
  }

  selectNull() {
    this.start = new Date();
    this.end = new Date();
    this.requestparams = { billno: '', start: '', end: '', kunbaohao: '', supplierid: '' };
  }

  showDialog() {
    this.classicModal.show();
  }

  hideDialog() {
    this.classicModal.hide();
  }

  import() {
    const tihuodetids = new Array();
    const tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < tihuodets.length; i++) {
      if (tihuodets[i].selected) {
        tihuodetids.push(tihuodets[i].data.id);
      }
    }
    if (!tihuodetids.length) {
      this.toast.pop('warning', '请选择要引入的提单明细!');
      return;
    }
    const json = {qualityid: this.parentThis.qualityobjection.id, tihuodetids: tihuodetids};
    this.qualityApi.importtihuodet(json).then(data => {
      this.parentThis.hideimporttihuodet();
    });
  }

}
