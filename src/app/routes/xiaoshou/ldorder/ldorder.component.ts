import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from "../../../core/settings/settings.service";
import { ColDef, GridOptions } from "ag-grid";
import { ModalDirective, BsModalService, BsModalRef } from "ngx-bootstrap";
import { ClassifyApiService } from "../../../dnn/service/classifyapi.service";
import { DatePipe } from "@angular/common";
import { ToasterService } from "angular2-toaster";
import { ActivatedRoute, Router } from "@angular/router";
import { MoneyService } from "../../../dnn/service/money.service";
import { UserapiService } from "app/dnn/service/userapi.service";
import { QihuoService } from "app/routes/qihuo/qihuo.service";
import { KucundetimportComponent } from 'app/dnn/shared/kucundetimport/kucundetimport.component';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { FeeapiService } from 'app/routes/fee/feeapi.service';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';

@Component({
  selector: 'app-ldorder',
  templateUrl: './ldorder.component.html',
  styleUrls: ['./ldorder.component.scss']
})
export class LdorderComponent implements OnInit {
  oldyufurate: any = '';
  //父页面传过来的qihuoid的值
  ldorderid: number;
  ldordermodel = { addrbak: {}, buyer: {}, seller: {}, org: {}, arrearspeople: {}, cuser: {}, vuser: {} };
  qihuoflag: any = { dingjin: true, isv: false, fisv: false, fp: false, issubmit: true, detail: true };
  one: boolean = true;
  two: boolean = false;
  // 控制是否输入
  isshowInput = false;
  isshowInput1 = false;
  // 费用合计
  feeHeji: number = 0;
  feeHeji1 = 0;
  //aggird 表格初始化对象
  gridOptions: GridOptions;//期货
  ordergridOptions: GridOptions;//订单明细
  wuliuOffergridOptions: GridOptions; // 物流竞价明细
  editmodel: any = {}; // 明细修改对象
  gns1: any = []; // 修改明细的品名
  chandis1: any = []; // 修改明细的产地
  gnsarr: any = [];
  attrs1: any = [];
  showGuige1 = false;
  editguige: any = {};
  isChandi1 = false;
  gcs1: any[] = [];
  guigelength1: number; // 声明一个数量计算器
  dets = null; // 引入库存时明细id
  tabviewindex = 0; // 物流竞价明细选项卡的索引
  selectQihuodetWuliubaojia: any = [];

