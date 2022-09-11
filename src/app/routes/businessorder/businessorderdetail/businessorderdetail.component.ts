import { FavoritelistComponent } from './../../../dnn/shared/favoritelist/favoritelist.component';
import { KucundetimportComponent } from './../../../dnn/shared/kucundetimport/kucundetimport.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { OrderapiService } from './../../order/orderapi.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { GridOptions, ColDef } from 'ag-grid';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BusinessorderapiService } from './../businessorderapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MoneyService } from 'app/dnn/service/money.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ProorderapiService } from 'app/routes/produce/proorderapi.service';
import { ImpzhiyajinComponent } from 'app/dnn/shared/impzhiyajin/impzhiyajin.component';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';
import { RukuService } from 'app/routes/ruku/ruku.service';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';

@Component({
  selector: 'app-businessorderdetail',
  templateUrl: './businessorderdetail.component.html',
  styleUrls: ['./businessorderdetail.component.scss']
})
export class BusinessorderdetailComponent implements OnInit {
  results: any;

  // 引入库存弹窗对象
  kcbsModalRef: BsModalRef;
  @ViewChild('payorder') private payorder: ModalDirective;
  @ViewChild('addyunfee') private addyunfee: ModalDirective;
  @ViewChild('chukufeetype') private ckfeetype: ModalDirective;
  @ViewChild('yunfeeDialog') private yunfeeDialog: ModalDirective;
  @ViewChild('arrearspayDialog') private arrearspayDialog: ModalDirective;
  // 配款
  @ViewChild('allocationModel') private allocationModel: ModalDirective;
  // 释放配款
  @ViewChild('shifangallocationModel') private shifangallocationModel: ModalDirective;
  @ViewChild('zhibaoshuModel') private zhibaoshuModel: ModalDirective;
  // 修改运输方式
  @ViewChild('mainmodifydialog') private mainmodifydialog: ModalDirective;
  // 弹出添加地址的对话框
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  // 期货变更提交原因填写
  @ViewChild('qhchangetijiaoModel') private qhchangetijiaoModel: ModalDirective;
  // 质押金使用金额填写
  @ViewChild('zhiyajinusejineeditor') private zhiyajinusejineeditor: ModalDirective;

  @ViewChild('priceDialog') private priceDialog: ModalDirective;
  @ViewChild('jiagongfeeDialog') private jiagongfeeDialog: ModalDirective;
  @ViewChild('addqualityModal') private addqualityModal: ModalDirective;
  haszhiyajin: boolean;
  zhiyajins: any;
  impzhiyajinmodels: any = [];
  zhiyajinimpid: any;
  weiimpjine: any;
  zhiyajinimpjine: any;
  yunfeeModel = {};
  //质量异议
  qualityModel = {};
  //引入质量异议
  zlbsModalRef: BsModalRef;
  changeordermodal={};
  ordermodal=[{value:'1',label:'默认模板'},{value:'2',label:'老模板'}];
  saletypes = [{ value: '1', label: '补差' }, { value: '2', label: '退货' }, { value: '3', label: '订货折让' }];
  msg = {
    name: '获取验证码', flag: false,
    arrearsflag: false, payflag: false
  };
  salepricemodel: any = { pertprice: null, price: null };
  feemodel: any = { feetype: null, price: null, beizhu: null };
  // 控制是否输入
  isshowInput = false;
  // 费用合计
  feeHeji: Number = 0;
  diyfeeHeji: number = 0;
  gcid: number;
  cangkuid: number;
  // 插行控制器
  lines: any[] = [];
  isimport = { flag: true };
  paramsdata;
  params = {};
  curyue = 0; // 配款弹窗剩余余额
  xuyue = 0; // 配款弹窗剩余需配款金额
  allocation: any = {};
  // 引入收藏夹弹窗对象
  favbsModalRef: BsModalRef;
  chukufeetypes: { label: string; value: string; }[] = [];
  chukufeetypess = {};

  // 内部销售单的展示
  businessorder = {};
  yunfeemodel = {};
  jiagongfeemodel = {};
  orderid: number;
  feetypes = [{ value: '1', label: '汽运费' },
  { value: '2', label: '铁运费' },
  { value: '3', label: '船运费' },
  { value: '4', label: '出库费' },
  { value: '5', label: '开平费' },
  { value: '6', label: '纵剪费' },
  { value: '7', label: '销售运杂费' },
  { value: '8', label: '包装费' },
  { value: '9', label: '仓储费' },
  { value: '10', label: '保险费' }];

  // 获取当前登录用户的信息
  current = this.storage.getObject('cuser');

