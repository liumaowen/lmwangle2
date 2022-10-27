import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { GridOptions } from 'ag-grid';
import { DatePipe } from '@angular/common';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';
import { CaigouService } from 'app/routes/caigou/caigou.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-magangadd',
  templateUrl: './magangadd.component.html',
  styleUrls: ['./magangadd.component.scss']
})
export class MaGangAddComponent implements OnInit {
  wuliunotice: any = { enddest: '', id: null, wuliuuserid: null, transporttype: null, ispieces: false };
  caigoudetList: any = [];
  selectQihuodetWuliubaojia: any = [];
  parentThis;
  addr = {};
  provinces1 = []; // 起始地省
  citys1 = []; // 起始地市
  countys1 = []; // 起始地县
  provinces = []; // 目的地省
  citys = []; // 目的地市
  countys = []; // 目的地县
  jiaoqi1: Date = new Date();
  updateDet: any = { ordermodal1:null,id: null, wuliuuserid: null, jibanhoudu: null, jiaoqi1:null,params:null,data:null,transporttype: null};
  changeordermodal1={transporttype:null,ordermodal1:null};
  ordermodal1=[{value:'1',label:'默认模板'},{value:'2',label:'马钢模板'}];
  magang={transporttype:null};
  transporttype = [{ label: '请选择。。。', value: null }, { label: '汽运', value: 1 }, { label: '铁运', value: 2 }, { label: '船运', value: 3 }];
  cuser = {};
  wuluiorderlist: any = [];
  requestparams = {};
  newdate = new Date();
  gridOptions: GridOptions;
  addPro: any = {};
  rowData: any = [];
  selectRowData: any = {};
  slitlist: any = []; // 加工成品规格
  cangkus = [];
  // updateDet = {};
  results: any;
  constructor(
    public bsModalRef: BsModalRef,
    public settings: SettingsService,
    private toast: ToasterService,
    private addressparseService: AddressparseService,
    private classifyapi: ClassifyApiService,
    private caigouApi: CaigouService,
    private actroute: ActivatedRoute,
    private qihuoapi: QihuoService,
    private datepipe: DatePipe,
    private matchcarApi: MatchcarService,
    private userapi: UserapiService) {
    this.gridOptions = {
      enableFilter: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60,},
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 20, },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 40, },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层结构', field: 'tuceng', minWidth: 50,},
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 45,},
      { cellStyle: { 'text-align': 'center' }, headerName: '聚酯', field: 'painttype', minWidth: 65,},
      { cellStyle: { 'text-align': 'center' }, headerName: '面漆颜色', field: 'mianqi', minWidth: 75,},
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆颜色', field: 'diqi', minWidth: 75,},
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层重量', field: 'duceng', minWidth: 70,},
      { cellStyle: { 'text-align': 'center' }, headerName: '用途', field: 'yongtu', minWidth: 45,},
      { cellStyle: { 'text-align': 'center' }, headerName: '基板厚度', field: 'jibanhoudu', minWidth: 60,editable: true,
         onCellValueChanged: (params) => {
            this.modifyattr(params, '基板厚度')
          }
        },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80,},
      { cellStyle: { 'text-align': 'center' }, headerName: '背面油漆是否要马钢喷漆', field: 'penma1', minWidth: 30,},
      { cellStyle: { 'text-align': 'center' }, headerName: '交期', field: 'jiaoqi1', minWidth: 70,
      editable: true,
        valueFormatter: data => {
          if ((data.value + '').indexOf('->') !== -1) {
            return data.value;
          }
          else {
            return this.datepipe.transform(data.value, 'y-MM-dd');
          }
        },
        onCellValueChanged: (params) => { this.modifyattr(params, '交货日期') }
    },

    ];
  }

  ngOnInit() {
      setTimeout(() => {
      this.shownoticewuliuyuan();
    }, 0);
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }

