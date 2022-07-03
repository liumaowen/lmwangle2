import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { ToasterService } from 'angular2-toaster';
import { ActivatedRoute } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-xstuihuodetail',
  templateUrl: './xstuihuodetail.component.html',
  styleUrls: ['./xstuihuodetail.component.scss']
})
export class XstuihuodetailComponent implements OnInit {

  // 控制页面按钮显示与否
  showflag: any = {};
  xstuihuo: any = {};

  gridOptions: GridOptions;

  feegridOptions: GridOptions;

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  constructor(public settings: SettingsService, private route: ActivatedRoute, private toast: ToasterService, private storage: StorageService, private tihuoApi: XiaoshouapiService, private router: Router) {

    // 设置临调明细表
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
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.feegridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.feegridOptions.onGridReady = this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.feegridOptions.groupSuppressAutoColumn = this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '退货单位', field: 'buyer.name', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', width: 260 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'xstuihuo.cangku.name', width: 100 },
      { cellStyle: { 'text-align': 'right' }, headerName: '定价', field: 'price', width: 90,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'pertprice', width: 90,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '费用单价', field: 'feeprice', width: 90,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'cuser.realname', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'xstuihuo.cdate', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 100 }
    ];

    this.feegridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', cellRenderer: 'group', width: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 120,
        cellRenderer: (params) => {
          if (params.data.type == 1) {
            return '汽运费';
          } else if (params.data.type == 2) {
            return '铁运费';
          } else if (params.data.type == 3) {
            return '船运费';
          } else if (params.data.type == 4) {
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
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', width: 90,
        cellRenderer: (params) => {
          if (params.data.accountdirection === 1) {
            return '采购';
          } else if (params.data.accountdirection === 2) {
            return '销售';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', width: 90,
        cellRenderer: (params) => {
          if (params.data.payorreceive === 1) {
            return '应付';
          } else if (params.data.payorreceive === 2) {
            return '应收';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100,
      valueFormatter: this.settings.valueFormatter3},
      { cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 100,
      valueFormatter: this.settings.valueFormatter2},
      { cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 120,
      valueFormatter: this.settings.valueFormatter2},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', width: 120,
        cellRenderer: (params) => {
          if (params.data.group) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.group) {
            sweetalert({
              title: '你确定要删除吗',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.tihuoApi.removeTuihuofee({ feecollectid: params.data.group }).then((response) => {
                this.toast.pop('success', '删除成功！！！');
                this.listTuihuoFeeDetail();
              });
              sweetalert.close();
            })
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 120 }
    ];

    this.listDetail();
    this.listTuihuoFeeDetail();

  }

  ngOnInit() {
  }

  listDetail() {
    this.tihuoApi.getxstuihuo(this.route.params['value']['id']).then((response) => {
      this.xstuihuo = response['xstuihuo'];
      if (this.xstuihuo.status === 1) {
        this.showflag.verify = true;
      } else {
        this.showflag.verify = false;
      }
      if (this.xstuihuo.status === 1 && this.xstuihuo.vuserid === this.current.id) {
        this.showflag.shenhe = true;
      } else {
        this.showflag.shenhe = false;
      }
      this.gridOptions.api.setRowData(response['list']);

    });
  }

  listTuihuoFeeDetail() {
    this.tihuoApi.listTuihuoFeeDetail({ tuihuoid: this.route.params['value']['id'] }).then((response) => {
      console.log(response);
      this.feegridOptions.api.setRowData(response);
    });
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;

  showDialog() {
    this.classicModal.show();
  }
  hideDialog() {
    this.classicModal.hide();
  }
  // 添加费用
  fee = {};
  companyProduce = [];

  detids = [];

  tweight = null;
  addFeeDialog() {
    this.fee = {};
    this.companyProduce = [];
    this.detids = new Array();
    let xstuihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];// 获取选中的提货单明细。
    let weight = '0';
    for (let i = 0; i < xstuihuodets.length; i++) {
      if (xstuihuodets[i].selected) {
        weight = weight['add'](xstuihuodets[i].data.weight);
        this.detids.push(xstuihuodets[i].data.id);
      }
    }
    if (this.detids.length <= 0) {
      this.toast.pop('warning', '请选择添加费用的货物');
      // Notify.alert('请选择添加费用 的货物', { status: 'warning' });
      return '';
    }
    this.tweight = weight;
    this.fee['tweight'] = weight;
    //this.fee['accountdirection'] = 2;
    //this.fee['payorreceive'] = 1;
    this.showDialog();
  }

  companyOfProduce;
  createFee() {    
    if (!this.fee['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if (!this.fee['accountdirection']) {
      this.toast.pop('warning', '请选择费用方向！');
      return '';
    }
    if (!this.fee['price']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    if (!this.fee['payorreceive']) {
      this.toast.pop('warning', '请选择应付或者应收！');
      return '';
    }
    if (!this.companyOfProduce['code']) {
      this.toast.pop('warning', '请选择费用单位！');
      return '';
    }
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    this.fee['idList'] = this.detids;
    this.tihuoApi.createTuihuoFee(this.fee).then(() => {
      this.hideDialog();
      this.toast.pop('success', '费用添加成功');
      this.listTuihuoFeeDetail();
    });
  }

  // 判断所选费用是不是加工费
  expression = true;

  modifytweight() {
    if (this.fee['type'] === 5 || this.fee['type'] === 6) {
      this.expression = false;
    } else {
      this.fee['tweight'] = this.tweight
      this.fee['price'] = null;
      this.fee['jine'] = null;
      this.expression = true;
      return '';
    }
  }

  // 通过单价获取金额
  getjine() {
    if (!this.fee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    this.fee['jine'] = this.fee['tweight']['mul'](this.fee['price']);
  }

  // 通过金额获取单价
  getprice() {
    if (!this.fee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      // Notify.alert("请填写重量", { status: 'warning' });
      return '';
    }
    this.fee['price'] = this.fee['jine']['div'](this.fee['tweight']);
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering
  feetype = [{ label: '请选择', value: '' }, { label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 }, { label: '出库费', value: 4 }, { label: '开平费', value: 5 }, { label: '纵剪费', value: 6 }, { label: '销售运杂费', value: 7 }, { label: '包装费', value: 8 }, { label: '仓储费', value: 9 }];

  verify(id) {
    if (confirm('销售退货单审核之后无法撤销，你确定审核吗？')) {
      this.tihuoApi.verify(id).then(() => {
        this.toast.pop('success', '审核成功');
        this.router.navigateByUrl('xstuihuo');
      });
    }
  }

  remove(id) {
    if (confirm('你确定删除这个销售退货单吗？')) {
      this.tihuoApi.removexstuihuo(id).then(() => {
        // Notify.alert('删除成功', { status: 'success' });
        // $state.go('app.xstuihuo');
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('xstuihuo');
      });
    }
  }
   /**修改 */
   modify() {
    this.tihuoApi.xstuihuoupdate(this.xstuihuo).then(data => {
      this.listDetail();
    });
  }
}
