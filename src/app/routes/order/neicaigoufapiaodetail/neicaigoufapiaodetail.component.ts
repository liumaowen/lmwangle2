import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { StorageService } from 'app/dnn/service/storage.service';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { OrderapiService } from '../orderapi.service';

@Component({
  selector: 'app-neicaigoufapiaodetail',
  templateUrl: './neicaigoufapiaodetail.component.html',
  styleUrls: ['./neicaigoufapiaodetail.component.scss']
})
export class NeicaigoufapiaodetailComponent implements OnInit {

  neicaigoufapiao: any = {};
  detparams: any = {};
  gnlists: any = [];
  gridOptions: GridOptions;
  suser;
  ssuser;
  customer = {};
  // 获取当前用户
  current = this.storage.getObject('cuser');

  // 控制是否显示按钮
  flag = {};


  sprice = {};

  saleList = new Array();

  constructor(public settings: SettingsService, private toast: ToasterService,
    private route: ActivatedRoute, private storage: StorageService, private orderApi: OrderapiService,
    private modalService: BsModalService, private router: Router, private classifyApi: ClassifyApiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 40, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', aggFunc: 'sum', width: 30,
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'price', width: 40 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', width: 40, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '单吨(加减)价', field: 'fapiaochae', width: 40 },
      { cellStyle: { 'text-align': 'center' }, headerName: '开票单价', field: 'fapiaoprice', width: 40 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '开票金额', field: 'fapiaojine', width: 50, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['fapiaojine']) {
            return Number(params.data['fapiaojine']);
          } else {
            return 0;
          }
        },
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', width: 50,
        cellRenderer: (params) => {
          if (params.data) {
            if (params.data.del) {
              return '<a target="_blank">删除</a>';
            } else {
              return '';
            }
          }
        },
        onCellClicked: (params) => {
          if (params.data) {
            if (params.data.del) {
              if (confirm('你确定要删除吗？')) {
                this.orderApi.deldetail(params.data.id).then((response) => {
                  this.listDetail();
                });
              }
            }
          }
        }
      }
    ];


  }

  ngOnInit() {
    this.listDetail();
  }

  // 获取aggird 表格
  listDetail() {
    console.log(this.route.params['value']);
    this.orderApi.getDetailAndList(this.route.params['value']['id']).then(data => {
      this.neicaigoufapiao = data.neicaigoufapiao;
      this.gridOptions.api.setRowData(data.list);
    });
  }
  removebill() {
    if (confirm('你确定要删除吗？')) {
      this.orderApi.delmodel(this.route.params['value']['id']).then(data => {
        this.router.navigateByUrl('saledetreport');
      });
    }
  }
  // 修改开票品名和发票号
  @ViewChild('detmodifyModal') private detmodifyModal: ModalDirective;
  impdata: any = [];
  showDetmodify() {
    let gn = null;
    this.impdata = [];
    const saleshourudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < saleshourudets.length; i++) {
      if (saleshourudets[i].data && saleshourudets[i].selected) {
        console.log(saleshourudets[i].data);
        if (!gn) {
          gn = saleshourudets[i].data.originalgn;
        } else if (gn !== saleshourudets[i].data.gnid) {
          this.toast.pop('warning', '请选择相同的品名进行修改！！！');
          return;
        }
        this.impdata.push(saleshourudets[i].data.id);
      }
    }
    if (!gn) {
      this.toast.pop('warning', '请选择明细！！');
      return;
    }
    this.classifyApi.getsalebill({ pid: gn }).then((data) => {
      this.gnlists = [];
      data.forEach(element => {
        this.gnlists.push({
          label: element['label'],
          value: element['label']
        });
      });
      this.detparams['gn'] = this.gnlists[0].value;
    });
    this.detmodifyModal.show();
  }
  hideDetmodify() {
    this.detmodifyModal.hide();
  }
  modifydetail() {
    this.detparams.list = this.impdata;
    this.orderApi.modifyNeicaigoufapiaoDetails(this.detparams).then(data => {
      this.toast.pop('success', '修改成功');
      this.hideDetmodify();
      this.listDetail();
    });
  }
  resetparams() {
    this.detparams = {};
  }
  // 提交审核
  submitVuser() {
    if (confirm('你确定要提交审核吗？')) {
      this.orderApi.submitNeicaigoufapiaoVuser(this.route.params['value']['id'], {}).then(data => {
        this.toast.pop('success', '提交审核成功');
        this.listDetail();
      });
    }
  }
  // 审核按钮
  verifybill() {
    if (confirm('你确定要审核吗？')) {
      this.orderApi.verifyNeicaigoufapiaoVuser(this.route.params['value']['id'], {}).then(data => {
        this.toast.pop('success', '审核成功');
        this.listDetail();
      });
    }
  }
  // 弃审
  cancelVerify() {
    if (confirm('你确定要弃核吗？')) {
      this.orderApi.cancelverify(this.route.params['value']['id'], {}).then(data => {
        this.toast.pop('success', '弃审成功');
        this.listDetail();
      });
    }
  }
  detailBatchDel() {
    const saleshourudets = this.gridOptions.api.getModel()['rowsToDisplay'];
    if (confirm('你确定要删除吗？')) {
      let count = 0;
      for (let i = 0; i < saleshourudets.length; i++) {
        if (saleshourudets[i].data && saleshourudets[i].selected) {
          count++;
          this.orderApi.deldetail(saleshourudets[i].data.id).then((response) => {
            this.toast.pop('success', '删除成功！');
          });
        }
      }
      if (count === 0) {
        this.toast.pop('warning', '请选择要删除的明细！');
        return;
      }
      this.listDetail();
    }
  }

}
