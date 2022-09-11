import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ExamapiService } from 'app/layout/exam/examapi.service';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-dailyprice',
  templateUrl: './dailyprice.component.html',
  styleUrls: ['./dailyprice.component.scss']
})
export class DailypriceComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('priceAddModal') private priceAddModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  chandioptions1: any = [];
  isshowInput = false;
  filterConditionObj = {};
  gridOptions: GridOptions;
  search: Object = { name: '' };
  gnchandis: any[];
  params: any = { price: null, chandi: '', gn: '' };
  mygnchandis = [];
  orgid: any;
  flag = 0;
  constructor(private toast: ToasterService, public settings: SettingsService, private caigouApi: CaigouService,
    private datepipe: DatePipe,
    public examapiService: ExamapiService,
  ) {
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
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: 'id', field: 'id', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '时间', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', minWidth: 80 ,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '责任人', field: 'realname', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 60, enableRowGroup: true,
        cellRenderer: (params) => {
          return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗？')) {
            this.caigouApi.deletepricechart(params.data.id).then(data => {
              this.toast.pop('success', '操作成功');
              this.query();
            });
          }
        }
      },
    ];
  }

  ngOnInit() {
    this.caigouApi.getchandi().then(data => {
      this.gnchandis = data;
    });
  }
  openquery() {
    this.search = { name: '' };
    this.chandioptions = [];
    this.classicModal.show();
  }
  query() {
    console.log(this.search);
    if (!this.search['sdate']) {
      this.toast.pop('warning', '请选择开始日期');
      return;
    } else {
      this.search['sdate'] = this.datepipe.transform(this.search['sdate'], 'y-MM-dd');
    }
    if (!this.search['edate']) {
      this.toast.pop('warning', '请选择结束日期');
      return;
    } else {
      this.search['edate'] = this.datepipe.transform(this.search['edate'], 'y-MM-dd');
    }
    this.caigouApi.pricechartlist(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }
  selectegangchang(e) {
    console.log(e);
    this.params.chandiid = e.id;
    this.params.chandi = e.text;
  }
  close() {
    this.classicModal.hide();
  }
  addpricewindow() {
    this.priceAddModal.show();
  }
  closepricewindow() {
    this.priceAddModal.hide();
  }
  /**创建 */
  ceateModel() {
    if (!this.params.cdate) {
      this.toast.pop('warning', '请选择日期');
      return;
    }
    if (!this.params.chandi) {
      this.toast.pop('warning', '请选择产地');
      return;
    }
    if (!this.params.price) {
      this.toast.pop('warning', '请输入价格');
      return;
    }
    this.params.cdate = this.datepipe.transform(this.params.cdate, 'y-MM-dd');
    if (this.mygnchandis.length <= 0) {
      this.toast.pop('warning', '请添加明细');
      return;
    }
    this.examapiService.saveprice({ mygnchandi: this.mygnchandis, cdate: this.params.cdate }).then(data => {
      this.toast.pop('success', '添加成功！');
      this.closepricewindow();
    });
  }
  deletegnchandi(i) {
    this.mygnchandis.splice(i); // 删除重复的
  }
  addpricetodb() {
    if (!this.params.chandi) {
      this.toast.pop('warning', '请选择产地');
      return;
    }
    if (!this.params.price) {
      this.toast.pop('warning', '请输入价格');
      return;
    }
    let istwochandi = false;
    this.mygnchandis.forEach(e => {
      if (this.params.chandi === e.chandi && this.params.gn === e.gn) {
        istwochandi = true;
      }
    });
    if (istwochandi) {
      this.toast.pop('warning', '不允许添加相同产地价格多次！！！');
      return;
    }
    this.mygnchandis.push({ chandi: this.params.chandi, gn: this.params.gn, price: this.params.price });
    this.isshowInput = !this.isshowInput;
  }
  showInput() {
    this.isshowInput = !this.isshowInput;
    this.params.chandi = '';
    this.params.gn = '';
    this.params.price = null;
    this.chandioptions1 = [];
  }
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  showselectgn(flag) {
    this.flag = flag;
    this.mdmgndialog.show();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    if (this.flag === 0) {
        this.chandioptions = [];
        for (let index = 0; index < attrs.length; index++) {
          const element = attrs[index];
          if (element['value'] === 'chandi') {
            this.chandioptions = element['options'];
            break;
          }
        }
        this.search['gn'] = item.itemname;
        if (this.chandioptions.length) {
          this.search['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
        }
    } else if (this.flag === 1) {
        this.chandioptions1 = [];
        for (let index = 0; index < attrs.length; index++) {
          const element = attrs[index];
          if (element['value'] === 'chandi') {
            this.chandioptions1 = element['options'];
            break;
          }
        }
        this.params['gn'] = item.itemname;
        if (this.chandioptions1.length) {
          this.params['chandi'] = this.chandioptions1[this.chandioptions1.length - 1]['value'];
        } 
    }
  }

}
