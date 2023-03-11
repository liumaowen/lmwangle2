import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { FeefukuanapiService } from './../../../routes/fee/feefukuanapi.service';
import { ColDef, GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feeimplist',
  templateUrl: './feeimplist.component.html',
  styleUrls: ['./feeimplist.component.scss']
})
export class FeeimplistComponent implements OnInit {

  flag = { next: true, import: false };

  msgshow = { weight: 0, jine: 0, msg: '' };

  // 接收父页面传过来的值
  parentThis;

  gridOptions: GridOptions;
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService,
    private feefukuanApi: FeefukuanapiService, private toast: ToasterService,
    private router: Router) {
    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: (params) => {
        if (this.flag.next) {
          if (params.node['selected']) {
            this.msgshow.weight = this.msgshow.weight['add'](params.node.data.weight);
            this.msgshow.jine =
              this.msgshow.jine['add'](params.node.data.jine['sub'](params.node.data.impjine ? params.node.data.impjine : '0'));
          } else {
            this.msgshow.weight = this.msgshow['weight']['sub'](params.node.data['weight']);
            this.msgshow.jine =
              this.msgshow.jine['sub'](params.node.data.jine['sub'](params.node.data.impjine ? params.node.data.impjine : '0'));
          }
          this.msgshow.msg = '共选中了' + this.msgshow.weight + '吨，' + this.msgshow.jine['fmoney'](2, 1) + '元';
          // $scope.$apply();
        }
      },
      onCellValueChanged: (params) => {
        this.msgshow.jine = this.msgshow.jine['sub'](params.oldValue).add(params.newValue);
        this.msgshow.msg = '共选中了' + this.msgshow.jine + '元';
        // $scope.$apply();
      },
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
    };

    this.gridOptions.columnDefs = [
      { headerName: 'id', field: 'id', width: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '实际单位', field: 'actualfeecustomername', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '付款单位', field: 'paycustomer', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务单位', field: 'yewudanwei', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 100,
        cellRenderer: (params) => {
          if (params.data.type === 1) {
            return '汽运费';
          } else if (params.data.type === 2) {
            return '铁运费';
          } else if (params.data.type === 3) {
            return '船运费';
          } else if (params.data.type === 4) {
            return '出库费';
          } else if (params.data.type === 5) {
            return '开平费';
          } else if (params.data.type === 6) {
            return '纵剪费';
          } else if (params.data.type === 7) {
            return '销售运杂费';
          } else if (params.data.type === 8) {
            return '包装费';
          } else if (params.data.type === 9) {
            return '仓储费';
          } else if (params.data.type === 10) {
            return '保险费';
          } else if (params.data.type === 11) {
            return '押车费';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单据编号', field: 'billno', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流约车单编号', field: 'matchcarbillno', minWidth: 120,
        cellRenderer: (params) => {
          if (params.data && params.data.matchcarid) {
            return '<a target="_blank" href="#/matchcar/detail/' + params.data.matchcarid + '">' + params.data.matchcarbillno + '</a>';
          }
        }, colId: 'matchcarbillno'
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '物流员', field: 'wuliuusername', minWidth: 80, colId: 'wuliuusername' },
      { cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startaddr', minWidth: 80, colId: 'startaddr' },
      { cellStyle: { 'text-align': 'center' }, headerName: '目的地', field: 'endaddr', minWidth: 80, colId: 'endaddr' },
      { cellStyle: { 'text-align': 'center' }, headerName: '约车单创建时间', field: 'matchcarcdate', minWidth: 100, colId: 'matchcarcdate' },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实付单价', field: 'innerprice', minWidth: 90,
        valueGetter: (params) => {
          if (params.data && params.data['innerprice']) {
            return Number(params.data['innerprice']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2, colId: 'innerprice'
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '实付金额', field: 'innerjine', minWidth: 90,
        valueGetter: (params) => {
          if (params.data && params.data['innerjine']) {
            return Number(params.data['innerjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2, colId: 'innerjine'
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已付金额', field: 'yijine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '已引用金额', field: 'impjine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">本次付金额</font>', field: 'benjine', width: 90, editable: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return null;
          } else {
            return params.value;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '单据类型', field: 'billtype', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 90 },

      { cellStyle: { 'text-align': 'center' }, headerName: '单据id', field: 'billid', width: 100 }
    ];
    this.getMyRole();

    setTimeout(() => {
      this.listfee();
    }, 500);
  }

  ngOnInit() {
  }

  // 获取显示的数据
  listfee() {
    this.feefukuanApi.improtFee({
      //feeorgid: this.parentThis['feefukuan'].feeorgid,
      feecustomerid: this.parentThis['feefukuan'].feecustomerid,
      paycustomerid: this.parentThis['feefukuan'].paycustomerid
    }).then((response) => {
      console.log(response);
      this.gridOptions.api.setRowData(response);
    });
  }
  // 获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    this.gridOptions.columnDefs.forEach((colde: ColDef) => {
      // 如果登陆的用户是业务员，设置为不可见
      if (myrole.some(item => item === 10)) {
        if (colde.colId === 'innerjine' || colde.colId === 'innerprice') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
      // 如果登陆的用户是非物流员，设置为不可见
      if (!myrole.some(item => item === 9 || item === 1)) {
        if (colde.colId === 'matchcarbillno' || colde.colId === 'wuliuusername' || colde.colId === 'startaddr'
          || colde.colId === 'endaddr' || colde.colId === 'matchcarcdate') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      }
    });
  }
  // 点击执行下一步
  next() {
    let ids = new Array();
    let feecollects = this.gridOptions.api.getModel()['rowsToDisplay'];
    console.log(feecollects);
    for (let i = 0; i < feecollects.length; i++) {
      if (feecollects[i].selected) {
        ids.push(feecollects[i].data.id);
      }
    }
    console.log(ids);
    if (ids.length == 0) {
      this.toast.pop('warning', '请选择要编辑的费用!');
      return;
    }
    this.feefukuanApi.getImpFee({ ids: ids }).then((response) => {
      this.flag = { next: false, import: true };
      this.gridOptions.api.setRowData(response);
    });
  }

  // 费用引入数据
  importFee() {
    let fees = this.gridOptions.api.getModel()['rowsToDisplay'];
    let impdata = new Array();
    for (let i = 0; i < fees.length; i++) {
      if (!fees[i].data.impjine) {
        fees[i].data.impjine = '0';
      }
      if (fees[i].data.benjine.add(fees[i].data.impjine) > fees[i].data.jine) {
        this.toast.pop('warning', '本次应付金额填写不允许！');
        return;
      }
      let obj = {};
      obj['id'] = fees[i].data.id;
      obj['benjine'] = fees[i].data.benjine;
      obj['yewudanwei'] = fees[i].data.yewudanwei;
      impdata.push(obj);
    }
    this.feefukuanApi.addFeefukuanDet({ feefukuanid: this.parentThis['feefukuan'].id, list: impdata }).then((response) => {
      // $scope.$emit('feefukuan', response);//向父页面传递所引入的数据
      this.parentThis.feeFuKuan();
    });
  }

  // 全部选择
  checkAll() {
    this.gridOptions.api.selectAll();
  }

}
