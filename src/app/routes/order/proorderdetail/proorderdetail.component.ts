import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap';
import { FavoritelistComponent } from './../../../dnn/shared/favoritelist/favoritelist.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap';
import { KucundetimportComponent } from './../../../dnn/shared/kucundetimport/kucundetimport.component';
import { ToasterService } from 'angular2-toaster';
import { ColDef, GridOptions } from 'ag-grid/main';
import { ProorderapiService } from './../../produce/proorderapi.service';
import { ActivatedRoute } from '@angular/router';
import { OrderapiService } from './../orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { FeeapiService } from 'app/routes/fee/feeapi.service';
import { MoneyService } from 'app/dnn/service/money.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';

@Component({
  selector: 'app-proorderdetail',
  templateUrl: './proorderdetail.component.html',
  styleUrls: ['./proorderdetail.component.scss']
})
export class ProorderdetailComponent implements OnInit {
  //配款
  @ViewChild('allocationModel') private allocationModel: ModalDirective;
  //释放配款
  @ViewChild('shifangallocationModel') private shifangallocationModel: ModalDirective;
  // 修改运输方式
  @ViewChild('mainmodifydialog') private mainmodifydialog: ModalDirective;
  // 弹出添加地址的对话框
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  // 弹出修改定价的对话框
  @ViewChild('priceDialog') private priceDialog: ModalDirective;
  @ViewChild('addqualityModal') private addqualityModal: ModalDirective;
  gridOptions: GridOptions;
  allocationgridOptions: GridOptions; // 配款
  gridOptions1: GridOptions;
  wuliuOffergridOptions: GridOptions; // 物流竞价明细
  // 成品对象
  requestparams = {};
  feetypes = [{ value: '1', label: '汽运费' },
  { value: '2', label: '铁运费' },
  { value: '3', label: '船运费' },
  { value: '4', label: '出库费' },
  { value: '5', label: '开平费' },
  { value: '6', label: '纵剪费' },
  { value: '7', label: '销售运杂费' },
  { value: '8', label: '包装费' },
  { value: '9', label: '仓储费' }];

