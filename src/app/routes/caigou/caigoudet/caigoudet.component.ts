import { StorageService } from './../../../dnn/service/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CaigoudetimportComponent } from './../../../dnn/shared/caigoudetimport/caigoudetimport.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../caigou.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QihuoService } from '../../qihuo/qihuo.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DatePipe } from '@angular/common';
import { SelectComponent } from 'ng2-select';
import { CustomerapiService } from 'app/routes/customer/customerapi.service';
import { MdmService } from 'app/routes/mdm/mdm.service';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-caigoudet',
  templateUrl: './caigoudet.component.html',
  styleUrls: ['./caigoudet.component.scss']
})
export class CaigoudetComponent implements OnInit {

  form: FormGroup;
  @ViewChild('defaultGroup') public nselect: SelectComponent;
  @ViewChild('classicModal') classicModal: ModalDirective;
  @ViewChild('supplierModal') supplierModal: ModalDirective;
  @ViewChild('buyerModal') buyerModal: ModalDirective;
  @ViewChild('weightModal') weightModal: ModalDirective;
  @ViewChild('priceModal') priceModal: ModalDirective;
  @ViewChild('gcmodify') private gcmodify: ModalDirective;
  @ViewChild('addrmodify') private addrmodify: ModalDirective;
  @ViewChild('gongchamodify') private gongchamodify: ModalDirective;
  @ViewChild('dateModal') private dateModal: ModalDirective;
  @ViewChild('countmodify') private countmodify: ModalDirective;
  @ViewChild('beizhumodify') private beizhumodify: ModalDirective;
  @ViewChild('jiesuanmodify') private jiesuanmodify: ModalDirective;
  @ViewChild('areamodify') private areamodify: ModalDirective;
  colors: Array<any>;
  color = { detid: null };
  @ViewChild('colormodify') private colormodify: ModalDirective;
  @ViewChild('gcinfodialog') private gcinfodialog: ModalDirective;
  @ViewChild('gaizhanglog') private gaizhanglog: ModalDirective;
  @ViewChild('hetongdialog') private hetongdialog: ModalDirective;
  @ViewChild('orgModal') private orgModal: ModalDirective;
  @ViewChild('mdmclassicModal') mdmclassicModal: ModalDirective;
  @ViewChild('mdmgndialog') mdmgndialog: ModalDirective;
  @ViewChild('jiesuantypeModal') private jiesuantypeModal: ModalDirective;
  @ViewChild('cangkuModal') private cangkuModal: ModalDirective;
  mdmgnsearch = { pagenum: 1, pagesize: 10, itemname: '', categoryname: '' };
  goodscode: any = {};
  chandigongchas = [];
  editTempParam = { detdata: null }; // 修改明细临时变量
  editflag = { zhidan: false };
  @ViewChild('addFeeModal') private addFeeModal: ModalDirective;
  gridOptions: GridOptions;
  // 交货最小时间
  jiaohuodatemin: Date = new Date();
  // 交货时间
  jiaohuodate: Date = new Date();
  det: object = {
    gn: '', chandi: '', guige: '', caigouid: '', caigouweight: '', price: '', beizhu: '',
    jiaohuodate: '', oneweight: '', yongtu: '', gongcha: '', houdugongcha: '', widthgongcha: '', jiesuanprice: '', zhuanhuo: '',
    orgid: '',jhcangkuid:''
  };
  isshowInput = false;
  feemodel: any = { feetype: null, price: null, feecustomer: {}, chengyun: null, id: null };
  areas = new Array();
  // 品名
  gns: any[];
  gn;
  // 产地
  chandis: any[];
  cs: any[];
  showGuige: boolean;
  isChandi: boolean;
  // 规格
  attrs: any;
  modifyweight: Object = { caigouweight: null, detid: '' };
  modifyprice: Object = { price: null, detid: '' };
  modifyorg: Object = { orgid: null, detid: '' };
  caigou: Object = { seller: '', buyer: '', vuser: '', org: '' };
  // 资源号
  grno: Object = { grno: null, detid: '' };
  updateDet = {};
  // 采购弹窗对象
  cgbsModalRef: BsModalRef;
  cg: object = { jiaohuoaddr: '', id: '', beizhu: '', areaid: '' };
  flag: Object = { qihuo: false, tijiao: false, shenhe: false, qishen: false };
  supplier: Object = { supplierid: '', id: '' };
  buyer: Object = { buyerid: '', id: '' };
  houdugongchas: any[];
  widthgongchas: any[];
  yongtus: any[];
  oneweights: any[];
  copy: Object = { id: '' };
  // 物料编码中规格属性的修改
  values = [];
  newattrid: number;
  modifygccaigoudetid: number;
  attrname: any;
  // 交货地点
  jiaohuoaddrs: any[];
  guigelength: number; // 声明一个数量计算器
  // 修改公差
  gongchas: any[];
  gongchaModel: Object = { detid: '', type: '', name: '', id: ''};
  // 转货
  zhuanhuos;
  nextflag = false;
  // 盖章人
  gzuser;
  isgz: boolean;
  jstype: object = {};
  cangku: { label: string; value: string; }[];
  constructor(private caigouApi: CaigouService, private fb: FormBuilder, private actroute: ActivatedRoute, public settings: SettingsService,
    private classifyApi: ClassifyApiService, private toast: ToasterService, private bsModalService: BsModalService,
    private qihuoapi: QihuoService, private router: Router, private datepipe: DatePipe, private storage: StorageService,
    private customerApi: CustomerapiService, public mdmService: MdmService,) {
    // 表单验证
    this.form = fb.group({
      'caigouweight': [null, Validators.compose([Validators.required,
      Validators.pattern('^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,3})?$')])],
      'price': [null, Validators.compose([Validators.required, Validators.pattern('^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$')])],
      'beizhu': [],
      'weight': [],
      'jiaohuodate': [],
      'yongtu': [],
      'gongcha': [],
      'houdugongcha': [],
      'widthgongcha': [],
      'jiesuantype-radio': [],
      'jiesuanprice': [null, Validators.compose([Validators.required,
      Validators.pattern('^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$')])],
      'zhuanhuo': [],
      'orgid': [],
      gn: [],
      categorydesc: [],
    });

    console.log('abcd', this.actroute.params['value']['id']);
    this.det['caigouid'] = this.actroute.params['value']['id'];
    this.gridOptions = {
      rowSelection: 'multiple',
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableFilter: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: (params) => {
        const result = [
          'copy',
          {
            name: '自适应',
            action: () => {
              params.columnApi.autoSizeAllColumns();
            }
          }
        ];
        if (params.node.data.id !== null && params.node.data.orderdetid === null) {
          result.push({
            name: '插行复制',
            action: () => {
              // console.log('/*/********************', params);
              this.copy['id'] = params.node.data.id;
              this.caigouApi.copydet(this.copy).then(data => {
                this.toast.pop('success', '复制插行成功！');
                this.getcaigou();
              });
            }
          });
        }
        return result;
      },
      groupSelectsChildren: true // 分组可全选
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group', minWidth: 90,
        checkboxSelection: true, headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'goodscode.id', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100, editable: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return null;
          } else {
            return params.value;
          }
        },
        onCellValueChanged: (params) => {
          console.log('value', params.newValue);
          if (params.data.rukuweight !== '0') {
            this.getcaigou();
            this.toast.pop('error', '已有相关入库，资源号不允许修改！', '');
            return;
          }
          if (params.newValue === null || params.newValue === undefined) {
            this.grno['grno'] = null;
          } else {
            console.log('value1', params.newValue);
            this.grno['grno'] = params.newValue;
          }
          this.grno['detid'] = params.data.id;
          this.caigouApi.addgrno(this.grno).then(data => {
            this.toast.pop('success', '添加资源号成功！');
            this.getcaigou();
          });
          console.log('value1asd');
        }
        // onCellClicked: (params) => {
        //   this.grno['detid'] = params.data.id;
        //   this.grno['grno'] = params.data.grno;
        //   console.log(params);
        //   this.grnoModal.show();
        // }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '合约号', field: 'contractno', minWidth: 100, editable: true,
        onCellValueChanged: (params) => {
          this.updateDet = {};
          this.updateDet['contractno'] = params.newValue;
          this.updateDet['id'] = params.data.id;
          this.caigouApi.updateCaigouDet(this.updateDet).then(data => {
            if (data) {
              this.toast.pop('success', '添加合约号成功！');
              this.getcaigou();
            }
          });
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '完成', field: '', minWidth: 80,
        cellRenderer: (params) => {
          if (!params.data.finish && params.data.id) {
            return '<a target="_blank">完成</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (!params.data.finish && params.data.id) {
            sweetalert({
              title: '你确定要完成吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.caigouApi.finish(params.data.id).then(data => {
                this.toast.pop('success', '采购已完成！');
                this.getcaigou();
              });
              sweetalert.close();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '预付费用单价', field: 'yuguprice', minWidth: 150,
        enableRowGroup: true, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '费用明细', field: 'miaoshu', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货地址', field: 'innerjiaohuoaddr', minWidth: 80
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '采购量', field: 'caigouweight', minWidth: 80,
        onCellClicked: (params) => {
          // if (!params.data.print) {
          this.modifyweight['detid'] = params.data.id;
          this.modifyweight['caigouweight'] = params.data.caigouweight;
          console.log(params);
          this.weightModal.show();
          // } else {
          //   this.toast.pop('error', '采购单已经打印，采购量不允许修改！', '');
          //   return;
          // }

        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '钢厂合同量', field: 'gchtweight', minWidth: 100, editable: true,
        cellRenderer: (params) => {
          if (params.value === null || params.value === undefined) {
            return null;
          } else {
            return params.value;
          }
        },
        onCellValueChanged: (params) => {
          if (!params.data.id) {
            return;
          }
          if (params.data.finish) {
            this.toast.pop('warning', '已经完成不允许修改', '');
            return;
          }
          this.grno['detid'] = params.data.id;
          this.caigouApi.modifygchtweight({ gchtweight: params.newValue }, params.data.id).then(data => {
            this.toast.pop('success', '钢厂合同量修改成功！');
            this.getcaigou();
          });
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '入库量', field: 'rukuweight', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'tuihuoweight', minWidth: 80,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '采购单价', field: 'price', minWidth: 100,
        onCellClicked: (params) => {
          if (params.data.rukuweight === '0') {
            this.modifyprice['detid'] = params.data.id;
            console.log(params);
            this.priceModal.show();
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '采购金额', field: 'jine', minWidth: 100,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '收货机构', field: 'org', minWidth: 100,
        onCellClicked: (params) => {
          if (params.data.id) {
            this.modifyorg['detid'] = params.data.id;
            this.modifyorg['orgid'] = params.data.orgid;
            console.log(params);
            this.orgModal.show();
          }
        }
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '结算价格', field: 'jiesuanprice', minWidth: 80,
        onCellClicked: (data) => {
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.openjiesuan(data['data']['id']);
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['houduid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['houdu'], data['data']);
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['widthid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['width'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['beiqiid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['beiqi'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '<span font="red">颜色</span>', field: 'color', minWidth: 80,
        onCellClicked: (data) => {
          if (data.data.orderdetid !== null) {
            this.opencolormodifydialog(data.data.colorid, data.data.id);
          } else if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['color'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['ducengid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['duceng'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['caizhiid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['caizhi'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['pproid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['ppro'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['painttypeid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['painttype'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['qimoid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['qimo'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['tucengid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['tuceng'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['neijingid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['neijing'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['penmaid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['penma'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['packagetypeid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['packagetype'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.showgcmodify(data['data']['xiubianid'], data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['xiubian'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'weight', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opengongcha('weight', data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['weight'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '用途', field: 'yongtu', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opengongcha('yongtu', data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['yongtu'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '数量公差', field: 'gongcha', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opencount(data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.opencount(data['data']['id']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度公差', field: 'houdugongcha', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opengongcha('houdu', data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['houdugongcha'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度公差', field: 'widthgongcha', minWidth: 80,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opengongcha('width', data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.showdetmodify(data['data']['widthgongcha'], data['data']);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货日期', field: 'jiaohuodate', minWidth: 100,
        enableRowGroup: true, valueFormatter: data => {
          return this.datepipe.transform(data.value, 'y-MM-dd');
        },
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.opendate(data['data']['id'], data.value);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.opendate(data['data']['id'], data.value);
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '期货合同ID', field: 'orderid', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.orderid) {
            return '<a target="_blank" href="#/qihuo/' + params.data.orderid + '">' + params.data.orderid + '</a>';
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data.id && params.data.rukuweight === '0') {
            return '<a target="_blank">删除</a>';
          } else {
            return '';
          }
        }, onCellClicked: (params) => {
          if (params.data.id && params.data.rukuweight === '0') {
            sweetalert({
              title: '你确定要删除吗？',
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#23b7e5',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnConfirm: false
            }, () => {
              this.caigouApi.deletedet(params.data.id).then(data => {
                this.toast.pop('success', '删除成功！');
                this.getcaigou();
              });
              sweetalert.close();
            });
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '预估吨毛利', field: 'yugumaoliprice', minWidth: 150 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 150,
        onCellClicked: (data) => {
          // if (!this.caigou['isv'] && data['data']['orderdetid'] === null && this.caigou['status'] === 0) {
          //   this.openbeizhu(data['data']['id']);
          // }
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.openbeizhu(data['data']['id']);
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'jiesuantype', minWidth: 100 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '交货仓库', field: 'jhcangku', minWidth: 150,
        onCellClicked: (data) => {
          if (data['data']['orderdetid'] === null && data['data'].rukuweight === '0') {
            this.openjhcangku(data['data']['id']);
          }
        }
      }
    ];
  }

  ngOnInit() {
    this.getcaigou();
  }
  orgclose() {
    this.orgModal.hide();
  }
  getcaigou() {
    this.jiaohuoaddrs = [];
    this.caigouApi.getCaigou(this.actroute.params['value']['id']).then(data => {
      // 如果已经发送BPM审批且已经审核通过
      if (data.caigou.isv === true && data.caigou.tiaohuocgprocessid != null) {
        this.isgz = true;
      } else {
        this.isgz = false;
      }
      this.caigou = data.caigou;
      // if (data.caigou.kind === 1) {
      //   this.flag['qihuo'] = true;
      // } else {
      //   this.flag['qihuo'] = false;
      // }
      // console.log('saaaa', this.storage.getObject('cuser'));
      // if (data.caigou.status === 0 && this.storage.getObject('cuser').id === data.caigou.cuserid) {
      // this.flag['tijiao'] = true;
      // this.flag['shenhe'] = false;
      // this.flag['qishen'] = false;
      // }else if (data.caigou.status === 1 && this.storage.getObject('cuser').id === data.caigou.vuserid) {
      //   this.flag['tijiao'] = false;
      //   this.flag['shenhe'] = true;
      //   this.flag['qishen'] = false;
      // }else if (data.caigou.status === 2 && this.storage.getObject('cuser').id === data.caigou.vuserid) {
      //   this.flag['tijiao'] = false;
      //   this.flag['shenhe'] = false;
      //   this.flag['qishen'] = true;
      // }else {
      //   this.flag['tijiao'] = false;
      //   this.flag['shenhe'] = false;
      //   this.flag['qishen'] = false;
      // }
      this.cg['jiaohuoaddr'] = data.caigou.jiaohuoaddr;
      this.cg['beizhu'] = data.caigou.beizhu;
      this.cg['id'] = data.caigou.id;
      this.gridOptions.api.setRowData(data.caigoudet);
    });
  }
  adddet() {
    this.nextflag = false;
    this.zhuanhuos = [{ value: '', label: '全部' }, { value: true, label: '转货' }, { value: false, label: '不转货' }];
    this.selectNull();
    this.jiaohuodate = undefined;
    this.gns = [];
    this.classifyApi.getGnAndChandi().then(data => {
      data.forEach(element => {
        this.gns.push({
          label: element.name,
          value: element
        });
      });
      console.log('gns11', this.gns);
      // data.join();
    });
    this.classicModal.show();
    // this.nselect.active = [];
  }
  addmdmdet() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许重复插入！');
      return;
    }
    this.nextflag = false;
    this.selectNull();
    this.zhuanhuos = [{ value: '', label: '全部' }, { value: true, label: '转货' }, { value: false, label: '不转货' }];
    this.jiaohuodate = undefined;
    this.mdmclassicModal.show();
  }
  addmdm() {
    if (!this.det['price']) { this.toast.pop('error', '采购单价不能为空！', ''); return; }
    if (!this.det['caigouweight'] || this.det['caigouweight'] === '0') { this.toast.pop('error', '采购量不能为空不能为零！', ''); return; }
    if (this.jiaohuodate) {
      this.det['jiaohuodate'] = this.datepipe.transform(this.jiaohuodate, 'y-MM-dd');
    }
    if (!this.det['jiaohuodate'] || this.det['jiaohuodate'] === null) { this.toast.pop('error', '交货日期必填！', ''); return; }
    if (!this.det['oneweight'] || this.det['oneweight'] === null || this.det['oneweight'] === '0') {
      this.toast.pop('error', '单卷重不能为空不能为零！', '');
      return;
    }
    if (this.det['zhuanhuo'] === '') { this.toast.pop('error', '货权是否转移必选！', ''); return; }
    if (this.det['zhuanhuo'] === true) {
      if (this.det['orgid'] === '') { this.toast.pop('error', '转货必须选收货机构！', ''); return; }
      if (this.det['orgid'] === '670') { this.toast.pop('error', '转货不允许选择涂镀应用艺术为收货机构！', ''); return; }
    }
    if (this.det['detid']) {
      this.caigouApi.modifymdmcaigoudet(this.det).then(data => {
        this.getcaigou();
        this.mdmclassicModal.hide();
      });
    } else {
      this.caigouApi.adddet(this.det).then(data => {
        this.getcaigou();
        this.mdmclassicModal.hide();
      });
    }
  }
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
  selectedgn(value) {
    console.log('0002', value);
    this.cs = [];
    if (this.chandis.length > 0) {
      this.chandis = [];
    }
    this.showGuige = false; // 选择品名时
    this.det['gn'] = value.id;
    this.det['chandi'] = '';
    this.cs = value.attrs;
    this.cs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
    this.isChandi = true;
    console.log('chandis', this.chandis);
  }
  selectedchandi(value) {
    console.log('c', value);
    this.det['guige'] = [];
    this.det['chandi'] = value;
    this.attrs = [];
    this.classifyApi.getAttrs(value).then(data => {
      this.guigelength = data['length'];
      console.log('guige', data);
      this.attrs = data;
    });
    this.showGuige = true;
    console.log('attr', this.attrs);
    this.houdugongchas = [];
    this.widthgongchas = [];
    this.yongtus = [];
    this.oneweights = [];
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.caigou['chandiid']) {
          console.log('确定产地的', element);
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
  selectedguige(value, id) {
    if (this.det['guige'].length > 0) {
      for (let i = 0; i < this.det['guige'].length; i++) {
        if (this.det['guige'][i].name === id) {
          this.det['guige'].splice(i, 1);
        }
      }
    }
    // 备注需求 如果是彩涂，且是烨辉彩涂，那么油漆对应颜色重新选择
    if (this.caigou['chandiid'] == 8) {
      if (id == "painttypeid") {
        if (this.chandis[2].value = 8) {
          this.classifyApi.getAttrs(value).then(data => {
            if (data.length != 0) {
              this.attrs = this.attrs.filter(item => item.name != 'colorid');
              //this.attrs.push(data[0]);
              this.attrs.splice(8, 0, data[0]);
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
    this.det['guige'].push({ name: id, value: value });
    console.log('op', this.det);
  }
  close() {
    this.classicModal.hide();
  }
  mdmclose() {
    this.mdmclassicModal.hide();
  }
  supplierclose() {
    this.supplierModal.hide();
  }
  weightclose() {
    this.weightModal.hide();
  }
  priceclose() {
    this.priceModal.hide();
  }
  selectNull() {
    this.goodscode = {};
    this.chandis = [];
    this.det = {
      gn: null,
      chandi: null,
      guige: [],
      caigouid: this.actroute.params['value']['id'],
      caigouweight: null,
      price: '0.00',
      beizhu: '',
      jiaohuodate: null,
      weight: '',
      yongtu: '',
      gongcha: '',
      houdugongcha: '',
      widthgongcha: '',
      jiesuanprice: '0.00',
      zhuanhuo: '',
      orgid: '',
      jhcangkuid:''
    };
    this.isChandi = false;
    this.showGuige = false;
  }
  add() {
    console.log('op', this.det);
    console.log('opsss', this.attrs);
    if (!this.det['price']) { this.toast.pop('error', '采购单价不能为空！', ''); return; }
    if (!this.det['caigouweight'] || this.det['caigouweight'] === '0') { this.toast.pop('error', '采购量不能为空不能为零！', ''); return; }
    if (this.jiaohuodate) {
      this.det['jiaohuodate'] = this.datepipe.transform(this.jiaohuodate, 'y-MM-dd');
    }
    if (!this.det['jiaohuodate'] || this.det['jiaohuodate'] === null) { this.toast.pop('error', '交货日期必填！', ''); return; }
    if (!this.det['oneweight'] || this.det['oneweight'] === null || this.det['oneweight'] === '0') {
      this.toast.pop('error', '单卷重不能为空不能为零！', '');
      return;
    }
    if (this.det['zhuanhuo'] === '') { this.toast.pop('error', '货权是否转移必选！', ''); return; }
    if (this.det['zhuanhuo'] === 'true') {
      if (this.det['orgid'] === '') { this.toast.pop('error', '转货必须选收货机构！', ''); return; }
      if (this.det['orgid'] === '670') { this.toast.pop('error', '转货不允许选择涂镀应用艺术为收货机构！', ''); return; }
    }
    this.caigouApi.adddet(this.det).then(data => {
      // this.gridOptions.api.setRowData(data);
      this.getcaigou();
      this.classicModal.hide();
    });
  }
  selectstart() { }
  // 引入期货明细
  importdet() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许重复引入！');
      return;
    }
    this.bsModalService.config.class = 'modal-all';
    this.cgbsModalRef = this.bsModalService.show(CaigoudetimportComponent);
    this.cgbsModalRef.content.parentthis = this;
  }
  // 添加资源号
  // confirmgrno() {
  //   if (!this.grno['grno']) {
  //     this.toast.pop('error', '没有填写资源号！', '');
  //     return;
  //   }
  //   this.caigouApi.addgrno(this.grno).then(data => {
  //     this.toast.pop('success', '添加资源号成功！');
  //     this.getcaigou();
  //     this.grnoclose();
  //   });
  // }
  // 修改采购量
  confirmweight() {
    if (!this.modifyweight['caigouweight'] || this.modifyweight['caigouweight'] === '0' || this.modifyweight['caigouweight'] < 0) {
      this.toast.pop('error', '采购量不能为空或不能为零或不能为负！', '');
      return;
    }
    this.caigouApi.modifyweight(this.modifyweight).then(data => {
      this.toast.pop('success', '采购量修改成功！');
      this.getcaigou();
      this.weightclose();
    });
  }
  // 添加采购单价
  confirmprice() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许重复添加！');
      return;
    }

    if (!this.modifyprice['price'] || this.modifyprice['price'] === '0' || this.modifyprice['price'] < 0) {
      this.toast.pop('error', '采购单价不能为空或不能为零或不能为负！');
      return;
    }
    this.caigouApi.modifyprice(this.modifyprice).then(data => {
      this.toast.pop('success', '采购单价添加成功！');
      this.getcaigou();
      this.priceclose();
    });
  }
  //修改收货机构
  confirmorg() {
    this.caigouApi.modifyorg(this.modifyorg).then(data => {
      this.toast.pop('success', '机构修改成功！');
      this.getcaigou();
      this.orgclose();
    });
  }
  deletecaigou() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许删除！');
      return;
    }
    this.caigouApi.deletecaigou(this.actroute.params['value']['id']).then(data => {
      this.toast.pop('success', '采购单删除成功！');
      this.router.navigate(['caigou']);
    });
  }
  jiaohuoaddr() {
    if (this.cg['jiaohuoaddr'] !== this.caigou['jiaohuoaddr']) {
      this.caigouApi.modifyjiaohuoaddr(this.cg).then(data => {
        this.toast.pop('success', '交货地址修改成功！');
        this.closeaddr();
        this.getcaigou();
      });
    }
  }
  modbeizhu() {
    if (this.cg['beizhu'] !== this.caigou['beizhu']) {
      this.caigouApi.modifybeizhu(this.cg).then(data => {
        this.toast.pop('success', '备注修改成功！');
        this.getcaigou();
      });
    }
  }
  // 颜色，色号修改
  opencolormodifydialog(classifyid, detid) {
    this.colors = [];
    // 获取颜色列表
    this.classifyApi.getBrothernode({ classifyid: classifyid }).then(data => {
      data.forEach(element => {
        this.colors.push({
          value: element.id,
          label: element.name
        });
      });
    });
    this.color['detid'] = detid;
    this.colormodify.show();
  }
  closecolormodifydialog() {
    this.colormodify.hide();
  }

  modifycolor() {
    console.log(this.color);
    const model = { colorid: this.color['id'] };
    this.qihuoapi.modifycolor(this.color['detid'], model).then(data => {
      this.closecolormodifydialog();
      this.toast.pop('success', '修改成功');
      this.getcaigou();
    });
  }
  reload() {
    this.caigouApi.reloadcg(this.actroute.params['value']['id']).then(data => {
      this.toast.pop('success', data.msg);
    });
  }
  print() {
    this.caigouApi.cgprint(this.actroute.params['value']['id']).then(data => {
      if (!data.flag) {
        this.toast.pop('warning', data.msg);
      } else {
        window.open(data.msg);
      }
    });
  }
  // 提交审核
  submitcg() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许重复提交！');
      return;
    }
    if (confirm('确认要提交审核吗？')) {
      this.caigouApi.submitcg(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '提交成功');
        this.getcaigou();
      });
    }
  }
  verifycg() {
    if (confirm('确认要审核吗？')) {
      this.caigouApi.verifycg(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '审核成功');
        this.getcaigou();
      });
    }
  }
  opensupplier() {
    this.supplier = { supplierid: '', id: '' };
    this.supplier['id'] = this.actroute.params['value']['id'];
    this.supplierModal.show();
  }
  confirmsupplier() {
    if (this.supplier['supplierid'] instanceof Object) {
      this.supplier['supplierid'] = this.supplier['supplierid'].code;
    } else {
      this.supplier['supplierid'] = null;
    }
    if (this.supplier['supplierid'] === null) {
      this.toast.pop('error', '请填写供应商！', '');
      return;
    }
    this.caigouApi.modifysupplier(this.supplier).then(data => {
      this.toast.pop('success', '供应商修改成功');
      this.getcaigou();
    });
    this.supplierclose();
  }
  back() {
    if (confirm('确认要回退吗？')) {
      this.caigouApi.backcg(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '回退成功');
        this.getcaigou();
      });
    }
  }
  refuse() {
    if (confirm('确认要弃审吗？')) {
      this.caigouApi.refusecg(this.actroute.params['value']['id']).then(data => {
        this.toast.pop('success', '弃审成功');
        this.getcaigou();
      });
    }
  }
  // 修改规格
  showgcmodify(oldvalueid, caigoudetid) {
    if (!oldvalueid) {
      return;
    }
    // if (!this.caigou['isv']) {
    this.values = [];
    this.newattrid = null;
    this.modifygccaigoudetid = null;
    this.modifygccaigoudetid = caigoudetid;
    const model = { classifyid: oldvalueid };
    this.classifyApi.getParentNode(oldvalueid).then(data => {
      this.attrname = data['value'];
    });
    this.classifyApi.getBrothernode(model).then(data => {
      this.values = [];
      data.forEach(element => {
        this.values.push({
          value: element.id,
          label: element.name
        });
      });
    });
    this.gcmodify.show();
    // }
  }
  modifygc() {
    const model = { name: this.attrname, value: this.newattrid };
    this.caigouApi.modifygc(this.modifygccaigoudetid, model).then(data => {
      this.closegcmodify();
      this.toast.pop('success', '修改成功');
      this.getcaigou();
    });
  }
  closegcmodify() {
    this.gcmodify.hide();
  }
  closeaddr() {
    this.addrmodify.hide();
  }
  openaddr() {
    this.jiaohuoaddrs = [];
    const chandigongchaparam = { gn: this.caigou['gn'], chandi: this.caigou['chandi'] };
    this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
      for (let index = 0; index < chandigongchas.length; index++) {
        const element = chandigongchas[index];
        if (element.value === 'jiaohuoaddr') {
          this.jiaohuoaddrs = element.options;
          break;
        }
      }
    });
    this.addrmodify.show();
  }
  closegongchamodify() {
    this.gongchamodify.hide();
  }
  closedateModal() {
    this.dateModal.hide();
  }
  closecount() {
    this.countmodify.hide();
  }
  opengongcha(type, detid) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = type;
    this.gongchas = [];
    this.qihuoapi.getchandigongcha().then(a => {
      a.forEach(element => {
        if (element['chandiid'] === this.caigou['chandiid']) {
          console.log('确定产地的', element);
          if (type === 'yongtu') {
            element.attr.yongtu.forEach(addr => {
              this.gongchas.push({
                value: addr.value,
                label: addr.value
              });
            });
          } else if (type === 'weight') {
            element.attr.oneweight.forEach(addr => {
              this.gongchas.push({
                value: addr.value,
                label: addr.value
              });
            });
          } else if (type === 'houdu') {
            element.attr.houdugongcha.forEach(addr => {
              this.gongchas.push({
                value: addr.value,
                label: addr.value
              });
            });
          } else if (type === 'width') {
            element.attr.widthgongcha.forEach(addr => {
              this.gongchas.push({
                value: addr.value,
                label: addr.value
              });
            });
          }
        }
      }); // dataforeach
    }); // qihuoapi
    this.gongchamodify.show();
  }
  closecangku() {
    this.cangkuModal.hide();
  }
  modifygongcha() {
    if (this.gongchaModel['name'] === '') {
      this.closegongchamodify();
      this.closecount();
      this.closebeizhu();
      this.closejiesuan();
      this.closecangku();
      return;
    }
    this.caigouApi.modifygongcha(this.gongchaModel).then(data => {
      this.closegongchamodify();
      this.closecount();
      this.closebeizhu();
      this.closejiesuan();
      this.closecangku();
      this.toast.pop('success', '修改成功');
      this.getcaigou();
    });
  }
  opendate(detid, date) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = 'date';
    this.jiaohuodate = new Date(date);
    this.dateModal.show();
  }
  openjhcangku(detid) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = 'jhcangku';
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
    this.cangkuModal.show();
  }
  datemodify() {
    if (this.jiaohuodate) {
      this.gongchaModel['name'] = this.datepipe.transform(this.jiaohuodate, 'y-MM-dd');
    }
    this.closedateModal();
    this.modifygongcha();
  }
  opencount(detid) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = 'count';
    this.countmodify.show();
  }
  closebeizhu() {
    this.beizhumodify.hide();
  }
  openbeizhu(detid) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = 'beizhu';
    this.beizhumodify.show();
  }
  selectezhuanhuo(value) {
    this.det['zhuanhuo'] = value.id;
  }
  next() {
    if (this.attrs.length !== this.det['guige'].length) { this.toast.pop('error', '请把属性填写完整再提交！', ''); return; }
    this.nextflag = true;
    this.nselect.active = [];
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
      this.nextflag = true;
      this.det['gcid'] = good.id;
      const chandigongchaparam = { gn: good['gn'], chandi: good['chandi'] };
      this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
        this.chandigongchas = [];
        for (let index = 0; index < chandigongchas.length; index++) {
          const element = chandigongchas[index];
          if (element.value !== 'jiaohuoaddr') {
            this.chandigongchas.push(element);
          }
        }
        if (this.editTempParam.detdata) {
          this.det['houdugongcha'] = this.editTempParam.detdata['houdugongcha'];
          this.det['widthgongcha'] = this.editTempParam.detdata['widthgongcha'];
          this.det['gongcha'] = this.editTempParam.detdata['gongcha'];
          this.det['yongtu'] = this.editTempParam.detdata['yongtu'];
          this.jiaohuodate = new Date(this.editTempParam.detdata['jiaohuodate']);
          this.det['oneweight'] = this.editTempParam.detdata['weight'];
          this.det['detid'] = this.editTempParam.detdata['id'];
          this.det['caigouweight'] = this.editTempParam.detdata['caigouweight'];
          this.det['price'] = this.editTempParam.detdata['price'];
          if (this.editTempParam.detdata['zhuanhuo'] === '转货') {
            this.det['zhuanhuo'] = true;
          } else {
            this.det['zhuanhuo'] = false;
          }
          this.det['orgid'] = this.editTempParam.detdata['orgid'];
          this.det['jiesuanprice'] = this.editTempParam.detdata['jiesuanprice'];
          this.det['beizhu'] = this.editTempParam.detdata['beizhu'];
          this.det['jhcangku'] = this.editTempParam.detdata['jhcangku'];
        }
      });
    });
  }
  /**修改采购mdm明细 */
  showdetmodify(oldvalueid, caigoudet) {
    if (!oldvalueid) { return; }
    this.nextflag = false;
    this.selectNull();
    this.zhuanhuos = [{ value: '', label: '全部' }, { value: true, label: '转货' }, { value: false, label: '不转货' }];
    this.jiaohuodate = undefined;
    this.goodscode = { gn: caigoudet['goodscode']['gn'] };
    this.mdmService.getMdmAttributeDic({ itemcode: caigoudet['goodscode']['gncode'] }).then(data1 => {
      this.showGuige = true;
      this.attrs = data1;
      this.goodscode = caigoudet['goodscode'];
    });
    this.editflag.zhidan = true;
    this.editTempParam.detdata = caigoudet;
    this.mdmclassicModal.show();
  }
  fanhui() {
    this.nextflag = false;
  }
  closejiesuan() {
    this.jiesuanmodify.hide();
  }
  openjiesuan(detid) {
    this.gongchaModel = { detid: '', type: '', name: '', id: '' };
    this.gongchaModel['detid'] = detid;
    this.gongchaModel['id'] = this.actroute.params['value']['id'];
    this.gongchaModel['type'] = 'jiesuan';
    this.jiesuanmodify.show();
  }
  //钢厂信息修改
  showgcinfodialog() {
    this.gcinfodialog.show();
  }
  closegcinfodialog() {
    this.gcinfodialog.hide();
  }
  // 盖章消息推送
  showgaizhanglog() {
    this.gaizhanglog.show();
  }
  closegaizhanglog() {
    this.gaizhanglog.hide();
  }
  selectmonth(value) {
    this.caigou['month'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }
  modifygcinfo() {
    const caigouid = this.actroute.params['value']['id'];
    this.caigouApi.modifyGcinfo({ gcmonth: this.caigou['month'] }, caigouid).then(data => {
      this.getcaigou();
      this.closegcinfodialog();
    });
  }
  // 盖章提醒
  submitgaizhang() {
    const caigouid = this.actroute.params['value']['id'];
    this.caigouApi.submitgaizhang(this.gzuser.code, caigouid).then(data => {
      this.getcaigou();
      this.closegaizhanglog();
    });
  }
  openarea() {
    this.classifyApi.listBypid({ pid: 3814 }).then((data) => {
      console.log(data);
      const arealist = [{ label: '请选择仓库所在区域', value: '' }];
      data.forEach(element => {
        arealist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.areas = arealist;
    });
    this.areamodify.show();
  }
  closearea() {
    this.areamodify.hide();
  }
  submitarea() {
    console.log(this.cg);
    this.caigouApi.modifyjiaohuoaddr(this.cg).then(data => {
      this.toast.pop('success', '交货地址修改成功！');
      this.closearea();
      this.getcaigou();
    });
  }
  // 合同上传弹窗
  contractUploader() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许重复上传！');
      return;
    }
    this.hetongdialog.show();
  }
  //合同上传信息及格式
  uploadParam: any = { module: 'qihuo', count: 1, sizemax: 5, extensions: ['doc', 'pdf', 'png', 'jpg'] };
  // 设置上传的格式
  accept = null;// ".xls, application/xls";
  // 上传成功执行的回调方法
  upcontract($event) {
    console.log($event);
    const model = { caigouid: this.actroute.params['value']['id'], url: $event.url };
    if ($event.length !== 0) {
      this.caigouApi.uploadcontract(model).then(data => {
        this.toast.pop('success', '上传成功！');
      });
    }
    this.hideuploadDialog();
  }
  // 关闭上传弹窗
  hideuploadDialog() {
    this.hetongdialog.hide();
  }
  lookContract() {
    this.caigouApi.lookContract(this.actroute.params['value']['id']).then(data => {
      console.log(data);
      if (!data['flag']) {
        this.toast.pop('warning', data['msg']);
      } else {
        window.open(data['msg']);
      }
    });
  }
  caigoudetids: any = [];
  //批量删除明细
  deletecaigoudet() {
    if (this.caigou['tiaohuocgprocessid'] !== null) {
      this.toast.pop('error', '已经提交审核，不允许删除！');
      return;
    }
    this.caigoudetids = new Array();
    const caigoudetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < caigoudetlist.length; i++) {
      if (caigoudetlist[i].selected && caigoudetlist[i].data && caigoudetlist[i].data['gn'] !== '合计') {
        this.caigoudetids.push(caigoudetlist[i].data.id);
      }
    }
    if (!this.caigoudetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.caigouApi.deletecaigoudet(this.caigoudetids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.getcaigou();
      });
    }
  }
  openbuyer() {
    this.buyer = { buyerid: '', id: '' };
    this.buyer['id'] = this.actroute.params['value']['id'];
    this.buyerModal.show();
    this.findWiskind();
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
  confirmbuyer() {
    if (this.buyer['buyerid'] === null) {
      this.toast.pop('error', '请填写采购单位！', '');
      return;
    }
    this.caigouApi.modifybuyer(this.buyer).then(data => {
      this.toast.pop('success', '采购单位修改成功');
      this.getcaigou();
    });
    this.buyerclose();
  }
  buyerclose() {
    this.buyerModal.hide();
  }
  querymat() {
    if (this.det['matcode'] && this.det['matcode'].trim()) {
      this.qihuoapi.getmat(this.det['matcode']).then(mat => {
        this.goodscode = { gn: mat['gn'] };
        if (!mat['gncode']) {
          this.toast.pop('warning', '没有品名编码！');
          return;
        }
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

  showAddFee() {
    this.lines = [];
    const ids = new Array();
    const dets = this.gridOptions.api.getModel()['rowsToDisplay'];
    let count = 0;
    for (let i = 0; i < dets.length; i++) {
      if (dets[i].selected && dets[i].data) {
        count++;
        ids.push(dets[i].data.id);
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择明细');
      return '';
    }
    this.feemodel['ids'] = ids;
    this.addFeeModal.show();
    this.getCategory();
    console.log(1111111);
    console.log(ids);
    console.log(ids[0]);
    if (ids.length === 1) {
      this.caigouApi.getYugufeeList(ids[0]).then(data => {
        this.lines = data;
        for (let i = 0; i < this.lines.length; i++) {
          this.lines[i]['feecustomer'] = data[i]['feecustomer']['name'];
          this.feemodel['id'] = data[i]['id'];
        }
        console.log(this.lines);
        this.getcaigou();
      });
    }
  }
  // 控制显示添加框
  showInput() {
    this.isshowInput = !this.isshowInput;
  }
  feetypes = [{ value: '1', label: '汽运费' },
  { value: '2', label: '铁运费' },
  { value: '3', label: '船运费' },
  { value: '4', label: '出库费' },
  { value: '5', label: '开平费' },
  { value: '6', label: '纵剪费' },
  { value: '7', label: '销售运杂费' },
  { value: '8', label: '包装费' },
  { value: '9', label: '仓储费' },
  { value: '10', label: '保险费' },
  { value: '13', label: '入库费' }];

  categorys = [
    { value: 0, label: '钢厂代运' },
    { value: 1, label: '我司承运' },
    { value: 2, label: '无' },
  ];
  category = '';
  getCategory() {
    console.log(this.feemodel['chengyun']);
    let category = this.feemodel['chengyun'];
    if (category === null || category === undefined) {
      this.category = '';
    } else if (category === 1) {
      this.category = '我司承运';
    } else if (category === 0) {
      this.category = '钢厂代运';
    } else {
      this.category = '';
    }
  }
  // 费用合计
  feeHeji: number = 0;
  lines: any[] = [];//插行控制器
  insertline() {//插行
    this.getCategory();
    if (!this.feemodel['feetype']) {
      this.toast.pop('warning', '费用类型不能为空');
      return;
    }
    if (!this.feemodel['price']) {
      this.toast.pop('warning', '费用单价不能为空');
      return;
    }
    if (!this.feemodel['feecustomer']['code']) {
      this.toast.pop('warning', '费用单位不能为空');
      return;
    }
    if ((this.feemodel['feetype'] === '1' || this.feemodel['feetype'] === '2' || this.feemodel['feetype'] === '3')
      && (this.feemodel['chengyun'] === undefined || this.feemodel['chengyun'] === null)) {
      this.toast.pop('warning', '请选择承运类型!');
      return;
    }
    this.caigouApi.addYuguFee(this.feemodel).then(data => {
      this.getcaigou();
    });
    this.feeHeji = this.feeHeji['add'](this.feemodel['price']);
    this.lines.push(
      {
        id: new Date().getTime(),
        type: this.feemodel['feetype'],
        yuguprice: this.feemodel['price'],
        feecustomer: this.feemodel['feecustomer']['name'],
        chengyun: this.feemodel['chengyun']
      }
    )
    this.isshowInput = !this.isshowInput;
    this.feemodel['fees'] = this.lines;
  }

  delorderfee(index, yuguprice) {
    this.lines.splice(index, 1);
    this.feeHeji = this.feeHeji['sub'](yuguprice);
    this.caigouApi.deleteyugufee(this.feemodel['id']).then(data => {
      this.getcaigou();
    });
  }
  feeadddialogclose() { this.addFeeModal.hide(); }
  addYuguFee() {
    this.addFeeModal.hide();
  }
  jstypeShow(){
    this.jiesuantypeModal.show();
  }
  jiesuantypclose(){
    this.jiesuantypeModal.hide();
  }
  showmodifyJiesuanType() {
    this.caigoudetids = new Array();
    const caigoudetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < caigoudetlist.length; i++) {
      if (caigoudetlist[i].selected && caigoudetlist[i].data && caigoudetlist[i].data['gn'] !== '合计') {
        this.caigoudetids.push(caigoudetlist[i].data.id);
      }
    }
    if (!this.caigoudetids.length) {
      this.toast.pop('warning', '请选择明细之后再修改！');
      return;
    }
    this.jstype['detids'] = this.caigoudetids;
    this.jstypeShow();
  }
  confirmjstype(){
    this.caigouApi.modifyjiesuantype(this.jstype).then(data => {
      this.getcaigou();
    });
    this.jiesuantypclose();
  }

}
