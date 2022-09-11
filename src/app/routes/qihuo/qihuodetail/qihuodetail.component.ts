import { StorageService } from './../../../dnn/service/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from "../../../core/settings/settings.service";
import { GridOptions, ColDef } from "ag-grid";
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { QihuoService } from "../qihuo.service";
import { ClassifyApiService } from "../../../dnn/service/classifyapi.service";
import { DatePipe } from "@angular/common";
import { ToasterService } from "angular2-toaster";
import { ActivatedRoute, Router } from "@angular/router";
import { MoneyService } from "../../../dnn/service/money.service";
import { UserapiService } from './../../../dnn/service/userapi.service';
import { KucundetimportComponent } from "../../../dnn/shared/kucundetimport/kucundetimport.component";
import { ContactprojectComponent } from '../contactproject/contactproject.component';
import { BusinessorderapiService } from 'app/routes/businessorder/businessorderapi.service';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { NoticewuliuyuanComponent } from 'app/dnn/shared/noticewuliuyuan/noticewuliuyuan.component';
import { FeeapiService } from 'app/routes/fee/feeapi.service';
import { ImporttiaohuobidComponent } from '../importtiaohuobid/importtiaohuobid.component';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { QualityobjectionimportComponent } from 'app/dnn/shared/qualityobjectionimport/qualityobjectionimport.component';
import { OrderapiService } from 'app/routes/order/orderapi.service';
import { MdmService } from 'app/routes/mdm/mdm.service';



@Component({
  selector: 'app-qihuodetail',
  templateUrl: './qihuodetail.component.html',
  styleUrls: ['./qihuodetail.component.scss']
})
export class QihuodetailComponent implements OnInit {
  oldyufurate: any = '';
  cangku: { label: string; value: string; }[];
  @ViewChild('chukufeetype') private ckfeetype: ModalDirective;
  //配款
  @ViewChild('allocationModel') private allocationModel: ModalDirective;
  //释放配款
  // 上传弹窗实例
  @ViewChild('shifangallocationModel') private shifangallocationModel: ModalDirective

  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  //作废原因填写
  @ViewChild('zuofeiModel') private zuofeiModel: ModalDirective;
  // 查看质保书
  @ViewChild('zhibaoshuModel') private zhibaoshuModel: ModalDirective;
  // 期货变更提交原因填写
  @ViewChild('qhchangetijiaoModel') private qhchangetijiaoModel: ModalDirective;
  // 修改免息弹窗
  @ViewChild('interestfreeandunitandcangkuModel') private interestfreeandunitandcangkuModel: ModalDirective;
  // 采购合同弹窗
  @ViewChild('createCaigouModal') private createCaigouModal: ModalDirective;
  @ViewChild('addqualityModal') private addqualityModal: ModalDirective;
  @ViewChild('createmdmqihuodialog') private createmdmqihuodialog: ModalDirective;
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  // 控制页面操作按钮是否显示
  flag: { edit: boolean, editbaocun: boolean, disabled: boolean, verify: boolean, confirm: boolean, querendaohuo: boolean, shenhe: boolean, pdf: boolean, deldet: boolean } =
    { edit: false, editbaocun: false, disabled: false, verify: false, confirm: false, querendaohuo: false, shenhe: false, pdf: false, deldet: false };
  // 控制编辑的
  mdmgnsearch = { pagenum: 1, pagesize: 10, itemname: '', categoryname: '' };
  goodscode: any = {};
  gnData: any = [];
  editflag = { zhidan: false, iseditguige: false };
  editTempParam = { detdata: null }; // 修改明细临时变量
  chukufeetypes: { label: string; value: string; }[] = [];
  chukufeetypess = {};
  params = {};
  qhqualityModel = {};
  changeordermodal={};
   // 获取当前登录用户的信息
   current = this.storage.getObject('cuser');
 
   paytypes = [{ value: '0', label: '款到发货' }, { value: '1', label: '欠款发货' }];
  //父页面传过来的qihuoid的值
  qihuoid: number;
  tihuoid: number;
  wlweight;
  //引入质量异议
  zlbsModalRef: BsModalRef;
  isimport = { flag: true };
  rstypes = [{ value: '1', label: '补重' }, { value: '2', label: '退款' }, { value: '3', label: '订货折让' }];
  saletypes = [{ value: '1', label: '补差' }, { value: '2', label: '退货' }, { value: '3', label: '订货折让' }];
  ordermodal=[{value:'1',label:'默认模板'},{value:'2',label:'老模板'}];
  qihuomodel = { addrbak: {}, buyer: {}, seller: {}, org: {}, arrearspeople: {}, cuser: {}, vuser: {} ,cperson: {},jhcangku: {}};
  qihuodet = {};
  wlcustomer = {};
  transporttype;
  isbaojia = false;
  editqihuo: any = {}; // 修改订单的主表
  addrs: any = []; // 收货地址
  orderdetids: any[] = [];
  //费用添加弹出框
  feemodel: any = { feetype: null, price: null, beizhu: null };
  lines: any[] = [];//插行控制器
  @ViewChild('feeadddialog') private feeadddialog: ModalDirective;
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
  qihuoflag: any = {
    dingjin: true, isv: false, fisv: false, fp: false, issubmit:
      true, detail: true, isdingjinedit: false, noticecaigou: false,
    isfinish: false, isrecall: false, isorderchange: false, qihuochangestatus: 0, // 期货变更状态：0:变更前;1:变更中;2:审核中
    isruku: false,
    orderchange:1,//1:默认模板，2：老模板
  };
  qihuoflag2: any = {
    istiaohuo:false
  };
  one: Boolean = true;
  two: Boolean = false;
  hesuanDate: Boolean = false;
  // 控制是否输入
  isshowInput = false;
  // 费用合计
  feeHeji: number = 0;
  iscountshow: boolean; // 张数米数是否显示
  diyfeeHeji: number = 0;
  ordertitle: String;
  qihuodetname: String;
  orderdetname: String;
  zhidaoprices;
  isurgent;
  materialtypes;
  private gridApi;
  tabviewindex = 0; // 物流竞价明细选项卡的索引
  wuluiorderlist: any = [];
  zijinmonthrates: any = [];
  thtypes: any = [];
  storagefees: any = [];
  results: any;
  //aggird 表格初始化对象
  gridOptions: GridOptions;//期货
  pgridOptions: GridOptions;//成品
  bmgridOptions: GridOptions;//基料
  ordergridOptions: GridOptions;//订单明细
  dingjingridOptions: GridOptions;//定金
  allocationgridOptions: GridOptions;//配款
  wuliuOffergridOptions: GridOptions; // 物流竞价明细
  qihuochangegridOptions: GridOptions; // 期货变更记录
  isshownoticecaigou: boolean; // 是否显示通知采购两个按钮

  isorderchange: boolean; // 是否显示通知采购两个按钮

