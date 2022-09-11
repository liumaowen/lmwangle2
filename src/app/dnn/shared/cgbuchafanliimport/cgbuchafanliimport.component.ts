import { CgbuchaModule } from './../../../routes/cgbucha/cgbucha.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DecimalPipe, DatePipe } from '@angular/common';
import { StorageService } from './../../service/storage.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CaigouService } from '../../../routes/caigou/caigou.service';
import { CgbuchaapiService } from '../../../routes/cgbucha/cgbuchaapi.service';

@Component({
  selector: 'app-cgbuchafanliimport',
  templateUrl: './cgbuchafanliimport.component.html',
  styleUrls: ['./cgbuchafanliimport.component.scss']
})
export class CgbuchafanliimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  gridOptions: GridOptions;
  parentthis;
  saledet: object = { id: null, detids: [] };
  search = {start: '', end: '', chandi: '',gn: '', supplierid: '',grno:''};
  start: Date;
  end: Date;
  gangchangs: any[];
  chandioptions: any = [];
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService,
    private toast: ToasterService, private classifyApi: ClassifyApiService, private datepipe: DatePipe,
    private cgbuchaApi: CgbuchaapiService, private caigouApi: CaigouService) {
      this.gridOptions = {
        groupDefaultExpanded: -1,
        suppressAggFuncInHeader: true,
        enableRangeSelection: true,
        rowDeselection: true,
        rowSelection: "multiple",
        overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
        overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
        enableColResize: true,
        enableSorting: true,
        excelStyles: this.settings.excelStyles,
        enableFilter: true,
        localeText: this.settings.LOCALETEXT,
        animateRows: true,
        getContextMenuItems: this.settings.getContextMenuItems,
        getNodeChildDetails: (params) => {
            if (params.group) {
              return {
                group: true,
                expanded: null != params.group,
                children: params.participants,
                field: 'group',
                key: params.group
              };
            } else {
              return null;
            }
        },
        groupSelectsChildren: true // 分组可全选
      };
      this.gridOptions.groupSuppressAutoColumn = true;
      this.gridOptions.onGridReady = this.settings.onGridReady;
      // 设置aggird表格列
      this.gridOptions.columnDefs = [
        { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'group', cellRenderer: 'group', minWidth: 40, checkboxSelection: true,headerCheckboxSelection: true },
        {
            cellStyle: { 'text-align': 'center' }, headerName: '采购合同号', field: 'billno', minWidth: 90,
            cellRenderer: (params) => {
              if (params.data && params.data.billno) {
                return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
              } else {
                return '';
              }
            }
        },
        {
            cellStyle: { 'text-align': 'center' }, headerName: '入库单号', field: 'rukubillno', minWidth: 90,
            cellRenderer: (params) => {
              if (params.data && params.data.rukubillno) {
                return '<a target="_blank" href="#/ruku/' + params.data.rukubillid + '">' + params.data.rukubillno + '</a>';
              } else {
                return '';
              }
            }
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 100},
        { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'rukudate', minWidth: 125},
        { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 150 },
        { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '返利类型', field: 'youhuitype', minWidth: 90},
        {
            cellStyle: { 'text-align': 'center' }, headerName: '出货量', field: 'chuhuoweight', minWidth: 90,
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['chuhuoweight']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
        // { cellStyle: { 'text-align': 'right' }, headerName: '享受补贴量（吨）', field: 'weight', minWidth: 100 },
        // { cellStyle: { 'text-align': 'right' }, headerName: '补贴单价', field: 'price', minWidth: 80 },
        { cellStyle: { 'text-align': 'right' }, headerName: '预估返利金额', field: 'yugufanlijine', minWidth: 100 },
        { cellStyle: { 'text-align': 'right' }, headerName: '已补差金额', field: 'ybuchajine', minWidth: 100 },
        { cellStyle: { 'text-align': 'right' }, headerName: '未补差金额', field: 'wbuchajine', minWidth: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '返利id', field: 'id', minWidth: 60 }
      ];
    }

  ngOnInit() {
  }
  openquery() {
    this.selectNull();
    // this.caigouApi.getchandi().then(data => {
    //   this.gangchangs = data;
    // });
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = {start: '', end: '', chandi: '',gn: '',supplierid: '',grno:'' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    this.search['supplierid'] = this.parentthis.caigouModel['supplierid'];
    if (!this.search['start']) {
      this.toast.pop('error', '请选择开始月份！', '');
      return;
    }
    if (!this.search['end']) {
      this.toast.pop('error', '请选择结束月份！', '');
      return;
    }
    if (this.start > this.end) {
      this.toast.pop('error', '开始月份大于结束月份，请重新选择！', '');
      return;
    }
    this.caigouApi.getfanidetgroup(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.classicModal.hide();
  }
  selectstartmonth(value) {
    this.start = value.getTime();
    this.search['start'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectendmonth(value) {
    this.end = value.getTime();
    this.search['end'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 引入
  import() {
    this.saledet['detids'] = [];
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].isSelected() && selected[i].data['rukudetid']) {
        // if (Number(selected[i].data['wbuchajine'])<=0) {
        //     this.toast.pop('error', '资源号：'+selected[i].data['grno']+'，未补差金额小于或等于0！');
        //     return;
        // }
        this.saledet['detids'].push({fanlidetid:selected[i].data.fanlidetid,rukudetid:selected[i].data.rukudetid});
      }
    };
    this.saledet['id'] = this.parentthis.caigouModel.id;
    if (!this.saledet['detids'].length) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.cgbuchaApi.importfanli(this.saledet).then(data => {
      this.parentthis.querydata();
    });
    this.bsModalRef.hide();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
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
      this.search['chandi'] = this.chandioptions[0]['value'];
    }
  }
}
