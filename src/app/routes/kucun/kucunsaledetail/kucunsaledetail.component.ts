import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe, DecimalPipe } from '@angular/common';
import { StorageService } from './../../../dnn/service/storage.service';
import { KucunService } from './../kucun.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-kucunsaledetail',
  templateUrl: './kucunsaledetail.component.html',
  styleUrls: ['./kucunsaledetail.component.scss']
})
export class KucunsaledetailComponent implements OnInit {

  gridOptions: GridOptions;

  constructor(public settings: SettingsService, private kucunapi: KucunService, private storage: StorageService,
    private datepipe: DatePipe, private toast: ToasterService, private numpipe: DecimalPipe) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onColumnResized: (parmas) => this.memoryTable(),
      onColumnMoved: (parmas) => this.memoryTable(),
      onGridReady: () => {
        if (this.storage.getObject('permanent_kucunPosition')) {
          this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_kucunPosition'));
        }
      }
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    //设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'left' }, headerName: '品名', field: 'gn', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '地区', field: 'areaname', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '现货总量', field: 'weight', minWidth: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight'] && params.data['gn'] !== '合计') {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellClass: 'text-center', headerName: '未产', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-right text-red', headerClass: 'text-red', headerName: '本月', field: 'n_b_produce', aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['n_b_produce'] && params.data['gn'] !== '合计') {
                return Number(params.data['n_b_produce']);
              } else {
                return 0;
              }
            },
            minWidth: 80, editable: true, newValueHandler: this.newValueHandler, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right text-red', headerClass: 'text-red', headerName: '下月', field: 'n_x_produce', aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['n_x_produce'] && params.data['gn'] !== '合计') {
                return Number(params.data['n_x_produce']);
              } else {
                return 0;
              }
            },
            minWidth: 80, editable: true, newValueHandler: this.newValueHandler, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right text-red', headerClass: 'text-red', headerName: '预定', field: 'n_s_produce', aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['n_s_produce'] && params.data['gn'] !== '合计') {
                return Number(params.data['n_s_produce']);
              } else {
                return 0;
              }
            },
            minWidth: 80, editable: true, newValueHandler: this.newValueHandler, valueFormatter: this.settings.valueFormatter3
          }
        ]
      },

      {
        cellStyle: { 'text-align': 'right' }, headerName: '流通总量', field: 'all_weight', minWidth: 80, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['all_weight'] && params.data['gn'] !== '合计') {
            return Number(params.data['all_weight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellClass: 'text-center', headerName: '日销售量', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-right', headerName: '内销', field: 'd_inner_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['d_inner_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['d_inner_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '代销', field: 'd_offline_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['d_offline_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['d_offline_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '懒猫自销', field: 'd_offline_self_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['d_offline_self_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['d_offline_self_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.valueFormatter
          },
          {
            cellClass: 'text-right', headerName: '线上', field: 'd_online_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['d_online_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['d_online_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right text-red', headerClass: 'text-red', headerName: '总量', field: 'o_weight', aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['o_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['o_weight']);
              } else {
                return 0;
              }
            },
            minWidth: 70, valueFormatter: this.settings.valueFormatter3
          },
        ]
      },
      {
        cellClass: 'text-center', headerName: '月度销售量', headerClass: 'wis-ag-center',
        children: [
          {
            cellClass: 'text-right', headerName: '内销', field: 'm_inner_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_inner_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_inner_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '代销', field: 'm_offline_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_offline_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_offline_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '懒猫自销', field: 'm_offline_self_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_offline_self_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_offline_self_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '线上', field: 'm_online_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_online_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_online_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right text-red', headerClass: 'text-red', headerName: '总量', field: 'm_weight', aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_weight']);
              } else {
                return 0;
              }
            },
            minWidth: 70, valueFormatter: this.settings.valueFormatter3
          },
          {
            cellClass: 'text-right', headerName: '撤销/退货', field: 'm_revoke_weight', minWidth: 70, aggFunc: 'sum',
            valueGetter: (params) => {
              if (params.data && params.data['m_revoke_weight'] && params.data['gn'] !== '合计') {
                return Number(params.data['m_revoke_weight']);
              } else {
                return 0;
              }
            },
            valueFormatter: this.settings.valueFormatter3
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '长期库存', field: 'kulingweight', minWidth: 90, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['kulingweight'] && params.data['gn'] !== '合计') {
            return Number(params.data['kulingweight']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长期比例', field: 'ratio', minWidth: 90 }
    ];
  }

  ngOnInit() {
    this.showSaleTable();
  }

  // 查询懒猫每日销售库存
  showSaleTable() {
    this.kucunapi.showSaleTable().then(data => {
      this.gridOptions.api.setRowData(data);
    })
  }

  // 保存aggird样式大小
  memoryTable() {
    var permanent_kucunPosition = this.gridOptions.columnApi.getColumnState();
    this.storage.setObject("permanent_kucunPosition", permanent_kucunPosition);
  }


  // 获取弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;

  //库存明细表下载
  kucunSaleExport() {
    this.classicModal.show();
  }

  //定义下载传递时间
  date: Date;

  //关闭库存下载弹窗
  coles() {
    this.classicModal.hide();
  }

  //最大时间
  maxdate = new Date();

  download() {
    if (this.date) {
      this.kucunapi.lazycatsaletable({ datestr: this.datepipe.transform(this.date, 'yyyy-MM-dd') }).then(data => {
        if (data.flag) {
          open(data['msg']);
        } else {
          this.toast.pop('error', data['msg'])
        }
      });
      // open("http://gm.wiskind.cn/store/pub/kucun/lazycatsaletable?datestr="+this.datepipe.transform(this.date,'yyyy-MM-dd'));
    } else {
      this.toast.pop('warning', '请填写文件时间！')
    }
    this.coles();
  }

  //修改未产信息
  newValueHandler = (params) => {
    //要查询条件
    if (params.newValue == params.oldValue) return false;
    let num = new RegExp("^[0-9]*$");
    // if (num.test(params.newValue) || /^\d+\.?\d{0,3}$/.test(params.newValue)) {
    if (num.test(params.newValue)) {
      let search = { gn: '', chandi: '', areaid: '', newvalue: '', remark: null };
      search.chandi = params.data["chandi"];
      search.gn = params.data["gn"];
      search.areaid = params.data["areaid"];
      search['newvalue'] = params.newValue;
      if ('n_b_produce' == params.colDef["field"]) search['remark'] = 1;
      if ('n_s_produce' == params.colDef["field"]) search['remark'] = 2;
      if ('n_x_produce' == params.colDef["field"]) search['remark'] = 3;
      this.kucunapi.modifySaleTable(search).then(data => {
        this.showSaleTable();
      }).catch(data => {
        params.data[params.colDef.field] = params.oldValue;
        params.api.recomputeAggregates()
        return false
      })
      return false
    } else {
      this.toast.pop("warning", "格式不正确，请填写整数");
      return false
    }
  }

  // aggird保留整数
  valueFormatter = (params) => {
    try {
      return this.numpipe.transform(params.value, '1.0-0')
    } catch (error) {
      return null
    }
  }

}