  songaddress: any = ''; // 送货地址
  isSaleman = false; // 是否是业务员
  msgs = [{ severity: 'info', detail: '您没有变更内容，如果提交则不需审批直接返回变更前状态！' }];
  isall = false; // 是否全选
  singleData = [];
  validQihuochangedet = [];
  // 引入弹窗模型
  bsModalRef: BsModalRef;
  importTBbsModalRef: BsModalRef;
  noticewuliuparams: any = {}; // 通知物流专员报价弹窗的参数
  qihuodetlist: any = []; // 期货明细
  qhchangetijiaobeizhu = ''; // 期货变更提交备注
  editqihuobuyerid = null;
  units: any = []; // 其他单位
  isShowInterestfree = false; // 是否显示免息按钮（期货和期货加工的显示）
  interestfreeAndUnitAndCangkuObj = {
    qihuodetid: null, isinterestfree: false, interestfreedays: null, interestfreereason: '', unitname: null,
    unitweight: null, unitprice: null,jhcangku:null,cangkuid:'', interestfreeOrUnitOrCangku: ''
  }; // 修改免息和新单位的对象
  // releasetypes = [{ value: '0', label: '不释放' }, { value: '1', label: '等比例释放' }, { value: '2', label: '最后一次释放' }];
  chandigongchas = [];
  packageyaoqius = [];
  jhcangku: any;
  constructor(public settings: SettingsService, private qihuoapi: QihuoService, private classifyapi: ClassifyApiService,
    private addressparseService: AddressparseService, private caigouApi: CaigouService, private datepipe: DatePipe,
    private toast: ToasterService, private route: ActivatedRoute, private router: Router, private moneyapi: MoneyService,
    private userapi: UserapiService, private modalService: BsModalService, private modalService1: BsModalService,
    private matchcarApi: MatchcarService, private storage: StorageService, private businessOrderApi: BusinessorderapiService,
    private feeApi: FeeapiService, private businessorderApi: BusinessorderapiService, private customerApi: CustomerapiService,
    public mdmService: MdmService, private orderApi: OrderapiService, private classifyApi: ClassifyApiService) {
    //aggird实例对象
    this.gridOptions = {
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
      enableFilter: true,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true, // 焦点离开停止编辑
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
        if (this.qihuomodel['ordertype'] === 1 || this.qihuomodel['ordertype'] === 10 || this.qihuomodel['ordertype'] === 14) {
          result.push({
            name: '成品添加',
            action: () => {
              this.addproductdialog(params.node.data.neibujiesuanprice, params.node.data.id, params.node.data.goodscode);
            }
          });
        }
        if (!this.qihuomodel['vuserid']) {
          result.push({
            name: '行复制',
            action: () => {
              this.qihuoapi.copydet({ id: params.node.data.id }).then(() => {
                this.getqihuomodel();
                this.findqihuodet();
              })
            }
          });
        }
        return result;
      },
      onSelectionChanged: (event) => {
        const rowCount = event.api.getSelectedNodes();
        this.wlweight = 0;
        rowCount.forEach(ele => {
          if (!ele['data']['group']) {
            this.wlweight = this.wlweight + Number(ele['data']['weight']);
          }

        });
        this.wlweight = this.wlweight.toFixed(3);
      },
    }
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'id', minWidth: 80, enableRowGroup: true,
        checkboxSelection: true
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '规格', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'goodscode.id', minWidth: 100
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', minWidth: 60, enableRowGroup: true },
          { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 120, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 60, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3,
            onCellClicked: (data) => {
              // this.showgcmodify(data['data']['goodscode']['houdu'], data['data']['id']);
              this.showdetmodify(data['data']['goodscode']['houdu'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'goodscode.width', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['width'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['duceng'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '颜色|锌花', field: 'goodscode.color', minWidth: 95, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['color'], data['data']);
            }
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '原色号', field: 'sehao', minWidth: 80, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['caizhi'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 80, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['ppro'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'goodscode.painttype', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['painttype'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['beiqi'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '漆膜厚度', field: 'goodscode.qimo', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['qimo'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'goodscode.tuceng', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['tuceng'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'goodscode.neijing', minWidth: 80, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['neijing'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否喷码', field: 'goodscode.penma', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['penma'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'oneweight', minWidth: 80, enableRowGroup: true,
            onCellClicked: (params) => {
              this.showdetmodify(params['data']['oneweight'], params['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'goodscode.xiubian', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['xiubian'], data['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'goodscode.packagetype', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showdetmodify(data['data']['goodscode']['packagetype'], data['data']);
            }
          }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '数量', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', minWidth: 80, enableRowGroup: true,
            editable: (params) => this.editable(params) || (this.qihuoflag['qihuochangestatus'] === 1 && !this.qihuoflag['isruku']),
            valueFormatter: this.settings.valueFormatter3,
            onCellValueChanged: (params) => { this.modifyattr(params, '订货量'); }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '已采购', field: 'yicaigouweight', minWidth: 80, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '已入库', field: 'yirukuweight', minWidth: 80, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '已提货', field: 'yitihuoweight', minWidth: 80, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '已验收', field: 'yijiagongweight', minWidth: 80, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3
          }
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '公差', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '数量', field: 'weightgongcha', minWidth: 60, enableRowGroup: true,
            // editable: this.editable,
            onCellClicked: (params) => {
              this.showdetmodify(params['data']['weightgongcha'], params['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdugongcha', minWidth: 60, enableRowGroup: true,
            // editable: this.editable,
            onCellClicked: (params) => {
              this.showdetmodify(params['data']['houdugongcha'], params['data']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'widthgongcha', minWidth: 60, enableRowGroup: true,
            // editable: this.editable,
            onCellClicked: (params) => {
              this.showdetmodify(params['data']['widthgongcha'], params['data']);
            }
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '钢厂交货地', field: 'innerjiaohuoaddr', minWidth: 90, enableRowGroup: true,
        // editable: this.editable,
        onCellClicked: (params) => {
          this.showdetmodify(params['data']['innerjiaohuoaddr'], params['data']);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货仓库', field: 'jhcangku', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.qihuomodel['qihuostatus'] !== 8) {
            this.showinterestfreeandunitandcangkuModel(params.data, 'cangku');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货周期', field: 'jhzhouqi', minWidth: 60, enableRowGroup: true,
        // editable: this.editable,
        onCellClicked: (params) => {
          this.showdetmodify(params['data']['jhzhouqi'], params['data']);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内部交货期限', field: 'innerqixian', minWidth: 120, enableRowGroup: true,
        editable: (params) => this.editable(params) || (this.qihuoflag['qihuochangestatus'] === 1 && !this.qihuoflag['isruku']),
        valueFormatter: data => {
          if ((data.value + '').indexOf('->') !== -1) {
            return data.value;
          }
          else {
            return this.datepipe.transform(data.value, 'y-MM-dd');
          }
        },
        onCellValueChanged: (params) => { this.modifyattr(params, '交货期限') }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '用途', field: 'yongtu', minWidth: 60, enableRowGroup: true,
        // editable: this.editable,
        onCellClicked: (params) => {
          this.showdetmodify(params['data']['yongtu'], params['data']);
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售单价', field: 'saleprice', minWidth: 90, enableRowGroup: true,
        editable: this.editable,
        valueFormatter: this.settings.valueFormatter2,
        onCellClicked: (params) => {
          console.log(params);
          this.salepriceandfeemodifydialogshow(params.data.id, params.data.saleprice, params.data.neibujiesuanprice);
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '考核单价', field: 'neibujiesuanprice', minWidth: 90,
        enableRowGroup: true, editable: this.editable,
        valueFormatter: this.settings.valueFormatter2,
        onCellValueChanged: (params) => { this.modifyattr(params, "考核价") }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估费用单价', field: 'yugufeeprice', minWidth: 120, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '预估毛利', field: 'yugumaoliprice', minWidth: 90, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用明细', field: 'yugufeemiaoshu', minWidth: 120, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 80, enableRowGroup: true,
        editable: this.editable,
        cellRenderer: data => {
          if (data.data.zhidaojiagedesc === 0) {
            return '正常';
          } else if (data.data.zhidaojiagedesc === 1) {
            return '低于';
          } else if (data.data.zhidaojiagedesc === 2) {
            return '总经理特批';
          }
        }, onCellValueChanged: (params) => { this.modifyattr(params, "指导价格") }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '净料类型', field: 'materialtype', minWidth: 80, enableRowGroup: true,
        editable: this.editable,
        cellRenderer: data => {
          if (data.data.materialtype === 1) {
            return '开平板';
          } else if (data.data.materialtype === 2) {
            return '纵剪卷';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '打包要求', field: 'packageyaoqiu', minWidth: 90, enableRowGroup: true
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '净料长度', field: 'length', minWidth: 90, enableRowGroup: true,
        editable: this.editable,
        onCellValueChanged: (params) => { this.modifyattr(params, '净料长度'); }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '净料张数', field: 'count', minWidth: 90, enableRowGroup: true,
        editable: this.editable,
        onCellValueChanged: (params) => { this.modifyattr(params, '净料张数'); }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '新单位', field: 'unitname', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.qihuomodel['qihuostatus'] !== 8) {
            this.showinterestfreeandunitandcangkuModel(params.data, 'unit');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '新单位数量', field: 'unitweight', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.qihuomodel['qihuostatus'] !== 8) {
            this.toast.pop('info', '请点击新单位进行修改！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '新单位单价', field: 'unitprice', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.qihuomodel['qihuostatus'] !== 8) {
            this.toast.pop('info', '请点击新单位进行修改！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否免息', field: 'isinterestfree', minWidth: 90,
        cellRenderer: data => {
          if (data.data.isinterestfree) {
            return '是';
          } else {
            return '否';
          }
        },
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.isShowInterestfree && this.qihuomodel['qihuostatus'] !== 8) {
            this.showinterestfreeandunitandcangkuModel(params.data, 'interestfree');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '免息天数', field: 'interestfreedays', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.isShowInterestfree && this.qihuomodel['qihuostatus'] !== 8) {
            this.toast.pop('info', '请点击是否免息进行修改！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '免息原因', field: 'interestfreereason', minWidth: 90,
        onCellClicked: (params) => {
          if (null === this.qihuomodel['vuserid'] && this.isShowInterestfree && this.qihuomodel['qihuostatus'] !== 8) {
            this.toast.pop('info', '请点击是否免息进行修改！');
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '下单备注', field: 'beizhu', minWidth: 60, enableRowGroup: true,
        editable: (params) => this.editable(params) || (this.qihuoflag['qihuochangestatus'] === 1 && !this.qihuoflag['isruku']),
        onCellValueChanged: (params) => { this.modifyattr(params, '备注') }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '是否急单', field: 'isurgent', minWidth: 60, enableRowGroup: true,
        editable: this.editable,
        cellRenderer: data => {
          if (data.data.isurgent) {
            return '是';
          } else {
            return '否';
          }
        },
        onCellValueChanged: (params) => { this.modifyattr(params, '是否急单') }
      },
      {
        cellStyle: { "display": "block" }, headerName: '操作', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '删除', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
              if (this.qihuoflag['issubmit']) {
                return '<a target="_blank">删除</a>';
              } else {
                return '';
              }
            }, onCellClicked: (data) => {
              if (this.qihuoflag['issubmit']) {
                if (confirm('你确定要删除吗？')) {
                  this.qihuoapi.deldet(data.data.id).then(() => {
                    this.toast.pop('success', '删除成功！');
                    this.getqihuomodel();
                    this.findqihuodet();
                  })
                }
              }
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '引入', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
              if (this.qihuomodel['qihuostatus'] !== 8) {
                return '<a target="_blank">引入</a>';
              } else {
                return '';
              }
            }, onCellClicked: (data) => {
              if (this.qihuomodel['qihuostatus'] !== 8) {
                this.impkucundialog(data.data.id);
              }
            }
          },
        ]
      }
    ];
    //dingjingridOptions实例对象
    this.dingjingridOptions = {
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
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.dingjingridOptions.onGridReady = this.settings.onGridReady;
    this.dingjingridOptions.groupSuppressAutoColumn = true;
    this.dingjingridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '付金公司', field: 'buyer.name', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '定金金额', field: 'shifudingjin', minWidth: 60, enableRowGroup: true,
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
        cellStyle: { 'text-align': 'center' }, headerName: '核算日期', field: 'hesuanDate', minWidth: 60, enableRowGroup: true,
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
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'verify', minWidth: 60, enableRowGroup: true,
      //   cellRenderer: params => {
      //     if (this.storage.getObject('cuser').id === 3943 && !params.data.isv) {
      //       return '<a target="_blank">审核</a>';
      //     }
      //     return '';
      //   },
      //   onCellClicked: (data) => {
      //     if (this.storage.getObject('cuser').id === 3943 && !data.data.isv) {
      //       this.verifydingjin(data.data.id);
      //     }
      //   }
      // },


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
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.allocationgridOptions.onGridReady = this.settings.onGridReady;
    this.allocationgridOptions.groupSuppressAutoColumn = true;
    this.allocationgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '付金公司', field: 'buyer.name', minWidth: 60, enableRowGroup: true },
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
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'verify', minWidth: 60, enableRowGroup: true,
        cellRenderer: params => {
          if (this.storage.getObject('cuser').id === 3943 && !params.data.isv) {
            return '<a target="_blank">审核</a>';
          }
          return '';
        },
        onCellClicked: (data) => {
          if (this.storage.getObject('cuser').id === 3943 && !data.data.isv) {
            this.verifyAllocation(data.data.id);
          }
        }
      },
    ];
    //aggird实例对象
    this.pgridOptions = {
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
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.pgridOptions.onGridReady = this.settings.onGridReady;
    this.pgridOptions.groupSuppressAutoColumn = true;
    this.pgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '定价/吨', field: 'price', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '销售价/吨', field: 'pertprice', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'amount', minWidth: 60, cellRenderer: params => {
          return '<a target="_blank">删除</a>';
        }, onCellClicked: params => {
          if (confirm('你确定要删除吗?')) {
            this.qihuoapi.delproduct(params.data.id).then(data => {
              this.toast.pop('success', '删除成功！');
              this.queryproduct();
              this.getqihuomodel();
        
            })
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '明细id', field: 'id', minWidth: 60, enableRowGroup: true }
    ];
    //基料
    this.bmgridOptions = {
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
      getContextMenuItems: this.settings.getContextMenuItems
    };
    this.bmgridOptions.onGridReady = this.settings.onGridReady;
    this.bmgridOptions.groupSuppressAutoColumn = true;
    this.bmgridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangku.name', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 300, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '考核价', field: 'price', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '销售价', field: 'pertprice', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 60, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 60, enableRowGroup: true,
        cellRenderer: (params) => {
          return '<a target="_blank">删除</a>';
        },
        onCellClicked: (params) => {
          if (confirm('你确定要删除吗？')) {
            this.qihuoapi.deleteProorderdet(params.data.id).then(data => {
              this.toast.pop('success', '操作成功');
              this.getbasematerial();
            })
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存Id', field: 'kucunid', minWidth: 60, enableRowGroup: true },
      { cellStyle: { 'text-align': 'center' }, headerName: 'gcId', field: 'gcid', minWidth: 60, enableRowGroup: true }
    ];
    // ordergridOptions实例对象
    this.ordergridOptions = {
      rowSelection: 'multiple',
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
      getContextMenuItems: this.settings.getContextMenuItems, groupSelectsChildren: true, // 分组可全选
      getNodeChildDetails: (rowItem) => {
        if (rowItem.group) {
          // console.log('group', rowItem);
          return {
            group: true,
            expanded: rowItem.group === '彩涂卷' || rowItem.group === '镀锌' || rowItem.group === '铝锌镁' || rowItem.group === '镀铝锌'
              || rowItem.group === '折弯件' || rowItem.group === '辉彩' || rowItem.group === '恒牧' || rowItem.group === '洁彩'
              || rowItem.group === '锌铝镁',
            children: rowItem.participants,
            field: 'group',
            key: rowItem.group
          };
        } else {
          return null;
        }
      },

    };
    this.ordergridOptions.onGridReady = this.settings.onGridReady;
    this.ordergridOptions.groupSuppressAutoColumn = true;
    this.ordergridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group',
        width: 90, checkboxSelection: true, headerCheckboxSelection: true,
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn',  width: 90,  },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 300 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '出库费类型', field: 'chukufeetype', width: 110,
        cellRenderer: (params) => {
          if (params.data.chukufeetype == 0) {
            return '现结';
          } else if (params.data.chukufeetype == 1) {
            return '月结';
          } else if (params.data.chukufeetype == 2) {
            return '免付';
          } else {
            return '';
          }
        }
      },
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
        width: 90, menuTabs: ['filterMenuTab']
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
        cellStyle: { 'text-align': 'center' }, headerName: '预计发货时间', field: 'fahuodate', width: 100
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '零散发货', field: 'ispieces', width: 70
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '物流专员', field: 'notifiername', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'wuliuordertype', width: 90
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', width: 90, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">作废</a>';
        }, onCellClicked: (data) => {
          /*const obj = { purchaseRequestId: data.data.id };
          this.qihuoapi.sccinquirystatus(obj).then(data1 => {
            let inquiry: any = {};
            if (data1.length) {
              inquiry = data1[0];
            }
            // WAITING_FOR_INQUIRY ：待询价（询价单尚未创建）可删除
            //  WAITING_FOR_START ：询价待开始
            //  INQUIRING ：询价中
            //  INQUIRY_FINISHED ：询价结束
            if (inquiry.status === 'WAITING_FOR_START') {
              this.toast.pop('warning', '询价待开始不允许作废！');
              return;
            }
            if (inquiry.status === 'INQUIRING') {
              this.toast.pop('warning', '询价中不允许作废！');
              return;
            }
            if (inquiry.status === 'INQUIRY_FINISHED') {
              this.toast.pop('warning', '询价结束不允许作废！');
              return;
            }
          });*/
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
    this.qihuochangegridOptions = {
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
    this.qihuochangegridOptions.onGridReady = this.settings.onGridReady;
    this.qihuochangegridOptions.groupSuppressAutoColumn = true;
    this.qihuochangegridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'qihuodetid', width: 90
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
    //获取URL传过来的值
    this.findzijinmonthrate();
    this.findstoragefee();
    this.findthtype();
    this.tihuoid = this.route.queryParams['value']['tihuoid'];
    this.route.params.subscribe((data) => { this.qihuoid = data['id']; });
    this.getqihuomodel();
    //this.getbasematerial();
    this.findqihuodet();
    this.querydingjin();
    this.queryallocation();
    //this.queryproduct();
    this.getorderdet();
    this.getMyRole();
    setTimeout(() => {
      this.addressparseService.getData();
      this.getunits();
    }, 1000);
    this.getRoles();
  }
  // 获取用户角色，如果登陆的用户是业务员，设置为不可见
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    const cuser = JSON.parse(localStorage.getItem('cuser'));
    if (myrole.some(item => item === 10)) {
      this.isSaleman = true;
      this.wuliuOffergridOptions.columnDefs.forEach((colde: ColDef) => {
        if (colde.colId === 'innerprice' || colde.colId === 'wlcustomername' || colde.colId === 'innerjine') {
          colde.hide = true;
          colde.suppressToolPanel = true;
        }
      });
    } else {
      this.isSaleman = false;
    }
    // 获取物流竞价明细表
    this.qihuoapi.wuliuofferdetail(this.qihuoid).then(data => {
      this.wuliuOffergridOptions.api.setRowData(data);
      this.wuluiorderlist = data;
    });
  }
  //获取资金占用月利率
  findzijinmonthrate() {
    this.classifyapi.getChildrenTree({ pid: 11325 }).then((data) => {
      data.forEach(element => {
        this.zijinmonthrates.push({
          label: element.label,
          value: element.label
        });
      });
    });
  }
  //调货类型
  findthtype() {
    this.classifyapi.getChildrenTree({ pid: 17947 }).then((data) => {
      data.forEach(element => {
        if(this.current.orgid === 22528 || this.current.orgid === 664 || this.current.orgid === 22525 || this.current.orgid === 22524 
          || this.current.orgid === 22350 || this.current.orgid === 22427 || this.current.orgid === 674){
          this.thtypes.push({
            label: element.label,
            value: element.label
          });
        }else{
          if(!(element.id === 17950)){
            this.thtypes.push({
              label: element.label,
              value: element.label
            });
          }
        }
      });
    });
  }
  //获取仓储费收费标准
  findstoragefee() {
    this.classifyapi.getChildrenTree({ pid: 11326 }).then((data) => {
      data.forEach(element => {
        this.storagefees.push({
          label: element.label,
          value: element.label
        });
      });
    });
  }
  // 打开修改免息弹窗
  showinterestfreeandunitandcangkuModel(qihuodet, modifyname) {
    setTimeout(() => {
      this.interestfreeAndUnitAndCangkuObj = {
        qihuodetid: qihuodet.id, isinterestfree: qihuodet.isinterestfree,
        interestfreedays: qihuodet.interestfreedays, interestfreereason: qihuodet.interestfreereason, unitname: qihuodet.unitname,
        unitweight: qihuodet.unitweight, unitprice: qihuodet.unitprice,jhcangku:qihuodet.jhcangku,cangkuid:qihuodet.cangkuid, interestfreeOrUnitOrCangku: modifyname
      };
    }, 0);
    this.interestfreeandunitandcangkuModel.show();
    // 查找仓库
    this.cangku = [{ label: '非必填选项', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            label: element.name,
            value: element.id
        });
      });
    });
  }
  interestfreehideDialog() {
    this.interestfreeandunitandcangkuModel.hide();
  }
  // 保存免息修改
  modifyinterestfree() {
    if (this.interestfreeAndUnitAndCangkuObj.interestfreeOrUnitOrCangku === 'interestfree') {
      if (this.interestfreeAndUnitAndCangkuObj['isinterestfree']) {
        if (this.interestfreeAndUnitAndCangkuObj['interestfreedays'] === undefined || this.interestfreeAndUnitAndCangkuObj['interestfreedays'] === null) {
          this.toast.pop('warning', '免息天数不允许为空！'); return;
        }
        if (!this.interestfreeAndUnitAndCangkuObj['interestfreereason']) {
          this.toast.pop('warning', '免息原因不允许为空！'); return;
        }
      }
    } else if (this.interestfreeAndUnitAndCangkuObj.interestfreeOrUnitOrCangku === 'unit') {
      if (this.interestfreeAndUnitAndCangkuObj['unitname']) {
        if (this.interestfreeAndUnitAndCangkuObj['unitweight'] === undefined || this.interestfreeAndUnitAndCangkuObj['unitweight'] === null
          || this.interestfreeAndUnitAndCangkuObj['unitprice'] === undefined || this.interestfreeAndUnitAndCangkuObj['unitprice'] === null) {
          this.toast.pop('warning', '请把新单位信息填写完整！'); return;
        }
      }
    }
    this.qihuoapi.modifyinterestfree(this.interestfreeAndUnitAndCangkuObj.qihuodetid, this.interestfreeAndUnitAndCangkuObj).then(data => {
      this.toast.pop('success', '修改成功');
      this.getqihuomodel();
      this.findqihuodet();
      this.interestfreehideDialog();
    });
  }
  // 添加的明细中的数据修改
  modifyattr(params, type) {
    if (this.qihuomodel['qihuostatus'] !== 8 && null != params.data.order.vuserid) {
      this.toast.pop('warning', '已经提交审核不允许修改！');
      return;
    }
    if (type === '订货量' && params.newValue === params.oldValue) {
      return;
    }
    if (type === '备注' && params.newValue === params.oldValue) {
      return;
    }
    if (type === '交货期限' && params.newValue === params.oldValue) {
      return;
    }
    this.qihuoapi.modifyqihuodet(params.data.id, { type: type, value: params.newValue }).then(data => {
      this.toast.pop('success', '修改成功');
      this.getqihuomodel();
      this.findqihuodet();
    }, err => {
      if (type === '订货量') {
        params.node.data.weight = params.oldValue;
        params.node.setData(params.node.data);
      }
      if (type === '备注') {
        params.node.data.beizhu = params.oldValue;
        params.node.setData(params.node.data);
      }
      if (type === '交货期限') {
        params.node.data.innerqixian = params.oldValue;
        params.node.setData(params.node.data);
      }
    });
  }

  // 判断是否可以编辑

  editable(params) {
    if (null != params.node.data.order.vuserid) {
      return false;
    } else {
      return true;
    }
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
  //获取orderdet中的数据
  getorderdet() {
    this.qihuoapi.findOrderdet(this.qihuoid).then(data => {
      if (data.length > 0) {
        this.qihuoflag['isfinish'] = true;
      }
      console.log('ordergridOptions___+++++___', data);
      // this.ordergridOptions.api.setRowData(data.list);
      this.ordergridOptions.api.setRowData(data);
    })
  }
  //获取主表的数据
  getqihuomodel() {
    this.qihuoapi.findqihuo(this.qihuoid).then(data => {

      this.qihuomodel = data;
      this.qihuomodel['cpersonname'] = data.wuliuname;
      // if(this.qihuomodel['thtype']){
      //   this.qihuoflag2['istiaohuo'] = true;
      // }
      // this.qihuomodel['guigetype'] = this.qihuomodel['guigetype'] === 0 ? '常规' : '特殊';
      // this.qihuomodel['kehutype'] = this.qihuomodel['kehutype'] === 0 ? '直接用户' : '贸易商';
      this.isbaojia = this.qihuomodel['isnoticecaigou'];
      if (this.qihuomodel['ordertype'] === 1) {
        this.ordertitle = '期货加工订单';
        this.qihuodetname = '采购明细';
        this.orderdetname = '已验收成品';
      } else if (this.qihuomodel['ordertype'] === 9) {
        this.ordertitle = '调货订单';
        this.qihuodetname = '销售明细';
        this.orderdetname = '已入库钢卷';
      } else if (this.qihuomodel['ordertype'] === 10) {
        this.ordertitle = '调货加工订单';
        this.qihuodetname = '采购明细';
        this.orderdetname = '已验收成品';
      } else if (this.qihuomodel['ordertype'] === 13) {
        this.ordertitle = '在途订单';
        this.qihuodetname = '销售明细';
        this.orderdetname = '已入库钢卷';
      } else if (this.qihuomodel['ordertype'] === 14) {
        this.ordertitle = '在途加工订单';
        this.qihuodetname = '采购明细';
        this.orderdetname = '已验收成品';
      } else {
        this.ordertitle = '期货订单';
        this.qihuodetname = '销售明细';
        this.orderdetname = '已入库钢卷';
      }
      if (this.qihuomodel['vuserid']) {
        this.qihuoflag['dingjin'] = false;
        this.qihuoflag['detail'] = false;
      } else {
        this.qihuoflag['dingjin'] = true;
        this.qihuoflag['detail'] = true;
      }
      if (this.qihuomodel['ordertype'] === 2) {
        this.qihuoflag['dingjin'] = false;
      }
      this.userapi.userInfo2().then(data => {
        if (data.id === this.qihuomodel['vuserid']) {
          if (!this.qihuomodel['isv']) {
            this.qihuoflag['isv'] = true;
          } else {
            this.qihuoflag['isv'] = false;
          }
          if (this.qihuomodel['isv']) {
            this.qihuoflag['fisv'] = true;
          } else {
            this.qihuoflag['fisv'] = false;
          }
        }
      })
      if (this.qihuomodel['ordertype'] === 1 || this.qihuomodel['ordertype'] === 10 || this.qihuomodel['ordertype'] === 14) {
        this.qihuoflag['fp'] = true;
      }
      if (this.qihuomodel['vuserid']) {
        this.qihuoflag['issubmit'] = false;
        this.qihuoflag['isdingjinedit'] = true;
      } else {
        this.qihuoflag['issubmit'] = true;
        this.qihuoflag['isdingjinedit'] = false;
      }
      if (this.qihuomodel['sellerid'] === 3786) { // 所属机构为邯郸加工中心
        this.isshownoticecaigou = false;
      } else {
        this.isshownoticecaigou = true;
      }
      if (this.qihuomodel['noticecaigouprocessedid'] || this.qihuomodel['noticecaigoudate']) {
        this.qihuoflag['noticecaigou'] = true;
      } else {
        this.qihuoflag['noticecaigou'] = false;
      }
      if (this.qihuomodel['isnoticecaigou']) {
        this.qihuoflag['isnoticerukuapply'] = true;
      }
      if (this.qihuomodel['qihuostatus'] === 3 || this.qihuomodel['qihuostatus'] === 4) {
        this.qihuoflag['isrecall'] = true;
      } else {
        this.qihuoflag['isrecall'] = false;
      }
      // if(this.qihuomodel['zhidaojiagedesc']===0){
      //   this.qihuomodel['zhidaojiagedesc'] = '正常';
      // }else{
      //   this.qihuomodel['zhidaojiagedesc'] = '低于';
      // }
      this.getbasematerial();
      this.queryproduct();
      this.oldyufurate = this.qihuomodel['yufurate'];
      if (this.qihuomodel['addrbakid']) {
        this.songaddress = this.qihuomodel['addrbak']['province'] + this.qihuomodel['addrbak']['city']
          + this.qihuomodel['addrbak']['county'] + this.qihuomodel['addrbak']['detail'];
      } else {
        this.songaddress = '';
      }
      if (this.qihuomodel['qihuostatus'] === 8) {
        this.qihuomodel['typename'] = this.formattype(this.qihuomodel['type']);
      } else {
        this.qihuoflag['qihuochangestatus'] = 0;
      }
      this.isShowInterestfree = this.qihuomodel['ordertype'] === 0 || this.qihuomodel['ordertype'] === 1;
    });
  }
  /**运输类型 */
  formattype(type) {
    if (type === 0) {
      return '自提';
    } else if (type === 1) {
      return '代运';
    } else if (type === 2) {
      return '转货';
    }
  }
  modify(params) {
    this.qihuoapi.update(this.qihuomodel['id'], params).then(() => {
      if (this.qihuomodel['qihuostatus'] === 8) {
        this.getqihuomodel();
        setTimeout(() => {
          this.getqihuochangeloglist();
        }, 0);
      } else {
        this.getqihuomodel();
      }
    });
  }
  //查询期货明细
  findqihuodet() {
    this.qihuoapi.findQihuodet(this.qihuoid).then(data => {
      // console.log('gridOptions___+++++___', data);
      this.gridOptions.api.setRowData(data);
      this.qihuodetlist = data;
      // 变更中显示变更后的明细
      setTimeout(() => {
        this.getqihuochangeloglist();
      }, 100);
    });
  }

  //生成期货
  qihuodetmodel = {
    id: null,
    gnid: null,
    chandiid: null,
    dinghuoliang: null,
    oneweight: null,
    jiaohuodate: null,
    jiaohuoaddr: null,
    neibujiesuanprice: null,
    saleprice: null,
    houdugongcha: null,
    widthgongcha: null,
    weightgongcha: null,
    classifys: null,
    cangkuid: null,
    chukufeeprice: 0,
    yunfeeprice: 0,
    yunzafeeprice: 0,
    jiagongfeeprice: 0,
    unitname: null,
    isinterestfree: false,
    jhzhouqi:null,
    jhcangku:null
  };
  @ViewChild('createqihuodialog') private createqihuodialog: ModalDirective;
  //查询弹窗
  gns: any[];
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      // console.log(data);
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        })
      })
    });
  }
  islindiao: boolean;
  isqihuo: boolean;
  cangkus: Array<any>;
  addqihuodialog() {
    this.createselectNull();
    this.gns = [];
    this.getGnAndChandi();
    this.zhidaoprices = [{ label: '请选择。。。', value: null },
    { value: '0', label: '正常' }, { value: '1', label: '低于' }, { value: '2', label: '总经理特批' }];
    this.isurgent = [{ label: '请选择。。。', value: null }, { label: '是', value: true }, { label: '否', value: false }];
    this.materialtypes = [{ label: '请选择。。。', value: null },
    { value: '1', label: '开平板' }, { value: '2', label: '纵剪卷' }];
    // console.log(this.qihuomodel['ordertype']);
    if (this.qihuomodel['ordertype'] === 2) {//如果是临调销售合同则需要添加仓库
      this.getcangkus();
    }
    this.iscountshow = false;
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
      if (this.gcs[i]['name'] == labelid) {
        this.gcs.splice(i, 1);
      }
    }
    // 备注需求 如果是彩涂，且是烨辉彩涂，那么油漆对应颜色重新选择
    if (this.qihuodetmodel['chandiid'] == 8) {
      if (labelid == "painttypeid") {
        if (this.chandis[2].value = 8) {
          this.classifyapi.getAttrs(event['value']).then(data => {
            if (data.length != 0) {
              this.attrs = this.attrs.filter(item => item.name !== 'colorid');
              // this.attrs.push(data[0]);
              this.attrs.splice(3, 0, data[0]);
              this.guigelength = this.attrs.length;
            } else {
              this.attrs = this.attrs.filter(item => item.name != 'colorid');
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
  houdugongchas: any[];
  widthgongchas: any[];
  yongtus: any[];
  oneweights: any[];
  jiaohuoaddrs: any[];
  nextdialog() {
    if (this.gcs.length !== this.guigelength) { this.toast.pop('warning', '规格属性不允许为空！'); return; }
    this.qihuodetmodel['gnid'] = this.qihuodetmodel['gnid']['id'];
    this.one = false;
    this.two = true;
    if (this.qihuomodel['ordertype'] !== 2) {
      this.isqihuo = true;
    }
    this.houdugongchas = [];
    this.widthgongchas = [];
    this.yongtus = [];
    this.oneweights = [];
    this.jiaohuoaddrs = [];
    this.lines = [];
    this.getunits();
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.qihuodetmodel['chandiid']) {
          // console.log("确定产地的", element);
          // 厚度公差
          element.attr.houdugongcha.forEach(houdu => {
            this.houdugongchas.push({
              value: houdu.value,
              label: houdu.value
            });
          });
          // 宽度公差
          element.attr.widthgongcha.forEach(width => {
            this.widthgongchas.push({
              value: width.value,
              label: width.value
            });
          });
          // 交货地址
          element.attr.jiaohuoaddr.forEach(addr => {
            this.jiaohuoaddrs.push({
              value: addr.value,
              label: addr.value
            });
          });
          // 单卷重
          element.attr.oneweight.forEach(oneweight => {
            this.oneweights.push({
              value: oneweight.value,
              label: oneweight.value
            });
          });
          // 用途
          element.attr.yongtu.forEach(yongtu => {
            this.yongtus.push({
              value: yongtu.value,
              label: yongtu.value
            });
          });
        }
      }); // dataforeach
    }); // qihuoapi
  }

  //重选
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
      oneweight: null,
      jiaohuodate: null,
      jiaohuoaddr: null,
      neibujiesuanprice: null,
      saleprice: null,
      houdugongcha: null,
      widthgongcha: null,
      weightgongcha: null,
      classifys: null,
      cangkuid: null,
      chukufeeprice: 0,
      yunfeeprice: 0,
      yunzafeeprice: 0,
      jiagongfeeprice: 0,
      unitname: null,
      isinterestfree: false,
      jhzhouqi:null,
      jhcangku:null
    };
    this.one = true;
    this.two = false;
  }
  create() {
    console.log(this.qihuodetmodel);
    if (!this.qihuodetmodel['beizhu']) { this.toast.pop('warning', '下单备注不允许为空！'); return; }
    if (!this.qihuodetmodel['houdugongcha']) { this.toast.pop('warning', '厚度公差不允许为空！'); return; }
    if (!this.qihuodetmodel['widthgongcha']) { this.toast.pop('warning', '宽度公差不允许为空！'); return; }
    if (!this.qihuodetmodel['dinghuoliang']) { this.toast.pop('warning', '订货量不允许为空！'); return; }
    if (!this.qihuodetmodel['oneweight']) { this.toast.pop('warning', '单卷重不允许为空！'); return; }
    if (!this.qihuodetmodel['weightgongcha']) { this.toast.pop('warning', '数量公差不允许为空！'); return; }
    if (this.qihuomodel['ordertype'] !== 2) {
      if (!this.qihuodetmodel['neibujiesuanprice']) { this.toast.pop('warning', '内部结算价格不允许为空！'); return; }
    }
    if (this.qihuodetmodel['materialtype'] === '1') {
      if (!this.qihuodetmodel['length'] || this.qihuodetmodel['length'] === '') {
        this.toast.pop('warning', '米数不允许为空！');
        return;
      }
      if (!this.qihuodetmodel['count'] || this.qihuodetmodel['count'] === '') {
        this.toast.pop('warning', '张数不允许为空！');
        return;
      }
    }
    if (this.qihuodetmodel['isinterestfree']) {
      if (this.qihuodetmodel['interestfreedays'] === undefined || this.qihuodetmodel['interestfreedays'] === null) {
        this.toast.pop('warning', '免息天数不允许为空！'); return;
      }
      this.qihuodetmodel['interestfreedays'] = Math.round(this.qihuodetmodel['interestfreedays']);
      if (this.qihuodetmodel['interestfreedays'] <= 15) {
        this.toast.pop('warning', '免息天数只能填写大于15的整数！'); return;
      }
      if (!this.qihuodetmodel['interestfreereason']) {
        this.toast.pop('warning', '免息原因不允许为空！'); return;
      }
    }
    if (!this.qihuodetmodel['saleprice']) { this.toast.pop('warning', '销售价格不允许为空！'); return; }
    if( this.qihuomodel['ordertype'] !== 0 && this.qihuomodel['ordertype'] !== 1){
      if (!this.qihuodetmodel['jiaohuodate']) { this.toast.pop('warning', '交货期限不允许为空！'); return; }
    }
    
    if( this.qihuomodel['ordertype'] === 0||this.qihuomodel['ordertype']===1){
      if (!this.qihuodetmodel['jhzhouqi']) { this.toast.pop('warning', '交货周期不允许为空'); return; }
    }
    if (!this.qihuodetmodel['jiaohuoaddr']) { this.toast.pop('warning', '交货地址不允许为空！'); return; }
    if (!this.qihuodetmodel['yongtu']) { this.toast.pop('warning', '用途不允许为空！'); return; }
    if (!this.qihuodetmodel['zhidaojiagedesc']) { this.toast.pop('warning', '指导价格不允许为空！'); return; }
    if (this.qihuodetmodel['isurgent'] === undefined) { this.toast.pop('warning', '是否急单不允许为空！'); return; }
    if (this.qihuodetmodel['unitname']) {
      if (this.qihuodetmodel['unitweight'] === undefined ||
        this.qihuodetmodel['unitweight'] === null ||
        this.qihuodetmodel['unitprice'] === undefined ||
        this.qihuodetmodel['unitprice'] === null) {
        this.toast.pop('warning', '请把新单位信息填写完整！'); return;
      }
    }

    this.qihuodetmodel['jiaohuodate'] ?
      this.qihuodetmodel['jiaohuodate'] = this.datepipe.transform(this.qihuodetmodel['jiaohuodate'], 'y-MM-dd') : '';
    this.qihuodetmodel['classifys'] = this.gcs;
    this.qihuodetmodel['id'] = this.qihuoid;
    this.qihuodetmodel['fees'] = this.lines;
    // console.log('9999999999998888888888999999', this.qihuodetmodel);
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
  //成品添加模块
  //生成成品
  productmodel = {
    orderid: null,
    qihuodetid: null,
    gnid: null,
    chandiid: null,
    length: null,
    weight: null,
    price: null,
    saleprice: null,
    width: null,
    houduid: null,
    classifys: null
  };
  productselectNull() {
    this.chandis = [];
    this.isChandi = false;
    this.attrs = [];
    this.showGuige = false;
    this.gcs = [];
    this.productmodel = {
      orderid: null,
      qihuodetid: null,
      gnid: null,
      chandiid: null,
      length: null,
      weight: null,
      price: null,
      saleprice: null,
      width: null,
      houduid: null,
      classifys: null
    };
  }
  widths: any[] = [];
  @ViewChild('productdialog') private productdialog: ModalDirective;
  addproductdialog(price, detid, goodscode) {
    this.mdmService.getMdmAttributeDic({ itemcode: goodscode['gncode'] }).then(attrs => {
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        if (element['value'] === 'width') {
          this.widths = element['options'];
          break;
        }
      }
    });
    // this.classifyapi.getBrothernode({ classifyid: widthid }).then(data => {
    //   this.widths = [];
    //   data.forEach(element => {
    //     this.widths.push({
    //       value: element.id,
    //       label: element.name
    //     });
    //   })
    // })
    this.productselectNull();
    this.gns = [];
    // this.getGnAndChandi();
    this.productmodel['price'] = price;
    this.productmodel['qihuodetid'] = detid;
    this.productdialog.show();
  }
  closeproductdialog() {
    this.productdialog.hide();
  }
  createproduct() {
    if (!this.productmodel['width']) { this.toast.pop('warning', '宽度不允许为空！'); return; }
    if (!this.productmodel['weight']) { this.toast.pop('warning', '重量不允许为空！'); return; }
    if (!this.productmodel['price']) { this.toast.pop('warning', '价格不允许为空！'); return; }
    if (!this.productmodel['saleprice']) { this.toast.pop('warning', '销售价格不允许为空！'); return; }
    this.productmodel['orderid'] = this.qihuomodel['id'];
    this.qihuoapi.createProduct(this.productmodel).then(() => {
      this.toast.pop('success', '添加成功');
      this.closeproductdialog();
      /* 刷新明细页面*/
      this.queryproduct();
    });
  }
  queryproduct() {
    if (this.qihuoflag['fp']) {
      this.qihuoapi.findProduct(this.qihuoid).then(data => {
        this.pgridOptions.api.setRowData(data);
      })
    }
  }
  //如果是期货加工则获取基料
  getbasematerial() {
    this.qihuoapi.findBasematerial(this.qihuoid).then(data => {
      this.bmgridOptions.api.setRowData(data);
    });
  }
  //定金添加模块
  @ViewChild('dingjindialog') private dingjindialog: ModalDirective;
  curyue: any = '0';
  dingjin = { buyerid: null, dingjin: null };
  adddingjindialog() {
    let moneyquery = { buyerid: this.qihuomodel['buyer']['id'], wcustomerid: this.qihuomodel['seller']['id'] };
    this.moneyapi.getmoney(moneyquery).then(data => {
      // console.log('___++++____', data);
      if (!data['wyue']) {
        this.curyue = 0;
      } else {
        this.curyue = data['wyue'];
      }
    });
    this.dingjindialog.show();
  }
  closedingjindialog() {
    this.dingjindialog.hide();
  }
  adddingjin() {
    let model = {
      buyerid: this.qihuomodel['buyer']['id'], wcustomerid: this.qihuomodel['seller']['id'],
      qihuoid: this.qihuomodel['id'], dingjin: this.dingjin['dingjin']
    };
    this.qihuoapi.adddingjin(model).then(() => {
      this.closedingjindialog();
      this.querydingjin();
      this.getqihuomodel();
    })
  }
  //扣除定金余额不足审核
  verifydingjin(dingjinid) {
    if (confirm("这个定金确定要审核通过吗？")) {
      console.log(dingjinid + '#' + this.qihuomodel['id']);
      this.qihuoapi.verifydingjin(this.qihuomodel['id'], dingjinid).then(() => {
        this.toast.pop('success', '审核成功');
        this.querydingjin();
        this.getqihuomodel();
      })
    }
  }
  //释放定金
  @ViewChild('shifangdingjin') private shifangdingjin: ModalDirective;
  shifangdingjindialog() {
    this.shifangdingjin.show();
  }
  closeshifangdialog() {
    this.shifangdingjin.hide();
  }
  shifang() {
    let model = {
      buyerid: this.qihuomodel['buyer']['id'], wcustomerid: this.qihuomodel['seller']['id'],
      qihuoid: this.qihuomodel['id'], dingjin: this.dingjin['dingjin'], releasereason: this.dingjin['releasereason'],
      tihuoid: this.tihuoid
    };
    this.qihuoapi.shifangdingjin(model).then(() => {
      this.closeshifangdialog();
      this.querydingjin();
      this.getqihuomodel();
    })
  }
  querydingjin() {
    this.qihuoapi.finddingjin(this.qihuoid).then(data => {
      data.forEach(element => {
        if (element.hesuanDate) {
          this.hesuanDate = true;
        }
      });
      this.dingjingridOptions.api.setRowData(data);
    })
  }
  //此处需要有个弹出框，可供选择确认是否欠款发货
  @ViewChild('submitvuser') private submitvuser: ModalDirective;
  submitvuserdialog() {
    if (this.qihuomodel['ischuliquality'] === null && (this.qihuomodel['ordertype'] == 0 || this.qihuomodel['ordertype'] == 1)) {
      this.toast.pop('warning', '请选择是否处理质量异议');
      return;
    }
    if(this.qihuomodel['wuliuid'] === null && this.qihuomodel['type'] === 1){
      this.toast.pop('warning', '请选择物流员！');
      return;
    }
    this.submitvuser.show();
  }
  closesubmitvuserdialog() {
    this.submitvuser.hide();
  }
  qihuopaytype;
  changepaytype(e) {
    console.log(e);
    this.qihuopaytype = e;
    console.log(this.qihuopaytype);
  }
  //提交审核人
  submitverify() {
    if (!this.qihuopaytype) {
      this.toast.pop('warning', '请选择支付类型');
      return;
    }
    this.closesubmitvuserdialog();
    this.qihuomodel['paytype'] = this.qihuopaytype;
    if (this.qihuomodel['moneytype'] === '定金') { // 生效约定方式为定金到账时，可为0
      if (!this.qihuomodel['dingjin']) {
        this.toast.pop('warning', '请输入约定定金');
        return;
      }
    } else {
      if (this.qihuomodel['dingjin'] === null || this.qihuomodel['dingjin'] === undefined) {
        this.toast.pop('warning', '请输入约定定金');
        return;
      }
    }
    if (!this.qihuomodel['beizhu']) {
      this.toast.pop('warning', '销售备注不允许为空，请填写销售备注');
      return;
    }
    // // 调货合同判断明细销售单价有没有填写
    // if (this.qihuomodel['ordertype'] === 9) {
    //   for (let i = 0; i < this.qihuodetlist.length; i++) {
    //     const element = this.qihuodetlist[i];
    //     const count = i + 1;
    //     if (!element['saleprice']) {
    //       this.toast.pop('warning', '第' + count + '行明细销售单价未填写！！！');
    //       return;
    //     }
    //   }
    // }
    let search = { dingjin: null, beizhu: null, qihuoid: null, paytype: null,wuliuid: null };
    search.qihuoid = this.qihuoid;
    search.beizhu = this.qihuomodel['beizhu'];
    search.dingjin = this.qihuomodel['dingjin'];
    search.paytype = this.qihuomodel['paytype'];
    search.wuliuid = this.qihuomodel['wuliuid'];
    console.log(search.wuliuid);
    if (confirm('你确定提交审核吗？')) {
      this.qihuoapi.submitverify(this.qihuoid, search).then(data => {
        this.toast.pop('success', '提交审核成功');
        this.qihuoflag['dingjin'] = false;
        this.qihuoflag['detail'] = false;
        this.getqihuomodel();
      });
    }
  }
  //审核
  verifyqihuo() {
    let search = { version: this.qihuomodel['version'] };
    if (confirm("你确定审核吗？")) {
      this.qihuoapi.verify(this.qihuoid, search).then(data => {
        this.toast.pop('success', '审核成功');
        this.getqihuomodel();
      })
    }
  }
  //弃审
  removeverify() {
    let search = { version: this.qihuomodel['version'] };
    if (confirm("你确定弃审吗？")) {
      this.qihuoapi.qishen(this.qihuoid, search).then(data => {
        this.toast.pop('success', '弃审成功');
        this.getqihuomodel();
      })
    }
  }
  //通知采购
  noticecaigou() {
    if (confirm('你确定通知采购吗？')) {
      this.qihuoapi.noticeCaigou(this.qihuoid).then(data => {
        this.toast.pop('success', '通知成功！');
        this.getqihuomodel();
        this.findqihuodet();
      })
    }
  }

 
  //通知入库申请
  noticerukuapply() {
    if (this.qihuomodel['qihuostatus'] !== 3) {
      this.toast.pop('warning', '未审核不能通知入库申请！');
      return;
    }
    if (confirm('你确定通知入库申请吗？')) {
      this.qihuoapi.noticerukuapply(this.qihuoid).then(data => {
        this.toast.pop('success', '通知成功！');
        this.getqihuomodel();
      });
    }
  }
  //库存引入
  kcbsModalRef: BsModalRef;
  qihuodetid: number;
  impkucundialog(qihuodetid) {
    //引入kucun中的货物
    this.qihuodetid = qihuodetid;
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(KucundetimportComponent);
    //this.kcbsModalRef.content.qihuodetid = qihuodetid;
    this.kcbsModalRef.content.componentparent = this;
    // console.log('引入库存产品');
  }
  //引入
  imp(ids) {
    this.qihuoapi.impkucun(this.qihuodetid, { kucunids: ids }).then(data => {
      this.kcbsModalRef.hide();
      this.getorderdet();
    })
  }
  //打印预览
  print() {
    this.qihuoapi.print(this.qihuoid).then(data => {
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    })
  }




 
  
  
  @ViewChild('ordermodalchange') private ordermodalchange: ModalDirective;
  //生成pdf
  makepdf() {
    console.log(this.changeordermodal);
    this.qihuoapi.makepdf(this.qihuoid,this.changeordermodal).then(data => {
      this.toast.pop('success', data.msg);
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






  /**修改mdm物料明细 */
  showdetmodify(oldvalueid, data) {
    if (!oldvalueid) { return; }
    if (this.qihuomodel['qihuostatus'] === 8 && (this.qihuoflag['qihuochangestatus'] === 2 || this.qihuoflag['isruku'])) { return; }
    if (this.qihuomodel['qihuostatus'] !== 8 && null != this.qihuomodel['vuserid']) {
      this.toast.pop('warning', '已经提交审核不允许修改');
      return;
    }
    this.zhidaoprices = [{ label: '请选择。。。', value: null },
    { value: '0', label: '正常' }, { value: '1', label: '低于' }, { value: '2', label: '总经理特批' }];
    this.isurgent = [{ label: '请选择。。。', value: null }, { label: '是', value: true }, { label: '否', value: false }];
    this.materialtypes = [{ label: '请选择。。。', value: null },
    { value: '1', label: '开平板' }, { value: '2', label: '纵剪卷' }];
    if (this.qihuomodel['ordertype'] === 2) {// 如果是临调销售合同则需要添加仓库
      this.getcangkus();
    }
    if (this.qihuomodel['isweishi']) {
        this.packageyaoqius = [{ label: '请选择。。。', value: null }];
        this.classifyapi.getChildrenTree({ pid: 17746 }).then(data => {
          data.forEach(element => {
            this.packageyaoqius.push({ label: element.label, value: element.label });
          });
        });
    }
    this.iscountshow = false;
    this.goodscode = { gn: data['goodscode']['gn'] };
    this.mdmService.getMdmAttributeDic({ itemcode: data['goodscode']['gncode'] }).then(data1 => {
      this.showGuige = true;
      this.attrs = data1;
      this.attrs.forEach(element => {
        if (element['iscas']) {
            const options = element['options'];
            for (let index = 0; index < options.length; index++) {
                const ele = options[index];
                if (data['goodscode'][element['value']] === ele['value']) {
                    this.mdmService.getmdmclassifychild(ele['id']).then(children => {
                        for (let i = 0; i < children.length; i++) {
                          const child = children[i];
                          for (let j = 0; j < this.attrs.length; j++) {
                            const attr = this.attrs[j];
                            if (child['mdmvalue'] === attr['mdmvalue']) {
                              attr['options'] = child['options'];
                              break;
                            }
                          }
                        }
                    });
                    break;
                }
            }
        }
      });
      this.goodscode = data['goodscode'];
      if (this.qihuomodel['qihuostatus'] === 8) {
        for (const key in this.goodscode) {
          if (Object.prototype.hasOwnProperty.call(this.goodscode, key)) {
            if (this.goodscode[key] !== undefined && this.goodscode[key] !== null) {
              this.goodscode[key] = (this.goodscode[key] + '').split('->')[0];
            }
          }
        }
      }
    });
    this.editflag.zhidan = true;
    if (this.qihuomodel['qihuostatus'] === 8 && this.qihuoflag['qihuochangestatus'] === 1 && !this.qihuoflag['isruku']) {
      this.editflag.iseditguige = true;
    } else {
      this.editflag.iseditguige = false;
    }
    // 查找仓库
    this.cangku = [{ label: '非必填选项', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            label: element.name,
            value: element.id
           });
        });
    });
    this.editTempParam.detdata = data;
    this.one = true;
    this.two = false;
    this.createmdmqihuodialog.show();
  }
  //物料编码中规格属性的修改
  values = [];
  newattrid: number;
  modifygcqihuodetid: number;
  attrname: any;
  @ViewChild('gcmodify') private gcmodify: ModalDirective;
  showgcmodify(oldvalueid, qihuodetid) {
    if (!oldvalueid) { return; }
    if (this.qihuomodel['qihuostatus'] === 8 && (this.qihuoflag['qihuochangestatus'] === 2 || this.qihuoflag['isruku'])) { return; }
    if (this.qihuomodel['qihuostatus'] !== 8 && null != this.qihuomodel['vuserid']) {
      this.toast.pop('warning', '已经提交审核不允许修改');
      return;
    }
    this.values = [];
    this.newattrid = null;
    this.modifygcqihuodetid = null;
    this.modifygcqihuodetid = qihuodetid;
    let model = { classifyid: oldvalueid };
    this.classifyapi.getParentNode(oldvalueid).then(data => {
      this.attrname = data['value'];
    })
    this.classifyapi.getBrothernode(model).then(data => {
      this.values = [];
      data.forEach(element => {
        this.values.push({
          value: element.id,
          label: element.name
        });
      });
    })
    this.gcmodify.show();
  }
  closegcmodify() {
    this.gcmodify.hide();
  }
  modifygc() {
    let model = { name: this.attrname, value: this.newattrid };
    this.qihuoapi.modifygc(this.modifygcqihuodetid, model).then(data => {
      this.closegcmodify();
      this.toast.pop('success', '修改成功');
      this.findqihuodet();
    });
  }
  /**获取变更记录,更新当前明细 */
  getqihuochangeloglist() {
    this.qihuoapi.getqihuochangeloglist(this.qihuoid).then(res => {
      const data = res['list'];
      this.qihuoflag['isruku'] = res['isruku'];
      if (res['isqihuochange'] &&
        (this.qihuomodel['qihuostatus'] === 5 || this.qihuomodel['qihuostatus'] === 6 || this.qihuomodel['qihuostatus'] === 8)) {
        this.qihuoflag['isorderchange'] = true;
      } else {
        this.qihuoflag['isorderchange'] = false;
      }
      if (data.length && ((this.qihuoflag['qihuochangestatus'] === 0 || this.qihuoflag['qihuochangestatus'] === 1)
        && this.qihuomodel['qihuostatus'] === 8)) {
        const validData = data.filter(ele => ele['status'] !== 3 && ele['status'] !== 4);
        this.validQihuochangedet = validData;
        this.qihuodetchange(validData);
        if (validData.length) {
          // 期货变更中，期货变更审核中 qihuoflag['qihuochangestatus']: 0 // 期货变更状态：0:变更前;1:变更中;2:审核中
          if (validData.some(ele => ele['status'] === 1)) {
            this.qihuoflag['qihuochangestatus'] = 1;
          } else if (validData.some(ele => ele['status'] === 2)) {
            this.qihuoflag['qihuochangestatus'] = 2;
          }
          if (this.qihuoflag['qihuochangestatus'] === 2) {
            this.qihuoflag['isorderchange'] = false;
          }
        } else {
          if (this.qihuomodel['qihuostatus'] === 8) {
            this.qihuoflag['qihuochangestatus'] = 1;
          }
        }
      } else if (!data.length) {
        if (this.qihuomodel['qihuostatus'] === 8) {
          this.qihuoflag['qihuochangestatus'] = 1;
          this.validQihuochangedet = [];
        }
      }
      this.qihuochangegridOptions.api.setRowData(data);
    });
  }
  /**显示变更明细 */
  qihuodetchange(changeloglist: any[]) {
    for (let i = 0; i < changeloglist.length; i++) {
      const ele = changeloglist[i];
      if (ele['qihuodetid']) { // 明细
        for (let j = 0; j < this.qihuodetlist.length; j++) {
          const qihuodet = this.qihuodetlist[j];
          if (qihuodet['id'] === ele['qihuodetid']) {
            if (ele['type'] === '规格变更') {
              for (const key in ele['goodscode']) {
                if (Object.prototype.hasOwnProperty.call(ele['goodscode'], key)) {
                  const propervalue = ele['goodscode'][key];
                  qihuodet['goodscode'][key] = propervalue;
                }
              }
            }
            if (ele['type'] === '销售价格变更') {
              qihuodet['saleprice'] = ele['saleprice'];
            }
            if (ele['type'] === '内部结算价格变更') {
              qihuodet['neibujiesuanprice'] = ele['neibujiesuanprice'];
            }
            if (ele['type'] === '订货量变更') {
              qihuodet['weight'] = ele['weight'];
            }
            if (ele['type'] === '下单备注变更') {
              qihuodet['beizhu'] = ele['xiadanbeizhu'];
            }
            if (ele['type'] === '内部交期变更') {
              qihuodet['innerqixian'] = ele['innerqixian'];

            }
          }
        }
      } else { // 主表
        if (ele['type'] === '客户变更') {
          this.qihuomodel['buyer']['name'] = ele['buyername'];
        }
        if (ele['type'] === '运输类型变更') {
          this.qihuomodel['typename'] = ele['typename'];
        }
        if (ele['type'] === '收货地址变更') {
          this.songaddress = ele['addrname'];
        }
      }
    }
    this.gridOptions.api.setRowData(this.qihuodetlist);
  }
  finishqihuo(qihuoid) {
    console.log(qihuoid);
    if (confirm('所有入库已经完成并且订单中货物已经实提，你确定要这么做吗？')) {
      this.qihuoapi.finishqihuo(qihuoid, null).then(data => {
        this.toast.pop('success', '操作成功，不允许悔改！');
        this.getqihuomodel();
        this.findqihuodet();
      })
    }

  }
  //修改主表信息
  @ViewChild('mainmodifydialog') private mainmodifydialog: ModalDirective;
  //卖方公司
  innercompany(event) {
    this.editqihuo['sellerid'] = event;
  }
  buyer: any = {};
  openmodifymain() {
    this.editqihuo = JSON.parse(JSON.stringify(this.qihuomodel));
    this.editqihuo['jiaohuoqixian'] = new Date(this.editqihuo['jiaohuoqixian']);
    this.editqihuo['shengxiaodate'] = new Date(this.editqihuo['shengxiaodate']);
    this.findAddr(this.editqihuo['buyerid'], true);
    this.buyer = {};
    this.editqihuobuyerid = this.editqihuo['buyerid'];
    this.mainmodifydialog.show();
  }
  closemaindialog() {
    this.mainmodifydialog.hide();
  }
  modifymain() {
    if ((this.buyer instanceof Object) && this.buyer['code']) {
      this.editqihuo['buyerid'] = this.buyer['code'];
    }
    if (this.editqihuo['type'] === 1 && !this.editqihuo['addrid']) {
      this.toast.pop('warning', '请填写收货地址！');
      return;
    }
    this.editqihuo['addrbak']['addrid'] = this.editqihuo['addrid'];
    if (this.editqihuo['type'] !== 1) {
      this.editqihuo['addrbak']['addrid'] = null;
    }
    this.editqihuo['jiaohuoqixian'] = this.datepipe.transform(this.editqihuo['jiaohuoqixian'], 'y-MM-dd');
    this.editqihuo['shengxiaodate'] = this.datepipe.transform(this.editqihuo['shengxiaodate'], 'y-MM-dd');
    if (confirm('你确定修改吗？')) {
      this.modify(this.editqihuo);
      this.closemaindialog();
    }
  }
  //展示费用
  feeadddialogshow() {
    this.feeHeji = 0;
    this.feemodel = { feetype: null, price: null, beizhu: null };
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
  modifychukufee() {
    if (!isNaN(this.chukufeetypess['value'])) {
      this.chukufeetypess['type'] = this.chukufeetypess['value'];
      this.chukufeetypess['gn'] = this.params['data'].gn;
      this.chukufeetypess['cangkuid'] = this.params['data'].cangkuid;
      this.chukufeetypess['chandiid'] = this.params['data'].chandiid;
      this.chukufeetypess['gcid'] = this.params['data'].gcid;
      this.chukufeetypess['orderid'] = this.qihuoid;
      this.qihuoapi.getchukufeetype(this.chukufeetypess).then(() => {
        this.getorderdet();
        this.toast.pop('success', '修改成功');
        this.ckfeetypehideDialog();
      });
    }
  }
  ckfeetypehideDialog() {
    this.ckfeetype.hide();
  }
  ckfeetypeshowDialog() {
    this.ckfeetype.show();
  }
  //销售价格和预估费用修改弹出框
  salepricemodel: any = { neibujiesuanprice: null, saleprice: null };
  @ViewChild('salepriceandfeemodifydialog') private salepriceandfeemodifydialog: ModalDirective;
  //展示 
  salepriceandfeemodifydialogshow(qihuodetid, saleprice, neibujiesuanprice) {
    if (this.qihuoflag['qihuochangestatus'] === 2) { return; }
    this.qihuodetid = null;
    this.diyfeeHeji = 0;
    this.salepricemodel = { neibujiesuanprice: null, saleprice: null };
    if (this.qihuomodel['qihuostatus'] === 8) {
      if (saleprice !== undefined && saleprice !== null) {
        saleprice = (saleprice + '').split('->')[0];
      }
      if (neibujiesuanprice !== undefined && neibujiesuanprice !== null) {
        neibujiesuanprice = (neibujiesuanprice + '').split('->')[0];
      }
    }
    this.salepricemodel['saleprice'] = saleprice;
    this.salepricemodel['neibujiesuanprice'] = neibujiesuanprice;
    this.qihuodetid = qihuodetid;
    this.findyugufee(qihuodetid);//根据qihuodetid查询预估费用
    this.salepriceandfeemodifydialog.show();
  }
  salepriceanfeemodifydialogclose() { this.salepriceandfeemodifydialog.hide(); }
  addyugufeetodb() {
    if (!this.feemodel['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel['price'] && 'number' === typeof this.feemodel['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    this.feemodel['qihuodetid'] = this.qihuodetid;
    console.log(this.feemodel);
    if (confirm("你确定要添加费用吗？")) {
      this.qihuoapi.addfeeinqihuo(this.feemodel).then(data => {
        this.toast.pop('success', '添加成功!');
        this.findyugufee(this.qihuodetid);
        this.diyfeeHeji = this.diyfeeHeji['add'](this.feemodel['price']);
        this.findqihuodet();
        this.feemodel = {
          feetype: null, price: null, beizhu: null
        };
      })
    }

  }
  modifysaleprice() {
    if (!this.salepricemodel['saleprice']) {
      this.toast.pop('warning', '请输入销售价格');
      return;
    }
    if (!this.salepricemodel['neibujiesuanprice']) {
      this.toast.pop('warning', '请输入内部结算价格！');
      return;
    }
    if (confirm("你确定价格修改无误，提交修改吗？")) {
      this.qihuoapi.modifyprice(this.qihuodetid, this.salepricemodel).then(data => {
        this.findqihuodet();
        this.getqihuomodel();
        this.salepriceanfeemodifydialogclose();
      });
    }
  }
  delorderfeeindb(orderfeedetid, feeprice) {
    if (confirm('你确定要删除吗？')) {
      this.qihuoapi.delorderfee(orderfeedetid, this.qihuodetid).then(data => {
        this.findyugufee(this.qihuodetid);
        this.diyfeeHeji = this.diyfeeHeji['sub'](feeprice);
        this.findqihuodet();
        this.getqihuomodel();
      })
    }
  }
  //根据qihuodetid查询预估费用
  findyugufee(qihuodetid) {
    this.qihuoapi.findYugufees(qihuodetid).then(data => {
      this.diyfeeHeji = 0;
      this.lines = data;
      this.lines.forEach(e => {
        this.diyfeeHeji = this.diyfeeHeji['add'](e.feeprice);
      })
    })
  }
  //选择物流专员
  suser;
  isuser;
  wuliuidselect(user) {
    this.isuser = user;
    this.showwuliuid();
  }
  @ViewChild('wuliuid') private wuliuid: ModalDirective;

  showwuliuid() {
    this.wuliuid.show();
  }
  hidewuliuid() {
    this.wuliuid.hide();
    this.suser = null;
  }
  hidewuliuidqd() {
    if (this.isuser === 'cperson') {
      if (this.suser) {
        if (typeof (this.suser) === 'object') {
          this.qihuomodel['cpersonname'] = this.suser['name'];
          this.qihuomodel['wuliuid'] = this.suser['code'];
        } else if (typeof (this.suser) === 'string') {
          this.qihuomodel['wuliuid'] = '';
          this.toast.pop('warning', '输入的人员名称有误，请重新选择');
        }
      } else {
        this.qihuomodel['wuliuid'] = '';
      }
    }
    this.qihuoapi.addwuliuyuan(this.qihuomodel).then(() => {
    });
    this.getqihuomodel();
    this.hidewuliuid();
  }


  // 控制显示添加框
  showInput() {
    this.isshowInput = !this.isshowInput;
  }
  hesuandingjin() {
    if (confirm('确定后定金开始核算，你确定吗？')) {
      this.qihuoapi.hesuandingjin(this.qihuoid).then(data => {
        this.toast.pop('success', '修改成功！');
        this.querydingjin();
      });
    }
  }
  // 合同上传弹窗
  contractUploader() {
    this.uploaderModel.show();
  }
  //合同上传信息及格式
  uploadParam: any = { module: 'qihuo', count: 1, sizemax: 5, extensions: ['doc', 'pdf', 'jpeg', 'png', 'jpg'] };
  // 设置上传的格式
  accept = null;// ".xls, application/xls";
  // 上传成功执行的回调方法
  upcontract($event) {
    console.log($event);
    const model = { qihuoid: this.qihuoid, url: $event.url };
    if ($event.length !== 0) {
      this.qihuoapi.uploadcontract(model).then(data => {
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideDialog();
  }
  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  lookContract() {
    this.qihuoapi.lookContract(this.qihuoid).then(data => {
      console.log(data);
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    });
  }
  cancelnoticecaigou() {
    if (confirm('你确定要取消通知采购吗？')) {
      this.qihuoapi.cancelnoticecaigou(this.qihuoid).then(data => {
        this.getqihuomodel();
        this.toast.pop('success', '操作成功！');
      });
    }
  }
  showzuofei() {
    this.zuofeiModel.show();
  }
  zuofeiclose() {
    this.zuofeiModel.hide();
  }
  zuofeiorder() {
    console.log(this.qihuomodel['zuifeireason']);
    if (confirm('你确定要作废吗？')) {
      this.qihuoapi.zuofeiOrder(this.qihuoid, this.qihuomodel['zuofeireason']).then(data => {
        this.getqihuomodel();
        this.toast.pop('success', '操作成功！');
        this.zuofeiclose();
      });
    }
  }
  //添加配款
  allocation = { buyerid: null, dingjin: null };
  addallocationdialog() {
    let moneyquery = { buyerid: this.qihuomodel['buyer']['id'], wcustomerid: this.qihuomodel['seller']['id'] };
    this.moneyapi.getmoney(moneyquery).then(data => {
      if (!data['wyue']) {
        this.curyue = 0;
      } else {
        this.curyue = data['wyue'];
      }
    });
    this.allocationModel.show();
  }
  closeallocationdialog() {
    this.allocationModel.hide();
  }
  addallocation() {
    let model = {
      buyerid: this.qihuomodel['buyer']['id'],
      wcustomerid: this.qihuomodel['seller']['id'],
      qihuoid: this.qihuomodel['id'],
      jine: this.allocation['jine']
    };
    this.qihuoapi.addAllocation(model).then(() => {
      this.toast.pop('success', '添加成功');
      this.closeallocationdialog();
      this.queryallocation();
      this.getqihuomodel();
    });
  }

  //扣除定金余额不足审核
  verifyAllocation(allocationid) {
    if (confirm('这个定金确定要审核通过吗？')) {
      this.qihuoapi.verifyAllocation(this.qihuomodel['id'], allocationid).then(() => {
        this.toast.pop('success', '审核成功');
        this.queryallocation();
        this.getqihuomodel();
      })
    }
  }
  shifangallocationdialog() {
    this.shifangallocationModel.show();
  }
  closeshifangallocationdialog() {
    this.shifangallocationModel.hide();
  }
  shifangAllocation() {
    let model = {
      buyerid: this.qihuomodel['buyer']['id'], wcustomerid: this.qihuomodel['seller']['id'],
      qihuoid: this.qihuomodel['id'], jine: this.allocation['jine']
    };
    this.qihuoapi.shifangAllocation(model).then(() => {
      this.closeshifangallocationdialog();
      this.queryallocation();
      this.getqihuomodel();
    })
  }
  queryallocation() {
    this.qihuoapi.findAllocation(this.qihuoid).then(data => {
      this.allocationgridOptions.api.setRowData(data);
    })
  }
  // 选择类型后
  selectedtype(typevalue) {
    if (typevalue === '1') {
      this.iscountshow = true;
    } else {
      this.iscountshow = false;
      delete this.qihuodetmodel['count'];
      delete this.qihuodetmodel['length'];
    }
  }
  /**
   * 关联项目
   */
  getContactProject() {
    this.modalService.config.class = 'modal-all';
    this.kcbsModalRef = this.modalService.show(ContactprojectComponent);
    this.kcbsModalRef.content.componentparent = this;
  }
  // 计算约定比率
  calcyufurate() {
    if (this.qihuomodel['dingjin'] !== null && this.qihuomodel['dingjin'] !== undefined) {
      let result = parseFloat(this.qihuomodel['dingjin']);
      result = Math.round(this.qihuomodel['dingjin'] * 100) / 100;
      this.qihuomodel['dingjin'] = result;
      this.qihuomodel['yufurate'] = this.GetPercent(this.qihuomodel['dingjin'], this.qihuomodel['tjine']);
      this.oldyufurate = this.qihuomodel['yufurate'];
      this.modify(this.qihuomodel);
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
        this.oldyufurate = this.qihuomodel['yufurate'];
        return false;
      }
      this.qihuomodel['yufurate'] = this.NumberCheck(this.oldyufurate);
      this.qihuomodel['dingjin'] = (Number(this.qihuomodel['tjine']) * this.toPoint(this.qihuomodel['yufurate']));
      let result = parseFloat(this.qihuomodel['dingjin']);
      result = Math.round(this.qihuomodel['dingjin'] * 100) / 100;
      this.qihuomodel['dingjin'] = result;
      this.oldyufurate = this.qihuomodel['yufurate'];
      this.modify(this.qihuomodel);
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
  // 选择买方公司后
  showaddr(event) {
    console.log(event);
    if (!event['code']) {
      return;
    }
    this.editqihuobuyerid = event['code'];
    this.findAddr(event['code'], false);
  }
  // 获取选择公司的送货地址
  findAddr(customerid, flag) {
    this.addrs = [];
    if (customerid && this.editqihuo['type'] === 1) {// 判断只有是代运的才能加载地址
      this.addrs = [{ value: '', label: '请选择地址' }];
      this.userapi.findAddr(customerid).then((data) => {
        data.forEach((element) => {
          this.addrs.push({
            value: element['id'],
            label: element['province'] + element['city'] + element['county'] + element['detail']
          });
        });
        if (flag) {
          if (this.editqihuo['addrbakid']) {
            this.editqihuo['addrid'] = this.editqihuo['addrbak']['addrid'];
          }
        }
      });
    }
  }
  // 地址添加
  // 弹出添加地址的对话框
  @ViewChild('addrdialog') private addrdialog: ModalDirective;
  addr = {};
  provinces = [];
  citys = [];
  countys = [];
  // 打开省市县弹窗
  addAddrDialog() {
    if (this.editqihuo['type'] === 0) {
      this.toast.pop('warning', '自提的订单无需添加地址^~^');
      return '';
    }
    if (!this.editqihuo['buyerid']) {
      this.toast.pop('warning', '请选择买方公司');
      return;
    }
    this.addr = {};
    this.provinces = [];
    this.citys = [];
    this.countys = [];
    this.addr['detail'] = this.editqihuo['addrbak']['detail'];
    this.addr['lianxiren'] = this.editqihuo['addrbak']['lianxiren'];
    this.addr['phone'] = this.editqihuo['addrbak']['phone'];
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
  getAddr() {
    this.findAddr(this.editqihuobuyerid, false);
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
  // 开始往数据库中添加内容
  addAddr() {
    // if (!this.addr['provinceid']) {
    //   this.toast.pop('warning', '请选择省！！！');
    //   return '';
    // }
    // if (!this.addr['cityid']) {
    //   this.toast.pop('warning', '请选择市！！！');
    //   return '';
    // }
    // if (!this.addr['countyid']) {
    //   this.toast.pop('warning', '请选择县或区！！！');
    //   return '';
    // }
    if (!this.addr['detail']) {
      this.toast.pop('warning', '请填写详细地址！！！');
      return '';
    }
    this.addr['customerid'] = this.editqihuo['buyerid'];
    this.businessOrderApi.createAddr(this.addr).then((data) => {
      this.addrdialogclose();
      this.findAddr(this.addr['customerid'], false);
    });
  }
  addrdialogclose() {
    this.addrdialog.hide();
  }

  // 运输地址集合
  destList = [];
  /**
   * 根据目的地自动识别省市县
   */
  selectedenddest(destination) {
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.wuliunotice['provinceid'] = '';
      this.wuliunotice['cityid'] = '';
      this.wuliunotice['countyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.wuliunotice['provinceid'] = addressObj['provinceValue'];
          this.getpcc(this.wuliunotice['provinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.wuliunotice['cityid'] = addressObj['cityValue'];
                this.getpcc(this.wuliunotice['cityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.wuliunotice['countyid'] = addressObj['countyValue'];
                      }
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
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyapi.getChildrenTree({ pid: pid }).then((data) => {
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
  getcity2() {
    this.citys = [];
    delete this.wuliunotice['cityid'];
    delete this.wuliunotice['countyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['provinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
      });
      this.countys = [];
    });
  }

  getcounty2() {
    this.countys = [];
    delete this.wuliunotice['countyid'];
    this.classifyapi.getChildrenTree({ pid: this.wuliunotice['cityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 弹出选择物流专员的对话框
  cuser = {};
  wuliunotice: any = {
    enddest: '', id: null, wuliuuserid: null,
    transporttype: null
  };
  selectQihuodetWuliubaojia: any = [];
  /**选择物流员弹窗 */
  shownoticewuliuyuan() {
    if (!this.qihuomodel['isnoticecaigou'] && this.qihuomodel['ordertype'] !== 13 && this.qihuomodel['ordertype'] !== 14) {
      this.toast.pop('warning', '请先通知采购！！！');
      return;
    }
    if ((this.qihuomodel['ordertype'] !== 13 || this.qihuomodel['ordertype'] !== 14) && !this.qihuomodel['isv']) {
      this.toast.pop('warning', '在途合同请审核完成后物流竞价！！！');
      return;
    }
    if (this.qihuomodel['type'] !== 1) {
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
          guige: orderdetSelected[i].data['goodscode']['guige'],
          weight: orderdetSelected[i].data['weight'],
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
    this.noticewuliuparams = { qihuodets: this.selectQihuodetWuliubaojia, id: this.qihuomodel['id'], detids: qihuodetids };
    this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
    this.bsModalRef.content.parentThis = this;
  }
  wuliunoticehide() {
    this.bsModalRef.hide();
    this.getqihuomodel();
    this.findqihuodet();
    this.getMyRole();
    this.tabviewindex = 5;
  }
  handleChange(event) {
    this.tabviewindex = event.index;
  }

  // 查询质保书
  getZhibaoUrl() {
    this.qihuoapi.getZhibaoUrl(this.qihuoid).then(data => {
      this.singleData = data;
      if (!this.singleData || !this.singleData.length) {
        this.toast.pop('warning', '未查询到质保书!');
        return;
      }
      this.zhibaoshuModel.show();
    })
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
      this.qihuoapi.downlodezhibao({ pathList: files }).then(data => {
        if (data['zipurl']) {
          window.open(data['zipurl']);
        }
      });
    } else {
      this.toast.pop('warning', '请选择要下载的质保书！');
    }
  }

  showProduceWuliu() {
    if (this.qihuomodel['type'] !== 1) {
      this.toast.pop('warning', '运输类型只有代运才能通知物流专员报价！！！');
      return;
    }
    if (!this.qihuomodel['isv']) {
      this.toast.pop('warning', '请在审核通过之后进行询价！！！');
      return;
    }
    const orderdetids = [];
    this.selectQihuodetWuliubaojia = [];
    const orderdetSelected = this.ordergridOptions.api.getModel()['rowsToDisplay']; // 获取选中的订单明细。
    for (let i = 0; i < orderdetSelected.length; i++) {
      if (orderdetSelected[i].data.id && orderdetSelected[i].selected) {
        orderdetids.push(orderdetSelected[i].data.id);
      }
    }
    if (orderdetids.length < 1) {
      this.toast.pop('warning', '请选择需要报价的成品明细！！！');
      return;
    }

    this.businessorderApi.orderdetgroup(orderdetids).then(data => {
      this.selectQihuodetWuliubaojia = data;
      this.modalService1.config.class = 'modal-lg';
      // 通知物流报价弹窗的参数
      this.noticewuliuparams = { qihuodets: this.selectQihuodetWuliubaojia, id: this.qihuomodel['id'], detids: orderdetids, datasource: 6 };
      this.bsModalRef = this.modalService1.show(NoticewuliuyuanComponent);
      this.bsModalRef.content.parentThis = this;
    })
  }
  /**打开引入调货竞价弹窗 */
  showtiaohuobid() {
    this.modalService1.config.class = 'modal-all';
    this.importTBbsModalRef = this.modalService1.show(ImporttiaohuobidComponent);
    this.importTBbsModalRef.content.parentThis = this;
  }
  /**已下单和已审核状态下可以一键撤回制单中 */
  oneRecall() {
    this.qihuoapi.onerecall(this.qihuoid).then(data => {
      this.getqihuomodel();
      this.findqihuodet();
    });
  }
  /**点击期货变更按钮 */
  orderchange() {
    if (this.qihuoflag['qihuochangestatus'] === 0) {
      if (confirm('钢厂下单前：一键撤回到制单中\n库存入库前，可变更项 ：价格、买方公司、运输方式、规格、订货量\n库存入库后，可变更项 ：价格、买方公司、运输方式\n点击后合同不能被其他单据引用，确定要变更吗？')) {
        if (this.qihuoflag['isorderchange']) {
          this.qihuoapi.orderchange(this.qihuoid).then(data => {
            this.getqihuomodel();
            this.findqihuodet();
          });
        }
        if (this.qihuoflag['isrecall']) {
          this.oneRecall();
        }
      }
    } else if (this.qihuoflag['qihuochangestatus'] === 1) {
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
      const json = { orderid: this.qihuoid, beizhu: this.qhchangetijiaobeizhu };
      this.qihuoapi.orderchangesubmitverify(json).then(data => {
        this.getqihuomodel();
        this.findqihuodet();
        this.qhchangetijiaoclose();
      });
    }
  }
  /**获取其他单位 */
  getunits() {
    this.units = [{ label: '请选择新单位', value: null }];
    this.classifyapi.getChildrenTree({ pid: 12717 }).then(data => {
      data.forEach(element => {
        this.units.push({
          label: element.label,
          value: element.label
        });
      });
    });
  }

  caigoudan() {
    const ids = new Array();
    const qihuodetlistlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    let chandi = '';
    let gn = '';
    for (let i = 0; i < qihuodetlistlist.length; i++) {
      if (qihuodetlistlist[i].selected && qihuodetlistlist[i].data) {
        if (!chandi) {
          chandi = qihuodetlistlist[i].data.goodscode.chandi;
        }
        if (!gn) {
          gn = qihuodetlistlist[i].data.goodscode.gn;
        }
        if (gn !== qihuodetlistlist[i].data.goodscode.gn || chandi !== qihuodetlistlist[i].data.goodscode.chandi) {
          this.toast.pop('warning', '请选择同一产地的货物');
          return '';
        }
        ids.push(qihuodetlistlist[i].data.id);
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择明细！！！');
      return;
    }
    this.caigou['orderdetids'] = ids;
    this.caigou['orderid'] = this.qihuoid;
    this.selectegangchang(gn, chandi);
    this.findWiskind();
    this.createCaigouModal.show();
  }
  closeCaigou() {
    this.createCaigouModal.hide();
  }
  caigou: object = {};
  selectmonth(value) {
    this.caigou['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  createCaigou() {
    if (!this.caigou['month']) {
      this.toast.pop('error', '请选择合同月份！', '');
      return;
    }
    // if (!this.caigou['jiaohuoaddr']) {
    //   this.toast.pop('error', '请填写交货地点！', '');
    //   return;
    // }
    if (this.caigou['sellerid'] instanceof Object) {
      this.caigou['sellerid'] = this.caigou['sellerid'].code;
    } else {
      this.caigou['sellerid'] = null;
    }
    if (this.caigou['sellerid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    this.caigouApi.createCaigou(this.caigou).then(data => {
      this.router.navigateByUrl('/caigou/' + data.id);
      this.closeCaigou();
    });
  }
  selectegangchang(gn, chandi) {
    this.caigou['chandi'] = gn;
    this.caigou['chandi'] = chandi;
    this.jiaohuoaddrs = [];
    const chandigongchaparam = { gn: gn, chandi };
    this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
      for (let index = 0; index < chandigongchas.length; index++) {
        const element = chandigongchas[index];
        if (element.value === 'jiaohuoaddr') {
          this.jiaohuoaddrs = element.options;
          break;
        }
      }
    });
    // this.qihuoapi.getchandigongcha().then(data => {
    //   data.forEach(element => {
    //     if (element['chandiid'] === this.caigou['chandiid']) {
    //       console.log('确定产地的', element);
    //       // 交货地址
    //       element.attr.jiaohuoaddr.forEach(addr => {
    //         this.jiaohuoaddrs.push({
    //           value: addr.value,
    //           label: addr.value
    //         });
    //       });
    //     }
    //   });
    // });
  }
  neiwuwaiwu = false;
  getRoles() {
    let myrole = JSON.parse(localStorage.getItem('myrole'));
    for (let i = 0; i < myrole.length; i++) {
      if (myrole[i] === 20 || myrole[i] === 21 || myrole[i] === 33 || myrole[i] === 34) {
        this.neiwuwaiwu = true;
      }
    }
  }
  //查询采购单位
  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' });
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          if (element.id === 3786 ||
            element.id === 3864 ||
            element.id === 21619
          ) {
            this.companyIsWiskind.push({
              label: element.name,
              value: element.id
            });
          }
        });
        console.log(this.companyIsWiskind);
      })
    }
  }

  qualitShow() {
    this.addqualityModal.show();
  }
  hideaddModal() {
    this.addqualityModal.hide();
  }

  
  choice() {
    console.log(this.qhqualityModel['compensation']);
    if (!this.qhqualityModel['ischuliquality']) {
      this.toast.pop('warning', '请选择是否处理！');
      return;
    }
    if (!this.qhqualityModel['saletype'] && !this.qhqualityModel['rstype']) {
      this.toast.pop('warning', '请填写销售类型或资源类型！');
      return;
    }
    if (this.qhqualityModel['saletype'] && !this.qhqualityModel['salebeizhu']) {
      this.toast.pop('warning', '请填写销售说明！');
      return;
    }
    if (this.qhqualityModel['saletype'] && this.qhqualityModel['salejine'] === null) {
      this.toast.pop('warning', '请填写销售金额！');
      return;
    }
    if (this.qhqualityModel['rstype'] && !this.qhqualityModel['rsbeizhu']) {
      this.toast.pop('warning', '请填写资源说明！');
      return;
    }
    if (this.qhqualityModel['rstype'] && this.qhqualityModel['rsjine'] === null) {
      this.toast.pop('warning', '请填写资源金额！');
      return;
    }
    this.qhqualityModel['id'] = this.qihuomodel['id'];
    this.hideaddModal();
    this.modalService.config.class = 'modal-all';
    this.zlbsModalRef = this.modalService.show(QualityobjectionimportComponent);
    this.zlbsModalRef.content.isimport = this.isimport;
    this.zlbsModalRef.content.qhqualityModel = this.qhqualityModel;
    this.zlbsModalRef.content.parent = this;
  }
  addupdate() {
    let params = { ischuliquality: this.qhqualityModel['ischuliquality'], id: this.qihuomodel['id'] };
    this.orderApi.qualityUpdate(params).then(data => {
      console.log(data);
      if (data) {
        this.getqihuomodel();
        this.hideaddModal();
      }
    });
  }
  // /**打开品名选择弹窗 */
  // showgetmdmgn() {
  //   this.mdmgndialog.show();
  //   this.mdmgnsearch = {pagenum: 1, pagesize: 10, itemname: '', itemcode: ''};
  //   this.getMdmgn();
  // }
  // querymdmgn() {
  //   this.mdmgnsearch.pagenum = 1;
  //   this.getMdmgn();
  // }
  // /**查询品名 */
  // getMdmgn() {
  //   this.mdmService.gnMdmgn(this.mdmgnsearch).then(data => {
  //     this.mdmgnsearchtotal = data.headers.get('total');
  //     this.gnData = data.json();
  //     console.log(this.gnData);
  //   });
  // }
  // /**品名列表分页 */
  // mdmgnsearchChanged(event) {
  //   this.mdmgnsearch['pagenum'] = event.page;
  //   this.mdmgnsearch['pagesize'] = event.itemsPerPage;
  //   this.getMdmgn();
  // }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.goodscode = {};
    this.goodscode['gn'] = item.itemname;
    this.goodscode['gncode'] = item.itemcode;
    this.goodscode['categorydesc'] = item.categorydesc;
    this.showGuige = true;
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.goodscode[element['value']] = element['defaultval'];
      }
    }
  }
  mdmreset() {
    this.editflag = { zhidan: false, iseditguige: false };
    this.editTempParam = { detdata: null };
    this.showGuige = false;
    this.gcs = [];
    this.qihuodetmodel = {
      id: null,
      gnid: null,
      chandiid: null,
      dinghuoliang: null,
      oneweight: null,
      jiaohuodate: null,
      jiaohuoaddr: null,
      neibujiesuanprice: null,
      saleprice: null,
      houdugongcha: null,
      widthgongcha: null,
      weightgongcha: null,
      classifys: null,
      cangkuid: null,
      chukufeeprice: 0,
      yunfeeprice: 0,
      yunzafeeprice: 0,
      jiagongfeeprice: 0,
      unitname: null,
      isinterestfree: false,
      jhzhouqi:null,
      jhcangku:null
    };
    this.one = true;
    this.two = false;
    this.goodscode = {};
  }
  addmdmgoodscode() {
    // if(this.qihuomodel['ordertype'] === 9 && !this.qihuomodel['thtype']){
    //   this.toast.pop('warning', '请选择调货类型');
    //   return;
    // }
    this.mdmreset();
    this.zhidaoprices = [{ label: '请选择。。。', value: null },
    { value: '0', label: '正常' }, { value: '1', label: '低于' }, { value: '2', label: '总经理特批' }];
    this.isurgent = [{ label: '请选择。。。', value: null }, { label: '是', value: true }, { label: '否', value: false }];
    this.materialtypes = [{ label: '请选择。。。', value: null },
    { value: '1', label: '开平板' }, { value: '2', label: '纵剪卷' }];
    if (this.qihuomodel['isweishi']) {
      this.packageyaoqius = [{ label: '请选择。。。', value: null }];
      this.classifyapi.getChildrenTree({ pid: 17746 }).then(data => {
        data.forEach(element => {
          this.packageyaoqius.push({ label: element.label, value: element.label });
        });
      });
    }
    if (this.qihuomodel['ordertype'] === 2) {// 如果是临调销售合同则需要添加仓库
      this.getcangkus();
    }
    // 查找仓库
    this.cangku = [{ label: '非必填选项', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
        response.forEach(element => {
          this.cangku.push({
            label: element.name,
            value: element.id
          });
       });
    });
    this.iscountshow = false;
    this.createmdmqihuodialog.show();
  }
  createmdmqihuodialogcoles() {
    this.createmdmqihuodialog.hide();
  }
  nextdialog1() {
    for (let index = 0; index < this.attrs.length; index++) {
      const attrjson = this.attrs[index];
      if (attrjson.isrequired) {
        if (!this.goodscode[attrjson.value]) {
          this.toast.pop('warning', '请选择' + attrjson.name + '！');
          return;
        }
      }
    }
    this.mdmService.createMaterial(this.goodscode).then(good => {
      console.log(good);
      this.one = false;
      this.two = true;
      if (this.qihuomodel['ordertype'] !== 2) {
        this.isqihuo = true;
      }
      this.chandigongchas = [];
      this.houdugongchas = [];
      this.widthgongchas = [];
      this.yongtus = [];
      this.oneweights = [];
      this.jiaohuoaddrs = [];
      this.lines = [];
      this.getunits();
      this.qihuodetmodel['gcid'] = good.id;
      const chandigongchaparam = { gn: good['gn'], chandi: good['chandi'] };
      this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
        this.chandigongchas = chandigongchas;
        if (this.editTempParam.detdata) {
          this.qihuodetmodel['houdugongcha'] = this.editTempParam.detdata['houdugongcha'];
          this.qihuodetmodel['widthgongcha'] = this.editTempParam.detdata['widthgongcha'];
          this.qihuodetmodel['weightgongcha'] = this.editTempParam.detdata['weightgongcha'];
          this.qihuodetmodel['yongtu'] = this.editTempParam.detdata['yongtu'];
          this.qihuodetmodel['jiaohuodate'] = new Date(this.editTempParam.detdata['innerqixian']);
          this.qihuodetmodel['oneweight'] = this.editTempParam.detdata['oneweight'];
          this.qihuodetmodel['jiaohuoaddr'] = this.editTempParam.detdata['innerjiaohuoaddr'];
          this.qihuodetmodel['detid'] = this.editTempParam.detdata['id'];
          this.qihuodetmodel['dinghuoliang'] = this.editTempParam.detdata['weight'];
          this.qihuodetmodel['beizhu'] = this.editTempParam.detdata['beizhu'];
          this.qihuodetmodel['zhidaojiagedesc'] = this.editTempParam.detdata['zhidaojiagedesc'] + '';
          this.qihuodetmodel['isurgent'] = this.editTempParam.detdata['isurgent'];
          this.qihuodetmodel['materialtype'] = this.editTempParam.detdata['materialtype'];
          this.qihuodetmodel['cangkuid'] = this.editTempParam.detdata['cangkuid'];
          this.qihuodetmodel['isinterestfree'] = this.editTempParam.detdata['isinterestfree'];
          this.qihuodetmodel['interestfreedays'] = this.editTempParam.detdata['interestfreedays'];
          this.qihuodetmodel['interestfreereason'] = this.editTempParam.detdata['interestfreereason'];
          this.qihuodetmodel['length'] = this.editTempParam.detdata['length'];
          this.qihuodetmodel['count'] = this.editTempParam.detdata['count'];
          this.qihuodetmodel['neibujiesuanprice'] = this.editTempParam.detdata['neibujiesuanprice'];
          this.qihuodetmodel['saleprice'] = this.editTempParam.detdata['saleprice'];
          this.qihuodetmodel['jhzhouqi'] = this.editTempParam.detdata['jhzhouqi'];
          if (this.qihuomodel['isweishi'] && this.editTempParam.detdata['packageyaoqiu']) {
            this.qihuodetmodel['dabaoyaoqiu'] = this.editTempParam.detdata['packageyaoqiu'].split(',');
          }
          if (this.qihuomodel['isweishi']) {
            this.qihuodetmodel['unitname'] = this.editTempParam.detdata['unitname'];
            this.qihuodetmodel['unitweight'] = this.editTempParam.detdata['unitweight'];
            this.qihuodetmodel['unitprice'] = this.editTempParam.detdata['unitprice'];
          }
        }
      });
    });
  }

  mdmcreate() {
    if (!this.qihuodetmodel['beizhu']) { this.toast.pop('warning', '下单备注不允许为空！'); return; }
    if (!this.qihuodetmodel['houdugongcha']) { this.toast.pop('warning', '厚度公差不允许为空！'); return; }
    if (!this.qihuodetmodel['widthgongcha']) { this.toast.pop('warning', '宽度公差不允许为空！'); return; }
    if (!this.qihuodetmodel['dinghuoliang']) { this.toast.pop('warning', '订货量不允许为空！'); return; }
    if (!this.qihuodetmodel['oneweight']) { this.toast.pop('warning', '单卷重不允许为空！'); return; }
    if (!this.qihuodetmodel['weightgongcha']) { this.toast.pop('warning', '数量公差不允许为空！'); return; }
    if (this.qihuomodel['ordertype'] !== 2) {
      if (!this.qihuodetmodel['neibujiesuanprice']) { this.toast.pop('warning', '内部结算价格不允许为空！'); return; }
    }
    if (this.qihuodetmodel['materialtype'] === '1') {
      if (!this.qihuodetmodel['length'] || this.qihuodetmodel['length'] === '') {
        this.toast.pop('warning', '米数不允许为空！');
        return;
      }
      // if (!this.qihuodetmodel['count'] || this.qihuodetmodel['count'] === '') {
      //   this.toast.pop('warning', '张数不允许为空！');
      //   return;
      // }
    }
    if (this.qihuodetmodel['isinterestfree']) {
      if (this.qihuodetmodel['interestfreedays'] === undefined || this.qihuodetmodel['interestfreedays'] === null) {
        this.toast.pop('warning', '免息天数不允许为空！'); return;
      }
      this.qihuodetmodel['interestfreedays'] = Math.round(this.qihuodetmodel['interestfreedays']);
      if (this.qihuodetmodel['interestfreedays'] <= 15) {
        this.toast.pop('warning', '免息天数只能填写大于15的整数！'); return;
      }
      if (!this.qihuodetmodel['interestfreereason']) {
        this.toast.pop('warning', '免息原因不允许为空！'); return;
      }
    }
    if (!this.qihuodetmodel['saleprice']) { this.toast.pop('warning', '销售价格不允许为空！'); return; }
    if(this.qihuomodel['ordertype'] !== 0 && this.qihuomodel['ordertype']!==1){
      if (!this.qihuodetmodel['jiaohuodate']) { this.toast.pop('warning', '交货期限不允许为空！'); return; }
    }
    if(this.qihuomodel['ordertype'] === 0||this.qihuomodel['ordertype']===1){
      if (!this.qihuodetmodel['jhzhouqi']) { this.toast.pop('warning', '交货周期不允许为空'); return; }
    }
    if (!this.qihuodetmodel['jiaohuoaddr']) { this.toast.pop('warning', '交货地址不允许为空！'); return; }
    if (!this.qihuodetmodel['yongtu']) { this.toast.pop('warning', '用途不允许为空！'); return; }
    if (!this.qihuodetmodel['zhidaojiagedesc']) { this.toast.pop('warning', '指导价格不允许为空！'); return; }
    if (this.qihuodetmodel['isurgent'] === undefined) { this.toast.pop('warning', '是否急单不允许为空！'); return; }
    if (this.qihuomodel['isweishi']) {
      if (!this.qihuodetmodel['unitname'] ||
        this.qihuodetmodel['unitweight'] === undefined ||
        this.qihuodetmodel['unitweight'] === null ||
        this.qihuodetmodel['unitprice'] === undefined ||
        this.qihuodetmodel['unitprice'] === null) {
        this.toast.pop('warning', '请把新单位信息填写完整！'); return;
      }
    }
    this.qihuodetmodel['jiaohuodate'] ?
      this.qihuodetmodel['jiaohuodate'] = this.datepipe.transform(this.qihuodetmodel['jiaohuodate'], 'y-MM-dd') : '';
    this.qihuodetmodel['id'] = this.qihuoid;
    this.qihuodetmodel['fees'] = this.lines;
    if (this.qihuomodel['ordertype'] === 15) {
      this.qihuodetmodel['packageyaoqiu'] = this.qihuodetmodel['dabaoyaoqiu'].join();
    }
    if (this.qihuodetmodel['detid']) { // 修改明细
      this.qihuoapi.modifymdmqihuodet(this.qihuodetmodel).then(() => {
        this.createmdmqihuodialogcoles();
        /* 刷新明细页面*/
        this.findqihuodet();
        this.getqihuomodel();
        this.one = true;
        this.two = false;
      });
    } else { // 创建明细
      this.qihuoapi.createqihuodet(this.qihuodetmodel).then(() => {
        this.createmdmqihuodialogcoles();
        /* 刷新明细页面*/
        this.findqihuodet();
        this.getqihuomodel();
        this.one = true;
        this.two = false;
      });
    }
  }

  querymat() {
    if (this.qihuodetmodel['matcode'] && this.qihuodetmodel['matcode'].trim()) {
      this.qihuoapi.getmat(this.qihuodetmodel['matcode']).then(mat => {
        this.goodscode = { gn: mat['gn'] };
        this.mdmService.getMdmAttributeDic({ itemcode: mat['gncode'] }).then(data1 => {
          this.showGuige = true;
          this.attrs = data1;
          for (const key in mat) {
            if (Object.prototype.hasOwnProperty.call(mat, key)) {
              const element = mat[key];
              this.goodscode[key] = element;
            }
          }
        });
      });
    }
  }
  /**选择属性 */
  selectattr(item, value) {
    if (item['iscas']) {
      const options = item['options'];
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        if (value === element['value']) {
          this.mdmService.getmdmclassifychild(element['id']).then(children => {
            for (let i = 0; i < children.length; i++) {
              const child = children[i];
              for (let j = 0; j < this.attrs.length; j++) {
                const attr = this.attrs[j];
                if (child['mdmvalue'] === attr['mdmvalue']) {
                  attr['options'] = child['options'];
                  this.goodscode[attr.value] = null;
                  break;
                }
              }
            }
          });
          break;
        }
      }
    }
  }
  //批量删除明细
  qihuodetids: any = [];
  deleteqihuodet() {
    this.qihuodetids = new Array();
    const qihuodetidsdetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < qihuodetidsdetlist.length; i++) {
      if (qihuodetidsdetlist[i].selected && qihuodetidsdetlist[i].data && qihuodetidsdetlist[i].data['id'] ) {
        this.qihuodetids.push(qihuodetidsdetlist[i].data.id);
      }
    }
    if (!this.qihuodetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.qihuoapi.delqihuoDet(this.qihuodetids).then(data => {
      this.toast.pop('success', '删除成功！');
      this.getqihuomodel();
      this.findqihuodet();
      });
    }
  }
  
}