  editorder: any = {};
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  addrs: any = []; // 收货地址
  buyer: any = {};
  // 引入库存弹窗对象
  kcbsModalRef: BsModalRef;
  @ViewChild('editqihuodialog') private editqihuodialog: ModalDirective;
  // 修改运输方式
  @ViewChild('mainmodifydialog') private mainmodifydialog: ModalDirective;
  // 弹出添加地址的对话框
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  // 引入通知采购弹窗模型
  bsModalRef: BsModalRef;
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  constructor(public settings: SettingsService, private qihuoapi: QihuoService, private classifyapi: ClassifyApiService,
    private datepipe: DatePipe, private toast: ToasterService, private route: ActivatedRoute, private router: Router,
    private moneyapi: MoneyService, private userapi: UserapiService, private modalService: BsModalService,
    private feeApi: FeeapiService, private businessorderApi: BusinessorderapiService,
    private modalService1: BsModalService) {
    // aggird实例对象
    this.gridOptions = {
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
      // groupSelectsChildren: true, // 分组可全选
      // rowSelection: 'multiple',
      // getNodeChildDetails: (params) => {
      //   if (params.group) {
      //     return { group: true, children: params.participants, field: 'group', key: params.group };
      //   } else {
      //     return null;
      //   }
      // },
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    //设置aggird表格列
    this.gridOptions.columnDefs = [
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'group', cellRenderer: 'group',
      //   cellRendererParams: { checkbox: true }, headerCheckboxSelection: true,
      //    minWidth: 80
      // },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku.name', minWidth: 80, checkboxSelection: true
      },
      {
        cellStyle: { "display": "block" }, headerName: '规格', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          { cellStyle: { "text-align": "center" }, headerName: '品名', field: 'goodscode.gn', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '产地', field: 'goodscode.chandi', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '宽度', field: 'goodscode.width', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '颜色', field: 'goodscode.color', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 80, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '油漆种类', field: 'goodscode.painttype', minWidth: 90, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '漆膜厚度', field: 'goodscode.qimo', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '涂层', field: 'goodscode.tuceng', minWidth: 90, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '卷内径', field: 'goodscode.neijing', minWidth: 80, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '是否喷码', field: 'goodscode.penma', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '是否修边', field: 'goodscode.xiubian', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '包装方式', field: 'goodscode.packagetype', minWidth: 60, enableRowGroup: true },
        ]
      },
      {
        cellStyle: { "display": "block" }, headerName: '数量', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          { cellStyle: { "text-align": "center" }, headerName: '订货量', field: 'weight', minWidth: 60, enableRowGroup: true },
          { cellStyle: { "text-align": "center" }, headerName: '已提货', field: 'yitihuoweight', minWidth: 60, enableRowGroup: true }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '费用', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          { cellStyle: { 'text-align': 'center' }, headerName: '销售价格', field: 'saleprice', minWidth: 100 },
          { cellStyle: { 'text-align': 'center' }, headerName: '结算价格', field: 'neibujiesuanprice', minWidth: 100 },
          { cellStyle: { 'text-align': 'center' }, headerName: '预估费用单价', field: 'yugufeeprice', minWidth: 100 },
          { cellStyle: { 'text-align': 'center' }, headerName: '预估毛利', field: 'yugumaoliprice', minWidth: 80 },
        ]
      },
      // {
      //   cellStyle: { "text-align": "center" }, headerName: '操作', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
      //     return '<a target="_blank">删除</a>';
      //   }, onCellClicked: (data) => {
      //     if (confirm('你确定要删除吗？')) {
      //       this.qihuoapi.deldet(data.data.id).then(() => {
      //         this.toast.pop('success', '删除成功！');
      //         this.getqihuomodel();
      //         this.findqihuodet();
      //       })
      //     }
      //   }
      // },
      {
        cellStyle: { 'display': 'block' }, headerName: '操作', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '删除', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
              if (this.qihuoflag['detail']) {
                return '<a target="_blank">删除</a>';
              }
            }, onCellClicked: (data) => {
              if (this.qihuoflag['detail']) {
                if (confirm('你确定要删除吗？')) {
                  this.qihuoapi.deldet(data.data.id).then(() => {
                    this.toast.pop('success', '删除成功！');
                    this.getqihuomodel();
                    this.findqihuodet();
                  });
                }
              }
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '插行', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
              if (this.qihuoflag['detail']) {
                return '<a target="_blank">插行</a>';
              }
            }, onCellClicked: (data) => {
              if (this.qihuoflag['detail']) {
                this.qihuoapi.copylddet({ id: data.data.id }).then(params => {
                  this.findqihuodet();
                });
              }
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '修改', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
              if (this.qihuoflag['detail']) {
                return '<a target="_blank">修改</a>';
              }
            }, onCellClicked: (data) => {
              if (this.qihuoflag['detail']) {
                this.detEdit(data.data);
              }
            }
          }


        ]
      }
    ];

    //ordergridOptions实例对象
    this.ordergridOptions = {
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
      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          // console.log('group', rowItem);
          return {
            group: true,
            expanded: rowItem.group === '彩涂' || rowItem.group === '镀锌' || rowItem.group === '镀铝锌'
              || rowItem.group === '折弯件' || rowItem.group === '辉彩' || rowItem.group === '恒牧' || rowItem.group === '洁彩',
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group
          };
        } else {
          return null;
        }
      }
    };
    this.ordergridOptions.onGridReady = this.settings.onGridReady;
    this.ordergridOptions.groupSuppressAutoColumn = true;
    this.ordergridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', cellRenderer: 'group', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '出库费单价', field: 'chukuprice', width: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        // cellStyle: { 'text-align': 'center' }, headerName: '运费', field: 'shijiyunprice', width: 70,
        cellStyle: { 'text-align': 'right' }, headerName: '运费', field: 'yunprice', width: 70,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '考核价', field: 'price', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售价', field: 'pertprice', width: 90, editable: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', width: 90,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提货Id', field: 'tihuoid', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcId', field: 'gcid', width: 90 }

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
        cellStyle: { 'text-align': 'center' }, headerName: '是否作废', field: 'isdel', width: 90
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
              this.getqihuomodel();
              this.findqihuodet();
            });
          }
        }
      }
    ];
  }
  ngOnInit() {
    //获取URL传过来的值
    this.route.params.subscribe((data) => { this.ldorderid = data['id']; });
    this.getqihuomodel();
    this.findqihuodet();
    this.getorderdet();
    this.getMyRole();
    setTimeout(() => {
      this.getGn();
    }, 0);
  }
  //获取orderdet中的数据
  getorderdet() {
    this.qihuoapi.findOrderdet(this.ldorderid).then(data => {
      console.log('ordergridOptions___+++++___', data);
      this.ordergridOptions.api.setRowData(data);
    });
  }
  //获取主表的数据
  getqihuomodel() {
    this.qihuoapi.findqihuo(this.ldorderid).then(data => {
      console.log(data);
      this.ldordermodel = data;
      this.oldyufurate = this.ldordermodel['yufurate'];
      if (this.ldordermodel['vuserid']) {
        this.qihuoflag['dingjin'] = false;
        this.qihuoflag['detail'] = false;
      }
      if (this.ldordermodel['ordertype'] == 2) {
        this.qihuoflag['dingjin'] = false;
      }
      this.userapi.userInfo2().then(data => {
        if (data.id == this.ldordermodel['vuserid']) {
          if (!this.ldordermodel['isv']) {
            this.qihuoflag['isv'] = true;
          } else {
            this.qihuoflag['isv'] = false;
          }
          if (this.ldordermodel['isv']) {
            this.qihuoflag['fisv'] = true;
          }
        }
      })
      if (this.ldordermodel['ordertype'] == 1) {
        this.qihuoflag['fp'] = true;
      }
      if (this.ldordermodel['vuserid']) {
        this.qihuoflag['issubmit'] = false;
        this.qihuoflag['isdingjinedit'] = true;
      }
    })
  }
  //查询期货明细
  findqihuodet() {
    this.qihuoapi.findQihuodet(this.ldorderid).then(data => {
      console.log('gridOptions___+++++___', data);
      this.gridOptions.api.setRowData(data);
    })
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
      // this.getMyRole();
    });
  }
  //生成期货
  qihuodetmodel = {
    id: null,
    gnid: null,
    chandiid: null,
    dinghuoliang: null,
    saleprice: null,
    classifys: null,
    cangkuid: null,
    chukufeeprice: null,
    yunfeeprice: null,
    yunzafeeprice: null,
    jiagongfeeprice: null
  };
  @ViewChild('createqihuodialog') private createqihuodialog: ModalDirective;
  //查询弹窗
  gns: any[];
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      console.log(data);
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  islindiao: boolean;
  isqihuo: boolean;
  cangkus: Array<any>;
  addqihuodialog() {
    this.createselectNull();
    this.gns = [];
    this.getGnAndChandi();
    console.log(this.ldordermodel['ordertype']);
    if (this.ldordermodel['ordertype'] === 2) {//如果是临调销售合同则需要添加仓库
      this.getcangkus();
    }
    this.createqihuodialog.show();
  }
  getcangkus() {
    this.islindiao = true;
    this.cangkus = [];
    this.classifyapi.changkulist().then(data => {
      data.forEach(element => {
        this.cangkus.push({
          label: element.name,
          value: element.id
        });
      });
    });
  }
  chandis: any[];
  isChandi: boolean = false;
  selectedgn(value) {
    this.isChandi = true;
    this.attrs = [];
    this.showGuige = false;
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  attrs: any[];
  guigelength: number;//声明一个数量计算器
  showGuige: boolean = false;
  selectedchandi(value) {
    this.attrs = [];
    this.classifyapi.getAttrs(value).then(data => {
      this.guigelength = data['length'];
      this.attrs = data;
    });
    this.showGuige = true;
  }
  gcs: any[] = [];
  selectedguige(event, labelid) {
    for (let i = 0; i < this.gcs.length; i++) {
      if (this.gcs[i]['name'] === labelid) {
        this.gcs.splice(i, 1);
      }
    }
    // 备注需求 如果是彩涂，且是烨辉彩涂，那么油漆对应颜色重新选择
    if (this.qihuodetmodel['chandiid'] === 8) {
      if (labelid === 'painttypeid') {
        if (this.chandis[2].value = 8) {
          this.classifyapi.getAttrs(event['value']).then(data => {
            if (data.length !== 0) {
              this.attrs = this.attrs.filter(item => item.name !== 'colorid');
              this.attrs.splice(3, 0, data[0]);
              this.guigelength = this.attrs.length;
            } else {
              this.attrs = this.attrs.filter(item => item.name !== 'colorid');
              this.guigelength = this.attrs.length;
            }
          });
          this.showGuige = true;
        }
      }
    }
    this.gcs.push({ name: labelid, value: event['value'] });
  }
  qihuodialogcoles() {
    this.createqihuodialog.hide();
    this.one = true;
    this.two = false;
  }
  nextdialog() {
    if (this.gcs['length'] !== this.guigelength) { this.toast.pop('warning', '规格属性不允许为空！'); return; }
    this.qihuodetmodel['gnid'] = this.qihuodetmodel['gnid']['id'];
    this.one = false;
    this.two = true;
    if (this.ldordermodel['ordertype'] !== 2) {
      this.isqihuo = true;
    }
  }
  // 重选
  createselectNull() {
    this.chandis = [];
    this.isChandi = false;
    this.attrs = [];
    this.showGuige = false;
    this.gcs = [];
    this.qihuodetmodel = {
      id: null,
      gnid: null,
      chandiid: null,
      dinghuoliang: null,
      saleprice: null,
      classifys: null,
      cangkuid: null,
      chukufeeprice: null,
      yunfeeprice: null,
      yunzafeeprice: null,
      jiagongfeeprice: null
    };
    this.one = true;
    this.two = false;
  }
  create() {

    if (!this.qihuodetmodel['dinghuoliang']) { this.toast.pop('warning', '订货量不允许为空！'); return; }
    if (!this.qihuodetmodel['saleprice']) { this.toast.pop('warning', '销售价格不允许为空！'); return; }
    if (!this.qihuodetmodel['cangkuid']) { this.toast.pop('warning', '所在仓库不允许为空！'); return; }
    /* if(this.ldordermodel['ordertype']==2&&!this.qihuodetmodel['cangkuid']){
       this.toast.pop('warning','临调合同请填写仓库！');return;}*/
    this.qihuodetmodel['classifys'] = this.gcs;
    this.qihuodetmodel['id'] = this.ldorderid;
    this.qihuodetmodel['fees'] = this.lines;
    console.log(this.qihuodetmodel);
    this.qihuoapi.createqihuodet(this.qihuodetmodel).then(() => {
      this.toast.pop('success', '添加成功')
      this.qihuodialogcoles();
      /* 刷新明细页面*/
      this.findqihuodet();
      this.getqihuomodel();
      this.one = true;
      this.two = false;
    });
  }
  //提交审核人
  submitverify() {
    let search = { beizhu: null, qihuoid: null, dingjin: null };
    search.qihuoid = this.ldorderid;
    if (!this.ldordermodel['beizhu']) {
      this.toast.pop('warning', '请填写备注');
      return;
    }
    search.beizhu = this.ldordermodel['beizhu'];
    search.dingjin = this.ldordermodel['dingjin'];
    if (confirm("你确定提交审核吗？")) {
      this.qihuoapi.submitverify(this.ldorderid, search).then(data => {
        this.toast.pop('success', '提交审核成功');
        this.qihuoflag['dingjin'] = false;
        this.qihuoflag['detail'] = false;
        this.getqihuomodel();
      })
    }
  }
  //审核
  verifyqihuo() {
    let search = { version: this.ldordermodel['version'] };
    if (confirm("你确定审核吗？")) {
      this.qihuoapi.verify(this.ldorderid, search).then(data => {
        this.toast.pop('success', '审核成功');
        this.getqihuomodel();
      })
    }
  }
  //弃审
  removeverify() {
    let search = { version: this.ldordermodel['version'] };
    if (confirm("你确定弃审吗？")) {
      this.qihuoapi.qishen(this.ldorderid, search).then(data => {
        this.toast.pop('success', '弃审成功');
        this.getqihuomodel();
      })
    }
  }
  //打印预览
  print() {
    this.qihuoapi.print(this.ldorderid).then(data => {
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    })
  }
  //生成pdf
  makepdf() {
    this.qihuoapi.makepdf(this.ldorderid).then(data => {
      this.toast.pop('success', data.msg);
    });
  }
  //销售价格和预估费用修改
  @ViewChild('feeadddialog') private feeadddialog: ModalDirective;
  feetypes = [{ value: '1', label: '汽运费' },
  { value: '2', label: '铁运费' },
  { value: '3', label: '船运费' },
  { value: '4', label: '出库费' },
  { value: '5', label: '开平费' },
  { value: '6', label: '纵剪费' },
  { value: '7', label: '销售运杂费' },
  { value: '8', label: '包装费' },
  { value: '9', label: '仓储费' }];
  //费用添加弹出框
  feemodel: any = { feetype: null, price: null, beizhu: null };
  lines: any[] = [];//插行控制器
  //展示费用
  feeadddialogshow() {
    this.feeHeji = 0;
    this.qihuodetmodel['neibujiesuanprice'] = 0;
    this.feemodel = { feetype: null, price: null, beizhu: null };
    this.lines = [];
    this.feeadddialog.show();
  }
  feeadddialogclose() { this.feeadddialog.hide(); }
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
  // 控制显示添加框
  showInput() {
    this.isshowInput = !this.isshowInput;
  }
  /**明细修改 */
  detEdit(item) {
    const params = JSON.parse(JSON.stringify(item));
    this.gcs1 = [];
    this.editmodel = {};
    this.editmodel['gnid'] = params.goodscode['gnid'];
    this.editmodel['chandiid'] = params.goodscode['chandiid'];
    this.editmodel['weight'] = params['weight'];
    this.editmodel['saleprice'] = params['saleprice'];
    this.editmodel['neibujiesuanprice'] = params['neibujiesuanprice'];
    this.editguige = params['goodscode'];
    this.editmodel['id'] = params['id'];
    this.getchandi(this.editmodel['gnid']);
    this.isChandi1 = true;
    this.selectedchandi1(this.editmodel['chandiid'], true);
    if (this.ldordermodel['ordertype'] === 2) {// 如果是临调销售合同则需要添加仓库
      this.islindiao = true;
      this.cangkus = [];
      this.classifyapi.changkulist().then(data => {
        data.forEach(element => {
          this.cangkus.push({
            label: element.name,
            value: element.id
          });
        });
        this.editmodel['cangkuid'] = params['cangkuid'];
      });
    }
    this.editqihuodialog.show();
  }
  editqihuodialogcoles() {
    this.editqihuodialog.hide();
  }
  /**获取修改明细的品名 */
  getGn() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gnsarr = data;
      data.forEach(element => {
        this.gns1.push({
          label: element['name'],
          value: element['id']
        });
      });
    });
  }
  /**
   * 获取修改明细的产地
   * @param gnid 品名id
   */
  getchandi(gnid) {
    for (const iterator of this.gnsarr) {
      if (iterator.id === gnid) {
        const arr: any[] = iterator['attrs'];
        arr.forEach(ele => {
          this.chandis1.push({
            value: ele.id,
            label: ele.name
          });
        });
        break;
      }
    }
  }
  selectedgn1(gnid) {
    this.isChandi1 = true;
    this.attrs1 = [];
    this.showGuige1 = false;
    this.chandis1 = [];
    delete this.editmodel['chandiid'];
    this.getchandi(gnid);
    this.editguige = {};
  }
  selectedchandi1(value, flag) {
    this.attrs1 = [];
    if (!flag) {
      this.editguige = {};
      this.gcs1 = [];
    }
    this.classifyapi.getAttrs(value).then(data => {
      this.attrs1 = data;
      this.guigelength1 = data.length;
      if (flag) {
        this.getgcs(this.editguige);
      }
    });
    this.showGuige1 = true;
  }
  selectedguige1(event, labelid) {
    for (let i = 0; i < this.gcs1.length; i++) {
      if (this.gcs1[i]['name'] === labelid) {
        this.gcs1.splice(i, 1);
      }
    }
    this.gcs1.push({ name: labelid, value: event['value'] });
  }
  getgcs(json) {
    this.attrs1.forEach(element => {
      for (const key in json) {
        if (json.hasOwnProperty(key)) {
          const iter = json[key];
          if (key === element.name) {
            this.gcs1.push({ name: key, value: iter });
            break;
          }
        }
      }
    });
  }
  // 重选
  createselectNull1() {
    this.chandis1 = [];
    this.isChandi1 = false;
    this.attrs1 = [];
    this.showGuige1 = false;
    this.gcs1 = [];
    this.editmodel = {};
  }
  create1() {
    if (!this.editmodel['weight']) { this.toast.pop('warning', '订货量不允许为空！'); return; }
    if (!this.editmodel['saleprice']) { this.toast.pop('warning', '销售价格不允许为空！'); return; }
    if (this.gcs1['length'] !== this.guigelength1) { this.toast.pop('warning', '规格属性不允许为空！'); return; }
    this.editmodel['classifys'] = this.gcs1;
    this.editmodel['fees'] = this.lines1;
    this.qihuoapi.updatelddet(this.editmodel).then(() => {
      this.toast.pop('success', '修改成功');
      this.editqihuodialogcoles();
      /* 刷新明细页面*/
      this.findqihuodet();
      this.getqihuomodel();
    });
  }
  // 销售价格和预估费用修改
  @ViewChild('editdetfeeadddialog') private editdetfeeadddialog: ModalDirective;
  // 费用添加弹出框
  feemodel1: any = { feetype: null, price: null, beizhu: null };
  lines1: any[] = [];//插行控制器
  //展示费用
  feeadddialogshow1() {
    this.feeHeji1 = 0;
    this.editmodel['neibujiesuanprice'] = 0;
    this.feemodel1 = { feetype: null, price: null, beizhu: null };
    this.editdetfeeadddialog.show();
  }
  feeadddialogclose1() { this.editdetfeeadddialog.hide(); }
  insertline1() {// 插行
    if (!this.feemodel1['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel1['price'] && 'number' === typeof this.feemodel1['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    this.feeHeji1 = this.feeHeji1['add'](this.feemodel1['price']);
    this.lines1.push(
      {
        id: new Date().getTime(),
        feetype: this.feemodel1['feetype'],
        feeprice: this.feemodel1['price'],
        beizhu: this.feemodel1['beizhu']
      }
    )
    this.feemodel1 = { feetype: null, price: null, beizhu: null };
    this.isshowInput1 = !this.isshowInput1;
  }
  delorderfee1(index, feeprice) {
    this.lines1.splice(index, 1);
    this.feeHeji1 = this.feeHeji1['sub'](feeprice);
  }
  // 控制显示添加框
  showInput1() {
    this.isshowInput1 = !this.isshowInput1;
  }
  /**引入库存 */
  yinru(item) {
    this.dets = item.id;
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    this.kcbsModalRef.content.componentparent = this;
  }
  /**引入库存弹窗关闭 */
  ldimportkucunhide() {
    this.kcbsModalRef.hide();
    this.findqihuodet();
  }
  /**修改备注 */
  modify(params) {
    this.qihuoapi.update(this.ldordermodel['id'], params).then(() => {
      this.getqihuomodel();
    });
  }
  // 计算约定比率
  calcyufurate() {
    if (this.ldordermodel['dingjin'] !== null && this.ldordermodel['dingjin'] !== undefined) {
      this.ldordermodel['yufurate'] = this.GetPercent(this.ldordermodel['dingjin'], this.ldordermodel['tjine']);
      this.oldyufurate = this.ldordermodel['yufurate'];
      this.modify(this.ldordermodel);
    }
  }
  // 计算约定定金
  calcdingjin() {
    if (this.oldyufurate !== null && this.oldyufurate !== undefined) {
      if (this.oldyufurate.indexOf('%') !== -1) {
        this.oldyufurate = this.oldyufurate.replace('%', '');
      }
      if (isNaN(this.oldyufurate)) {
        alert('约定比率必须是数字，请检查！');
        this.oldyufurate = this.ldordermodel['yufurate'];
        return false;
      }
      this.ldordermodel['yufurate'] = this.NumberCheck(this.oldyufurate);
      this.ldordermodel['dingjin'] = (Number(this.ldordermodel['tjine']) * this.toPoint(this.ldordermodel['yufurate']));
      let result = parseFloat(this.ldordermodel['dingjin']);
      result = Math.round(this.ldordermodel['dingjin'] * 100) / 100;
      this.ldordermodel['dingjin'] = result;
      this.oldyufurate = this.ldordermodel['yufurate'];
      this.modify(this.ldordermodel);
    }
  }
  /**数字的处理 */
  NumberCheck(num) {
    let str = num;
    const len1 = str.substr(0, 1);
    const len2 = str.substr(1, 1);
    // 如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && len1 === 0 && len2 !== '.') {
      str = str.substr(1, 1);
    }
    // 第一位若是.则前边加上0
    if (len1 === '.') {
      str = '0' + str;
    }
    console.log(str);
    // 限制只能输入一个小数点
    if (str.indexOf('.') !== -1) {
      const str_ = str.substr(str.indexOf('.') + 1);
      if (str_.indexOf('.') !== -1) {
        str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
      }
    }
    // 如果需要保留小数点后两位，则用下面公式
    let result = parseFloat(str);
    result = Math.round(str * 100) / 100;
    return result + '%';
  }
  /**
   * 百分比
   * @param num 当前数
   * @param total 总数
   */
  GetPercent(num, total) {
    /// <summary>
    /// 求百分比
    /// </summary>
    /// <param name="num">当前数</param>
    /// <param name="total">总数</param>
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
      return '0';
    }
    return total <= 0 ? '0%' : ((num / total * 10000) / 100.00).toFixed(2) + '%';
  }
  /**百分比转数字 */
  toPoint(percent) {
    let str = percent.replace('%', '');
    str = str / 100;
    return str;
  }
  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    if (this.ldordermodel['qihuostatus'] < 3) {
      this.toast.pop('warning', '审核之后才能通知采购！！！');
      return;
    }
    if (this.ldordermodel['type'] !== 1) {
      this.toast.pop('warning', '运输类型只有代运才能通知物流专员报价！！！');
      return;
    }
    const qihuodetids = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.gridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data && orderdetSelected[i].selected) {
        qihuodetids.push(orderdetSelected[i].data.id);
        this.selectQihuodetWuliubaojia.push({
          id: orderdetSelected[i].data.id,
          guige: orderdetSelected[i].data['goodscode']['guige'], weight: orderdetSelected[i].data['weight'],
          baojialiang: orderdetSelected[i].data['weight'],
          sumyibaojia: orderdetSelected[i].data['ybaojiaweight'] || 0
        });
      }
    }
    if (qihuodetids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的期货明细！！！');
      return;
    }
    this.modalService1.config.class = 'modal-lg';
    // 通知物流报价弹窗的参数
    this.noticewuliuparams = { qihuodets: this.selectQihuodetWuliubaojia, id: this.ldordermodel['id'], detids: qihuodetids };
    this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
    this.bsModalRef.content.parentThis = this;
  }
  wuliunoticehide() {
    this.bsModalRef.hide();
    this.getqihuomodel();
    this.findqihuodet();
    this.getMyRole();
    this.tabviewindex = 2;
  }
  handleChange(event) {
    this.tabviewindex = event.index;
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
    this.qihuoapi.wuliuofferdetail(this.ldorderid).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
    });
  }


  openmodifymain() {
    this.editorder = JSON.parse(JSON.stringify(this.ldordermodel));
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
        this.getqihuomodel();
        this.findqihuodet();
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
    this.addr['customerid'] = this.editorder['buyerid'];
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

}