  // 内部销售单的展示
  proorder = {};

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  // 声明一个控制显示的对象
  flag = {};
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  selectQihuodetWuliubaojia: any = [];
  allocation = { buyerid: null, dingjin: null };
  curyue: any = '0';
  xuyue = 0; // 配款弹窗剩余需配款金额
  // 修改主表信息
  editorder: any = {};
  addr = {};
  provinces = [];
  //质量异议
  qualityModel = {};
  //引入质量异议
  changeordermodal={};
  zlbsModalRef: BsModalRef;
  isimport = { flag: true };
  ordermodal=[{value:'1',label:'默认模板'},{value:'2',label:'老模板'}];
  saletypes = [{ value: '1', label: '补差' }, { value: '2', label: '退货' }, { value: '3', label: '订货折让' }];
  citys = [];
  countys = [];
  addrs: any = []; // 收货地址
  buyer: any = {};
  modifyprice = {price: '', gcid: null,cangkuid: null, orderid: this.proorder['id']}; // 修改定价
  constructor(public settings: SettingsService, private numberpipe: DecimalPipe, private storage: StorageService,
    private orderApi: OrderapiService, private route: ActivatedRoute, private proOrderApi: ProorderapiService,
    private toast: ToasterService, private modalService: BsModalService, private classifyApi: ClassifyApiService,
     private router: Router,private modalService1: BsModalService,private businessorderApi: BusinessorderapiService,
     private datepipe: DatePipe,private qihuoapi: QihuoService,private feeApi: FeeapiService,
     private moneyapi: MoneyService, private userapi: UserapiService) {
    // 定义网格
    this.gridOptions = {
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      groupDefaultExpanded: -1,
  

      rowData: null,
      // 行数据
      enableFilter: true,
      // 过滤器
      rowSelection: 'multiple',
      // 多选单选控制
      rowDeselection: true,
      // 取消全选
      suppressRowClickSelection: false,
      enableColResize: true,
      // 列宽可以自由控制
      enableSorting: true,
      // 排序
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,


      // 分组显示
      // debug: true,

      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          return {
            group: true,
            expanded: null != rowItem.group,
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group
          };
        } else {
          return null;
        }
      }, // 这个是获取孩子列表的
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否生产', field: 'isuse', width: 90,
        cellRenderer: (params) => {
          if (params.data.isuse === true) {
            return '是';
          } else if (params.data.isuse === false) {
            return '否';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '定价/吨', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2,
        // editable: true,
        // cellRenderer: (params) => {
        //   if (params.data.isedit) {
        //     if (params.value === null || params.value === undefined) {
        //       return null;
        //     } else if (isNaN(params.value)) {
        //       return 'NaN';
        //     } else {
        //       return params.value;
        //     }
        //   } else {
        //     params.colDef.editable = false;
        //     return params.value;
        //   }
        // },onCellClicked: (params) => {
        //   if (this.proorder['cuserid'] === this.current.id) {
        //     if (!this.proorder['isv'] || this.flag['qihuochangestatus'] === 1) {
        //       if (params.data.isedit) {
        //         let price = params.data.price;
        //         if (this.proorder['status'] === 9) {
        //           if (price !== undefined && price !== null) {
        //             price = (price + '').split('->')[0];
        //           }
        //         }
        //         this.priceshowDialog(params.data.gcid, params.data.cangkuid, price);
        //       }
        //     }
        //   }
        // }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: function (params) {
          if (params.data.del) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          console.log('id1', params.data);
          if (!params.data.isuse) {
            if (confirm('你确定要删除吗?')) {
              this.proOrderApi.removeOneDet(params.data.id).then((response) => {
                this.listDetail();
                this.getDetail();
              });
            }
          } else {
            // Notify.alert('该基料已被引用不能删除！', { status: 'warning' });
            this.toast.pop('warning', '该基料已被引用不能删除！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          // console.log("=========",params.data)
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';

        }
      }

    ];


    this.gridOptions1 = {
      enableFilter: true,
      enableColResize: true,
      rowSelection: 'multiple',
      // 多选单选控制
      rowDeselection: true,
      // 取消全选
      onRowSelected: (event) => {
        if (event.node['selected']) {
          this.requestparams = null;
          this.requestparams = {
            gnid: event.node.data.goodscode.gnid, chandiId: event.node.data.goodscode.chandiid,
            colorId: event.node.data.goodscode.colorid, houduId: event.node.data.goodscode.houduid,
            ducengId: event.node.data.goodscode.ducengid, xiubianid: event.node.data.goodscode.xiubianid,
            packagetypeid: event.node.data.goodscode.packagetypeid, caizhiId: event.node.data.goodscode.caizhiid,
            pproId: event.node.data.goodscode.pproid, weight: event.node.data.weight, width: event.node.data.width,
            length: event.node.data.length, price: event.node.data.price, pertprice: event.node.data.pertprice
          };
        }

      },
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
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
      getContextMenuItems: (params) => {
        let result = [
          'copy',
          {
            name: '自适应',
            action: () => {
              // params.api.exportDataAsCsv(params);
              params.columnApi.autoSizeAllColumns();
            }
          }
        ];
        if (!this.proorder['isv']) {
          result.push({
            name: '费用修改/查看',
            action: () => {
              console.log(params);
              this.feemodifydialogshow(params.node.data.id, params.node.data.pertprice, params.node.data.price);
            }
          });
        }
        return result;
      },
    };
    //成品
    this.gridOptions1.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', width: 90,checkboxSelection: true,
      headerCheckboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', width: 90,
        cellRenderer: (params) => {
          return this.numberpipe.transform(params.data.pertprice.mul(params.data.weight), '1.2-2');
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售价/吨', field: 'pertprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '定价/吨', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用', field: 'yugufeeprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估毛利', field: 'yugufeeprice', width: 90,
        valueFormatter: this.settings.valueFormatter2,
        cellRenderer: (params) => {
          if (params.data.price && params.data.yugufeeprice) {
            return (params.data.pertprice - params.data.price - params.data.yugufeeprice) + ' ';
          } else if (params.data.group) {
            return;
          } else {
            return (params.data.pertprice - params.data.price) + ' ';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用明细', field: 'yugufeemiaoshu', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (this.proorder['status'] === 0) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          console.log('id', params.data);
          if (this.proorder['status'] === 0) {
            if (confirm('你确定要删除吗?')) {
              this.proOrderApi.removeOneFpDet(params.data.id).then((response) => {
                this.listDetail();
                this.getFpdetail();
              });
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 90 }
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
      excelStyles: this.settings.excelStyles,
      localeText: this.settings.LOCALETEXT,
      getContextMenuItems: this.settings.getContextMenuItems,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.wuliuOffergridOptions.onGridReady = this.settings.onGridReady;
    this.wuliuOffergridOptions.groupSuppressAutoColumn = true;
    this.wuliuOffergridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', width: 90,
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
        cellStyle: { 'text-align': 'center' }, colId: 'innerprice', headerName: '实付单价', field: 'innerprice',
        width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'jine', headerName: '系统金额', field: 'jine', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerjine', headerName: '实付金额', field: 'innerjine', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货地址', field: 'enddest', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货人', field: 'xhlianxiren', width: 90, editable: this.editxhlianxirenable,
        onCellValueChanged: (params) => { this.modifyxhlianxiren(params); }, cellRenderer: (params) => {
          if ((!params.data.xhlianxiren || params.data.xhlianxiren === '') && params.data.isdel !== '是') {
            return '<a>修改</a>';
          } else {
            return params.data.xhlianxiren;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货电话', field: 'xhlianxirenphone', width: 90, editable: this.editxhlianxirenable,
        onCellValueChanged: (params) => { this.modifyxhlianxiren(params); }, cellRenderer: (params) => {
          if ((!params.data.xhlianxirenphone || params.data.xhlianxirenphone === '') && params.data.isdel !== '是') {
            return '<a>修改</a>';
          } else {
            return params.data.xhlianxirenphone;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '指定收货签字人', field: 'isshouhuosign', minWidth: 90,
        valueGetter: (params) => {
          if (params.data) {
            return params.data.isshouhuosign ? '是' : '否';
          } else {
            return null;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '签字人', field: 'signuser', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '签字人电话', field: 'signphone', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'wlcustomername', headerName: '实际费用单位',
        field: 'wlcustomername', width: 180, menuTabs: ['filterMenuTab']
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
              this.getMyRole();
              this.listDetail();
              this.getFpdetail();
            });
          }
        }
      }
    ];
    this.allocationgridOptions = {
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
    this.allocationgridOptions.onGridReady = this.settings.onGridReady;
    this.allocationgridOptions.groupSuppressAutoColumn = true;
    this.allocationgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '付金公司', field: 'order.buyer.name', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '货款金额', field: 'jine', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '收款人', field: 'cuser.realname', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '收款日期', field: 'cdate', minWidth: 60, enableRowGroup: true,
        valueFormatter: data => {
          return this.datepipe.transform(data.value, 'y-MM-dd HH:mm:s');
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否审核', field: 'isv', minWidth: 60, enableRowGroup: true,
        cellRenderer: params => {
          if (params.data.isv) {
            return '已审核';
          }
          return '没有';
        }
      }
    ];

    this.listDetail();
    this.getDetail();
    this.getFpdetail();
  }

  ngOnInit() {
    this.getMyRole();
    this.queryallocation();
  }

  // 获取网格中的数据
  listDetail() {
    this.orderApi.get(this.route.params['value']['id']).then((data) => {
      this.proorder = data['order'];
      console.log(this.proorder);
      if (this.proorder['cuserid'] === this.current['id']) {
        if (this.proorder['status'] !== 6) {
          this.flag['import'] = true;
        }
        if (this.proorder['status'] === 3) {
          this.flag['wan'] = true;
        }
        if (this.proorder['status'] === 0) {
          // 制单中状态才显示按钮
          this.flag['show'] = true;
          this.flag['del'] = true;
        } else {
          this.flag['show'] = false;
          this.flag['del'] = false;
        }
      } else {
        this.flag['import'] = false;
        this.flag['show'] = false;
      }
      if (this.proorder['vuserid'] === this.current['id'] && this.proorder['status'] === 1) {
        this.flag['verify'] = true;
      } else {
        this.flag['verify'] = false;
      }
      if (this.proorder['vuserid'] === this.current['id']) {
        if (this.proorder['status'] === 1) {
          this.flag['jushen'] = true;
        }
        if (this.proorder['isv']) {
          this.flag['cancelverify'] = true;
        } else {
          this.flag['cancelverify'] = false;
        }
      }
    });
  }

  // 获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 10)) {
      this.wuliuOffergridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'innerprice' || colde.colId === 'wlcustomername' || colde.colId === 'innerjine') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      });
    }
    // 获取物流竞价明细表
    this.businessorderApi.wuliuofferdetail(this.route.params['value']['id']).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
    });
  }

  getDetail() {
    this.proOrderApi.getdet(this.route.params['value']['id']).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }

  getFpdetail() {
    this.proOrderApi.getfpdet(this.route.params['value']['id']).then((data) => {
      this.gridOptions1.api.setRowData(data);
    });
  }

  cancelchoose() {
    // 取消选择
    this.gridOptions1.api.deselectAll();
    this.requestparams = {};
  }

  // 收藏夹中的货物引入弹出框
  kcbsModalRef: BsModalRef;
  importKucun() {
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    this.kcbsModalRef.content.componentparent = this;
  }

  // 得到引入的数据并且展示在明细中此时数据库的明细表中还未保存
  proorderk() {
    this.kcbsModalRef.hide();
    this.listDetail();
    this.getDetail();
  }
  bsModalRef: BsModalRef;
  importFav() {
    const fav = this.storage.getObject('fav');
    if (fav) {
      this.modalService.config.class = 'modal-all';
      this.bsModalRef = this.modalService.show(FavoritelistComponent);
      // this.bsModalRef.content.isimport = this.isimport;
      this.bsModalRef.content.parentthis = this;
      this.bsModalRef.content.parentVar(this);
    } else {
      this.toast.pop('warning', '收藏夹中没有数据');
    }
  }

  Proorder() {
    this.bsModalRef.hide();
    this.listDetail();
    this.getDetail();
  }
  // 添加成品
  addProducts() {
    this.requestparams['ids'] = [];
    let bms = this.gridOptions.api.getSelectedRows();//选中的基料
    if (bms.length > 0) {
      for (let i = 0; i < bms.length; i++) {
        console.log('----------=========---------', bms[i]);
        this.requestparams['ids'].push(bms[i].id);
      }
    }
    if (this.requestparams['ids'].length !== 1) {
      this.toast.pop('warning', '请选择一条对应的基料添加成品！');
      return;
    }
    this.requestparams['bmid'] = this.requestparams['ids'][0];
    this.showaddProModal();
  }
  // 选择规格后下一步
  addproductdet() {
    this.requestparams['fees'] = this.lines;
    console.log(this.requestparams);
    if (!this.requestparams['width'] || !this.requestparams['length']) {
      this.toast.pop('warning', '请你填写宽度和长度！');
      return '';
    }
    if (!this.requestparams['weight'] || !this.requestparams['price'] || !this.requestparams['pertprice']) {
      this.toast.pop('warning', '请你填写完整重量和价格！');
      return '';
    }
    this.requestparams['orderid'] = this.proorder['id'];
    this.proOrderApi.addproduct(this.requestparams).then(data => {
      this.listDetail();
      this.getFpdetail();
    });
    this.hideaddProModal();
  }

  // 提交审核
  submitVerify() {
    if(this.proorder['ischuliquality'] === null){
      this.toast.pop('warning', '请选择是否处理质量异议');
      return;
    }
    if (!this.proorder['beizhu']) {
      this.proorder['beizhu'] = '';
    }
    this.proOrderApi.submitVuser(this.proorder['id'], { beizhu: this.proorder['beizhu'] }).then((data) => {
      this.listDetail();
      this.getDetail();
      this.getFpdetail();
      this.toast.pop('success', '审核提交成功');
    });
  }

  // 审核
  verifys() {
    if (confirm('你确定要审核吗？')) {
      this.proOrderApi.verify(this.proorder['id'], { version: this.proorder['version'] }).then((data) => {
        this.proorder = data['order'];
        this.listDetail();
        this.getDetail();
        this.getFpdetail();
        this.toast.pop('success', '审核成功');
      });
    }
  }
  // 放弃审核
  cancelVerify(operationtype) {
    if (confirm('你确定要执行吗？')) {
      this.proOrderApi.cancelVerify(this.proorder['id'], { type: operationtype, version: this.proorder['version'] }).then((data) => {
        this.listDetail();
        this.getDetail();
        this.getFpdetail();
        this.toast.pop('success', '操作成功');
      });
    }
  }

  // 删除制单中加工订单
  delproorder(id) {
    if (confirm('你确定删除吗？')) {
      this.proOrderApi.del(id).then(() => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('order');
        this.listDetail();
        this.getDetail();
      });
    }
  }

  // 查看已打印的订单
  print() {
    this.orderApi.print(this.route.params['value']['id']).then((response) => {
      console.log(response);
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        window.open(response['msg']);
      }
    });
  }

  // 重新生成合同
  @ViewChild('ordermodalchange') private ordermodalchange: ModalDirective;

  reload() {
    console.log(this.changeordermodal);
    this.orderApi.reload(this.route.params['value']['id'],this.changeordermodal).then((response) => {
      this.toast.pop('warning', response['msg']);
      this.hideordermodalchange() ;
    });
  }
  hideordermodalchange() {
    this.ordermodalchange.hide();
  }
  ordermodalchangeshow() {
    this.changeordermodal['ordermodal'] = 1;
    this.ordermodalchange.show();
  }

  // 点击完成加工订单
  finish(id) {
    this.proOrderApi.finish(id).then(function (data) {
      console.log('data', data);
      if (data.length != 0) {
        this.toast.pop('warning', '合同相关有未完成操作，暂时不能点击完成');
      }
    });
  }

  @ViewChild('addProModal') private addProModal: ModalDirective;

  showaddProModal() {
    this.addProModal.show();
  }

  hideaddProModal() {
    this.addProModal.hide();
  }
  //费用添加弹出框
  feemodel: any = { feetype: null, price: null, beizhu: null, fproductsdetid: null };
  isshowInput = false; // 控制是否输入
  feeHeji: number = 0;  // 费用合计
  @ViewChild('feeadddialog') private feeadddialog: ModalDirective;
  //展示费用
  feeadddialogshow() {
    this.feeHeji = 0;
    this.feemodel = { feetype: null, price: null, beizhu: null, fproductsdetid: null };
    this.feeadddialog.show();
  }
  insertline() {//插行
    if (!this.feemodel['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel['price'] && 'number' === typeof this.feemodel['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    this.feeHeji = this.feeHeji['add'](this.feemodel['price']);
    this.lines.push(
      {
        id: new Date().getTime(),
        feetype: this.feemodel['feetype'],
        feeprice: this.feemodel['price'],
        beizhu: this.feemodel['beizhu']
      }
    )
    this.feemodel = { feetype: null, price: null, beizhu: null };
    this.isshowInput = !this.isshowInput;
  }
  delorderfee(index, feeprice) {
    this.lines.splice(index, 1);
    this.feeHeji = this.feeHeji['sub'](feeprice);
  }
  lines: any[] = [];//插行控制器
  //查找已经添加到该明细下的费用
  findyugufee(fproductsdetid) {
    this.proOrderApi.findyugufee(fproductsdetid).then(data => {
      this.feeHeji = 0;
      this.lines = data;
      this.lines.forEach(e => {
        console.log(e);
        this.feeHeji = this.feeHeji['add'](e.feeprice);
      })
    })
  }
  feeadddialogclose() {
    this.listDetail();
    this.getDetail();
    this.getFpdetail();
    this.feeadddialog.hide();
  }
  // 控制显示添加框
  showInput() {
    this.isshowInput = !this.isshowInput;
  }

  @ViewChild('feemodifydialog') private feemodifydialog: ModalDirective;
  //展示费用
  feemodifydialogshow(fproductsdetid, pertprice, price) {
    this.feeHeji = 0;
    this.feemodel = { feetype: null, price: null, beizhu: null, fproductsdetid: null };
    this.feemodel['fproductsdetid'] = fproductsdetid;
    this.requestparams['pertprice'] = pertprice;
    this.requestparams['price'] = price;
    this.findyugufee(fproductsdetid);
    this.feemodifydialog.show();
  }
  modifyfee() {//插行
    if (!this.feemodel['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel['price'] && 'number' === typeof this.feemodel['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    this.feeHeji = this.feeHeji['add'](this.feemodel['price']);
    this.isshowInput = !this.isshowInput;
    if (confirm("你确定要添加费用吗？")) {
      this.proOrderApi.addfee(this.feemodel).then(data => {
        this.toast.pop('success', '添加成功!');
        this.findyugufee(this.feemodel['fproductsdetid']);
        this.feemodel = {
          feetype: null, price: null, beizhu: null, fproductsdetid: this.feemodel['fproductsdetid']
        };
      })
    }
  }
  feemodifydialogclose() {
    this.listDetail();
    this.getDetail();
    this.getFpdetail();
    this.feemodifydialog.hide();
  }
  delfeeindb(orderfeedetid, fproductsdetid, feeprice) {
    console.log(orderfeedetid + '#' + fproductsdetid + '#' + feeprice);
    if (confirm('你确定要删除费用吗？')) {
      this.proOrderApi.delorderfee(orderfeedetid, { fproductsdetid: fproductsdetid }).then(data => {
        this.toast.pop('success', '修改成功');
        this.findyugufee(this.feemodel['fproductsdetid']);
        this.feeHeji = this.feeHeji['sub'](feeprice);
      })
    }

  }
  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    if (this.proorder['type'] !== 1) {
      this.toast.pop('warning', '运输类型只有代运才能通知物流专员报价！！！');
      return;
    }
    if (this.proorder['isself'] && !this.proorder['isv']) {
      this.toast.pop('warning', '自销的合同请在审核通过之后进行询价！！！');
      return;
    }
    if (!this.proorder['isself'] && !this.proorder['paydate']) {
      this.toast.pop('warning', '代销的合同请在付款之后进行询价！！！');
      return;
    }
    let orderdetids = [];
    const selecteds = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.gridOptions1.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data.id && orderdetSelected[i].selected) {
        selecteds.push(orderdetSelected[i].data.id);
        orderdetids = [...orderdetids, ...orderdetSelected[i].data['orderdetids']];
      }
    }
    if (selecteds.length < 1) {
      this.toast.pop('warning', '请选择需要报价的成品明细单！！！');
      return;
    }
    if (orderdetids.length < 1) {
      this.toast.pop('warning', '请验收入库后再通知物流专员！！！');
      return;
    }
    this.businessorderApi.orderdetgroup(orderdetids).then(data => {
      this.selectQihuodetWuliubaojia = data;
      this.modalService1.config.class = 'modal-lg';
      // 通知物流报价弹窗的参数
      this.noticewuliuparams = { qihuodets: this.selectQihuodetWuliubaojia, id: this.proorder['id'], detids: orderdetids, datasource: 1 };
      this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
      this.bsModalRef.content.parentThis = this;
    })
  }

  wuliunoticehide() {
    this.bsModalRef.hide();
    this.listDetail();
    this.getDetail();
    this.getMyRole();
  }
  /**判断是否可以修改卸货联系人 */
  editxhlianxirenable(params) {
    if (params.node.data.isdel === '是') {
      return false;
    } else {
      return true;
    }
  }
  // 物流竞价明细表修改卸货联系人
  modifyxhlianxiren(params) {
    if (params.data.isdel === '是') {
      this.toast.pop('warning', '已经作废了不允许修改！');
      return;
    }
    const obj = {};
    obj['xhlianxirenphone'] = params.data.xhlianxirenphone;
    obj['xhlianxiren'] = params.data.xhlianxiren;
    obj['id'] = params.data.id;
    this.qihuoapi.editxhlianxiren(obj).then(data => {
      this.toast.pop('success', '修改成功');
      this.getMyRole();
    });
  }
  // 添加配款
  addallocationdialog() {
    if (this.proorder['status'] === 0) {
      this.toast.pop('warning', '请审核后添加配款！');
      return;
    }
    let moneyquery = { buyerid: this.proorder['buyer']['id'], wcustomerid: this.proorder['seller']['id'],salemanid:this.proorder['salemanid'] };
    this.moneyapi.getmoney(moneyquery).then(data => {
      if (!data['wyue']) {
        this.curyue = 0;
      } else {
        this.curyue = data['wyue'];
      }
    });
    this.xuyue = Number(this.proorder['tjine'])['sub'](Number(this.proorder['allocation']));
    this.allocationModel.show();
  }
  closeallocationdialog() {
    this.allocationModel.hide();
  }
  addallocation() {
    const model = {
      buyerid: this.proorder['buyer']['id'],
      wcustomerid: this.proorder['seller']['id'],
      qihuoid: this.proorder['id'],
      jine: this.allocation['jine']
    };
    this.qihuoapi.addAllocation(model).then(() => {
      this.toast.pop('success', '添加成功');
      this.closeallocationdialog();
      this.queryallocation();
      this.listDetail();
    });
  }
  queryallocation() {
    this.qihuoapi.findAllocation(this.route.params['value']['id']).then(data => {
      this.allocationgridOptions.api.setRowData(data);
    });
  }
  shifangallocationdialog() {
    this.shifangallocationModel.show();
  }
  // 释放配款
  closeshifangallocationdialog() {
    this.shifangallocationModel.hide();
  }
  shifangAllocation() {
    if (Number(this.proorder['allocation']) - Number(this.allocation['jine']) < 0) {
      this.toast.pop('warning', '释放配款太多，配款余额不足，请重新输入！');
      return;
    }
    const model = {
      buyerid: this.proorder['buyer']['id'], wcustomerid: this.proorder['seller']['id'],
      qihuoid: this.proorder['id'], jine: this.allocation['jine'], reason: this.allocation['reason']
    };
    this.qihuoapi.shifangAllocation(model).then(() => {
      this.closeshifangallocationdialog();
      this.queryallocation();
      this.listDetail();
    })
  }
  // 修改订单
  openmodifymain() {
    this.editorder = JSON.parse(JSON.stringify(this.proorder));
    this.findAddr(this.editorder['buyerid'], true);
    this.buyer = {};
    this.mainmodifydialog.show();
    this.mainmodifydialog.show();
  }
  closemaindialog() {
    this.mainmodifydialog.hide();
  }
  modifymain() {

    if (this.editorder['type'] === 1 && !this.editorder['addrid']) {
      this.toast.pop('warning', '请填写收货地址！');
      return;
    }
    this.editorder['addrbak']['addrid'] = this.editorder['addrid'];
    if (confirm('你确定修改吗？')) {
      this.businessorderApi.modifyorder(this.editorder).then(() => {
        this.closemaindialog();
        this.listDetail();
      });
    }
  }
  addAddrDialog() {
    if (this.editorder['type'] === 0) {
      this.toast.pop('warning', '自提的订单无需添加地址^~^');
      return '';
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.addr['detail'] = this.editorder['addrbak']['detail'];
    this.addr['lianxiren'] = this.editorder['addrbak']['lianxiren'];
    this.addr['phone'] = this.editorder['addrbak']['phone'];
    this.addrdialog.show();
    this.getProvince();
  }
  getProvince() {
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
    });
  }
  getcity() {
    this.citys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }
  getcounty() {
    this.countys = [];
    this.classifyApi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 开始往数据库中添加内容
  addAddr() {
    if (!this.addr['provinceid']) {
      this.toast.pop('warning', '请选择省！！！');
      return '';
    }
    if (!this.addr['cityid']) {
      this.toast.pop('warning', '请选择市！！！');
      return '';
    }
    if (!this.addr['countyid']) {
      this.toast.pop('warning', '请选择县或区！！！');
      return '';
    }
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！！！');
      return '';
    }
    this.addr['customerid'] = this.editorder['buyerid'];
    this.businessorderApi.createAddr(this.addr).then((data) => {
      this.addrdialogclose();
      this.findAddr(this.addr['customerid'], false);
    });
  }
  addrdialogShow() {
    this.addrdialog.show();
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }
  getAddr() {
    this.findAddr(this.editorder['buyerid'], false);
  }
  // 获取选择公司的送货地址
  findAddr(customerid, flag) {
    this.addrs = [];
    this.editorder['addrid'] = '';
    if (customerid && this.editorder['type'] === 1) {// 判断只有是代运的才能加载地址
      this.addrs = [{ value: '', label: '请选择地址' }];
      this.userapi.findAddr(customerid).then((data) => {
        data.forEach((element) => {
          this.addrs.push({
            value: element['id'],
            label: element['province'] + element['city'] + element['county'] + element['detail']
          });
        });
        if (flag) {
          if (this.editorder['addrbakid']) {
            this.editorder['addrid'] = this.editorder['addrbak']['addrid'];
          }
        }
      });
    }
  }
  /**弹出修改定价弹窗 */
  priceshowDialog(gcid, cangkuid, price) {
    this.modifyprice = { price: price, gcid: gcid, cangkuid: cangkuid, orderid: this.proorder['id'] };
    this.priceDialog.show();
  }
  pricehideDialog() { this.priceDialog.hide(); }
  modifydingjiaprice() {
    if (confirm('你确定价格修改无误，提交修改吗？')) {
      this.businessorderApi.changetprice(this.modifyprice).then(() => {
        this.listDetail();
        this.getDetail();
        this.toast.pop('success', '价格修改成功');
        this.pricehideDialog();
      });
    }
  }
  qualitShow(){
    this.addqualityModal.show();
  }
  hideaddModal(){
    this.addqualityModal.hide();
  }
  choice(){
    console.log(this.qualityModel['compensation']);
    if(!this.qualityModel['ischuliquality']){
      this.toast.pop('warning', '请选择是否处理！');
      return;
    }
    if(!this.qualityModel['salebeizhu']){
      this.toast.pop('warning', '请填写说明！');
      return;
    }
    if(!this.qualityModel['saletype']){
      this.toast.pop('warning', '请填写类型！');
      return;
    }
    if(!this.qualityModel['salejine']){
      this.toast.pop('warning', '请填写金额！');
      return;
    }
    this.qualityModel['id'] = this.proorder['id'];
    this.hideaddModal();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.qualityModel = this.qualityModel;
  }
  addupdate(){
    let params = {ischuliquality:this.qualityModel['ischuliquality'] , id:this.proorder['id']};
    this.orderApi.qualityUpdate(params).then(data => {
      console.log(data);
      if (data) {
        this.listDetail();
        this.hideaddModal();
      }
    });
  }

   //批量删除明细
   proorderdetids: any = [];
   deleteproorderdetfee() {
     this.proorderdetids = new Array();
     const proorderdetidslist = this.gridOptions1.api.getModel()['rowsToDisplay'];
     console.log(proorderdetidslist)
     for (let i = 0; i < proorderdetidslist.length; i++) {
       if (proorderdetidslist[i].selected && proorderdetidslist[i].data && proorderdetidslist[i].data['id'] ) {
         this.proorderdetids.push(proorderdetidslist[i].data.id);
       }
     }
     if (!this.proorderdetids.length) {
       this.toast.pop('warning', '请选择明细之后再删除！');
       return;
     }
      if (confirm('你确定要删除吗？')) {
       this.proOrderApi.removepro(this.proorderdetids).then(data => {
       this.toast.pop('success', '删除成功！');
       this.listDetail();
       this.getFpdetail();
       });
     }
     }
   


}
