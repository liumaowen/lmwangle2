import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-salebillcount',
  templateUrl: './salebillcount.component.html',
  styleUrls: ['./salebillcount.component.scss']
})
export class SalebillcountComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  querys = { isonline: '', orgid: '' };
  gridOptions: GridOptions;
  constructor(public settings: SettingsService, private storage: StorageService, private orderApi: OrderapiService,
    private toast: ToasterService, private classifyApi: ClassifyApiService) {
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
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true
    };
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 72, pinned: 'left',
        checkboxSelection: (params) => params.data, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'orderbill', width: 100,
        cellRenderer: (params) => {
          if (params.data) {
            return params.data.orderbill;
          } else {
            return '合计';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'maifangname', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卖方单位', field: 'seller', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'wguige', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'tjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['tjine']);
          } else {
            return '';
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 60,
        cellRenderer: (params) => {
          if (params.data && null != params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          }
          return '';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购单位', field: 'cgcustomer', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'saleman', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提时间', field: 'stdate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售时间', field: 'saledate', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '标记未开票收入', field: 'weikaipiaoshouru', width: 150 }
    ];
    this.kaipiaoList();
  }
  kaipiaoList() {
    this.orderApi.querykaipiaocount(this.querys).then((data) => {
      console.log('kaipiao', data);
      this.gridOptions.api.setRowData(data);
    });
  }
  ngOnInit() {
  }
  queryDialog() {
    this.querys = { isonline: '', orgid: '' };
    this.showclassicModal();
  }
  query() {
    this.orderApi.querykaipiaocount(this.querys).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
    this.hideclassicModal();
  }
  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
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
      fileName: '销售未开票明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  // 标记是否未开票收入
  markWeikaipiao() {
    let impdata = new Array();
    const weifapiaos = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < weifapiaos.length; i++) {
      if (weifapiaos[i].data && weifapiaos[i].selected) {
        impdata.push(weifapiaos[i].data);
      }
    }
    if (impdata.length === 0) {
      this.toast.pop('warning', '请选择销售未开票明细！！！');
      return;
    }
    console.log(impdata);
    if (confirm('你确定要标记为未开票收入吗？')) {
      this.orderApi.setweikaipiaoshouru({ list: impdata }).then(data => {
        this.toast.pop('success', '标记成功！！！');
      });
    }
  }
  // 是否生成凭证
  makepingzheng() {
    if ('你确定要对标记的明细生成未开票收入凭证吗？') {
      this.orderApi.makepingzheng().then(data => {
        this.toast.pop('success', '凭证生成完成，请在钉钉群中查看信息！！！');
      });
    }
  }


}