/**选择物流员弹窗 */
shownoticewuliuyuan() {
  this.wuliunotice = { ispieces: false, isshouhuosign: false };
  this.caigoudetList = this.parentThis.noticewuliuparams['qihuodets'];
  this.changeordermodal1=this.parentThis.noticewuliuparams['changeordermodal1']
  // 竞价的单据来源，1是现货,5是调拨,6是加工,7是在途 新增7 by cl 20210630
  this.wuliunotice['datasource'] = this.parentThis.noticewuliuparams['datasource'];
  this.rowData = this.caigoudetList;
  this.caigoudetList.forEach(ele => {  
    ele['isjiagongname'] = '否';
    ele['isjiagong'] = false;
    if (this.wuliunotice['datasource'] === 1 || this.wuliunotice['datasource'] === 5) {
      ele.isedit = false;
    } else {
      ele.isedit = true;
    }
  });
  this.wuliunotice['detids'] = this.parentThis.noticewuliuparams['detids'];
  this.getProvince();
}
getProvince() {
  this.provinces = [];
  this.classifyapi.getChildrenTree({ pid: 263 }).then((data) => {
    data.forEach(element => {
      this.provinces.push({
        label: element.label,
        value: element.id
      });
    });
    this.citys = [];
    this.countys = [];
    this.provinces1 = this.provinces;
    this.citys1 = [];
    this.countys1 = [];
  });
}
  
  transporttype1(){
    this.caigouApi.modifytransporttype1(this.parentThis.caigou.id,this.magang ).then(data => {
    });
  }

 // 生成PDF
 @ViewChild('ordermodalchange') private ordermodalchange: ModalDirective;
  reload1() {
    this.changeordermodal1['ordermodal1'] = this.parentThis.changeordermodal1.ordermodal1;
    this.changeordermodal1['transporttype'] = this.parentThis.changeordermodal1.transporttype;
    this.caigouApi.reloadcg(this.parentThis.caigou.id, this.parentThis.changeordermodal1).then(data => {
      this.toast.pop('success', data.msg);
      if (data) {
        this.bsModalRef.hide();
        this.parentThis.wuliunoticehide();
      }
      this.hideordermodalchange() ;
      this.hideaddfield() ;
      this.hideadd1field();
      this.hidecaigouaddfield();
      this.bsModalRef.hide()
      this.parentThis.wuliunoticehide();
    });
  }
  hideordermodalchange() {
    this.ordermodalchange.hide();
  }
  ordermodalchangeshow() {
   this.ordermodalchange.show();
  }
    // 添加的明细中的数据修改
    modifyattr(params, type) {
      if (type === '交货期限' && params.newValue === params.oldValue) {
        return;
      }
      this.changeordermodal1['data'] = params.data;
      this.changeordermodal1['jiaoqi1'] = params.data.jiaoqi1;
      this.changeordermodal1['jibanhoudu'] = params.data.jibanhoudu;
      this.changeordermodal1['ordermodal1'] = this.parentThis.changeordermodal1.ordermodal1;
      this.changeordermodal1['transporttype'] = this.parentThis.changeordermodal1.transporttype;
      console.log(this.parentThis)
      // this.caigouApi.reloadcg(this.parentThis.caigou.id,this.parentThis.noticewuliuparams.qihuodets).then(data => {
      this.caigouApi.modifyjiaohuodate(this.parentThis.caigou.id,this.parentThis.noticewuliuparams.qihuodets).then(data => {
        this.toast.pop('success', '修改成功');
      });
      }

           /**采购马钢手动弹窗 */
           @ViewChild('caigouaddfield') private caigouaddfield: ModalDirective;
           hidecaigouaddfield() {
             this.caigouaddfield.hide();
           }
           caigouaddfieldshow() {
           this.caigouaddfield.show();
           }
           
// 马钢模板手动输入字段值
 @ViewChild('caigoudetaddfield') private caigoudetaddfield: ModalDirective;
 hideaddfield() {
  this.caigoudetaddfield.hide();
}
addfieldshow() {
  this.caigoudetaddfield.show();
}

// 马钢模板手动输入字段值
@ViewChild('caigoudetsfield') private caigoudetsfield: ModalDirective;
hideadd1field() {
 this.caigoudetaddfield.hide();
}
add1fieldshow() {
 this.caigoudetaddfield.show();
}
}
