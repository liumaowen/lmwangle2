import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from '../orderapi.service';

@Component({
  selector: 'app-neicaigoufapiaoreporter',
  templateUrl: './neicaigoufapiaoreporter.component.html',
  styleUrls: ['./neicaigoufapiaoreporter.component.scss']
})
export class NeicaigoufapiaoreporterComponent implements OnInit {
  gridOptions: GridOptions;

  constructor(private orderApi: OrderapiService, public settings: SettingsService,
    private toast: ToasterService, private router: Router, private datepipe: DatePipe,
    private customerApi: CustomerapiService) {

    this.start = new Date(); // 设定页面开始时间默认值

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
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        cellRenderer: function (params) {
          if (params.data) {
            return '<a target="_blank" href="#/neicaigoufapiao/' + params.data.id + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单日期', field: 'cdate', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核日期', field: 'vdate', minWidth: 50 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '总数量', field: 'tweight', minWidth: 100, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '开票总金额', field: 'tjine', minWidth: 100, aggFunc: 'sum',
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'sellername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否审核', field: 'isv', minWidth: 100 }
    ];
  }

  ngOnInit() {
  }

  start;
  end;

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering
  requestparams: any = { start: '', end: '', vstart: '', vend: '', cuserid: '', vuserid: '', buyerid: '', sellerid: '' };
  listDetail() {
    this.orderApi.neicaigoufapiaoreporter(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }


  companyIsWiskind: any = [];
  @ViewChild('classicModal') private classicModal: ModalDirective;
  /**获取内部公司 */
  findWiskind() {
    this.customerApi.findwiskind().then((response) => {
      const paycustomerlists = [{ label: '请选择', value: '' }];
      for (let i = 1; i < response.length; i++) {
        if (response[i].id === 3453) {
          response.splice(i, 1);
        }
      }
      response.forEach(element => {
        paycustomerlists.push({
          label: element.name,
          value: element.id
        });
      });
      this.companyIsWiskind = paycustomerlists;
    });
  }
  openQueryDialog() {
    this.findWiskind();
    this.classicModal.show();
  }

  coles() {
    this.classicModal.hide();
  }

  // 重置条件后重选从服务端获取查询条件
  selectNull() {
    this.requestparams = { start: '', end: '', vstart: '', vend: '', cuserid: '', vuserid: '', buyerid: '', sellerid: '' };
    this.cuser = {};
    this.vuser = {};
  }
  // 通过用户模糊查询用户信息（制单人的选择）
  cuser = {};
  vuser = {};
  // 查询明细
  query() {
    if (this.requestparams['start']) {
      this.requestparams['start'] = this.datepipe.transform(this.requestparams['start'], 'yyyy-MM-dd');
    }
    if (this.requestparams['end']) {
      this.requestparams['end'] = this.datepipe.transform(this.requestparams['end'], 'yyyy-MM-dd');
    }
    if (this.requestparams['vstart']) {
      this.requestparams['vstart'] = this.datepipe.transform(this.requestparams['vstart'], 'yyyy-MM-dd');
    }
    if (this.requestparams['vend']) {
      this.requestparams['vend'] = this.datepipe.transform(this.requestparams['vend'], 'yyyy-MM-dd');
    }
    if (this.cuser['code']) {
      this.requestparams.cuserid = this.cuser['code'];
    }
    if (this.vuser['code']) {
      this.requestparams.vuserid = this.vuser['code'];
    }
    console.log(this.requestparams);
    // 设定运行查询，再清除页面data变量
    this.listDetail();
    this.coles();
  }
}
