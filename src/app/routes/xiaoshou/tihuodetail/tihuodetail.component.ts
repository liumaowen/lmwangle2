import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessorderapiService } from './../../businessorder/businessorderapi.service';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../../dnn/service/storage.service';
import { ActivatedRoute } from '@angular/router';
import { XiaoshouapiService } from './../xiaoshouapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { WuliuscoreapiService } from 'app/routes/wuliu/wuliuscore/wuliuscoreapi.service';
import { CangkuApiService } from 'app/routes/cangku/cangkuapi.service';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { KucundetimportComponent } from 'app/dnn/shared/kucundetimport/kucundetimport.component';
import { RukuService } from 'app/routes/ruku/ruku.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-tihuodetail',
  templateUrl: './tihuodetail.component.html',
  styleUrls: ['./tihuodetail.component.scss']
})
export class TihuodetailComponent implements OnInit {
  @ViewChild('arrearspayDialog') private arrearspayDialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  //销售退货弹窗 
  @ViewChild('updateFeeModal') private updateFeeModal: ModalDirective;
  @ViewChild('uploadcarnumModal') private uploadcarnumModal: ModalDirective;
  @ViewChild('interestAddModal') private interestAddModal: ModalDirective;
  // 质押金使用金额填写
  @ViewChild('zhiyajinusejineeditor') private zhiyajinusejineeditor: ModalDirective;
  haszhiyajin: boolean;
  zhiyajins: any;
  impzhiyajinmodels: any = [];
  zhiyajinimpid: any;
  weiimpjine: any;
  zhiyajinimpjine: any;
  msg: any = { name: '获取验证码', flag: false, arrearsflag: false, payflag: false };
  // 控制页面按钮显示与否
  showflag: any = {};
  tihuo: any = {};
  citys: any[] = [];
  countys: any[] = [];
  destination: any;
  provinces: any[] = [];
  provinces2: any[] = [];
  citys2: any[] = [];
  countys2: any[] = [];
  updatefee: any = {};
  current = this.storage.getObject('cuser');
  yedate = new Date(); // 设定页面开始时间默认值
  minDate = new Date();
  overdraft = {};
  beizhu: '';
  isld = false;
  qihuoid: any;
  isshowsjfydw = true;
  //是否显示撤销欠款按钮
  iscxqk = false;
  // isdaiyun: Boolean;
  releasejine = null;// 释放金额
  sumjine = null;// 账户余额+释放金额+释放配款
  releaseallocation
  gridOptions: GridOptions;
  ldgridOptions: GridOptions;
  kcbsModalRef: BsModalRef;
  feegridOptions: GridOptions;
  feegridOptionsforsaleman: GridOptions;
  storagefeegridOptions: GridOptions;
  showlog = false;
  isshowgodingjin = false;
  loglist = [];
  ldlist: any = [];
  lddetids: any = [];
  isldyinru = false; // 临调提货引入库存
  wuliuscore: any = {}; // 物流公司
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['jpg', 'gif', 'png'] };
  // 设置上传的格式
  accept = 'image/jpeg,image/gif,image/png';
  url = '';
  // 上传匹配车号上传信息及格式
  uploadcarnumParam: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['xls'] };
  // 设置上传文件类型
  acceptcarnum = '.xls, application/xls';
  interestAddParams = {
    tihuoid: null, yingfujine: '', iszhifu: true, jine: 0,
    qiankuandays: '', qiankuanreason: '', yedate: null, isqiankuan: false, yue: 0, qiankuanhuokuanjine: 0
  }; // 资金占用利息登记对象
  // 评价物流弹窗
  @ViewChild('pingjiawuliumodal') private pingjiawuliumodal: ModalDirective;
  ratingobj: any = {
    tihuoid: this.tihuo.id, transcompanyid: this.tihuo['transcompanyid'],
    goodssafe1: 5, goodssafe2: 5, goodssafe3: 10, goodssafe4: 5, goodssafe5: 0, ability1: 0, ability2: false
  };
  isshowzhibaoshu: Boolean = false;
  constructor(public settings: SettingsService, private fb: FormBuilder, private tihuoApi: XiaoshouapiService,
    private cangkuApi: CangkuApiService, private orderApi: OrderapiService,
    private route: ActivatedRoute, private datepipe: DatePipe, private rukuApi: RukuService,
    private storage: StorageService, private toast: ToasterService, private businessOrderApi: BusinessorderapiService,
    private addressparseService: AddressparseService, private classifyApi: ClassifyApiService,
    private router: Router, private modalService: BsModalService, private customerapiService: CustomerapiService,
    private wuliuscoreapiService: WuliuscoreapiService) {
    this.tihuoForm = fb.group({
      // 'chehao': [null, Validators.compose([Validators.required, Validators.pattern('^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$')])],
      // 'siji': [null, Validators.compose([Validators.required, Validators.pattern('^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$')])],
      // 'sijitel': [null, Validators.compose([Validators.required, Validators.pattern('1[3|5|7|8|][0-9]{9}')])],
      // 'beizhu': [null, Validators.compose([])],
      // 'shouhuoaddr': [null, Validators.compose([])],
      'carnum': [],
      'driverinfo': [],
    });

    // 设置提货明细表
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: (params) => {
        if (params.data.group && params.node['selected']) {
          let childs = params.node.childrenAfterGroup;
          childs.forEach(data => {
            data.selectThisNode(true);
          })
        }
      },
      getNodeChildDetails: (params) => {
        if (params.group) {
          return {
            group: true,
            //大壮说的2022-08-31
            expanded: null != params.group,
            children: params.participants,
            field: 'group',
            key: params.group
          };
        } else {
          return null;
        }
      },
      localeText: this.settings.LOCALETEXT,
    };
    // 设置临调明细表
    this.ldgridOptions = {
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowSelection: 'multiple',
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
      onRowSelected: (params) => {
        if (params.data.group && params.node['selected']) {
          let childs = params.node.childrenAfterGroup;
          childs.forEach(data => {
            data.selectThisNode(true);
          })
        }
      },
      getNodeChildDetails: (params) => {
        if (params.group) {
          return {
            group: true,
            //expanded: null != params.group,
            children: params.participants,
            field: 'group',
            key: params.group
          };
        } else {
          return null;
        }
      },
    };
    this.feegridOptionsforsaleman = {
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
      onRowSelected: (params) => {
        if (params.data.group && params.node['selected']) {
          let childs = params.node.childrenAfterGroup;
          childs.forEach(data => {
            data.selectThisNode(true);
          })
        }
      },
      getNodeChildDetails: (params) => {
        if (params.group) {
          return { group: true,
            //大壮说的合起来2022-08-31
            //expanded: null != params.group, 
            children: params.participants, field: 'group', key: params.group };
        } else {
          return null;
        }
      }
    };

    // 设置临调明细表
    this.storagefeegridOptions = {
      groupDefaultExpanded: -1,//默认展开
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

    };

    this.feegridOptions.onGridReady = this.settings.onGridReady;
    this.feegridOptionsforsaleman.onGridReady = this.settings.onGridReady;
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.feegridOptions.groupSuppressAutoColumn = true;
    this.feegridOptionsforsaleman.groupSuppressAutoColumn = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    // 设置明细表表格数据
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', minWidth: 100, cellRenderer: 'group',
        headerCheckboxSelection: true, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyer.name', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 260,
        cellRenderer: (params) => {// 如有长度，规格中添加长度
          if (params.data.goodscode) {
            // let guiges = params.data.goodscode.guige.split(',');
            // if (params.data.isfp && params.data.length !== 0) {
            //   guiges[1] = guiges[1] + '*' + params.data.length;
            // } else {
            //   guiges[1] = guiges[1] + '*C';
            // }
            // let guige = '';
            // guiges.forEach(element => {
            //   guige = guige + element + ',';
            // });
            let guige = '';
            if (params.data.isfp && params.data.length !== 0) {
              guige = params.data.goodscode.guige + '_' + params.data.length;
            } else {
              guige = params.data.goodscode.guige + '_C';
            }
            return guige;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'cangku.name', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单价', field: 'pertprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '定价', field: 'price', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      // {
      //   cellStyle: { 'text-align': 'right' }, headerName: '费用单价', field: 'feeprice', width: 90,
      //   valueFormatter: this.settings.valueFormatter2
      // },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 100, editable: true,
        onCellValueChanged: params => {
          let search = { saleweight: params.newValue };
          this.tihuoApi.modifyWeight(params.data.id, search).then(data => {
            this.toast.pop('success', '重量修改成功！');
            this.listDetail();
          });
        }, cellRenderer: params => {
          if (!params.data.isldmodify) {
            params.data.editable = false;
          }
          return params.data.weight;
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 120
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '配送方式', field: 'order.type | type', minWidth: 100,
        cellRenderer: (params) => {
          if (params.data.orderdet) {
            if (params.data.orderdet.order.type === 0) {
              return '自提';
            } else if (params.data.orderdet.order.type === 1) {
              return '代运';
            } else {
              return '转货';
            }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnum', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费结算', field: 'chukufeetype', minWidth: 120,
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
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '变更后出库费', field: 'chukufeetype2', minWidth: 120,
        cellRenderer: (params) => {
          if (params.data.chukufeetype2 === 0) {
            return '现结';
          } else if (params.data.chukufeetype2 === 1) {
            return '月结';
          } else if (params.data.chukufeetype2 === 2) {
            return '免付';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费单价', field: 'orderdet.perchukuprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '货物状态', field: 'goodsstatus', minWidth: 100,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (null != params.data.status && 'true' === params.data.status.toString()) {
              return '实提';
            } else if (null != params.data.status && 'false' === params.data.status.toString()) {
              return '退回';
            } else {
              return '';
            }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '实提人', field: 'shitiman.realname', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否退货', field: 'isxstuihuo', minWidth: 90,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (params.data.isxstuihuo) { return '是'; } else { return '否'; }
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否补差', field: 'isxsbucha', minWidth: 90,
        cellRenderer: (params) => {
          if (!params.data.group) {
            if (params.data.isxsbucha) { return '是'; } else { return '否'; }
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估费用', field: 'name', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'tihuo.cdate', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 60,
        cellRenderer: (params) => {
          if (params.data.ishowzhibaoshu) {
            return '<a>查看质保书</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (!params.data.ishowzhibaoshu) {
            return;
          }
          this.rukuApi.printZhibaoshu(params.data.kunbaohao).then((response) => {
            if (!response['flag']) {
              this.toast.pop('warning', response['msg']);
              // Notify.alert(response['msg'], { status: 'warning' });
            } else {
              this.listDetail();
              // 判断是否为苹果
              const u = navigator.userAgent;
              const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
              if (isiOS) {
                this.showlook = true;
                this.srchetong = response['msg'];
              } else {
                window.open(response['msg']);
              }
            }
          });
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 90,
        cellRenderer: (params) => {
          if (params.data.tihuo) {
            if (params.data.tihuo.isld) {
              return '';
            }
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存备注', field: 'beizhu', minWidth: 120 }
    ];
    //临调明细表
    this.ldgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '选择', width: 56, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '买方单位', field: 'buyer.name', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', width: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', width: 260,
        cellRenderer: (params) => {// 如有长度，规格中添加长度
          // let guiges = params.data.goodscode.guige.split(',');
          // if (params.data.isfp && params.data.length !== 0) {
          //   guiges[1] = guiges[1] + '*' + params.data.length;
          // } else {
          //   guiges[1] = guiges[1] + '*C';
          // }
          // let guige = '';
          // guiges.forEach(element => {
          //   guige = guige + element + ',';
          // });
          // return guige;
          if (params.data.goodscode) {
            let guige = '';
            if (params.data.isfp && params.data.length !== 0) {
              guige = params.data.goodscode.guige + '_' + params.data.length;
            } else {
              guige = params.data.goodscode.guige + '_C';
            }
            return guige;
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库名称', field: 'tihuo.cangku.name', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'pertprice', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 100,
        onCellClicked: (params) => {
          this.openweightmodifydialog(params.data.id);
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '配送方式', field: 'order.type | type', width: 100,
        cellRenderer: (params) => {
          if (params.data.tihuo.type === 0) { return '自提'; } else if (params.data.tihuo.type === 1) { return '代运'; }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnum', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'tihuo.cdate', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'weight', width: 100,
        cellRenderer: () => {
          return '<a>引入</a>';
        },
        onCellClicked: (params) => {
          if (this.tihuo.status === 2) {
            this.toast.pop('warning', '待付款的提货单不允许引入!');
            return;
          }
          if (this.tihuo.status === 3) {
            this.toast.pop('warning', '货物已经出库不允许继续引入');
            return;
          }
          this.imprealgoods(params);
        }
      },
    ];
  
    // 设置费用明细的表格数据
    this.feegridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'group', minWidth: 100, cellRenderer: 'group',
        headerCheckboxSelection: true, checkboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 120,
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
      { cellStyle: { 'text-align': 'center' }, headerName: '实际费用单位', field: 'actualfeename', width: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用支付', field: 'isdianfu', width: 80,
        cellRenderer: (params) => {
          if (params.data.isdianfu) {
            return '垫付';
          } else {
            return '普通';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', width: 80,
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
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', width: 80,
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
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '内部单价', field: 'innerprice', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '内部金额', field: 'innerjine', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '库存id', field: 'kucunid', width: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '捆包号', field: 'kunbaohao', width: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', width: 80,
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
              title: '你确定删除此条费用明细吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.tihuoApi.removeTihuofee({ feecollectid: params.data.group }).then((response) => {
                // Notify.alert('删除成功！！！', { status: 'success' });
                this.toast.pop('success', '删除成功！！！');
                this.listFeeDetail();
                this.listDetail();
              });
              sweetalert.close();
            });
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 120 }
    ];

    // 设置费用明细的表格数据（具有业务员权限）
    this.feegridOptionsforsaleman.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'group', minWidth: 100, cellRenderer: 'group',
        headerCheckboxSelection: true, checkboxSelection: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', width: 120,
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
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', width: 100,
        cellRenderer: (params) => {
          if (params.data.group) {
            return '<a target="_blank">' + params.data.feename + '</a>';
          } else {
            return params.data.feename;
          }
        },
        onCellClicked: (params) => {
          if (params.data.group) {
            this.showUpdateFeeModal2(params.data);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用支付', field: 'isdianfu', width: 80,
        cellRenderer: (params) => {
          if (params.data.isdianfu) {
            return '垫付';
          } else {
            return '普通';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', width: 80,
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
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', width: 80,
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
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '系统单价', field: 'price', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '系统金额', field: 'jine', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实付单价', field: 'innerprice', width: 120,
        cellRenderer: (params) => {
          if (params.data.type === 1 || params.data.type === 2 || params.data.type === 3 || params.data.type === 4) {
            return '';
          } else {
            return params.data.innerprice;
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '实付金额', field: 'innerjine', width: 120,
        cellRenderer: (params) => {
          if (params.data.type === 1 || params.data.type === 2 || params.data.type === 3 || params.data.type === 4) {
            return '';
          } else {
            return params.data.innerjine;
          }
        }
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '库存id', field: 'kucunid', width: 80 },
      { cellStyle: { 'text-align': 'right' }, headerName: '捆包号', field: 'kunbaohao', width: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', width: 80,
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
              title: '你确定删除此条费用明细吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.tihuoApi.removeTihuofee({ feecollectid: params.data.group }).then((response) => {
                // Notify.alert('删除成功！！！', { status: 'success' });
                this.toast.pop('success', '删除成功！！！');
                this.listFeeDetail();
                this.listDetail();
              });
              sweetalert.close();
            });
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'miaoshu', width: 120 }
    ];

    // 设置费用明细的表格数据（具有业务员权限）
    this.storagefeegridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'settletypename', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '捆包号', field: 'kunbaohao', width: 120,
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用金额', field: 'storagefee', width: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'right' }, headerName: '核算方式', field: 'storagefeedescribe', width: 80 },
    ];

    this.listDetail();
    this.listFeeDetail();
  }

  ngOnInit() {
    //页面初始化的时候获取用户权限
    this.getMyRole();
  }
  imprealgoods(params) {
    //引入实际提货的货物
    this.isldyinru = false;
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    this.kcbsModalRef.content.qihuodetid = params.data.qihuodetid;
    this.kcbsModalRef.content.tihuodetid = params.data.id;
    this.kcbsModalRef.content.componentparent = this;
  }
  //引入操作
  imp(ids, qihuodetid, tihuodetid) {
    this.tihuoApi.addtihuodet({ kucunids: ids, tihuoid: this.tihuo.id, qihuodetid: qihuodetid, tihuodetid: tihuodetid }).then(data => {
      this.kcbsModalRef.hide();
      this.listDetail();
    })
  }
  getMyRole() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 10) {
        this.isshowsjfydw = false;
      }
    }
    this.listFeeDetail();
  }

  startaddr;
  listDetail() {
    this.tihuoApi.get(this.route.params['value']['id']).then((response) => {
      if(response['list'].length>0){
        this.startaddr = response['list'][0]['participants'][0]['cangku']['address'];
      }
      this.tihuo = response['tihuo'];
      this.wuliuscore = response['wuliuscore'];
      this.isld = this.tihuo['isld'];
      this.isshowzhibaoshu = response['isshowzhibaoshu'];
      this.isshowcxqk();
      // this.gridOptions.api.setRowData(response['list']);
      if (this.tihuo['billno'].substring(0, 2) !== 'LD') {
        this.qihuoid = response['list'][0]['orderid'];
      } else {
        this.qihuoid = 0;
      }
      this.ldlist = response['ldlist'];
      this.gridOptions.api.setRowData(response['list']);
      this.ldgridOptions.api.setRowData(response['ldlist']);
      if (this.tihuo['dingjinshifangtype'] === 2) {
        this.isshowgodingjin = true;
      }
      const lists = response['list'], details = [];
      lists.forEach(element => {
        details.push(...element['participants']);
      });
      if (details.some(d => d.status === null)) {
        this.showflag['ispingjia'] = false; // 业务员是否可以评价
      } else {
        this.showflag['ispingjia'] = true;
      }
      // if (this.tihuo.releasejine) {
      //   this.showflag['releasejine'] = true;
      // } else {
      //   this.showflag['releasejine'] = false;
      // }
      // if (this.tihuo.releaseallocation) {
      //   this.showflag['releaseallocation'] = true;
      // } else {
      //   this.showflag['releaseallocation'] = false;
      // }
      if (!this.tihuo.isdel) {
        if (this.tihuo.status !== 3) {
          this.showflag['chexiaotihuo'] = true;
        } else {
          this.showflag['chexiaotihuo'] = false;
        }
        if (this.tihuo.cuserid === this.current.id) {
          if (this.tihuo.isorderpay && this.tihuo.status === 1) {
            this.showflag['returngoods'] = true;
          } else {
            this.showflag['returngoods'] = false;
          }
          if (!this.tihuo.isorderpay && this.tihuo.status === 2) {
            this.showflag['returngoods'] = true;
          } else {
            this.showflag['returngoods'] = false;
          }
        }
        if (this.tihuo.status === 3 && this.tihuo.cuserid === this.current.id) {// 提货单的代付款状态
          this.showflag.cancelshiti = true;
        } else {
          this.showflag.cancelshiti = false;
        }
        if (this.tihuo.status === 2) {// 提货单的代付款状态
          if (this.tihuo.cuserid === this.current.id && this.tihuo.paytype === 0) {// 显示支付按钮
            this.showflag.pay = true;
          } else {
            this.showflag.pay = false;
          }
          if (this.tihuo.arrearspeopleid === this.current.id && this.tihuo.paytype === 1) {// 显示欠款支付的按钮
            this.showflag.arrearspay = true;
          } else {
            this.showflag.arrearspay = false;
          }
        }
        if ((this.tihuo.status === 1) || (this.tihuo.status === 1 && this.tihuo.isonline)) {// 提货单的已准备发货状态
          this.showflag.shiti = true;
        } else {
          this.showflag.shiti = false;
        }
        if (this.tihuo.status !== 2) {// 提货单的已准备发货状态
          this.showflag.print = true;
        } else {
          this.showflag.print = false;
        }
        if (this.tihuo.status === 7) {// 资金占用利息登记按钮控制
          this.showflag.isShowInterestAdd = true;
        } else {
          this.showflag.isShowInterestAdd = false;
        }
        console.log(this.showflag);
      }
      if (response['loglist'].length === 0) {
        this.showlog = false;
      } else {
        this.showlog = true;
        this.loglist = response['loglist'];
      }
    });

    this.cangkuApi.gettihuostoragefee(this.route.params['value']['id']).then((response) => {
      this.storagefeegridOptions.api.setRowData(response);
    });
  }
  godingjin() {
    this.router.navigate(['/qihuo', this.qihuoid], { queryParams: { tihuoid: this.tihuo['id'] } });
  }
  endaddr;
  listFeeDetail() {
    this.tihuoApi.listFeeDetail({ tihuoid: this.route.params['value']['id'] }).then((response) => {
      if(response.length>0){
        for(let i = 0 ; i<response.length;i++){
          if(response[i]['destination']){
            this.endaddr = response[i]['destination'];
          }
        }
      }
      if (this.isshowsjfydw) {
        this.feegridOptions.api.setRowData(response);
      } else {
        this.feegridOptionsforsaleman.api.setRowData(response);
      }
    });
  }
  @ViewChild('payModal') private payModal: ModalDirective;

  // 付款页面
  paytihuoDialog() {
    //付款的时候先释放定金   
    let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];  // 获取选中的提货单明细。
    let tihuodetids = new Array();
    for (let i = 0; i < tihuodets.length; i++) {
      if (!tihuodets[i].data.weight) {
        this.toast.pop('warning', '请编辑货物重量！');
        return '';
      }
    }
    this.payModal.show();
    // this.tihuoApi.bilishifangdingjin(this.tihuo['id']).then(data1 => {
    //   if (data1['dingjin'] && data1['dingjin'] > 0) {
    //     this.releasejine = data1['dingjin'];
    //     this.showflag['releasejine'] = true;
    //   } else {
    //     this.releasejine = '0';
    //     this.showflag['releasejine'] = false;
    //   }
    //   if (data1['peikuan'] && data1['peikuan'] > 0) {
    //     this.releaseallocation = data1['peikuan'];
    //     this.showflag['releaseallocation'] = true;
    //   } else {
    //     this.releaseallocation = 0;
    //     this.showflag['releaseallocation'] = false;
    //   }
    //   this.tihuo['releasejine'] = data1['dingjin'];

    // });
    this.businessOrderApi.getmoney1({ buyerid: this.tihuo.buyerid, wcustomerid: this.tihuo.sellerid,salemanid: this.tihuo['salemanid'] }).then((data) => {// 仅仅是获取当前客户的余额
      if (!data['wyue']) {
        this.msg.currentmoney = 0;
      } else {
        this.msg.currentmoney = data['wyue'];
      }
      this.msg.paymoney = this.tihuo.tjine;
      this.sumjine = Number(this.msg.currentmoney);
      if (this.sumjine.sub(this.msg.paymoney) < 0) {
        this.msg.arrearsjine = this.msg.currentmoney.sub(this.msg.paymoney);
        // if (this.msg.currentmoney.sub(0) < 0) {
        if (data['oyue'].sub(0) < 0) {
          this.overdraft['tjine'] = this.msg.paymoney;
        } else {
          this.overdraft['tjine'] = this.msg['arrearsjine'].mul('-1');
        }
        this.msg.flag = true;
        this.msg.payflag = true;
      } else {
        this.msg.arrearsflag = true;
      }
      this.listDetail();
    });
  }

  // 关闭付款弹窗页面
  hidepayDialog() {
    this.payModal.hide();
  }

  // 获取支付验证码
  getpaycode() {
    this.msg.flag = true;
    let second = 60,
      timePromise = undefined;
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
    this.businessOrderApi.getCode({ billno: this.tihuo.billno }).then((data) => {// 仅仅是获取验证码
      this.toast.pop('success', '验证码发送成功');
    });
  }

  // 付款按钮
  tihuopay() {
    if (this.msg.code) {
      this.tihuoApi.tihuopay(this.tihuo.id, { tihuoid: this.tihuo.id, paycode: this.msg.code, version: this.tihuo.version }).then((data) => {
        // paydialog.close();
        this.payModal.hide();
        if (data['flag']) {
          this.listDetail();
          this.toast.pop('success', '付款成功');
        } else {
          this.toast.pop('warning', '客户的账户余额不足，请提醒充值！！！');
        }
      });
    } else {
      this.toast.pop('warning', '请输入验证码');
    }
  }

  // 欠款支付申请
  arrearspayapply() {
    // this.payModal.hide();
    // // 提交欠款支付的订单到财务人员进行审核
    // if (confirm("你确定做欠款支付的申请吗？")) {
    //   this.tihuoApi.arrears({ tihuoid: this.tihuo.id, jine: this.msg.arrearsjine, version: this.tihuo.version }).then(() => {
    //     // Notify.alert('申请提交成功', { status: 'success' });
    //     this.toast.pop('success', '申请提交成功!');
    //   });
    // }
    this.arrearspayshow();
  }
  // 提交欠款发货申请
  submitapply() {
    this.overdraft['billid'] = this.tihuo['id'];
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
    this.overdraft['type'] = 2;
    this.businessOrderApi.createoverdraft(this.overdraft).then(() => {
      this.payModal.hide();
      this.arrearspayhide();
      this.listDetail();
      this.listFeeDetail();
      this.toast.pop('success', '提交成功');
    });
  }
  zhiyajinapply() {
    this.overdraft['billid'] = this.tihuo['id'];
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
    this.overdraft['type'] = 2;
    this.businessOrderApi.createoverdraft(this.overdraft).then(() => {
      this.payModal.hide();
      this.arrearspayhide();
      this.listDetail();
      this.listFeeDetail();
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
  iszhiyajinapply: Boolean = false;
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
    if (Number(this.overdraft['tzhiyajinjine']) > 0) {
      this.iszhiyajinapply = true;
    }
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
  // 欠款支付按钮
  arrearspay() {
    this.businessOrderApi.getmoney({ buyerid: this.tihuo.buyerid, wcustomerid: this.tihuo.sellerid,salemanid:this.tihuo['salemanid'] }).then((data) => {
      if (!data['wyue']) {
        this.msg.currentmoney = '0';
      } else {
        this.msg.currentmoney = data['wyue'];
      }
      this.msg.paymoney = this.tihuo.tjine;
      this.msg.arrearsjine = this.msg.currentmoney.sub(this.msg.paymoney);
      sweetalert({
        title: '账户余额：' + this.msg.currentmoney + ',订单金额：' + this.tihuo.tjine + ',你确定欠款支付￥' + this.msg.arrearsjine + '吗?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#23b7e5',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnConfirm: false
      }, () => {
        this.tihuoApi.tihuopay(this.tihuo.id, { tihuoid: this.tihuo.id, paycode: '', version: this.tihuo.version }).then((data) => {
          this.listDetail();
          this.toast.pop('success', '支付成功！');
        });
        sweetalert.close();
      });
    });
  }
  arrearspayshow() {
    // 判断是否可以进行质押金欠款
    this.orderApi.listzhiyajin(this.tihuo['buyerid']).then(data => {
      this.haszhiyajin = data['haszhiyajin'];
      this.zhiyajins = data['zhiyajins'];
    });
    this.arrearspayDialog.show();
  }
  arrearspayhide() {
    this.arrearspayDialog.hide();
  }
  // 退回 提货单中没有实提的货物
  tihuoentity = { goodsstatus: false };
  returngoods() {
    if (this.tihuo.status == 2) {
      this.toast.pop('warning', '待付款下的提单不允许该操作');
      return '';
    }
    let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];  // 获取选中的提货单明细。
    let tihuodetids = new Array();
    for (let i = 0; i < tihuodets.length; i++) {
      if (tihuodets[i].selected) {
        if (tihuodets[i].goodsstatus) {
          this.toast.pop('warning', '货物状态已有，不能再次改变。');
          return '';
        }
        tihuodetids.push(tihuodets[i].data.id);
      }
    }
    if (tihuodetids.length <= 0) {
      this.toast.pop('warning', '请选择提货单中的货物！！！');
      return '';
    }
    this.tihuoentity['goodsstatus'] = false;
    this.tihuoentity['tihuodetids'] = tihuodetids;
    sweetalert({
      title: '你确定选择货物要退回吗?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.tihuoApi.modifygoodsstatus(this.tihuoentity).then(() => {
        this.toast.pop('success', '货物退回成功');
        this.listDetail();
      });
      sweetalert.close();
    });
  };

  // 完成 提货单中已经完成实提的货物
  finishtihuo() {
    if (this.tihuo.status === 1) {
      let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay'];// 获取选中的提货单明细。      
      let tihuodetids = new Array();
      for (let i = 0; i < tihuodets.length; i++) {
        if (!tihuodets[i].data.group) {
          if (!tihuodets[i].data.tihuo.isprint) {
            this.toast.pop('warning', '未打印的提单不能做实提');
            return;
          }
          if (tihuodets[i].selected) {
            if (null != tihuodets[i].data.status) {
              this.toast.pop('warning', '货物状态已有，不能再次改变。');
              return '';
            }
            tihuodetids.push(tihuodets[i].data.id);// 将货物放到数组中
          }
        }
      }
      if (tihuodetids.length <= 0) {
        this.toast.pop('warning', '请选择提货单中的货物！！！');
        return '';
      }
      this.tihuoentity.goodsstatus = true;
      this.tihuoentity['tihuodetids'] = tihuodetids;
      if (confirm("请确定提单已经打印并且货物已经实提，你确定吗？")) {
        this.tihuoApi.modifygoodsstatus(this.tihuoentity).then(() => {
          this.toast.pop('success', '货物已经完成提货');
          this.listDetail();
        });
      }
    } else {
      this.toast.pop('warning', '完成或者作废的提单不允许实提操作！');
    }
  };

  //撤销提货
  chexiaotihuo() {
    if (this.tihuo.status !== 3 && this.tihuo.status !== 4) {// 如果status==3的时候代表提货单已经完成则不能作废了,作废了的提单不能再次作废
      if (confirm('你确定要将该提单撤销吗？')) {
        this.tihuoApi.canceltihuo({ id: this.tihuo.id }).then(() => {
          this.toast.pop('warning', '提货单成功撤销');
          this.router.navigateByUrl('tihuo');
        });
      }
    } else {
      this.toast.pop('warning', '提货单不能撤销了');
    }
  }

  // 不予撤销提货
  refusecancel() {
    if (this.tihuo.status === 5) {// 如果status==3的时候代表提货单已经完成则不能作废了,作废了的提单不能再次作废
      sweetalert({
        title: '你确定要拒绝提单撤销吗？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#23b7e5',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnConfirm: false
      }, () => {
        this.tihuoApi.refusecancel({ id: this.tihuo.id }).then(() => {
          this.toast.pop('success', '提货单撤销退回！');
          // Notify.alert("提货单撤销退回！", { status: 'success' });// 弹出提示信息
          // 					$state.go('app.tihuo');
          this.listDetail();
        });
        sweetalert.close();
      });
    } else {
      this.toast.pop('warning', '不是撤销中的提单不允许拒绝撤销');
    }
  }

  // 是否显示撤销欠款
  isshowcxqk() {
    //如果此提单未审核且有欠款支付经办人
    if (this.tihuo.paydate === null && this.tihuo.arrearspeopleid !== null) {
      this.iscxqk = true;
    }
  }

  // 撤销欠款
  chexiaoqiankuan() {
    if (confirm('您确定撤销欠款吗？')) {
      this.tihuoApi.chexiaoqiankuan(this.tihuo.id).then(() => {
        this.toast.pop('success', '撤销欠款成功');
        this.listDetail();
      })
    }
  }

  // 撤销实提
  cancelShiti() {
    const tihuodets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    const tihuodetids = new Array();
    for (let i = 0; i < tihuodets.length; i++) {
      if (!tihuodets[i].data.group && tihuodets[i].selected) {
        if (!tihuodets[i].data.status) {
          this.toast.pop('warning', '货物未实提，不允许该操作');
          // Notify.alert("货物未实提，不允许该操作", { status: 'warning' });
          return;
        }
        if (tihuodets[i].data.isxsbucha) {
          this.toast.pop('warning', '销售补差的货物，不允许该操作');
          // Notify.alert("销售补差的货物，不允许该操作", { status: 'warning' });
          return;
        }
        if (tihuodets[i].data.isxstuihuo) {
          this.toast.pop('warning', '销售退货的货物，不允许该操作');
          // Notify.alert("销售退货的货物，不允许该操作", { status: 'warning' });
          return;
        }
        tihuodetids.push(tihuodets[i].data.id);// 将货物放到数组中
      }
    }
    if (tihuodetids.length < 1) {
      this.toast.pop('warning', '请选择要撤销实提的货物！');
      // Notify.alert("请选择要撤销实提的货物！", { status: 'warning' });
      return;
    }
    if (confirm("你确定要撤销实提操作吗？")) {
      this.tihuoApi.cancelShiti(this.tihuo.id, { tihuoid: this.tihuo.id, tihuodetids: tihuodetids }).then((data) => {
        // Notify.alert('实提撤销成功', { status: 'success' });
        this.toast.pop('success', '实提撤销成功')
        this.listDetail();
      });
    }
  }
  // 页面添加苹果钉钉查看提单
  showlook = false;
  srchetong = '';
  // 查看已生成的提货单
  print() {
    this.tihuoApi.print(this.route.params['value']['id']).then((response) => {
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
        // Notify.alert(response['msg'], { status: 'warning' });
      } else {
        this.listDetail();
        // 判断是否为苹果
        const u = navigator.userAgent;
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        if (isiOS) {
          this.showlook = true;
          this.srchetong = response['msg'];
        } else {
          window.open(response['msg']);
        }
      }
    });
  }

  // 重新生成提货单

  reload() {
    this.tihuoApi.reload(this.route.params['value']['id']).then((response) => {
      this.toast.pop('success', response['msg']);
    });
  }
  // 添加费用
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 打开添加费用查询弹窗
  showDialog() { this.classicModal.show(); }
  // 关闭查询弹窗
  hideDialog() { this.classicModal.hide(); }

  fee = { accountdirection: 2 };
  detids;
  tweight = null;
  companyOfProduce;
  actualfeecustomer: any = { name: '', code: '' };
  companyProduce;
  addFeeDialog() {
    this.fee = { accountdirection: 2 };
    this.companyOfProduce = {};
    this.companyProduce = [];
    this.detids = new Array();
    let tihuodets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    let weight = '0';
    this.fee['startaddr'] = this.startaddr;
    this.fee['endaddr'] = this.endaddr;
    for (let i = 0; i < tihuodets.length; i++) {
      if (!tihuodets[i].data.group && tihuodets[i].selected) {
        weight = weight['add'](tihuodets[i].data.weight);
        this.detids.push(tihuodets[i].data.id);
      }
    }
    this.tweight = weight;
    if (weight !== '0') {
      this.fee['tweight'] = weight;
    } else {
      this.fee['tweight'] = this.tihuo['tweight'];
    }
    this.getProvince();
    this.getProvince2();
    this.showDialog();
  }
  isyunyingzhongxin() {
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    this.updatefee['feecustomerid'] = this.companyOfProduce['code'];
  }
  //销售退货弹窗 
  @ViewChild('xiaoshoutuihuodialog') private xiaoshoutuihuodialog: ModalDirective;
  xiaoshoutuihuo() {
    this.xiaoshoutuihuodialog.show();
  }
  hidexiaoshoutuihuoDialog() {
    this.xiaoshoutuihuodialog.hide();
  }


  //查找预付费用单价
  @ViewChild('yugufeedialog') private yugufeedialog: ModalDirective;
  // 打开预付费用查询弹窗
  showyugufeeDialog() { this.yugufeedialog.show(); }
  // 关闭预付费用查询弹窗
  hideyugufeeDialog() { this.yugufeedialog.hide(); }
  lines: any[] = [];
  findyugufeeprice() {
    this.lines = [];
    if (!this.fee['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    this.showyugufeeDialog();
    if (!this.fee['collectid']) { this.fee['collectid'] = 0; }
    this.tihuoApi.findyufufeelist({
      orderid: this.fee['orderid'],
      collectid: this.fee['collectid'],
      feetype: this.fee['type']
    }).then(data => {
      data.forEach(data => {
        this.lines.push({
          id: data.id,
          feetype: data.feetype,
          feeprice: data.feeprice,
          beizhu: data.beizhu,
          select: false
        });
      })
    })
  }
  selectfeeid: any = null;
  onselect(id) {
    this.selectfeeid = null;
    this.selectfeeid = id;
  }
  //确认选中的预估费用
  selectedyugufee() {
    this.fee['yugufeeprice'] = null;
    // if (!this.selectfeeid) {
    //   this.toast.pop('warning', '请选择一个预估费用');
    //   return;
    // }
    this.lines.forEach(data => {
      if (this.selectfeeid === data.id) {
        this.fee['yugufeeprice'] = data.feeprice;
        this.fee['yugufeeid'] = data.id;
        this.hideyugufeeDialog();
      }
    })
  }


  createFee() {
    if (!this.fee['isdianfu']) {
      this.toast.pop('warning', '请选择支付类型！');
      return '';
    }
    if (!this.fee['type']) {
      this.toast.pop('warning', '请选择费用类型！');
      return '';
    }
    if((this.fee['type'] === 1 || this.fee['type'] === 2 || this.fee['type'] === 3) && (this.fee['iscarries'] === null|| this.fee['iscarries'] === undefined)){
      this.toast.pop('warning', '请选择是否我司承运！');
      return '';
    }
    if(this.fee['iscarries'] && (!this.fee['sprovinceid'] || !this.fee['scityid'] || !this.fee['scountyid'] || 
          !this.fee['eprovinceid'] || !this.fee['ecityid'] || !this.fee['ecountyid'] || !this.fee['startaddr'] || !this.fee['endaddr'])){
            this.toast.pop('warning', '省市县必填!');
            return '';
    }
    // if (!this.fee['yugufeeprice']) {
    //   this.toast.pop('warning', '请选择预估费用单价');
    //   return '';
    // }
    if (this.fee['innerprice'] === null || this.fee['innerprice'] === undefined) {
      this.toast.pop('warning', '请填写实付单价');
      return '';
    }
    if (!this.companyOfProduce['code']) {
      this.toast.pop('warning', '请选择费用单位！');
      return '';
    }
    if (!this.fee['accountdirection']) {
      this.toast.pop('warning', '请选择费用方向！');
      return '';
    }
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    if (this.fee['feecustomerid'] === '9545' && !this.actualfeecustomer) {
      this.toast.pop('warning', '请选择实际费用单位！');
      return;
    }
    this.fee['actualfeecustomerid'] = this.actualfeecustomer['code'];
    this.fee['actualfeename'] = this.actualfeecustomer['name'];
    this.fee['idList'] = this.detids;
    this.fee['tihuoid'] = this.tihuo['id'];
    if (this.fee['actualfeecustomerid'] === this.fee['feecustomerid']) {
      this.toast.pop('warning', '费用单位和实际费用单位重复！');
      return;
    }
    this.tihuoApi.createFee(this.fee).then(() => {
      this.hideDialog();
      this.toast.pop('success', '费用添加成功');
      this.listFeeDetail();
      this.listDetail();
      this.fee = { accountdirection: 2 };
    });
  }
  // 判断所选费用是不是加工费
  expression = true;
  modifytweight() {
    if (this.fee['type'] === 5 || this.fee['type'] === 6) {
      this.expression = false;
    } else if (this.detids) {
      this.fee['price'] = null;
      this.fee['jine'] = null;
      this.expression = true;
      return '';
    } else {
      this.fee['tweight'] = this.tihuo['tweight'];
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
    if (!this.fee['price']) {
      this.toast.pop('warning', '请填写单价');
      return '';
    }
    this.fee['jine'] = Math.round(this.fee['tweight'].mul(this.fee['price']) * 100) / 100;
  }

  // 通过金额获取单价
  getprice() {
    if (!this.fee['tweight']) {
      this.toast.pop('warning', '请填写重量');
      return '';
    }
    if (!this.fee['jine']) {
      this.toast.pop('warning', '请填写金额');
      return '';
    }
    this.fee['price'] = Math.round(this.fee['jine'].div(this.fee['tweight']) * 100) / 100;
  }

  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering
  feetype = [{ label: '请选择', value: '' }, { label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 }, { label: '出库费', value: 4 }, { label: '开平费', value: 5 }, { label: '纵剪费', value: 6 }, { label: '销售运杂费', value: 7 }, { label: '包装费', value: 8 }, { label: '仓储费', value: 9 }, { label: '保险费', value: 10 }, { label: '押车费', value: 11 }];


  // 实现销售退货
  xstuihuoentity = {};
  xstuihuo() {
    this.xstuihuoentity = {};
    this.xstuihuoentity['tihuoid'] = this.tihuo.id;
    const tihuodets1 = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细。
    const tihuodetids1 = new Array();
    const produceStatus = [];
    for (let i = 0; i < tihuodets1.length; i++) {
      if (!tihuodets1[i].data.group && tihuodets1[i].selected) {
        if (!tihuodets1[i].data.status) {
          this.toast.pop('warning', '货物未实提，不能做销售退货。');
          return '';
        }
        if (tihuodets1[i].data.isxstuihuo) {
          this.toast.pop('warning', '货物已做销售退货，不能再次销售退货。');
          return '';
        }
        if (tihuodets1[i].data.isxsbucha) {
          this.toast.pop('warning', '货物已做销售补差，不能进行销售退货。');
          return '';
        }
        tihuodetids1.push(tihuodets1[i].data.id); // 将货物放到数组中
        produceStatus.push(tihuodets1[i].data.orderdet.order.producestatus);
      }
    }
    if (tihuodetids1.length <= 0) {
      this.toast.pop('warning', '请选择提货单中实提的货物！！！');
      return '';
    }
    if (this.beizhu === '' || !this.beizhu) {
      this.toast.pop('warning', '请填写退货原因！');
      return;
    }
    let msg = '你确定要做销售退货吗？';
    if (produceStatus.some(item => item === 2)) {
      msg = '提单中的货物已被安排加工，确定需要销售退货吗？';
    }
    this.xstuihuoentity['tihuodetids'] = tihuodetids1;
    sweetalert({
      title: msg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      this.hidexiaoshoutuihuoDialog();
      this.xstuihuoentity['beizhu'] = this.beizhu;
      this.tihuoApi.xstuihuo(this.xstuihuoentity).then(() => {
        // Notify.alert("货物已经完成销售退货", { status: 'success' });
        this.toast.pop('success', '货物已经完成销售退货');
        this.listDetail();
      });
      sweetalert.close();
    });
  }

  @ViewChild('peopleModal') private peopleModal: ModalDirective;

  showpeopleModal() {
    this.peopleModal.show();
  }

  hidepeopleModal() {
    this.peopleModal.hide();
  }

  params1 = {};
  // 修改提货人
  modifytihuoren() {
    let tihuodets = [];
    const noldtihuodets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细
    const ldtihuodets = this.ldgridOptions.api.getModel()['rowsToDisplay']; // 获取选中的临调提货单明细
    const tihuodetids = new Array();
    if (this.isld) {
      tihuodets = ldtihuodets;
    } else {
      tihuodets = noldtihuodets;
    }
    for (let i = 0; i < tihuodets.length; i++) {
      if (!tihuodets[i].data.group) {
        if (tihuodets[i].selected) {
          tihuodetids.push(tihuodets[i].data.id); // 将货物放到数组中
        }
      }
    }
    if (tihuodetids.length <= 0) {
      if (this.isld) {
        this.toast.pop('warning', '请选择临调明细中的货物！！！');
      } else {
        this.toast.pop('warning', '请选择钢卷明细的货物！！！');
      }
      return '';
    }

    // 弹出修改提货人信息的编辑框
    this.params1 = { tihuodetids: tihuodetids };
    this.showpeopleModal();
  }

  tihuoForm: FormGroup;

  // 提交修改的提货人信息
  submittihuo() {
    this.tihuoApi.updatecarnum(this.tihuo['id'], this.params1).then(() => {
      this.toast.pop('success', '提货人信息修改成功');
      this.listDetail();
      this.hidepeopleModal();
    });
  }

  /**修改备注 */
  modify(params) {
    this.tihuoApi.modifytihuo(this.tihuo['id'], params).then(() => {
      this.listDetail();
    });
  }

  // 全选按钮
  selectall() {
    this.gridOptions.api.selectAll();
  }
  //临调提货单重量修改
  weight = { detid: null };
  @ViewChild('weightmodify') private weightmodify: ModalDirective;
  openweightmodifydialog(detid) {
    this.weight['detid'] = detid;
    this.weightmodify.show();
  }
  closeweightmodifydialog() {
    this.weightmodify.hide();
  }

  modifyldweight() {
    let model = { weight: this.weight['weight'] };
    this.tihuoApi.modifyWeight(this.weight['detid'], model).then(data => {
      this.closeweightmodifydialog();
      this.toast.pop('success', '修改成功');
      this.listDetail();
    });
  }
  @ViewChild('chukufeedialog') private chukufeedialog: ModalDirective;
  addchukuFeeDialog() {
    this.chukufeedialog.show();
  }
  hidechukuDialog() {
    this.chukufeedialog.hide();
  }
  createchukuFee() {
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    this.fee['tihuoid'] = this.tihuo['id'];
    this.tihuoApi.createChukuFee(this.fee).then(data => {
      this.hidechukuDialog();
      this.toast.pop('success', '创建成功');
      this.listFeeDetail();
    });
  }
  refuseChange() {
    this.tihuoApi.refuseChange(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '操作成功');
      this.listDetail();
    });
  }
  verifyChange() {
    this.tihuoApi.verifyChange(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '审核成功');
      this.listDetail();
    });
  }
  /**引入库存弹窗关闭 */
  ldimportkucunhide() {
    this.kcbsModalRef.hide();
    this.listDetail();
  }

  pingjiawuliu() {
    if (this.tihuo['type'] !== 1) {
      this.toast.pop('warning', '只有代运的可以评价！');
      return;
    }
    if (this.tihuo.cuserid !== this.current.id) {
      this.toast.pop('warning', '只有制单人可以评价！');
      return;
    }
    if (!this.showflag['ispingjia']) {
      this.toast.pop('warning', '请全部实提后再评价！');
      return;
    }
    this.ratingobj = {
      tihuoid: this.tihuo.id, transcompanyid: this.tihuo['transcompanyid'],
      goodssafe1: 5, goodssafe2: 5, goodssafe3: 10, goodssafe4: 5, goodssafe5: 0, ability1: 0, ability2: false,
      url: this.wuliuscore['url']
    };
    this.ratingobj['url'] = this.wuliuscore['url'];
    this.pingjiawuliumodal.show();
  }
  hidepingjiawuliu() {
    this.pingjiawuliumodal.hide();
  }
  /**创建评价 */
  pingjiasave() {
    const goodssafe = this.ratingobj['goodssafe1'] + this.ratingobj['goodssafe1'] + this.ratingobj['goodssafe1']
      + this.ratingobj['goodssafe1'] + this.ratingobj['goodssafe1'];
    if (Number(this.ratingobj['goodssafe5']) < 0 && !this.ratingobj['morebeizhu']) {
      this.toast.pop('warning', '请填写备注！');
      return;
    }
    if ((Number(this.ratingobj['ability1']) < 0 || this.ratingobj['ability2']) && !this.ratingobj['url']) {
      this.toast.pop('warning', '请上传图片！');
      return;
    }
    const obj = {
      goodssafe: goodssafe, ability: this.ratingobj['ability1'], isapproval: this.ratingobj['ability2'],
      tihuoid: this.tihuo.id, transcompanyid: this.tihuo['transcompanyid'], morebeizhu: this.ratingobj['morebeizhu'],
      url: this.ratingobj['url']
    };
    this.customerapiService.createzixin(obj).then(data => {
      this.hidepingjiawuliu();
      this.listDetail();
    });
  }
  /**打开上传弹窗 */
  picUploader() {
    this.uploaderModel.show();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    const json: any = {};
    json.tihuoid = this.tihuo.id;
    json.url = [$event.url];
    if ($event.length !== 0) {
      this.wuliuscoreapiService.uploadpic(json).then(data => {
        this.toast.pop('success', '上传成功！');
        this.url = data['url'];
        this.ratingobj['url'] = data['url'];
        this.hideuploadDialog();
      });
    }
  }
  deleteurl() {
    this.url = '';
    delete this.ratingobj['url'];
  }
  // 关闭上传弹窗
  hideuploadDialog() {
    this.uploaderModel.hide();
  }
  fundInterestSubmit() {
    this.tihuoApi.fundInterestSubmit(this.tihuo['id']).then(data => {
      this.toast.pop('success', '提交审核成功');
      this.listDetail();
    });
  }
  // 计算金额
  calinnerjine() {
    if (this.fee['innerprice']) {
      this.fee['innerjine'] = (parseFloat(this.fee['innerprice']) * parseFloat(this.fee['tweight'])).toFixed(2);
    }
  }
  calinnerprice() {
    if (this.fee['innerjine']) {
      this.fee['innerprice'] = (parseFloat(this.fee['innerjine']) / parseFloat(this.fee['tweight'])).toFixed(2);
    }
  }

  // 修改费用弹窗
  showUpdateFeeModal() {
    const feecollectList = this.feegridOptionsforsaleman.api.getModel()['rowsToDisplay'];
    const feecollectids = [];
    for (let i = 0; i < feecollectList.length; i++) {
      if (feecollectList[i].data.group && feecollectList[i].selected) {
        feecollectids.push(feecollectList[i].data.group);
      }
    }
    if (feecollectids.length < 1) {
      this.toast.pop('warning', '请选择要修改的费用！！！');
      return;
    }
    this.companyOfProduce = [];
    this.actualfeecustomer = [];
    this.updateFeeModal.show();
    this.updatefee = {};
    this.updatefee['feecollectids'] = feecollectids;
    this.updatefee['innerprice'] = feecollectList[0].data.innerprice;
  }

  showUpdateFeeModal2(feecollect) {
    if ('提货时根据预估费用自动添加费用' !== feecollect.miaoshu) {
      this.toast.pop('warning', '请选择自动引入的预估费用！！！');
      return;
    }
    const feecollectids = [];
    feecollectids.push(feecollect.group);
    this.companyOfProduce = [];
    this.actualfeecustomer = [];
    this.updateFeeModal.show();
    this.updatefee = {};
    this.updatefee['feecollectids'] = feecollectids;
    this.updatefee['innerprice'] = feecollect.innerprice;
  }

  closeUpdateFeeModal() {
    this.updateFeeModal.hide();
  }

  updateFee() {
    if (this.updatefee['innerprice'] < 0) {
      this.toast.pop('warning', '请填写正确实付单价！');
      return;
    }
    if (!this.companyOfProduce['code']) {
      this.toast.pop('warning', '请选择费用单位！');
      return;
    }
    this.updatefee['feecustomerid'] = this.companyOfProduce['code'];
    if (this.updatefee['feecustomerid'] === '9545' && !this.actualfeecustomer) {
      this.toast.pop('warning', '请选择实际费用单位！');
      return;
    }
    this.updatefee['actualfeecustomerid'] = this.actualfeecustomer['code'];
    if (this.updatefee['actualfeecustomerid'] === this.updatefee['feecustomerid']) {
      this.toast.pop('warning', '费用单位和实际费用单位重复！');
      return;
    }
    this.tihuoApi.updateFee(this.updatefee).then(() => {
      this.closeUpdateFeeModal();
      this.toast.pop('success', '费用修改成功');
      this.listFeeDetail();
    });
  }
  // 确认费用
  confirmFee() {
    if (confirm('请检查下费用不需要修改，确定要提交吗？\n修改费用：业务员权限下，点击费用明细中汇总行的费用单位')) {
      this.tihuoApi.confirmFee(this.tihuo.id).then(() => {
        this.listFeeDetail();
      });
    }
  }
  /**临调匹配车号 */
  uploadcarnum() {
    if (this.isld) {
      if (this.tihuo.status === 2) {
        this.toast.pop('warning', '待付款的提货单不允许匹配!');
        return;
      }
      if (this.tihuo.status === 3) {
        this.toast.pop('warning', '货物已经出库不允许继续匹配');
        return;
      }
    }
    this.uploadcarnumModal.show();
  }
  // 关闭上传弹窗
  hideuploadcarnumDialog() {
    this.uploadcarnumModal.hide();
  }
  uploadscarnum($event) {
    const json: any = {};
    json.tihuoid = this.tihuo.id;
    json.url = [$event.url];
    if ($event.length !== 0) {
      if (this.isld) {
        this.tihuoApi.multipleaddtihuodet(json).then(data => {
          this.toast.pop('success', '上传成功！');
          this.hideuploadcarnumDialog();
          this.listDetail();
        });
      } else {
        this.tihuoApi.matchingcarnum(json).then(data => {
          this.toast.pop('success', '上传成功！');
          this.hideuploadcarnumDialog();
          this.listDetail();
        });
      }
    }
  }
  /**打开资金占用利息登记弹窗 */
  showInterestAdd() {
    this.tihuoApi.findinterestbyorder(this.tihuo.id).then((lixi: any) => {
      this.interestAddParams = {
        tihuoid: this.tihuo.id, yingfujine: lixi, iszhifu: true, jine: 0,
        qiankuandays: null, qiankuanreason: null, yedate: null, isqiankuan: false, yue: 0,
        qiankuanhuokuanjine: 0
      };
      this.businessOrderApi.getmoney1({ buyerid: this.tihuo.buyerid, wcustomerid: this.tihuo.sellerid,salemanid: this.tihuo['salemanid'] }).then((data) => {
        // 仅仅是获取当前客户的余额
        let yue: any = 0;
        if (data['wyue']) {
          yue = data['wyue'];
        }
        this.interestAddParams['yue'] = Number(yue);
        this.interestAddParams['jine'] = lixi;
        if (yue.sub(Number(lixi) + Number(this.tihuo['tjine'])) < 0) {
          // 生成欠款
          this.interestAddParams.isqiankuan = true;
          if (yue.sub(Number(this.tihuo['tjine'])) < 0) {
            this.interestAddParams['qiankuanhuokuanjine'] = this.tihuo['tjine'].sub(yue);
          }
        } else {
          // 生成补差单
          this.interestAddParams.isqiankuan = false;
        }
      });
      this.interestAddModal.show();
    });
  }
  // 关闭查询弹窗
  hideInterestAddModal() { this.interestAddModal.hide(); }
  /**保存资金占用利息对象 */
  saveinterest() {
    let msg = '你确定要提交吗？';
    if (this.interestAddParams.iszhifu) {
      if (this.interestAddParams['isqiankuan']) {
        this.interestAddParams.yedate = this.datepipe.transform(this.yedate, 'y-MM-dd');
        if (this.interestAddParams.jine <= 0) {
          this.toast.pop('warning', '欠款金额不允许小于等于零！');
          return;
        }
        if (!this.interestAddParams.qiankuandays) {
          this.toast.pop('warning', '请填写欠款天数！');
          return;
        }
        if (!this.interestAddParams.qiankuanreason) {
          this.toast.pop('warning', '请填写欠款原因！');
          return;
        }
        msg = '提交之后发起审批，同意后会自动创建欠款单，你确定要提交吗？';
      } else {
        if (this.interestAddParams.jine <= 0) {
          this.toast.pop('warning', '实付利息不允许小于等于零！');
          return;
        }
        msg = '提交之后发起审批，同意后会自动创建补差单，你确定要提交吗？';
      }
    } else {
      msg = '提交之后发起审批，你确定要提交吗？';
    }
    if (confirm(msg)) {
      this.tihuoApi.tihuointeresttijiao(this.interestAddParams).then(data => {
        this.hideInterestAddModal();
        this.listDetail();
        this.toast.pop('success', '提交成功！发起审批...');
      });
    }
  }
  // 欠款金额改变
  qiankuanjineChange() {
    setTimeout(() => {
      const jine = this.interestAddParams['jine'];
      const yue: any = this.interestAddParams['yue'];
      if (yue.sub(Number(jine) + Number(this.tihuo['tjine'])) < 0) {
        this.interestAddParams.isqiankuan = true;
      } else {
        this.interestAddParams.isqiankuan = false;
      }
    }, 500);
  }
  makezhibaoshu() {
    this.rukuApi.makezhibaoshu(this.tihuo['id']).then(data => {
      console.log(data);
      if (data['flag']) {
        this.toast.pop('success', data['msg']);
      } else {
        this.toast.pop('error', '质保书生成出现问题！');
      }
    });
  }

  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }
  getcity() {
    this.citys = [];
    delete this.fee['scityid'];
    delete this.fee['scountyid'];
    this.classifyApi.getChildrenTree({ pid: this.fee['sprovinceid'] }).then((data) => {
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
    delete this.fee['scountyid'];
    this.classifyApi.getChildrenTree({ pid: this.fee['scityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getProvince() {
    this.provinces = [];
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

  getcity2() {
    this.citys2 = [];
    delete this.fee['ecityid'];
    delete this.fee['ecountyid'];
    this.classifyApi.getChildrenTree({ pid: this.fee['eprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys2.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys2 = [];
    });
  }
  getcounty2() {
    this.countys2 = [];
    delete this.fee['ecountyid'];
    this.classifyApi.getChildrenTree({ pid: this.fee['ecityid'] }).then((data) => {
      data.forEach(element => {
        this.countys2.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  getProvince2() {
    this.provinces2 = [];
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces2.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys2 = [];
      this.countys2 = [];
    });
  }
  /**
 * 根据详细地址自动识别省市县
 */
   
   selecteddes1(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      this.citys = []; this.countys = [];
      this.fee['sprovinceid'] = '';
      this.fee['scityid'] = '';
      this.fee['scountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.fee['sprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.fee['sprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.fee['scityid'] = addressObj['cityValue'];
                this.getpcc(this.fee['scityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.fee['scountyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
 
  selecteddes2(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      console.log(addressObj);
      this.citys2 = []; this.countys2 = [];
      this.fee['eprovinceid'] = '';
      this.fee['ecityid'] = '';
      this.fee['ecountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces2.length) {
          this.fee['eprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.fee['eprovinceid'], this.citys2).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.fee['ecityid'] = addressObj['cityValue'];
                this.getpcc(this.fee['ecityid'], this.countys2).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      this.fee['ecountyid'] = addressObj['countyValue'];
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  


  //批量删除明细
  tihuodetids: any = [];
  deltihuodetfee() {
    this.tihuodetids = new Array();
    let tihuodetidslist= [];
    if (this.isshowsjfydw) {
      tihuodetidslist = this.feegridOptions.api.getModel()['rowsToDisplay'];
    } else {
      tihuodetidslist = this.feegridOptionsforsaleman.api.getModel()['rowsToDisplay'];
    }
    for (let i = 0; i < tihuodetidslist.length; i++) {
      if (tihuodetidslist[i].selected && tihuodetidslist[i].data && tihuodetidslist[i].data['id'] ) {
        this.tihuodetids.push(tihuodetidslist[i].data.id);
      }
    }
    if (!this.tihuodetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.tihuoApi.removetihuofees(this.tihuodetids).then(data => {
      this.toast.pop('success', '删除成功！');
      this.listFeeDetail();
      this.listDetail();
      });
    }
  }
  
}



