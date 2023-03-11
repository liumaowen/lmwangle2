import { Component, OnInit, ViewChild } from '@angular/core';
import { KucunService } from '../kucun.service';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { DatePipe } from '@angular/common';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { Editor } from 'primeng/primeng';

@Component({
  selector: 'app-kucuncheck',
  templateUrl: './kucuncheck.component.html',
  styleUrls: ['./kucuncheck.component.scss']
})
export class KucuncheckComponent implements OnInit {

  @ViewChild('classicModal') classicModal: ModalDirective;
  @ViewChild('checkModal') private checkModal: ModalDirective;
  gridOptions: GridOptions;

  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: null;
  // 结束时间
  end: null;
  search: object = { start: '', end: '', kunbaohao: '', cangkuid: '' };
  constructor(private kucunApi: KucunService, public settings: SettingsService, private userapi: UserapiService, private datepipe: DatePipe,private kucunapi: KucunService, 
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
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '时间', field: 'cdate', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库库存量', field: 'weight2', minWidth: 57, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight2']) {
            return Number(params.data['weight2']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'ERP库存量', field: 'weight', minWidth: 57, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '差异', field: 'differences', minWidth: 200 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '原因', field: 'beizhu', minWidth: 150, editable: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return null;
          } else {
            return params.value;
          }
        },

        onCellValueChanged: (params) => {
          if(!params.data.id){
            return;
          }
          this.kucunApi.update({ beizhu: params.newValue, id: params.data.id }).then(data => {
            console.log(data);
            this.search['cangkuid'] = data['cangkuid'];
            this.querydata();
          });
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno2', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 100 },
    ];
  }

  ngOnInit() {
  }
  querydata() {
    this.kucunApi.find(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  ckitems;
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
    this.search = { kunbaohao: '', start: '', end: '', cangkuid: '' };
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
  uploadkucun() {
    this.checkModal.show();
  }
  hidecheckModal() {
    this.checkModal.hide();
  }
   // 设置上传的格式
   accept = ".xls, application/xls";
  uploadParam2: any = { module: 'kucuncheck', count: 1, sizemax: 1, extensions: ['xls'] };
  uploads2($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.kucunapi.check(addData).then(data => {
        if (data) {
          this.querydata();
          this.toast.pop('success', '上传成功！');
          this.hidecheckModal();
        }
      });
    }
  }
}
