import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { CaigouService } from '../caigou.service';
import { ModalDirective } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { ToasterService } from 'angular2-toaster';
import { now } from 'moment';

@Component({
  selector: 'app-cgfukuanplan',
  templateUrl: './cgfukuanplan.component.html',
  styleUrls: ['./cgfukuanplan.component.scss']
})
export class CgfukuanplanComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  search: any = {};
  gridOptions: GridOptions;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;
  @ViewChild('addCgFukuanPlanDialog') private addCgFukuanPlanDialog: ModalDirective;
  @ViewChild('updateModal') private updateModal: ModalDirective;
  gns: any[];
  chandis: any[];
  caigoutypes: any[];
  isurgent: any[];
  orgs: any[];
  saleman: any;
  params = {};
  chandiList: any[];
  palntypeList: any[];
  isshow = false;

  constructor(public settings: SettingsService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private orgApi: OrgApiService, private classifyapi: ClassifyApiService, private toast: ToasterService,) {
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
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: () => '合计' },
      // { cellStyle: { "text-align": "left" }, headerName: '选择', minWidth: 30, checkboxSelection: true, suppressMenu: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgtype', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '钢厂', field: 'chandi2', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '计划订货量', field: 'weight', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '计划付款金额', field: 'jine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '已付款', field: 'payjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['payjine']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '已付款明细', field: 'paydetbeizhu', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '未付款', field: 'nopayjine', width: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['nopayjine']);
          } else {
            return 0;
          }
        }, enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款要求', field: 'beizhu', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 100,
        cellRenderer: (params) => {
          return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗？')) {
            this.caigouApi.removePayjihua(params.data.id).then(data => {
              //this.search['month'] = this.datepipe.transform(now(), 'y-MM') + '-01';
              this.listDetail();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 100,
        cellRenderer: (params) => {
          return '<a target="_blank">更新</a>';
        },
        onCellClicked: (params) => {
          this.showupdate(params.data.id);
        }
      }
    ];
  }
  jsonpay: object = { jihuaweight: '', jihuapayjine: '', beizhu: '' };
  updatePayjihua() {
    this.jsonpay = this.params;
    if (confirm('你确定要修改吗？')) {
      this.caigouApi.updatePayjihua(this.jsonpay).then(data => {
        this.closeupdate();
        this.search['month'] = this.datepipe.transform(now(), 'y-MM') + '-01';
        this.listDetail();
      });
    }
  }
  showupdate(payjihuaid) {
    this.params = {};
    this.caigouApi.getPayjihua(payjihuaid).then(data => {
      console.log(data);
      this.params = data;
      this.updateModal.show();
    });
   
  }

  closeupdate() {
    this.updateModal.hide();
  }
  ngOnInit() {
    // this.getChandiList();

    this.getPlanTypeList();
  }

  listDetail() {
    this.caigouApi.findCgfukuanPlan(this.search).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  showgcinfodialog() {
    this.search = {};
    this.gcinfodialog.show();
  }
  closegcinfodialog() {


    this.gcinfodialog.hide();
  }
  selectmonth(value) {
    let month = this.datepipe.transform(value, 'y-MM-dd');
    this.search['month'] = month;
    this.params['month'] = month;
  }
  findCgfukuanPlan() {
    this.listDetail();
    this.closegcinfodialog();
  }

  showAddCgFukuanPlanDialog() {
    this.params = {};
    this.addCgFukuanPlanDialog.show();
  }

  closeAddCgFukuanPlanDialog() {
    this.addCgFukuanPlanDialog.hide();
  }

  // 填写采购付款计划
  addCgFukuanPlan() {
    if (!this.params['month']) {
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    if(!this.params['plantype']){
      this.toast.pop('warning', '请选择类型！！！');
      return;
    }
    if (this.params['plantype'] === '1' && !this.params['chandiid']) {
      this.toast.pop('warning', '请选择产地！！！');
      return;
    }
    if (!this.params['weight']) {
      this.toast.pop('warning', '请填写计划采购量！！！');
      return;
    }
    if (!this.params['jine']) {
      this.toast.pop('warning', '请填写计划付款金额！！！');
      return;
    }
    if (!this.params['beizhu']) {
      this.toast.pop('warning', '请填写计划付款要求！！！');
      return;
    }
    this.caigouApi.createCgfukuanPlan(this.params).then((data) => {
      if (data) {
        //
        this.listDetail();
        this.closeAddCgFukuanPlanDialog();
      }
    });
  }

  // 产地列表
  getChandiList() {
    this.caigouApi.getChandiList().then((data) => {
      if (data) {
        this.chandiList = data;
      }
    });
  }

  // 产地列表
  getPlanTypeList() {
    this.caigouApi.getPlanTypeList(13228).then((data) => {
      if (data) {
        this.palntypeList = data;
      }
    });
  }

  selectechandi(e) {
    this.params['chandiid'] = e.id;
    this.params['chandi'] = e.text;
    this.search['chandiid'] = e.id;
  }

  selectePlanType(e) {
    if (e.id === "1") {
      this.isshow = true;
    } else {
      this.isshow = false;
    }
    this.params['plantype'] = e.id;
  }
  types: any = [{ value: '', label: '请选择类型' }, { value: '1', label: '非调货' }, 
  { value: '2', label: '项目调货' }, { value: '3', label: '材料调货' }];

  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        this.chandioptions.unshift({ value: '', label: '全部' });
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[this.chandioptions.length-1]['value'];
    }
  }

}
