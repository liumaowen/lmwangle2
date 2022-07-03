import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { RukuService } from './../ruku.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { DatePipe } from '@angular/common';
import { FeeapiService } from 'app/routes/fee/feeapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-zaiturukudetail',
  templateUrl: './zaiturukudetail.component.html',
  styleUrls: ['./zaiturukudetail.component.scss']
})
export class ZaiturukudetailComponent implements OnInit {

  @ViewChild('zhuanhuoModal') private zhuanhuoModal: ModalDirective;
  // 入库单详情
  rukuModel: any = {};
  list: any = [];
  rukuid: number;
  gridOptions: GridOptions;
  huizonggridOptions: GridOptions;
  feegridOptions: GridOptions;
  // 物流竞价明细
  wuliuOffergridOptions: GridOptions; 

  bsModalRef: BsModalRef;
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  tabviewindex = 0;
  // 添加对象
  caigoufee = {};
  @ViewChild('feedialog') private feedialog: ModalDirective;
  // 添加费用按钮
  detids;
  companyOfProduce;
  companyProduce;
  constructor(private actroute: ActivatedRoute, private rukuapi: RukuService, public settings: SettingsService,
    private modalService1: BsModalService, private datepipe: DatePipe,private feeApi: FeeapiService,
    private toast: ToasterService, private route: Router) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      // getNodeChildDetails: (params) => {
      //   if (params.group) {
      //     return { group: true, children: params.list, field: 'group', key: params.group };
      //   } else {
      //     return null;
      //   }
      // },
      // onRowSelected: (params) => {
      //   if (params.data.group && params.node['selected']) {
      //     let childs = params.node.childrenAfterGroup;
      //     childs.forEach(data => {
      //       data.selectThisNode(true);
      //     })
      //   }
      // },
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 30, checkboxSelection: true,colId: 'check' },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 110 },
      { cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'org.name', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: (params) => {
          if (params.data.id && !params.data.isdaohuo) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.id && !params.data.isdaohuo) {
            sweetalert({
              title: '你确定要删除吗?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.rukuapi.delzaituRukudet(params.data.id).then((response) => {
                console.log('params', params);
                this.toast.pop('success', '删除成功！');
                this.getdetail();
                setTimeout(() => {
                  if (!this.list.length) {
                    this.route.navigateByUrl('zaituruku');
                  }
                }, 1000);
              });
              sweetalert.close();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否到货', field: 'isdaohuo', minWidth: 75, cellRenderer: (params) => {
          if (!params.data) {
            return null;
          } else {
            if (params.data.isdaohuo) {
              return '是';
            } else {
              return '否';
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车船号', field: 'carshipnum', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', minWidth: 75 }
    ];

    this.wuliuOffergridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowSelection: 'multiple',
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    }
    this.wuliuOffergridOptions.onGridReady = this.settings.onGridReady;
    this.wuliuOffergridOptions.groupSuppressAutoColumn = true;
    this.wuliuOffergridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', width: 90, checkboxSelection: true,
        headerCheckboxSelection: true,
        valueGetter: (params) => {
          if (params.data.transporttype === 1) {
            return '汽运';
          } else if (params.data.transporttype === 2) {
            return '铁运';
          } else if (params.data.transporttype === 3) {
            return '船运';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'weight', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'price', headerName: '系统单价', field: 'price', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerprice', headerName: '实付单价', field: 'innerprice', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'jine', headerName: '系统金额', field: 'jine', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerjine', headerName: '实付金额', field: 'innerjine', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货地址', field: 'enddest', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'wlcustomername', headerName: '实际费用单位',
        field: 'wlcustomername', width: 180
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feecustomername', width: 120, cellRenderer: () => {
          return '运营中心';
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 120,
        valueGetter: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['cdate'], 'y-MM-dd HH:mm');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流专员', field: 'notifiername', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">作废</a>';
        }, onCellClicked: (data) => {
          const wuliuorderids = [data.data.id];
          if (confirm('你确定要作废吗？')) {
            this.feeApi.zuofei(wuliuorderids).then(() => {
              this.toast.pop('success', '作废成功！');
              this.getwuliu();
            });
          }
        }
      }
    ];
  }

  ngOnInit() {
   this.getdetail();

   this.getwuliu();
  }
  getdetail() {
    this.rukuid = this.actroute.params['value']['id'];
    this.rukuapi.getone(this.actroute.params['value']['id']).then(data => {
      this.rukuModel = !data['zaitukucun'] ? {} : data['zaitukucun'];
      this.list = data['zaituKucundetList'];
      this.gridOptions.api.setRowData(this.list);
    });
  }

  getwuliu(){
    this.rukuapi.findbyzaituid(this.actroute.params['value']['id']).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
    });
  }
  // 撤销入库
  delRuku(id) {
    this.rukuapi.revoke(id).then((response) => {
      // this.rukuapi.delRuku(id).then((response1) => {
      // });
      this.toast.pop('success', '完成撤销!');
      this.route.navigateByUrl('ruku');
    });
  }

  addFeeDialog() {
    console.log('添加按钮');
    this.caigoufee = {};
    this.companyOfProduce = {};
    this.companyProduce = [];
    this.detids = new Array();
    const rukudets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细

    let weight: number = 0;
    for (let i = 0; i < rukudets.length; i++) {
      if (rukudets[i].selected && rukudets[i].data.id) {
        console.log(rukudets[i]);
        console.log('weight', weight);
        weight = weight['add'](rukudets[i].data.weight);
        console.log('weight', weight);
        this.detids.push(rukudets[i].data.id);
      }
    }
    if (this.detids.length <= 0) {
      this.toast.pop('warning', '请选择添加费用的货物');
      return '';
    }
    this.caigoufee['tweight'] = weight;
    this.caigoufee['accountdirection'] = 2;
    this.caigoufee['payorreceive'] = 1;

    this.feedialog.show();
  }
  // 卖方公司
  innercompany(event) {
    this.caigoufee['paycustomerid'] = event;
  }
  createFee() {
    console.log(this.companyOfProduce);
    if (!this.companyOfProduce) {
      this.toast.pop('warning', '请选择费用单位！');
      return '';
    }
    if (!this.caigoufee['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if (!this.caigoufee['accountdirection']) {
      this.toast.pop('warning', '请选择费用方向！');
      return '';
    }
    if (!this.caigoufee['payorreceive']) {
      this.toast.pop('warning', '请选择应付或者应收！');
      return '';
    }
    // 2017.04.08 费用修改付费单位 cpf MOD start
    if (!this.caigoufee['paycustomerid']) {
      this.toast.pop('warning', '请选择付费单位！');
      return '';
    }
    // 2017.04.08 费用修改付费单位 end
    this.caigoufee['feecustomerid'] = this.companyOfProduce['code'];
    this.caigoufee['idList'] = this.detids;
    console.log(this.caigoufee);
    this.closefeedialog();
    this.rukuapi.createCaigoufee(this.caigoufee).then(() => {
      this.toast.pop('success', '费用添加成功');
    });
  }
  // 关闭添加费用弹窗
  closefeedialog() {
    this.feedialog.hide();
  }

  // 单价输入失去焦点
  getjine() {
    if (!this.caigoufee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    this.caigoufee['jine'] = Math.round(this.caigoufee['tweight'].mul(this.caigoufee['price']) * 100) / 100;
  }

  // 通过金额获取单价
  getprice() {
    if (!this.caigoufee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    this.caigoufee['price'] = Math.round(this.caigoufee['jine'].div(this.caigoufee['tweight']) * 100) / 100;
  }

  // tslint:disable-next-line:member-ordering
  feetype = [{ label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 },
  { label: '出库费', value: 4 }, { label: '开平费', value: 5 }, { label: '纵剪费', value: 6 }, { label: '销售运杂费', value: 7 },
  { label: '包装费', value: 8 }, { label: '仓储费', value: 9 }];

  // 汇总全选
  selectall() {
    this.gridOptions.api.selectAll();
  }

  handleChange(event) {
    this.tabviewindex = event.index;
  }



  /**选择物流员弹窗 */
  selectZaituWuliubaojia: any = [];
  shownoticewuliuyuan() {
    const zaituids = [];
    this.selectZaituWuliubaojia = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        zaituids.push(orderdetSelected[i].data.id);
        this.selectZaituWuliubaojia.push({
          id: orderdetSelected[i].data.id,
          guige: orderdetSelected[i].data['goodscode']['guige'],
          weight: orderdetSelected[i].data['weight'],
          baojialiang: orderdetSelected[i].data['weight'],
          daohuo:orderdetSelected[i].data['isdaohuo'],
          
          sumyibaojia: orderdetSelected[i].data['ybaojiaweight'] || 0
        });
        //console.log(orderdetSelected[i].data['isdaohuo'])
        if(orderdetSelected[i].data['id'] == true){
          this.toast.pop('warning', '请选择在途明细！！！');
          return;
        }
        if(orderdetSelected[i].data['isdaohuo'] == true){
          this.toast.pop('warning', '请选择未到货明细！！！');
          return;
        }
      }
    }
    if (zaituids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的明细！！！');
      return;
    }
    this.modalService1.config.class = 'modal-lg';
    // 通知物流报价弹窗的参数
    this.noticewuliuparams = { qihuodets: this.selectZaituWuliubaojia, 
      id: this.rukuid['id'], 
      detids: zaituids , datasource: 7};
    this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
    this.bsModalRef.content.parentThis = this;

  }

  wuliunoticehide() {
    this.bsModalRef.hide();
    this.getwuliu();
    this.tabviewindex = 1;
  }





}


