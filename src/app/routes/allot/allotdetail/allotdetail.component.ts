import { CustomerapiService } from './../../customer/customerapi.service';
import { KucundetimportComponent } from './../../../dnn/shared/kucundetimport/kucundetimport.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { FavoritelistComponent } from './../../../dnn/shared/favoritelist/favoritelist.component';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { SettingsService } from './../../../core/settings/settings.service';
import { StorageService } from './../../../dnn/service/storage.service';
import { ColDef, GridOptions } from 'ag-grid/main';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { AllotapiService } from './../allotapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { DatePipe } from '@angular/common';
import { FeeapiService } from 'app/routes/fee/feeapi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-allotdetail',
  templateUrl: './allotdetail.component.html',
  styleUrls: ['./allotdetail.component.scss']
})
export class AllotdetailComponent implements OnInit {
  @ViewChild('chukufeedialog') private chukufeedialog: ModalDirective;
  @ViewChild('jingjiaModal') private jingjiaModal: ModalDirective;
  @ViewChild('qihuowuliuorderModel') private qihuowuliuorderModel: ModalDirective;
  @ViewChild('uploadcarnumModal') private uploadcarnumModal: ModalDirective;
  @ViewChild('peopleModal') private peopleModal: ModalDirective;
  // 获取当前的登录人
  current = this.storage.getObject('cuser');
  // 打开收藏夹来用控制显示引入按钮
  isimport;
  bsModalRef: BsModalRef;
  kcbsModalRef: BsModalRef;
  tihuorenModalRef: BsModalRef;
  // 获取页面传递过来的id
  parentId;
  // 控制是否有权限对aggird进行编辑
  edit;
  // 控制页面操作按钮是否显示
  flag: { edit: boolean, editbaocun: boolean, disabled: boolean, verify: boolean, confirm: boolean, querendaohuo: boolean, shenhe: boolean, pdf: boolean, deldet: boolean } =
    { edit: false, editbaocun: false, disabled: false, verify: false, confirm: false, querendaohuo: false, shenhe: false, pdf: false, deldet: false };
  // 控制编辑的
  model = { expcangku: '', org: '', cuser: '', issubmit: false, buser: {}, cperson: {} };
  // 仓库列表
  ckitems = new Array();
  // 是否审核
  isv: boolean;
  // 当前用户信息
  cuser;
  // 变更记录
  loglist: any = [];
  // 调拨明细表
  gridOptions: GridOptions;
  // 费用明细表
  feegridOptions: GridOptions;
  wuliuOffergridOptions: GridOptions; // 物流竞价明细
  // 付费单位列表
  items = [{ label: '全部', value: '' }];
  //是否备货
  isbeihuos = [{ label: '请选择', value: '' }, { label: '是', value: true }, { label: '否', value: false }];
  allottypes = [{ label: '请选择', value: '' }, { label: '正常调拨', value: 1 }, { label: '倒库调拨', value: 2 }];
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  selectQihuodetWuliubaojia: any = [];
  wuluiorderlist: any = [];
  tabviewindex = 0; // 物流竞价明细选项卡的索引
  jingjiadata: any = {};
  // 期货物流竞价
  singleData = [];
  allotForm: FormGroup;
  isall = false; // 是否全选
  citys: any[] = [];
  countys: any[] = [];
  startaddr;
  endaddr;
  provinces: any[] = [];
  provinces2: any[] = [];
  citys2: any[] = [];
  countys2: any[] = [];
  constructor(private route: ActivatedRoute, private router: Router,private fb: FormBuilder, private allotapi: AllotapiService,
    private classifyapi: ClassifyApiService, private datepipe: DatePipe,private addressparseService: AddressparseService,
    private storage: StorageService, public settings: SettingsService, private toast: ToasterService,private classifyApi: ClassifyApiService,
    private userapi: UserapiService, private modalService: BsModalService, private customerApi: CustomerapiService,
    private modalService1: BsModalService, private feeApi: FeeapiService, private qihuoapi: QihuoService) {
      this.allotForm = fb.group({
        'carnum': [],
        'driverinfo': [],
      });

    // 获取机构列表
    this.isv = false;
    if (!this.isv) {
      this.ckitems.push({ label: '请选择', value: '' });
      this.classifyapi.changkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            label: element.name,
            value: element.id
          });
        });
      });
    }

    // 获取付费单位列表
    this.customerApi.findwiskind().then((data) => {
      data.forEach(element => {
        this.items.push({
          label: element['name'],
          value: element['id']
        });
      });
    });

    // 在收藏夹显示引入按钮
    // this.isimport = true;

    // 获取当前用户
    this.userapi.userInfo().then(data => {
      this.cuser = data;
    });
    let current = this.storage.getObject('cuser');
    this.route.params.subscribe(data => {
      this.parentId = data.id;
      this.getDetail();
      this.listFeeDetail();
      // 查询表的主体
      this.allotapi.getAllot(data.id).then(data => {
        this.edit = true;
        // 主表显示框，输入框全部禁止掉
        this.flag.disabled = true;

        if (data.summary) {
          this.model = data.summary;
          this.model['cuser']['name'] = data.summary['cuser']['realname'];
          this.model['cuser']['code'] = data.summary['cuser']['id'];
          this.startaddr = this.model['expcangku']['address']
          if(this.model['impcangku']){
            this.endaddr = this.model['impcangku']['address']
          }
          if (!data['summary']['isv'] && data['summary']['cuserid'] === this.cuser['id']) {
            this.flag.edit = true;
            this.flag.editbaocun = true;
            this.flag.disabled = false;
            this.flag.deldet = true;
            this.gridOptions.columnApi.setColumnVisible('amount', true);
          } else {
            this.flag.editbaocun = true;
          }

          // 已经审核，没有到货确认，确认到货人已指定，确认到货人是当前用户
          if (data['summary']['isv'] && !data['summary']['status'] && data['summary']['cpersonid'] == this.cuser['id']) {
            this.flag.confirm = true;
            this.gridOptions.columnApi.setColumnVisible('amount', false);
          }
          // 已经审核的，对库存的修改
          if (data['summary']['isv']) {
            this.isv = true;
          }

          if (data['summary']['status']) {
            this.edit = false;
            this.gridOptions.columnApi.setColumnVisible('amount', false);
          }

          // 审核显示
          if (current['id'] === this.model['org']['userid'] && this.model['orgid'] !== 670) {
            this.flag.shenhe = true;
          }

          // pdf
          if (this.model['orgid'] === 670) {
            this.flag.pdf = true;
          } else if (this.model['isv']) {
            this.flag.pdf = true;
          }

          // 确认到货人
          if (this.model['cpersonid'] && current.id === this.model['cpersonid'] && !this.model['status']) {
            this.flag.querendaohuo = true;
          }
          if (this.model['isv'] && current.id === this.model['cuserid']) {
            this.flag['modifytihuoren'] = true;
          }

          // this.tweight = data.summary.tweight;
          // this.tyunfei = data.summary.tyunfei;
          // this.tchukufei = data.summary.tchukufei;

          if (this.isv) {
            this.ckitems = [];
            this.ckitems.push({ label: '请选择', value: '' });
            this.model['impcangkuid'] = null;
            this.classifyapi.getsamekulist({ cangkuid: data['summary']['impcangku']['id'] }).then(pre => {
              pre.forEach(element => {
                this.ckitems.push({
                  label: element.name,
                  value: element.id
                });
              });
              this.model['impcangkuid'] = data['summary']['impcangku']['id'];


            });

          }
        }
        // console.log(data['summary']['tweight']);
      });

    });

    // 调拨明细
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onCellValueChanged: (params) => {
        if (this.edit) {
          this.allotapi.change({ detid: params.data.id, storageno: params.data.storageno, beizhu: params.data.beizhu }).then(data => {
            console.log(params.data.id);
            console.log(params.data.storageno);
            console.log(params.data.beizhu);
          });
        } else {
          this.toast.pop('warning', '此单据已经完成，修改无效！');
        }
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
      // getNodeChildDetails: (params) => {
      //   if (params.group) {
      //     return {
      //       group: true,
      //       expanded: params.group === '彩涂' || params.group === '镀锌' || params.group === '镀铝锌',
      //       children: params.participants,
      //       field: 'group',
      //       key: params.group
      //     };
      //   } else {
      //     return null;
      //   }
      // },
      groupSelectsChildren: true // 分组可全选
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', cellRenderer: 'group', minWidth: 80,
        checkboxSelection: true, headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '底漆', field: 'diqi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '费用单价', field: 'feeprice', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '费用金额', field: 'feejine', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储位', field: 'storageno', minWidth: 60, editable: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '车号', field: 'carnum', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '司机信息', field: 'driverinfo', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60, editable: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: (params) => {
          if (params.data.del) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.del) {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.allotapi.delAllotDet(params.data.id).then(data => {
                this.toast.pop('success', '删除成功！');
                this.model['tweight'] = data.summary.tweight;
                this.model['version'] = data.summary.version;
                this.getDetail();
                this.getMyRole();
              });
              sweetalert.close();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存id', field: 'kucunid', minWidth: 60, cellRenderer: (params) => {
          if (params.data['kucunid']) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcid', field: 'gcid', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调拨状态', field: 'allottypename', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '调入时间', field: 'arrivedate', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: params => {
          return '<a target="_blank">删除</a>';
        }, onCellClicked: params => {
          if (confirm('你确定要删除吗?')) {
            this.allotapi.delallot(params.data.id).then(data => {
              this.toast.pop('success', '删除成功！');
              this.getDetail();

        
            })
          }
        }
      },

    ];


    // 费用明细表
    this.feegridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      groupSelectsChildren: true, // 分组可全选
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
    this.feegridOptions.groupSuppressAutoColumn = true;
    this.feegridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'group', cellRenderer: 'group', minWidth: 40 ,
      checkboxSelection: true, headerCheckboxSelection: true
    },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '费用类型', field: 'type', minWidth: 80, valueGetter: (params) => {
          if (params.data['type'] === 1) return '汽运费';
          else if (params.data['type'] === 2) return '铁运费';
          else if (params.data['type'] === 3) return '船运费';
          else if (params.data['type'] === 4) return '出库费';
          else if (params.data['type'] === 5) return '开平费';
          else if (params.data['type'] === 6) return '纵剪费';
          else if (params.data['type'] === 7) return '销售运杂费';
          else if (params.data['type'] === 8) return '包装费';
          else if (params.data['type'] === 9) return '仓储费';
          else return '';
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用单位', field: 'feename', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '记账方向', field: 'accountdirection', minWidth: 60, valueGetter: (params) => {
          if (params.data['accountdirection'] == 1) return '采购';
          else if (params.data['accountdirection'] == 2) return '销售';
          else return '';
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '应收应付', field: 'payorreceive', minWidth: 60, valueGetter: (params) => {
          if (params.data['payorreceive'] == 1) return '应付';
          else if (params.data['payorreceive'] == 2) return '应收';
          else return '';
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '单价', field: 'price', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'caozuo', minWidth: 60, cellRenderer: (params) => {
          if (params.data.group) {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.group) {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.allotapi.removeAllotfee({ feecollectid: params.data.group }).then(data => {
                this.toast.pop('success', '删除成功！');
                this.listFeeDetail();
                this.getDetail();
              });
              sweetalert.close();
            });

          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60 }

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
    };
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
              this.getMyRole();
              this.getbill();
              this.getDetail();
            });
          }
        }
      }
    ];

  }


  ngOnInit() {
    this.getMyRole();
  }

  // 查询单个调拨单明细信息
  getDetail() {
    this.allotapi.getdet(this.parentId).then(data => {
      this.gridOptions.api.setRowData(data);
    });

    //查询变更日志
    this.allotapi.getlog(this.parentId).then(data => {
      this.loglist = data;
    })
  }



  // 保存按钮
  modifyAllot() {
    if (this.model['expcangkuid'] !== this.model['impcangkuid'] && null !== this.model['impcangkuid']) {
      this.allotapi.modify(this.model).then(data => {
        this.model['version'] = data['version'];
        this.toast.pop('success', '保存成功');
      });
    } else {
      this.toast.pop('warning', '所选仓库不正确');
    }
    this.getbill();
  }

  // 点击引入库存产品按钮
  importKucun() {
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    this.kcbsModalRef.content.isimport = this.isimport;
    this.kcbsModalRef.content.componentparent = this;
    console.log('引入库存产品');
  }

  // 点击引入收藏夹按钮
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

  // 添加对象
  fee = {};

  @ViewChild('classicModal') private classicModal: ModalDirective;

  // 添加费用按钮

  sellers;

  detids;
  companyOfProduce;
  ckcompanyOfProduce;
  actualfeecustomer: any = { name: '', code: '' };
  companyProduce;

  addFeeDialog() {
    this.fee = {};
    this.companyProduce = [];
    this.detids = new Array();
    const allotdets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细
    let weight = '0';
    for (let i = 0; i < allotdets.length; i++) {
      if (allotdets[i].selected && !allotdets[i].data.group) {
        console.log('weight', weight);
        // weight = weight.add(allotdets[i].data.weight);
        weight = weight['add'](allotdets[i].data.weight);
        console.log('weight', weight);
        this.detids.push(allotdets[i].data.id);
      }
    }
    if (this.detids.length <= 0) {
      this.toast.pop('warning', '请选择添加费用的货物');
      return '';
    }
    this.fee['tweight'] = weight;
    //this.fee['accountdirection'] = 2;
    //this.fee['payorreceive'] = 1;
    this.fee['startaddr'] = this.startaddr;
    this.fee['endaddr'] = this.endaddr;
    this.getProvince();
    this.getProvince2();
    this.classicModal.show();
  }

  isyunyingzhongxin() {
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
  }
  createFee() {
    console.log(this.fee);
    if (typeof (this.companyOfProduce) !== 'object') {
      this.toast.pop('warning', '请选择费用单位！');
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
    if (!this.fee['accountdirection']) {
      this.toast.pop('warning', '请选择费用方向！');
      return '';
    }
    if (!this.fee['payorreceive']) {
      this.toast.pop('warning', '请选择应付或者应收！');
      return '';
    }
    // 2017.04.08 费用修改付费单位 cpf MOD start
    if (!this.fee['paycustomerid']) {
      this.toast.pop('warning', '请选择付费单位！');
      return '';
    }
    // 2017.04.08 费用修改付费单位 end
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    if (this.fee['feecustomerid'] === '9545' && !this.actualfeecustomer) {
      this.toast.pop('warning', '请选择实际费用单位！');
      return;
    }
    this.fee['actualfeecustomerid'] = this.actualfeecustomer['code'];
    this.fee['actualfeename'] = this.actualfeecustomer['name'];
    this.fee['idList'] = this.detids;
    if (this.fee['actualfeecustomerid'] === this.fee['feecustomerid']) {
      this.toast.pop('warning', '费用单位和实际费用单位重复！');
      return;
    }
    this.allotapi.createFee(this.fee).then(() => {
      this.toast.pop('success', '费用添加成功');
      this.listFeeDetail();
      this.closeclassicmodal();
      // this.listDetail();
    });
  }

  // 关闭添加费用弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }

  // 控制总重量是否可以修改
  expression = true;

  // 判断所选费用是不是加工费
  modifytweight() {
    if (this.fee['type'] === 5 || this.fee['type'] === 6) {
      this.expression = false;
    } else {
      //this.fee['tweight'] = this.tweight;
      this.fee['price'] = null;
      this.fee['jine'] = null;
      this.expression = true;
      return '';
    }
  }

  // 单价输入失去焦点
  getjine() {
    if (!this.fee['tweight']) {
      this.toast.pop('warning', '请填写重量');
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
    this.fee['price'] = Math.round(this.fee['jine'].div(this.fee['tweight']) * 100) / 100;
  }

  // tslint:disable-next-line:member-ordering
  feetype = [{ label: '取消', value: '' }, { label: '汽运费', value: 1 }, { label: '铁运费', value: 2 }, { label: '船运费', value: 3 },
  { label: '出库费', value: 4 }, { label: '开平费', value: 5 }, { label: '纵剪费', value: 6 }, { label: '销售运杂费', value: 7 },
  { label: '包装费', value: 8 }, { label: '仓储费', value: 9 }];

  // 查询费用明细
  listFeeDetail() {
    this.allotapi.listFeeDetail({ allotid: this.parentId }).then(data => {
      this.feegridOptions.api.setRowData(data);
    });
  }

  // 确认调入
  confirm() {
    const dets = [];
    const allotdets = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细
    for (let i = 0; i < allotdets.length; i++) {
      if (allotdets[i].selected && !allotdets[i].data.group) {
        if (allotdets[i].data.allottype !== 1) {
          this.toast.pop('warning', '请选择调出未调入的明细！');
          return '';
        }
        dets.push(allotdets[i].data.id);
      }
    }
    if (dets.length <= 0) {
      this.toast.pop('warning', '请选择调拨明细！');
      return '';
    }
    const params = {};
    params['allotid'] = this.model['id'];
    params['detids'] = dets;
    this.allotapi.confirm(params).then((response) => {
      this.toast.pop('success', '调拨完成');
      this.getDetail();
      this.getbill();
    });
  }

  // 确认调出
  submitVerify() {
    // this.modifyAllot();
    if (this.model['cperson']['realname'] && null != this.model['impcangkuid'] && this.model['impcangkuid'] != this.model['expcangkuid']) {
      const dets = [];
      const wuliuorderdets = this.wuliuOffergridOptions.api.getModel()['rowsToDisplay']; // 获取选中的提货单明细
      for (let i = 0; i < wuliuorderdets.length; i++) {
        if (wuliuorderdets[i].selected) {
          dets.push(wuliuorderdets[i].data.id);
        }
      }
      if (dets.length) {
        this.showjingjiamodal(dets);
        return;
      }else if(this.model['type'] === 2){
        this.showjingjiamodal2();
      }else if(this.model['type'] === 1 && dets.length <1){
        this.toast.pop('warning', '请选择物流竞价明细!');
      }else if(!this.model['type']){
        this.toast.pop('warning', '调拨类型必填!');
      }
      // this.allotapi.modify(this.model).then(data => {
      //   this.getbill();
      //   const json = { id: this.model['id'], wuliuorderids: dets };
      //   this.allotapi.verifyUser(json).then((req) => {
      //     this.toast.pop('success', '提交成功！');
      //     this.getMyRole();
      //     this.getbill();
      //     this.getDetail();
      //     // this.router.navigateByUrl('allotdetreport');
      //   });
      // });
    } else {
      if (null == this.model['impcangkuid']) {
        this.toast.pop('warning', '调入仓库为必填信息!');
      }
      if (null == this.model['cpersonid']) {
        this.toast.pop('warning', '确认到货人为必填信息!');
      }
      if (this.model['impcangkuid'] === this.model['expcangkuid']) {
        this.toast.pop('warning', '调出与调入仓库不能相同!');
      }
    }
  }

  // 审核按钮
  verify() {
    if (!this.model.issubmit) {
      this.toast.pop('warning', '请先确认提交审核！');
      return;
    }
    this.allotapi.auditAllot(this.model['id']).then(data => {
      this.toast.pop('success', '审核成功！');
      this.getDetail();
      this.getbill();
    });
  }

  // 生成pdf
  reload() {
    this.allotapi.reload(this.parentId).then(data => {
      this.toast.pop('warning', data['msg']);
    });
  }

  // 苹果钉钉查看信息
  showlook = false;
  srchetong = '';

  // 打印预览
  print() {
    this.allotapi.print(this.parentId).then(data => {
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        const isios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isios) {
          this.showlook = true;
          this.srchetong = data['msg'];
        } else {
          window.open(data['msg']);
        }
      }
    });
  }

  // 删除功能
  delAllot() {
    this.allotapi.delAllot(this.parentId).then(data => {
      this.toast.pop('success', '删除成功！');
      this.router.navigateByUrl('allotdetreport');
    });
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
  importAllotFav(data) {
    for (let i = 0; i < data.length; i++) {
      if (null != data[i].lockid) {
        // Notify.alert("已经锁定：捆包号" + data[i].kunbaohao, { status: 'warning' });
        this.toast.pop('warning', '已经锁定：捆包号' + data[i].kunbaohao);
        return;
      }
      // else if (null != data[i].orderid) {
      //   this.toast.pop('warning', '已下订单：捆包号' + data[i].kunbaohao);
      //   return;
      // }
    }
    let count = 1; // 仓库相同1，不同大于1
    let orgcount = 1; // 机构相同1，不同大于1
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].cangkuid != data[i + 1].cangkuid) {
        count++;
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].orgid != this.cuser.orgid) {
        orgcount++;
      }
      if (this.model['expcangkuid'] != undefined && data[i].cangkuid != this.model['expcangkuid']) {
        count++;
      }
    }
    // 页面无数据，新引入的数据是同一仓库，同一机构  页面有数据页面数据和新引入的是同一仓库，同一机构
    if (orgcount == 1 && count == 1) {
      if (data[0].id) {
        let tweight = "0";
        for (let i = 0; i < data.length; i++) {
          tweight = (data[i].weight).add(tweight);
        }
        this.model['tweight'] = tweight; // 总重量
        this.model['expcangku'] = data[0].cangku; // 调出仓库
        this.model['expcangkuid'] = data[0].cangku.id; // 调出仓库id
        this.model['org'] = data[0].org;
        this.model['orgid'] = this.cuser['orgid'];
        const kucunids = new Array();
        for (let i = 0; i < data.length; i++) {
          data[i].kucunid = data[i].id;
          kucunids[i] = data[i].id;
        }
        // 引入收藏夹到明细表中{id:$scope.model.id,kucunids:kucunids}
        this.allotapi.importFav({ allot: this.model, kucunids: kucunids }).then((response) => {
          this.gridOptions.api.setRowData(response);
          this.model['tweight'] = response[0].tweight;
          this.model['version'] = response[0].version;
        });
        // ngDialog.close();
        this.bsModalRef.hide();
      }
    } else {
      if (orgcount > 1) {
        // Notify.alert("请引入本机构的货物", { status: 'warning' });
        this.toast.pop('warning', '请引入本机构的货物');
      }
      else if (count > 1) {
        // Notify.alert("请引入同一个仓库的货物", { status: 'warning' });
        this.toast.pop('warning', '请引入同一个仓库的货物');
      }
    }
  }

  // 引入库存执行的回调
  importAllotKucun(data) {
    console.log('warning', data);
    for (let i = 0; i < data.length; i++) {
      if (null != data[i].lockid) {
        this.toast.pop('warning', '已经锁定：捆包号' + data[i].kunbaohao);
        // Notify.alert("已经锁定：捆包号" + data[i].kunbaohao, { status: 'warning' });
        return;
      }
      // else if (null != data[i].orderid && !data[i].isqihuo) {
      //   this.toast.pop('warning', '已下订单：捆包号' + data[i].kunbaohao);
      //   return;
      // }
    }
    let count = 1; // 仓库相同1，不同大于1
    let orgcount = 1; // 机构相同1，不同大于1
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].cangkuid !== data[i + 1].cangkuid) {
        count++;
      }
    }
    for (let i = 0; i < data.length; i++) {
      // 如果登录人是陈婷，可以调拨多个机构的货物
      if (data[i].orgid !== this.cuser.orgid && this.current['orgid'] !== 674) {
        orgcount++;
      }
      if ((this.model['expcangkuid'] !== undefined && this.model['expcangkuid'] !== null ) && data[i].cangkuid !== this.model['expcangkuid']) {
        count++;
      }
    }
    // 页面无数据，新引入的数据是同一仓库，同一机构  页面有数据页面数据和新引入的是同一仓库，同一机构
    if (orgcount === 1 && count === 1) {
      if (data[0].id) {
        let tweight = '0';
        for (let i = 0; i < data.length; i++) {
          tweight = (data[i].weight).add(tweight);
        }
        this.model['tweight'] = tweight; // 总重量
        this.model.expcangku = data[0].cangku; // 调出仓库
        this.model['expcangkuid'] = data[0].cangku.id; // 调出仓库id
        this.model.org = data[0].org;
        this.model['orgid'] = this.cuser.orgid;
        const kucunids = new Array();
        for (let i = 0; i < data.length; i++) {
          data[i].kucunid = data[i].id;
          kucunids[i] = data[i].id;
        }
        // 引入收藏夹到明细表中{id:$scope.model.id,kucunids:kucunids}
        this.allotapi.importFav({ allot: this.model, kucunids: kucunids }).then((response) => {
          this.gridOptions.api.setRowData(response);
          this.model['tweight'] = response[0].tweight;
          this.model['version'] = response[0].version;
          this.getbill();
        });
        // importdialog.close();
        this.kcbsModalRef.hide();
      }
    } else {
      console.log(this.current);
      console.log(orgcount > 1 && this.current['orgid'] !== 674);
      // 如果调拨人是运营中心，可以引入任意一个机构的货物
      if (orgcount > 1 && this.current['orgid'] !== 674) {
        this.toast.pop('warning', '请引入本机构的货物');
        // Notify.alert('请引入本机构的货物', { status: 'warning' });
      }
      else if (count > 1) {
        this.toast.pop('warning', '请引入同一个仓库的货物');
        // Notify.alert('请引入同一个仓库的货物', { status: 'warning' });
      }
    }
  }

  suser;
  isuser;
  addbuserDialog(user) {
    this.isuser = user;
    this.showaddbuser();
  }

  @ViewChild('addbuser') private addbuser: ModalDirective;

  showaddbuser() {
    this.addbuser.show();
  }

  hideaddbuser() {
    this.addbuser.hide();
    this.suser = null;
  }
  hideaddbuserqd() {
    if (this.isuser === 'buser') {
      if (this.suser) {
        if (typeof (this.suser) === 'object') {
          this.model.buser['realname'] = this.suser['name'];
          this.model['buserid'] = this.suser['code'];
        } else if (typeof (this.suser) === 'string') {
          this.model['buserid'] = '';
          this.toast.pop('warning', '输入的人员名称有误，请重新选择');
        }
      } else {
        this.model['buserid'] = '';
      }
    } else if (this.isuser === 'cperson') {
      if (this.suser) {
        if (typeof (this.suser) === 'object') {
          this.model['cperson']['realname'] = this.suser['name'];
          this.model['cpersonid'] = this.suser['code'];
        } else if (typeof (this.suser) === 'string') {
          this.model['cpersonid'] = '';
          this.toast.pop('warning', '输入的人员名称有误，请重新选择');
        }
      } else {
        this.model['cpersonid'] = '';
      }
    }
    this.hideaddbuser();
  }
  // 全选
  // selectAll() {
  //   this.gridOptions.api.selectAll();
  // }
  //出库费自动添加
  addChukuFeeDialog() {
    this.fee = {};
    this.chukufeedialog.show();
  }
  closechukufeedialog() {
    this.chukufeedialog.hide();
  }
  createChukuFee() {
    this.fee['feecustomerid'] = this.companyOfProduce['code'];
    this.fee['allotid'] = this.model['id'];
    console.log(this.fee);
    this.allotapi.createChukuFee(this.fee).then(data => {
      this.closechukufeedialog();
      this.toast.pop('success', '创建成功');
      this.listFeeDetail();
    })
  }
  // 查询表的主体
  getbill() {
    const current = this.storage.getObject('cuser');
    this.allotapi.getAllot(this.parentId).then(data => {
      this.edit = true;
      // 主表显示框，输入框全部禁止掉
      this.flag.disabled = true;
      if (data.summary) {
        this.model = data.summary;
        this.model['cuser']['name'] = data.summary['cuser']['realname'];
        this.model['cuser']['code'] = data.summary['cuser']['id'];
        this.startaddr = this.model['expcangku']['address']
          if(this.model['impcangku']){
            this.endaddr = this.model['impcangku']['address']
          }
        if (!data['summary']['isv'] && data['summary']['cuserid'] === this.cuser['id']) {
          this.flag.edit = true;
          this.flag.editbaocun = true;
          this.flag.disabled = false;
          this.gridOptions.columnApi.setColumnVisible('amount', true);
        } else {
          this.flag.editbaocun = true;
        }
        // 已经审核，没有到货确认，确认到货人已指定，确认到货人是当前用户
        if (data['summary']['isv'] && !data['summary']['status'] && data['summary']['cpersonid'] == this.cuser['id']) {
          this.flag.confirm = true;
          this.gridOptions.columnApi.setColumnVisible('amount', false);
        }
        if (data['summary']['status']) {
          this.edit = false;
          this.gridOptions.columnApi.setColumnVisible('amount', false);
        }
        // 审核显示
        if (current['id'] === this.model['org']['userid'] && this.model['orgid'] !== 670) {
          this.flag.shenhe = true;
        }
        // pdf
        if (this.model['orgid'] === 670) {
          this.flag.pdf = true;
        } else if (this.model['isv']) {
          this.flag.pdf = true;
        }
        // 确认到货人
        if (this.model['cpersonid'] && current.id === this.model['cpersonid'] && !this.model['status']) {
          this.flag.querendaohuo = true;
        }
      }
    });
  }
  /**打开修改提货人信息弹窗 */
  modifytihuoren() {
    let allotdets = this.gridOptions.api.getModel()['rowsToDisplay'];
    const allotdetids = new Array();
    for (let i = 0; i < allotdets.length; i++) {
      if (allotdets[i].selected) {
        allotdetids.push(allotdets[i].data.id); // 将货物放到数组中
      }
    }
    if (allotdetids.length <= 0) {
      this.toast.pop('warning', '请选择将要修改的的明细');
      return '';
    }
    if (this.model['status']) {
      this.toast.pop('warning', '已经调入，不允许修改提货人信息！');
      return;
    }
    this.params1 = { allotdetids: allotdetids };
    this.peopleModal.show();
  }
  /**关闭修改提货人信息弹窗 */
  closetihuorenmodal() {
    this.tihuorenModalRef.hide();
    this.getbill();
  }

  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    if(this.model['type'] !== 1){
      this.toast.pop('warning', '调拨类型为倒库调拨不允许发起竞价！');
      return;
    }
    const allotdetids = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data.id && orderdetSelected[i].selected && !orderdetSelected[i].data.group) {
        allotdetids.push(orderdetSelected[i].data.id);
      }
    }
    if (allotdetids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的调拨明细！！！');
      return;
    }

    this.allotapi.allotdetgroup(allotdetids).then(data => {
      this.selectQihuodetWuliubaojia = data;
      // 通知物流报价弹窗的参数
      this.noticewuliuparams = { qihuodets: this.selectQihuodetWuliubaojia, id: this.model['id'], detids: allotdetids, datasource: 5 };
      this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent, { class: 'modal-lg' });
      this.bsModalRef.content.parentThis = this;
    });
  }

  wuliunoticehide() {
    this.bsModalRef.hide();
    this.getbill();
    this.getDetail();
    this.getMyRole();
    this.tabviewindex = 2;
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
    this.allotapi.findbyallotid(this.parentId).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
    });
  }
  handleChange(event) {
    this.tabviewindex = event.index;
  }
  closejingjiamodal() {
    this.jingjiaModal.hide();

  }
  showjingjiamodal(dets) {
    this.jingjiaModal.show();
    this.jingjiadata = { wuliuorderids: dets };
    this.jingjiadata['ismianxi'] = false;
  }
  showjingjiamodal2() {
    this.jingjiaModal.show();
  }
  jingjiaFee() {
    if(this.jingjiadata['ischuku'] === true){
      console.log(this.jingjiadata['ischuku']);
      console.log(111);
      if (!this.jingjiadata['ckpaycustomerid']) {
        this.toast.pop('warning', '请选择付费单位！！！');
        return;
      }
      if (!this.jingjiadata['ckaccountdirection']) {
        this.toast.pop('warning', '请选择记账方向！！！');
        return;
      }
    }
    if(this.model['type'] === 1){
      if (!this.jingjiadata['paycustomerid']) {
        this.toast.pop('warning', '请选择付费单位！！！');
        return;
      }
      if (!this.jingjiadata['accountdirection']) {
        this.toast.pop('warning', '请选择记账方向！！！');
        return;
      }
  
    }
    if (this.jingjiadata['ismianxi'] === null|| this.jingjiadata['ismianxi'] === undefined) {
      this.toast.pop('warning', '请选择是否计息！！！');
      return;
    }
    this.model['ismianxi'] = this.jingjiadata['ismianxi'];
    this.allotapi.modify(this.model).then(data => {
      this.model['version'] = data['version'];
      let json = { id: this.model['id'] };
      json = Object.assign(json, this.jingjiadata);
      this.allotapi.verifyUser(json).then((req) => {
        this.toast.pop('success', '提交成功！');
        this.router.navigateByUrl('allotdetreport');
      });
    });
  }
  // 查询对应的期货物流竞价
  getqihuowuliuorder() {
    this.allotapi.getqihuowuliuorder(this.parentId).then(data => {
      this.singleData = data;
      if (!this.singleData || !this.singleData.length) {
        this.toast.pop('warning', '未查询到期货物流竞价！！！');
        return;
      }
      this.qihuowuliuorderModel.show();
    })
  }
  closeqihuowuliuorderModel() {
    this.qihuowuliuorderModel.hide();
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
  // 引入期货物流竞价
  importqihuowuliuorder() {
    const wuliuorderids = [];
    this.singleData.forEach(item => {
      if (item.checked && item.id) {
        wuliuorderids.push(item.id);
      }
    });
    if (!wuliuorderids.length || wuliuorderids.length < 1) {
      this.toast.pop('warning', '请选择期货物流竞价明细！！！');
    }
    if (wuliuorderids.length) {
      this.allotapi.importqihuowuliuorder({ wuliuorderids: wuliuorderids, allotid: this.parentId }).then(data => {
        if (data) {
          this.closeqihuowuliuorderModel();
          this.getbill();
          this.getDetail();
          this.getMyRole();
          this.tabviewindex = 2;
        }
      });
    }
  }

  // 一键删除明细 
  delDet() {
    this.allotapi.delDet({ allotid: this.parentId }).then(data => {
      this.getMyRole();
      this.getbill();
      this.getDetail();
    });
  }

  //一键撤销

  delALL() {

    sweetalert({
      title: '你确定要撤销调拨单吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      //删掉调出标识
      this.allotapi.delverifyUser({ allotid: this.parentId }).then(data => {

      });
      //删除所有费用
      this.allotapi.delAllotfee({ allotid: this.parentId }).then(data => {
      });
      //删除所有物流竞价
      const wuliuorderidlist = [];
      this.allotapi.findbyallotid(this.parentId).then(data => {
        data.forEach(element => {
          wuliuorderidlist.push(element.id);
        });
        this.feeApi.zuofei(wuliuorderidlist).then(() => {
        });
      });

      //删除所有明细
      this.allotapi.delDet({ allotid: this.parentId }).then(data => {
        this.getMyRole();
        this.getbill();
        this.getDetail();
      })
      sweetalert.close();
    });

  }

  // 关闭上传弹窗
  hideuploadcarnumDialog() {
    this.uploadcarnumModal.hide();
  }
  uploadcarnum() {
    if (this.model['status']) {
      this.toast.pop('warning', '已经调入，不允许修改提货人信息！');
      return;
    }
    this.uploadcarnumModal.show();
  }

  uploadcarnumParam: any = { module: 'ruku', count: 1, sizemax: 5, extensions: ['xls'] };
  // 设置上传文件类型
  acceptcarnum = '.xls, application/xls';
  uploadscarnum($event) {
    const json: any = {};
    json.allotid = this.parentId;
    json.url = [$event.url];
    if ($event.length !== 0) {
      this.allotapi.matchingcarnum(json).then(data => {
        this.toast.pop('success', '上传成功！');
        this.hideuploadcarnumDialog();
        this.getDetail();
      });
    }
  }
  params1 = {};
  hidepeopleModal(){
    this.peopleModal.hide();
  }
  submitallot() {
    this.allotapi.updatecarnum(this.params1).then(() => {
      this.toast.pop('success', '提货人信息修改成功');
      this.getDetail();
      this.hidepeopleModal();
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



    //批量删除调拨明细
    allotdetids: any = [];
    deleteallotdet() {
      this.allotdetids = new Array();
      const allotdetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
      for (let i = 0; i < allotdetlist.length; i++) {
        if (allotdetlist[i].selected && allotdetlist[i].data && allotdetlist[i].data['id']) {
          this.allotdetids.push(allotdetlist[i].data.id);
        }
      }
      if (!this.allotdetids.length) { 
        this.toast.pop('warning', '请选择明细之后再删除！');
        return;
      }
      if (confirm('你确定要删除吗？')) {
        this.allotapi.deleteallotdet(this.allotdetids).then(data => {
          this.toast.pop('success', '删除成功！');
                this.getDetail();
                this.getMyRole();
        });
      }
    }

//费用批量删除明细
allotdetfeeids: any = [];
deleteallotdetfee() {
  this.allotdetfeeids = new Array();
  const allotdetfeelist = this.feegridOptions.api.getModel()['rowsToDisplay'];
  for (let i = 0; i < allotdetfeelist.length; i++) {
    if (allotdetfeelist[i].selected && allotdetfeelist[i].data && allotdetfeelist[i].data['id']) {
      this.allotdetfeeids.push(allotdetfeelist[i].data.id);
    }
  }
  if (!this.allotdetfeeids.length) { 
    this.toast.pop('warning', '请选择明细之后再删除！');
    return;
  }
  if (confirm('你确定要删除吗？')) {
    this.allotapi.removeallotfees(this.allotdetfeeids).then(data => {
      this.toast.pop('success', '删除成功！'); 
      this.listFeeDetail();
      this.getDetail();
  });
  }
} 
  

}