  // 声明一个控制显示的对象
  flag = {
    isorderchange: false, qihuochangestatus: 0, // 现货变更状态：0:变更前;1:变更中;2:审核中
  };
  orderdetList = new Array();
  isall = false; // 是否全选
  validQihuochangedet = [];
  orderdetlist: any = [];
  gridOptions: GridOptions;
  proordergridOptions: GridOptions; // 加工基料明细
  allocationgridOptions: GridOptions; // 配款
  wuliuOffergridOptions: GridOptions; // 物流竞价明细
  orderchangegridOptions: GridOptions; // 合同变更记录
  yedate = new Date(); // 设定页面开始时间默认值
  minDate = new Date();
  overdraft = {};
  singleData = [];
  isSaleman = false; // 是否是业务员
  editorder: any = {};
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  addrs: any = []; // 收货地址
  buyer: any = {};
  // 物流竞价参数
  bsModalRef: BsModalRef;
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  selectQihuodetWuliubaojia: any = [];
  wuluiorderlist: any = [];
  qhchangetijiaobeizhu = ''; // 合同变更提交备注
  isshowzhibaoshu: Boolean = false;
  msgs = [{ severity: 'info', detail: '您没有变更内容，如果提交则不需审批直接返回变更前状态！' }];
  constructor(public settings: SettingsService, private businessorderApi: BusinessorderapiService, private route: ActivatedRoute,
    private router: Router, private storage: StorageService, private orderApi: OrderapiService, private userApi: UserapiService,
    private toast: ToasterService, private bsModal: BsModalService, private datepipe: DatePipe, private proOrderApi: ProorderapiService,
    private moneyapi: MoneyService, private qihuoapi: QihuoService, private modalService1: BsModalService, private rukuApi: RukuService,
    private matchcarApi: MatchcarService,
    private classifyapi: ClassifyApiService, private userapi: UserapiService, private modalService: BsModalService) {

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
      getContextMenuItems: (params) => {
        const result = [
          'copy',
          {
            name: '自适应',
            action: () => {
              // params.api.exportDataAsCsv(params);
              params.columnApi.autoSizeAllColumns();
            }
          }
        ];
        return result;
      },
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
      // getNodeChildDetails: (rowItem) => {
      //   if (rowItem.group) {
      //     return {
      //       group: true,
      //       expanded: rowItem.group === '彩涂' || rowItem.group === '镀锌' || rowItem.group === '镀铝锌'
      //         || rowItem.group === '冷轧' || rowItem.group === '冷硬' || rowItem.group === '至彩'
      //         || rowItem.group === '洁彩' || rowItem.group === '辉彩'
      //         || rowItem.group === '恒牧' || rowItem.group === '锌铝镁',
      //       children: rowItem.participants,
      //       field: 'group',
      //       key: rowItem.group
      //     };
      //   } else {
      //     return null;
      //   }
      // },
      groupSelectsChildren: true // 分组可全选
    };

    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', cellRenderer: 'group', width: 90,
        checkboxSelection: true, headerCheckboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', width: 90,
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120,
        cellRenderer: (params) => {
            if (params && params.data) {
                if (params.data.cangkuid) {
                    return '<a target="_blank" href="#/cangku/' + params.data.cangkuid + '">' + params.data.cangkuname + '</a>';
                } else {
                    return params.data.cangkuname;
                }
            } else {
                return '';
            }
        } 
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费类型', field: 'chukufeetype', width: 110,
        cellRenderer: (params) => {
          if (params.data.chukufeetype === 0) {
            return '现结';
          } else if (params.data.chukufeetype === 1) {
            return '月结';
          } else if (params.data.chukufeetype === 2) {
            return '免付';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (params.data.isedit) {
            if (params.data.ismodify) {
              this.chukufeetypess = {};
              this.chukufeetypes = [{ label: '请选择出库费类型', value: '' }, { label: '现结', value: '0' }, { label: '月结', value: '1' }];
              this.ckfeetypeshowDialog();
              this.params = params;
            }

          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费单价', field: 'chukuprice', width: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '<font color="red">销售价</font>', field: 'pertprice', width: 90, editable: true,
        valueFormatter: this.settings.valueFormatter2,
        cellRenderer: (params) => {
          if (params.data.isedit) {
            if (params.value === null || params.value === undefined) {
              return null;
            } else if (isNaN(params.value)) {
              return 'NaN';
            } else {
              return params.value;
            }
          } else {
            params.colDef.editable = false;
            return params.value;
          }
        },
        onCellClicked: (params) => {
          if (this.businessorder['cuserid'] === this.current.id) {
            if (!this.businessorder['isv'] || this.flag['qihuochangestatus'] === 1) {
              if (params.data.isedit) {
                let price = params.data.price;
                if (this.businessorder['status'] === 9) {
                  if (price !== undefined && price !== null) {
                    price = (price + '').split('->')[0];
                  }
                }
                this.priceshowDialog(params.data.gcid, params.data.cangkuid, params.data.pertprice, price);
                this.paramsdata = params.data;
              }
            }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '考核价', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用单价', field: 'yugufeeprice', width: 90,
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '预估毛利单价', field: 'amount', width: 100,
        cellRenderer: (params) => {
          let price = params.data.price;
          console.log(price);
          if (price && params.data.yugufeeprice) {
            if (this.businessorder['status'] === 9) {
              if (price !== undefined && price !== null) {
                price = (price + '').split('->')[0];
              }
            }
            return (params.data.pertprice - price - params.data.yugufeeprice) + ' ';
          } else if (params.data.group) {
            return;
          } else {
            if (this.businessorder['status'] === 9) {
              if (price !== undefined && price !== null) {
                price = (price + '').split('->')[0];
              }
            }
            return (params.data.pertprice - price) + ' ';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用明细', field: 'yugufeemiaoshu', width: 90,
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 60,
        cellRenderer: (params) => {
          if (params.data.isshowzhibaoshu) {
            return '<a>查看质保书</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (!params.data.isshowzhibaoshu) {
            return;
          }
          this.rukuApi.printZhibaoshu(params.data.kunbaohao).then((response) => {
            if (!response['flag']) {
              this.toast.pop('warning', response['msg']);
            } else {
              this.listDetail();
              // 判断是否为苹果
              const u = navigator.userAgent;
              const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
              if (isiOS) {
              } else {
                window.open(response['msg']);
              }
            }
          });
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', width: 100,
        cellRenderer: (params) => {
          if (params.data.del) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗?')) {
            this.businessorderApi.removeOneDet(params.data.id).then(response => {
              if (this.orderdetList.length > 0) {
                for (let i = 0; i < this.orderdetList.length; i++) {
                  if (this.orderdetList[i].id === params.data.id) {
                    this.orderdetList.splice(i, 1); // 删除重复的
                  }
                }
              }
              this.listDetail();
              this.getDetail();
            });
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货Id', field: 'tihuoid', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          // console.log("==========",params.data);
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';

        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcId', field: 'gcid', width: 90 }
    ];
    // 定义网格
    this.proordergridOptions = {
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
    this.proordergridOptions.columnDefs = [
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
        valueFormatter: this.settings.valueFormatter2
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
            this.toast.pop('warning', '该基料已被引用不能删除！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', width: 90,
        cellRenderer: (params) => {
          return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
        }
      }
    ];

    this.allocationgridOptions = {
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT
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
      getContextMenuItems: this.settings.getContextMenuItems,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.wuliuOffergridOptions.onGridReady = this.settings.onGridReady;
    this.wuliuOffergridOptions.groupSuppressAutoColumn = true;
    this.wuliuOffergridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '运输方式', field: 'transporttype', width: 90,
        menuTabs: ['filterMenuTab'],
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
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 100,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '总重量', field: 'weight', width: 100,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'price', headerName: '系统单价', field: 'price', width: 80,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerprice', headerName: '实付单价', field: 'innerprice',
        width: 90, menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'jine', headerName: '系统金额', field: 'jine', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, colId: 'innerjine', headerName: '实付金额', field: 'innerjine', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '起始地', field: 'startarea', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货地址', field: 'enddest', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货人', field: 'xhlianxiren', width: 90,
        menuTabs: ['filterMenuTab'], editable: true,
        onCellValueChanged: (params) => { this.modifyxhlianxiren(params); }, cellRenderer: (params) => {
          if (!params.data.xhlianxiren || params.data.xhlianxiren === '') {
            return '<a>修改</a>';
          } else {
            return params.data.xhlianxiren;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卸货电话', field: 'xhlianxirenphone', width: 90,
        menuTabs: ['filterMenuTab'], editable: true,
        onCellValueChanged: (params) => { this.modifyxhlianxiren(params); }, cellRenderer: (params) => {
          if (!params.data.xhlianxirenphone || params.data.xhlianxirenphone === '') {
            return '<a>修改</a>';
          } else {
            return params.data.xhlianxirenphone;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '指定收货签字人', field: 'isshouhuosign', minWidth: 90,
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
        cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feecustomername', width: 120,
        menuTabs: ['filterMenuTab'], cellRenderer: () => {
          return '运营中心';
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 120,
        menuTabs: ['filterMenuTab'],
        valueGetter: (params) => {
          if (params.data) {
            return this.datepipe.transform(params.data['cdate'], 'y-MM-dd HH:mm');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流专员', field: 'notifiername', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'wuliuordertype', width: 90,
        menuTabs: ['filterMenuTab']
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">作废</a>';
        }, onCellClicked: (data) => {
          const obj = { purchaseRequestId: data.data.id };
          const wuliuorderids = [data.data.id];
          if (confirm('你确定要作废吗？')) {
            this.businessorderApi.zuofei(wuliuorderids).then(() => {
              this.toast.pop('success', '作废成功！');
              this.orderid = this.route.params['value']['id'];
              this.getMyRole();
              this.listDetail();
              this.getDetail();
            });
          }
        }
      }
    ];
    this.orderchangegridOptions = {
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
      getContextMenuItems: this.settings.getContextMenuItems,
    };
    this.orderchangegridOptions.onGridReady = this.settings.onGridReady;
    this.orderchangegridOptions.groupSuppressAutoColumn = true;
    this.orderchangegridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'orderdetid', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '变更类型', field: 'type', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '变更内容', field: 'describe', width: 120,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核人', field: 'vusername', width: 110,
        cellRenderer: (params) => this.vuserRenderer(params.data.vusername, params.data.vuserindex)
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', width: 80
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '审核时间', field: 'vdate', width: 90
      }
    ];
    this.orderid = this.route.params['value']['id'];
    this.getMyRole();
    this.listDetail();
    this.getDetail();
  }
  vuserRenderer(val: string, regStr: any): any {
    if (regStr === undefined || regStr === null) { return val; }
    if (!val) { return null; }
    let params: any = '';
    const arr = val.split(',');
    for (let i = 0; i < arr.length; i++) {
      if (regStr === i) {
        arr[i] = `<mark style="color: #1890ff;">` + arr[i] + `</mark>`;
      }
    }
    params = arr.join(',');
    return params;
  }
  ngOnInit() {
    this.getMyRole();
    this.ckfeetypeonHide();
    this.queryallocation();
    this.getProorderDetail();
  }
  getProorderDetail() {
    this.proOrderApi.getdet(this.route.params['value']['id']).then((data) => {
      this.proordergridOptions.api.setRowData(data);
    });
  }
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    const cuser = JSON.parse(localStorage.getItem('cuser'));
    if (myrole.some(item => item === 10)) {
      this.isSaleman = true;
      this.wuliuOffergridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'innerprice' || colde.colId === 'wlcustomername' || colde.colId === 'innerjine') {
          colde.hide = true;
        }
      });
    } else {
      this.isSaleman = false;
    }
    // 获取物流竞价明细表
    this.businessorderApi.wuliuofferdetail(this.orderid).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
      this.wuluiorderlist = data;
    });
  }

  /**查询配款明细表 */
  queryallocation() {
    this.qihuoapi.findAllocation(this.orderid).then(data => {
      this.allocationgridOptions.api.setRowData(data);
    });
  }

  ckfeetypeonHide() {
    this.ckfeetype.onHide.subscribe(data => {
      if (!isNaN(this.chukufeetypess['value'])) {
        this.chukufeetypess['type'] = this.chukufeetypess['value'];
        this.chukufeetypess['gn'] = this.params['data'].gn;
        this.chukufeetypess['cangkuid'] = this.params['data'].cangkuid;
        this.chukufeetypess['chandi'] = this.params['data'].chandi;
        this.chukufeetypess['gcid'] = this.params['data'].gcid;
        this.chukufeetypess['orderid'] = this.businessorder['id'];
        this.businessorderApi.getchukufeetype(this.chukufeetypess).then(() => {
          this.listDetail();
          this.getDetail();
          this.toast.pop('success', '修改成功');
        });
      }
    });
  }

  // 获取网格中的数据
  listDetail() {
    this.orderApi.get(this.route.params['value']['id']).then((data) => {
      this.isshowzhibaoshu = data['isshowzhibaoshu'];
      this.businessorder = data['order'];
      this.userApi.userInfo().then((response) => {
        if (response.admin) {
          this.flag['recalculate'] = true;
        } else {
          this.flag['recalculate'] = false;
        }
      });
      if (this.businessorder['status'] !== 7 && this.businessorder['status'] !== 8) {
        this.flag['show'] = true;
      } else {
        this.flag['show'] = false;
      }
      if (this.businessorder['status'] === 3) {
        this.flag['fin'] = true;
      }
      if (this.businessorder['cuserid'] === this.current['id']) {
        if (!this.businessorder['isv']) {
          this.flag['save'] = true;
          if (this.businessorder['status'] === 0) {
            this.flag['submitV'] = true;
          } else {
            this.flag['submitV'] = false;
          }
        }
        if (this.businessorder['isv']) {
          if (this.businessorder['status'] === 2) {
            this.flag['pay'] = true;
          }
        }
        if (this.businessorder['status'] === 0) {// 制单中订单可以删除
          this.flag['del'] = true;
          this.flag['import'] = true;
          this.flag['save'] = true;
        } else {
          this.flag['del'] = false;
          this.flag['import'] = false;
          this.flag['save'] = false;
        }
        if (this.businessorder['status'] === 1 || this.businessorder['status'] === 2) {// 取消订单
          this.flag['cancels'] = true;
        } else {
          this.flag['cancels'] = false;
        }
      }
      if (this.businessorder['arrearspeopleid'] === this.current['id']) {
        if (this.businessorder['isv']) {
          if (this.businessorder['status'] === 2) {
            this.flag['arrearspay'] = true;
          }
        }
      }
      if (this.businessorder['vuserid'] === this.current['id']) {
        if (!this.businessorder['isv']) {
          this.flag['verify'] = true;
        } else {
          this.flag['cancelverify'] = true;
        }
      }
      if (this.businessorder['ordertype'] === 4 && this.businessorder['isself']) {
        this.flag['isxianhuoself'] = true;
      }
      if (this.businessorder['status'] !== 9) {
        this.flag.qihuochangestatus = 0;
      }
    });
  }

  getDetail() {
    this.businessorderApi.getdet(this.orderid).then((data) => {
      this.orderdetlist = data;
      this.gridOptions.api.setRowData(data);
      // 变更中显示变更后的明细
      setTimeout(() => {
        this.getorderchangeloglist();
      }, 100);
    });
  }



  importKucun() {
    this.bsModal.config.class = 'modal-all';
    this.kcbsModalRef = this.bsModal.show(KucundetimportComponent);
    this.kcbsModalRef.content.isimport = this.isimport;
    this.kcbsModalRef.content.componentparent = this;
  }

  businessorderk(data) {
    this.kcbsModalRef.hide();
    this.listDetail();
    this.getDetail();
  }

  importFav() {
    const fav = this.storage.getObject('fav');
    if (fav) {
      this.bsModal.config.class = 'modal-all';
      this.favbsModalRef = this.bsModal.show(FavoritelistComponent);
      this.favbsModalRef.content.isimport = this.isimport;
      this.favbsModalRef.content.parentthis = this;
      this.favbsModalRef.content.parentVar(this);
    } else {
      this.toast.pop('warning', '收藏夹中没有货物！！！');
      // Notify.alert("收藏夹中没有货物！！！",{status:'warning'});
    }
  }
  // 物流竞价明细表修改卸货联系人
  modifyxhlianxiren(params) {
    const obj = {};
    obj['xhlianxirenphone'] = params.data.xhlianxirenphone;
    obj['xhlianxiren'] = params.data.xhlianxiren;
    obj['id'] = params.data.id;
    this.qihuoapi.editxhlianxiren(obj).then(data => {
      this.toast.pop('success', '修改成功');
      this.getMyRole();
    });
  }
  businessorderfav(data) {
    this.favbsModalRef.hide();
    this.listDetail();
    this.getDetail();
  }

  addbyunfeeDialog() {
    if (this.businessorder['type'] === 0) {
      this.toast.pop('warning', '自提的订单无需添加运费！');
      return '';
    }
    if (!this.businessorder['tweight']) {
      this.toast.pop('warning', '请你选择购买的货物之后进行价格的填写！');
      return '';
    }
    if (this.businessorder['status'] > 2) {
      this.toast.pop('warning', '非制单中的订单不允许修改运费！！');
      return '';
    }
    this.yunfeeModel = {};
    this.addyunfeeshow();
  }

  // 计算总运费
  calctprice() {
    if (!this.businessorder['tweight']) {
      return '';
    }
    if (this.yunfeeModel['perprice']) {
      this.yunfeeModel['tprice'] = (parseFloat(this.yunfeeModel['perprice']) * parseFloat(this.businessorder['tweight'])).toFixed(2);
    }
  }

  // 计算运费单价
  calcperprice() {
    if (!this.businessorder['tweight']) {
      return '';
    }
    if (this.yunfeeModel['tprice']) {
      this.yunfeeModel['perprice'] = (parseFloat(this.yunfeeModel['tprice']) / parseFloat(this.businessorder['tweight'])).toFixed(2);
    }
  }

  // 提交审核
  submitVerify() {
    if (this.businessorder['ischuliquality'] === null && this.businessorder['isself']) {
      this.toast.pop('warning', '请选择是否处理质量异议');
      return;
    }
    if (!this.businessorder['vuserid']) {
      this.toast.pop('warning', '请填写审核人');
      // Notify.alert('请填写审核人', { status: 'warning' });
      return '';
    }
    if (null == this.businessorder['beizhu']) {
      this.businessorder['beizhu'] = '';
    }
    if (confirm('你确定要提交审核人吗？')) {
      // tslint:disable-next-line:max-line-length
      this.businessorderApi.submitVuser(this.businessorder['id'], { vuserid: this.businessorder['vuserid'], beizhu: this.businessorder['beizhu'] }).then((data) => {
        this.businessorder = data['order'];
        this.router.navigateByUrl('order');
        this.toast.pop('success', '审核人提交成功');
      });
    }
  }

  // 业务销售单审核
  Verify() {
    if (!this.businessorder['vuserid']) {
      this.toast.pop('warning', '请填写审核人');
      return '';
    }
    if (confirm('你确定要审核吗？')) {

      this.businessorderApi.verify(this.businessorder['id'], { version: this.businessorder['version'] }).then((data) => {
        this.businessorder = data['order'];
        this.router.navigateByUrl('order');
        this.toast.pop('success', '审核成功');
      });
    }
  }

  // 拒绝审核
  refuseverify() {
    if (confirm('你确定要拒绝审核吗？')) {
      // tslint:disable-next-line:max-line-length
      this.businessorderApi.refuseverify(this.businessorder['id'], { msg: '该订单不予审核，请审查无误再次提交审核！', version: this.businessorder['version'] }).then((data) => {
        this.businessorder = data['order'];
        this.router.navigateByUrl('order');
        this.toast.pop('success', '拒审成功');
      });
    }
  }

  // 放弃审核
  cancelVerify() {
    if (confirm('你确定要弃审吗？')) {
      this.businessorderApi.cancelVerify(this.businessorder['id'], { version: this.businessorder['version'] }).then((data) => {
        this.toast.pop('success', '弃审成功');
        // Notify.alert('弃审成功', { status: 'success' });
        this.businessorder = data;
        this.router.navigateByUrl('order');
        // $state.go('app.order');
      });
    }
  }

  b: boolean = false;
  // 弹出支付对话框
  payorderDialog() {
    console.log(1111111);
    for (let i = 0; i < this.orderdetlist.length; i++){
      console.log(22222222);
      console.log(this.orderdetlist.length);
      if(this.orderdetlist[i].pertprice.sub(this.orderdetlist[i].price)<=0){
        console.log(333333333);
        console.log(this.b);
        this.b = true;
      }
    }
    if(this.b){
      if(confirm('该订单销售单价＜（=）考核单价，请确认是否需要变更')){
        this.orderchange();
      }else{
        this.payordershow();
        this.businessorderApi.getmoney1({ buyerid: this.businessorder['buyerid'], wcustomerid: this.businessorder['sellerid'] }).then(data => {
          if (!data['wyue']) {
            this.msg['currentmoney'] = '0';
          } else {
            this.msg['currentmoney'] = data['wyue'];
          }
          this.msg['paymoney'] = this.businessorder['tjine'];
          if (this.msg['currentmoney'].sub(this.msg['paymoney']) < 0) {
            this.msg['arrearsjine'] = this.msg['currentmoney'].sub(this.msg['paymoney']);
            // if (this.msg['currentmoney'].sub(0) < 0) {
            if (data['oyue'].sub(0) < 0) {
              this.overdraft['tjine'] = this.msg['paymoney'];
            } else {
              this.overdraft['tjine'] = this.msg['arrearsjine'].mul('-1');
            }
            this.msg['flag'] = true;
            this.msg['payflag'] = true;
          } else {
            this.msg['arrearsflag'] = true;
          }
        });
      }
    }else{
      this.payordershow();
      this.businessorderApi.getmoney1({ buyerid: this.businessorder['buyerid'], wcustomerid: this.businessorder['sellerid'] }).then(data => {
        if (!data['wyue']) {
          this.msg['currentmoney'] = '0';
        } else {
          this.msg['currentmoney'] = data['wyue'];
        }
        this.msg['paymoney'] = this.businessorder['tjine'];
        if (this.msg['currentmoney'].sub(this.msg['paymoney']) < 0) {
          this.msg['arrearsjine'] = this.msg['currentmoney'].sub(this.msg['paymoney']);
          // if (this.msg['currentmoney'].sub(0) < 0) {
          if (data['oyue'].sub(0) < 0) {
            this.overdraft['tjine'] = this.msg['paymoney'];
          } else {
            this.overdraft['tjine'] = this.msg['arrearsjine'].mul('-1');
          }
          this.msg['flag'] = true;
          this.msg['payflag'] = true;
        } else {
          this.msg['arrearsflag'] = true;
        }
      });
    }
  }
  // 提交欠款发货申请
  submitapply() {
    this.overdraft['billid'] = this.businessorder['id'];
    this.overdraft['yedate'] = this.datepipe.transform(this.yedate, 'y-MM-dd');
    if (!this.overdraft['goodsmsg']) {
      this.toast.pop('warning', '请填写货物名称！');
      return;
    }
    if (!this.overdraft['days']) {
      this.toast.pop('warning', '请填写欠款天数！');
      return;
    }
    if (!this.overdraft['reason']) {
      this.toast.pop('warning', '请填写欠款原因！');
      return;
    }
    this.overdraft['type'] = 1;
    this.businessorderApi.createoverdraft(this.overdraft).then(() => {
      this.payorderhide();
      this.arrearspayhide();
      this.listDetail();
      this.getDetail();
      this.toast.pop('success', '提交成功');
    });
  }
  // 欠款支付申请按钮
  arrearspayapply() {
    // this.payorderhide();
    // tslint:disable-next-line:max-line-length
    // this.businessorderApi.arrears({ orderid: this.businessorder['id'], jine: this.msg['arrearsjine'], version: this.businessorder['version'] }).then(() => {
    //   this.toast.pop('success', '提交成功');
    // });
    this.arrearspayshow();
  }

  zhiyajinapply() {
    this.overdraft['billid'] = this.businessorder['id'];
    this.overdraft['yedate'] = this.datepipe.transform(this.yedate, 'y-MM-dd');
    if (!this.overdraft['goodsmsg']) {
      this.toast.pop('warning', '请填写货物名称！');
      return;
    }
    if (!this.overdraft['days']) {
      this.toast.pop('warning', '请填写欠款天数！');
      return;
    }
    if (!this.overdraft['reason']) {
      this.toast.pop('warning', '请填写欠款原因！');
      return;
    }
    this.overdraft['zhiyajins'] = this.zhiyajins;
    this.overdraft['type'] = 1;
    this.businessorderApi.createoverdraft(this.overdraft).then(() => {
      this.payorderhide();
      this.arrearspayhide();
      this.listDetail();
      this.getDetail();
      this.toast.pop('success', '提交成功');
    });

  }

  // 质押金引用金额填写
  showeditdialog(id, weiimpjine) {
    this.zhiyajinimpid = id;
    this.weiimpjine = weiimpjine;
    this.zhiyajinusejineeditor.show();
  }
  closeeditdialog() {
    this.zhiyajinimpid = null;
    this.weiimpjine = null;
    this.zhiyajinusejineeditor.hide();
  }
  // 使用质押金
  usezhiyajin() {
    if (!this.zhiyajinimpjine) {
      this.toast.pop('warning', '请填写要引用的质押金金额！');
      return;
    }
    if (Number(this.weiimpjine) < Number(this.zhiyajinimpjine)) {
      this.toast.pop('warning', '引用的金额不允许大于未使用金额！');
      return;
    }
    let imptzhiyajine = 0;
    this.zhiyajins.forEach(element => {
      if (element.id === this.zhiyajinimpid) {
        element.zhiyajinimpjine = this.zhiyajinimpjine;
        element.isshowzhiyajininput = false;
      }
      imptzhiyajine = Number(element.zhiyajinimpjine ? element.zhiyajinimpjine : 0) +
        Number(imptzhiyajine ? imptzhiyajine : 0);
    });
    this.overdraft['tzhiyajinjine'] = imptzhiyajine;
    this.zhiyajinimpjine = null;
    this.closeeditdialog();
  }
  modifyzhiyajin(id) {
    this.zhiyajins.forEach(element => {
      if (element.id === id) {
        element.isshowzhiyajininput = true;
      }
    });
  }
  arrearspayshow() {
    // 判断是否可以进行质押金欠款
    this.orderApi.listzhiyajin(this.businessorder['buyerid']).then(data => {
      this.haszhiyajin = data['haszhiyajin'];
      this.zhiyajins = data['zhiyajins'];
    });
    this.arrearspayDialog.show();
  }
  arrearspayhide() {
    this.arrearspayDialog.hide();
  }

  // 欠款支付
  arrearspay() {
    this.businessorderApi.getmoney({ buyerid: this.businessorder['buyerid'], wcustomerid: this.businessorder['sellerid'] }).then((data) => {
      if (!data['wyue']) {
        this.msg['currentmoney'] = '0';
      } else {
        this.msg['currentmoney'] = data['wyue'];
      }
      this.msg['paymoney'] = this.businessorder['tjine'];
      this.msg['arrearsjine'] = this.msg['currentmoney'].sub(this.msg['paymoney']);
      // tslint:disable-next-line:max-line-length
      if (confirm('账户余额：' + this.msg['currentmoney'] + ',订单金额：' + this.businessorder['tjine'] + ',你确定欠款支付￥' + this.msg['arrearsjine'] + '吗?')) {
        this.businessorderApi.pay(this.businessorder['id'], { paycode: '', version: this.businessorder['version'] }).then(() => {
          this.toast.pop('order');
          this.toast.pop('success', '支付成功');
        });
      }
    });
  }

  // 获取验证码并且控制倒计时显示
  getpaycode() {
    let second = 60;
    let timePromise = undefined;
    timePromise = setInterval(() => {
      if (second <= 0) {
        clearInterval(timePromise);
        this.msg.flag = false;
        timePromise = undefined;
        second = 60;
        this.msg.name = '重发验证码';
      } else {
        this.msg.name = second + '秒后可重发';
        this.msg.flag = true;
        second--;
      }
    }, 1000, 100);
    this.businessorderApi.getCode({ billno: this.businessorder['billno'] }).then((data) => {
      this.toast.pop('success', '验证码发送成功');
    });
  }

  // 支付
  pay() {
    if (this.msg['code']) {
      this.businessorderApi.pay(this.businessorder['id'],
        { paycode: this.msg['code'], version: this.businessorder['version'] }).then((data) => {
          this.payorderhide();
          try {
            if (data['flag']) {
              this.router.navigateByUrl('order');
              this.toast.pop('success', '付款成功');
            } else {
              this.toast.pop('warning', '客户的账户余额不足，请提醒充值！！！');
            }
          } catch (error) {
            this.toast.pop('warning', '客户的账户余额不足，请提醒充值！！！');
          }
        });
    } else {
      this.toast.pop('warning', '请输入验证码');
    }
  }


  // 删除制单中订单
  delbusinessorder(id) {
    if (confirm('你确定删除吗？')) {
      this.businessorderApi.del(id).then(() => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('order');
      });
    }
  }

  // 取消订单
  cancelbusinessorder(model) {
    if (model.status > 2) {
      this.toast.pop('warning', '已经付款的订单不能取消');
      return '';
    }
    if (model.cuserid !== this.current['id']) {
      this.toast.pop('warning', '非订单创建者，不能取消！');
      return '';
    }
    if (confirm('你确定取消订单吗？')) {
      this.businessorderApi.cancelorder(model.id, { version: model.version }).then(() => {
        this.toast.pop('success', '订单取消成功');
        this.router.navigateByUrl('order');
      });
    }
  }

  // 查看已打印的订单
  print() {
    this.orderApi.print(this.route.params['value']['id']).then((response) => {
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
        // Notify.alert(response.msg, { status: 'warning' });
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
      // Notify.alert(response.msg, { status: 'warning' });
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

  // 业务员主动完成订单
  finish(id, version) {
    if (confirm('你确定要完成此订单吗?')) {
      this.businessorderApi.finish(id, { version: version }).then((data) => {
        if (data.json()) {
          this.toast.pop('success', '订单已完成，未提货物已退回库存中！');
          this.router.navigateByUrl('order');
        }
      });
    }
  }

  recalculate() {
    this.businessorderApi.recalculate(this.route.params['value']['id']).then(() => {
      this.toast.pop('success', '计算成功');
      this.listDetail();
      this.getDetail();
    });
  }

  // 保存
  save() {
    if (null == this.businessorder['beizhu']) {
      this.businessorder['beizhu'] = '';
    }
    this.businessorderApi.save(this.businessorder['id'], { beizhu: this.businessorder['beizhu'] }).then(() => {
      this.listDetail();
      this.getDetail();
      this.toast.pop('success', '保存成功');
    });
  }

  selectNull() {
    this.yunfeeModel = {};
  }



  payordershow() {
    this.payorder.show();
  }

  payorderhide() {
    this.payorder.hide();
  }



  addyunfeeshow() {
    this.addyunfee.show();
  }

  addyunfeehide() {
    this.addyunfee.hide();
  }



  ckfeetypehideDialog() {
    this.ckfeetype.hide();
  }

  ckfeetypeshowDialog() {
    this.ckfeetype.show();
  }



  yunfeeshowDialog() {
    this.yunfeeDialog.show();
  }

  yunfeehideDialog(object) {
    this.yunfeeDialog.hide();
  }

  jiagongfeeshowDialog(params) {
    this.jiagongfeemodel = {};
    this.jiagongfeemodel['gcid'] = params.data.gcid;
    this.jiagongfeemodel['orderid'] = this.businessorder['id'];
    this.jiagongfeemodel['cangkuid'] = params.data.cangkuid;
    this.jiagongfeeDialog.show();
  }
  submitjiagongfee() {
    this.businessorderApi.modifyjiagongfee(this.jiagongfeemodel).then(() => {
      this.listDetail();
      this.getDetail();
      this.jiagongfeehideDialog();
    });
  }

  jiagongfeehideDialog() {
    this.jiagongfeeDialog.hide();
  }

  priceshowDialog(gcid, cangkuid, pertprice, price) {
    this.salepricemodel = null;
    this.diyfeeHeji = 0;
    this.gcid = null; this.cangkuid = null;
    this.gcid = gcid; this.cangkuid = cangkuid;
    this.salepricemodel = { pertprice: pertprice, price: price };
    this.findyugufee(this.orderid, gcid, cangkuid);
    this.priceDialog.show();
  }
  pricehideDialog() { this.priceDialog.hide(); }
  addyugufeetodb() {
    if (!this.feemodel['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel['price'] && 'number' === typeof this.feemodel['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    this.feemodel['orderid'] = this.orderid;
    this.feemodel['gcid'] = this.gcid;
    this.feemodel['cangkuid'] = this.cangkuid;
    if (confirm('你确定要添加费用吗？')) {
      this.orderApi.addfee(this.feemodel).then(data => {
        this.toast.pop('success', '添加成功!');
        this.findyugufee(this.orderid, this.gcid, this.cangkuid);
        this.diyfeeHeji = this.diyfeeHeji['add'](this.feemodel['price']);
        this.feemodel = { feetype: null, price: null, beizhu: null };
      });
    }
  }
  modifysaleprice() {
    if (!this.salepricemodel['pertprice']) {
      this.toast.pop('warning', '请输入销售价格');
      return;
    }
    if (confirm('你确定价格修改无误，提交修改吗？')) {
      if (!isNaN(this.salepricemodel['pertprice'])) {
        this.salepricemodel['orderid'] = this.orderid;
        this.salepricemodel['gcid'] = this.gcid;
        this.salepricemodel['cangkuid'] = this.cangkuid;
        this.businessorderApi.changetprice(this.salepricemodel).then(() => {
          this.listDetail();
          this.getDetail();
          this.toast.pop('success', '价格修改成功');
          this.pricehideDialog();
        });
      }
    }
  }
  delorderfeeindb(orderfeedetid, feeprice) {
    if (this.businessorder['status'] === 9) {
      this.toast.pop('warning', '合同变更中不允许删除费用！');
      return;
    }
    if (confirm('你确定要删除费用吗？')) {
      this.orderApi.delorderfee(orderfeedetid).then(data => {
        this.findyugufee(this.orderid, this.gcid, this.cangkuid);
        this.diyfeeHeji = this.diyfeeHeji['sub'](feeprice);

      });
    }
  }
  // 查找已经添加到该明细下的费用
  findyugufee(orderid, gcid, cangkuid) {
    this.orderApi.findYugufees({ gcid: gcid, cangkuid: cangkuid, orderid: orderid }).then(data => {
      this.diyfeeHeji = 0;
      this.lines = data;
      this.lines.forEach(e => {
        this.diyfeeHeji = this.diyfeeHeji['add'](e.feeprice);
      });
    });
  }
  // 控制显示添加框
  showInput() {
    if (this.businessorder['status'] === 9) {
      this.toast.pop('warning', '合同变更中不允许插入费用！');
      return;
    }
    this.isshowInput = !this.isshowInput;
  }


  yunfeeok() { }
  /**配款弹窗 */
  addallocationdialog() {
    if (this.businessorder['status'] === 0) {
      this.toast.pop('warning', '请审核后添加配款！');
      return;
    }
    const moneyquery = { buyerid: this.businessorder['buyer']['id'], wcustomerid: this.businessorder['seller']['id'] };
    this.moneyapi.getmoney(moneyquery).then(data => {
      if (!data['wyue']) {
        this.curyue = 0;
      } else {
        this.curyue = data['wyue'];
      }
    });
    this.xuyue = Number(this.businessorder['tjine'])['sub'](Number(this.businessorder['allocation']));
    this.allocationModel.show();
  }
  closeallocationdialog() {
    this.allocationModel.hide();
  }
  addallocation() {
    if (this.allocation['jine'] === null || this.allocation['jine'] === undefined || this.allocation['jine'] === '') {
      this.toast.pop('warning', '请输入实付配款金额！');
      return;
    }
    const allAllocationJine = Number(this.allocation['jine'])['add'](Number(this.businessorder['allocation']));
    if (allAllocationJine > Number(this.businessorder['tjine'])) {
      this.toast.pop('warning', '配款总金额大于合同金额，请重新输入！');
      return;
    }
    const model = {
      buyerid: this.businessorder['buyer']['id'],
      wcustomerid: this.businessorder['seller']['id'],
      qihuoid: this.businessorder['id'],
      jine: this.allocation['jine']
    };
    this.qihuoapi.addAllocation(model).then(() => {
      this.toast.pop('success', '添加成功');
      this.closeallocationdialog();
      this.listDetail();
      this.queryallocation();
    });
  }
  shifangallocationdialog() {
    this.shifangallocationModel.show();
  }
  closeshifangallocationdialog() {
    this.shifangallocationModel.hide();
  }
  shifangAllocation() {
    if (Number(this.businessorder['allocation']) - Number(this.allocation['jine']) < 0) {
      this.toast.pop('warning', '释放配款太多，配款余额不足，请重新输入！');
      return;
    }
    const model = {
      buyerid: this.businessorder['buyer']['id'], wcustomerid: this.businessorder['seller']['id'],
      qihuoid: this.businessorder['id'], jine: this.allocation['jine'], reason: this.allocation['reason'],
      isxianhuo: true
    };
    this.qihuoapi.shifangAllocation(model).then(() => {
      this.closeshifangallocationdialog();
      this.queryallocation();
      this.listDetail();
    });
  }

  // 查询质保书
  getZhibaoUrl() {
    this.businessorderApi.getZhibaoUrl(this.orderid).then(data => {
      this.singleData = data;
      if (!this.singleData || !this.singleData.length) {
        this.toast.pop('warning', '未查询到质保书!');
        return;
      }
      this.zhibaoshuModel.show();
    });
  }

  closezhibaoshudialog() {
    this.zhibaoshuModel.hide();
  }
  /**选择多选框 */
  checkboxchange(event) {
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }
  /**全选 */
  allcheck() {
    if (this.isall) {
      this.singleData.forEach(item => {
        item.checked = false;
      });
    } else {
      this.singleData.forEach(item => {
        item.checked = true;
      });
    }
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }

  /**一键下载质保书 */
  alldownload() {
    const files = [];
    this.singleData.forEach(item => {
      if (item.checked && item.url) {
        files.push(item.url);
      }
    });
    if (files.length) {
      this.businessorderApi.downlodezhibao({ pathList: files }).then(data => {
        if (data['zipurl']) {
          window.open(data['zipurl']);
        }
      });
    } else {
      this.toast.pop('warning', '请选择要下载的质保书！');
    }
  }

  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    if (this.businessorder['type'] !== 1) {
      this.toast.pop('warning', '运输类型只有代运才能通知物流专员报价！！！');
      return;
    }
    if (this.businessorder['isself'] && !this.businessorder['isv']) {
      this.toast.pop('warning', '自销的合同请在审核通过之后进行询价！！！');
      return;
    }
    if (!this.businessorder['isself'] && !this.businessorder['paydate']) {
      this.toast.pop('warning', '代销的合同请在付款之后进行询价！！！');
      return;
    }
    const orderdetids = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data.id && orderdetSelected[i].selected) {
        orderdetids.push(orderdetSelected[i].data.id);
        // this.selectQihuodetWuliubaojia.push({
        // id: orderdetSelected[i].data.id,
        // guige: orderdetSelected[i].data['guige'],
        // weight: orderdetSelected[i].data['weight'],
        // baojialiang: orderdetSelected[i].data['weight'],
        // sumyibaojia: orderdetSelected[i].data['ybaojiaweight'] || 0
        // });
      }
    }
    if (orderdetids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的现货明细！！！');
      return;
    }

    this.businessorderApi.orderdetgroup(orderdetids).then(data => {
      this.selectQihuodetWuliubaojia = data;
      this.modalService1.config.class = 'modal-lg';
      // 通知物流报价弹窗的参数
      this.noticewuliuparams = {
        qihuodets: this.selectQihuodetWuliubaojia,
        id: this.businessorder['id'],
        detids: orderdetids, datasource: 1
      };
      this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
      this.bsModalRef.content.parentThis = this;
    });
  }

  wuliunoticehide() {
    this.bsModalRef.hide();
    this.listDetail();
    this.getDetail();
    this.getMyRole();
  }

  openmodifymain() {
    this.editorder = JSON.parse(JSON.stringify(this.businessorder));
    this.findAddr(this.editorder['buyerid'], true);
    this.buyer = {};
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
    this.classifyapi.getChildrenTree({ pid: 263 }).then((data) => {
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
    this.classifyapi.getChildrenTree({ pid: this.addr['provinceid'] }).then((data) => {
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
    this.classifyapi.getChildrenTree({ pid: this.addr['cityid'] }).then((data) => {
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
  /**点击期货变更按钮 */
  orderchange() {
    if (this.flag['qihuochangestatus'] === 0) {
      if (confirm('待付款状态，可变更项 ：考核价格\n点击后合同不能被其他单据引用，确定要变更吗？')) {
        if (this.flag['isorderchange']) {
          this.qihuoapi.orderchange(this.orderid).then(data => {
            this.listDetail();
            this.getDetail();
          });
        }
      }
    } else if (this.flag['qihuochangestatus'] === 1) {
      this.showqhchangetijiao();
    }
  }
  showqhchangetijiao() {
    this.qhchangetijiaoModel.show();
    this.qhchangetijiaobeizhu = '';
  }
  qhchangetijiaoclose() {
    this.qhchangetijiaoModel.hide();
  }
  qhchangetijiao() {
    if (!this.qhchangetijiaobeizhu) {
      this.toast.pop('warning', '请输入备注！');
      return;
    }
    if (confirm('确定要提交期货变更吗？')) {
      const json = { orderid: this.orderid, beizhu: this.qhchangetijiaobeizhu };
      this.qihuoapi.orderchangesubmitverify(json).then(data => {
        this.listDetail();
        this.getDetail();
        this.qhchangetijiaoclose();
      });
    }
  }
  /**获取变更记录,更新当前明细 */
  getorderchangeloglist() {
    this.qihuoapi.getqihuochangeloglist(this.orderid).then(res => {
      const data = res['list'];
      if (res['isqihuochange'] &&
        (this.businessorder['status'] === 2 || this.businessorder['status'] === 9) && !this.businessorder['isself']) {
        this.flag['isorderchange'] = true;
      } else {
        this.flag['isorderchange'] = false;
      }
      if (data.length && ((this.flag['qihuochangestatus'] === 0 || this.flag['qihuochangestatus'] === 1)
        && this.businessorder['status'] === 9)) {
        const validData = data.filter(ele => ele['status'] !== 3 && ele['status'] !== 4);
        this.validQihuochangedet = validData;
        this.qihuodetchange(validData);
        if (validData.length) {
          // 期货变更中，期货变更审核中 qihuoflag['qihuochangestatus']: 0 // 期货变更状态：0:变更前;1:变更中;2:审核中
          if (validData.some(ele => ele['status'] === 1)) {
            this.flag['qihuochangestatus'] = 1;
          } else if (validData.some(ele => ele['status'] === 2)) {
            this.flag['qihuochangestatus'] = 2;
          }
          if (this.flag['qihuochangestatus'] === 2) {
            this.flag['isorderchange'] = false;
          }
        } else {
          if (this.businessorder['status'] === 9) {
            this.flag['qihuochangestatus'] = 1;
          }
        }
      } else if (!data.length) {
        if (this.businessorder['status'] === 9) {
          this.flag['qihuochangestatus'] = 1;
          this.validQihuochangedet = [];
        }
      }
      this.orderchangegridOptions.api.setRowData(data);
    });
  }
  /**显示变更明细 */
  qihuodetchange(changeloglist: any[]) {
    for (let i = 0; i < changeloglist.length; i++) {
      const ele = changeloglist[i];
      if (ele['orderdetid']) { // 明细
        for (let j = 0; j < this.orderdetlist.length; j++) {
          const orderdetgroup = this.orderdetlist[j];
          for (let k = 0; k < orderdetgroup.participants.length; k++) {
            const element = orderdetgroup.participants[k];
            if (element['id'] === ele['orderdetid']) {
              if (ele['type'] === '内部结算价格变更') {
                element['price'] = ele['price'];
                orderdetgroup['price'] = ele['price'];
                break;
              }
            }
          }
        }
      }
    }
    this.gridOptions.api.setRowData(this.orderdetlist);
  }
  qualitShow() {
    this.addqualityModal.show();
  }
  hideaddModal() {
    this.addqualityModal.hide();
  }
  choice() {
    console.log(this.qualityModel['compensation']);
    if (!this.qualityModel['ischuliquality']) {
      this.toast.pop('warning', '请选择是否处理！');
      return;
    }
    if (!this.qualityModel['salebeizhu']) {
      this.toast.pop('warning', '请填写说明！');
      return;
    }
    if (!this.qualityModel['saletype']) {
      this.toast.pop('warning', '请填写类型！');
      return;
    }
    if (this.qualityModel['salejine'] === null) {
      this.toast.pop('warning', '请填写金额！');
      return;
    }
    this.qualityModel['id'] = this.businessorder['id'];
    this.hideaddModal();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.qualityModel = this.qualityModel;
    this.zlbsModalRef.content.parent = this;
  }
  addupdate() {
    let params = { ischuliquality: this.qualityModel['ischuliquality'], id: this.businessorder['id'] };
    this.orderApi.qualityUpdate(params).then(data => {
      console.log(data);
      if (data) {
        this.listDetail();
        this.hideaddModal();
      }
    });
  }
  // ==============================
  makezhibaoshu() {
    this.rukuApi.makezhibaoshu(this.businessorder['id']).then(data => {
      console.log(data);
      if (data['flag']) {
        this.toast.pop('success', data['msg']);
      } else {
        this.toast.pop('error', '质保书生成出现问题！');
      }
    });
  }
  searchplace(e) {
    console.log(e.query);
    this.matchcarApi.getSuggestionPlace(e.query).then(data => {
      console.log(data);
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.title + '\r\n' + element.address,
          code: element
        });
      });
    });
  }

 
 
 //批量删除明细
 orderdetids: any = [];
 deleteorderdet() {
   this.orderdetids = new Array();
   const orderdetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
   for (let i = 0; i < orderdetlist.length; i++) {
     if (orderdetlist[i].selected && orderdetlist[i].data && orderdetlist[i].data['id'] ) {
       this.orderdetids.push(orderdetlist[i].data.id);
     }
   }
   if (!this.orderdetids.length) {
     this.toast.pop('warning', '请选择明细之后再删除！');
     return;
   }
   if (confirm('你确定要删除吗？')) {
     this.businessorderApi.delbusinessorderDet(this.orderdetids).then(data => {
     this.toast.pop('success', '删除成功！');
   
      this.listDetail();
      this.getDetail();     
    });
   }
 }
 
  
}
