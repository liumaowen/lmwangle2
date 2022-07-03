import { ToasterService } from 'angular2-toaster';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from './../../service/storage.service';
import { CgbuchaapiService } from '../../../routes/cgbucha/cgbuchaapi.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { GridOptions } from 'ag-grid/main';
import { ModalDirective } from 'ngx-bootstrap';
import { KucunService } from 'app/routes/kucun/kucun.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { QihuoService } from 'app/routes/qihuo/qihuo.service';
import { UserapiService } from 'app/dnn/service/userapi.service';
import { MdmService } from 'app/routes/mdm/mdm.service';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-rukucollectedetimport',
  templateUrl: './rukucollectedetimport.component.html',
  styleUrls: ['./rukucollectedetimport.component.scss']
})
export class RukucollectedetimportComponent implements OnInit {

  @ViewChild('queryModal') private queryModal: ModalDirective;
  @ViewChild('priceModal') private priceModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  // 接收父的元素 当页面初始化完成的时候
  parentthis;
  jiaohuoaddrs: any[];
  gns: any[] = [];
  chandis: any[] = [];
  caizhis: any[] = [];
  isChandi = false;
  attrs: any[] = [];
  // 常量作为字段名
  fieldArr = [
    'chandi', // 产地
    // 'color', // 颜色
    // 'width', // 宽度
    // 'houdu', // 厚度
    // 'duceng', // 镀层
    'caizhi', // 材质
    // 'ppro'// 后处理
  ];
  search = {
    gn: '', grno: '',chandi:'', supplierid: '',caizhi: '',month: '',jiaohuoaddr: '',start: '',end: ''
  };
  maxDate = new Date();
  end:Date;
  // 判断该页面是否显示引入按钮
  //isimport = false;
  // 默认禁止选择
  disabled = true;
  filterConditionObj = {};
    // 查询开始时间
    start: Date;
  // 机构
  items;
    // 品名
    pmitems;
    // 产地
    //cditems;
    // 材质
    //czitems;
  
  saledet: object = { price: '', detids: [], id: '' };
  // 表格设置
  gridOptions: GridOptions;
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService, private numberpipe: DecimalPipe,
    private qihuoapi: QihuoService,private classifyApi: ClassifyApiService,
     private datepipe: DatePipe,
    private toast: ToasterService, private cgbuchaApi: CgbuchaapiService, private kucunapi: KucunService, private classifyapi: ClassifyApiService,private userapi: UserapiService,public mdmService: MdmService) {
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
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      onRowSelected: event2 => {
      }
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'rukucollectdetid', minWidth: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 120 },
      //{ cellStyle: { 'text-align': 'center' }, headerName: '交货地', field: 'jiaohuoaddr', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 75 }
    ];
  }

  ngOnInit() {
  }
  import() {
    this.saledet['detids'] = [];
    this.saledet['id'] = this.parentthis.caigouModel.id;
    this.gridOptions.api.getModel().forEachNode(element => {
      if (element.isSelected()) {
        this.saledet['detids'].push(element.data.rukucollectdetid);
      }
    });
    if (this.saledet['detids'].length === 0) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.priceModal.show();
  }
  /**获取 */
  getGnAndChandi() {
    this.classifyApi.getGnAndChandi().then((data) => {
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  openquery() {
    this.selectNull();
    this.getGnAndChandi();
    // if (!this.pmitems) {
    //   this.pmitems = [{ value: '', label: '全部' }];
    //   this.userapi.getarea().then(data => {
    //     data['gn'].forEach(element => {
    //       this.pmitems.push({
    //         value: element['id'],
    //         label: element['name']
    //       })
    //     });
    //   });
    // }
    this.queryModal.show();
  }
  // 重选
  selectNull() {
    this.search = {
      gn: '', grno: '',chandi:'', supplierid: '', caizhi: '',month: '',jiaohuoaddr: '',start: '',end: ''
    };
    this.start = null;
    this.end = null;
    this.jiaohuoaddrs = [];
    this.chandis = [];
    this.caizhis = [];
    this.disabled = true;
    this.attrs = [];
  }
  // 查询
  query() {
    if (this.start){
       this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    }  
    if (this.end){
      this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    // if(!this.search['grno']){
    //   this.toast.pop('warning','请填写资源号');
    //   return;
    // }
    this.search['supplierid'] = this.parentthis.caigouModel.supplierid;
    this.queryModal.hide();
    this.cgbuchaApi.getcgbuchaing(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  closequery() {
    this.queryModal.hide();
  }
  closeprice() {
    this.priceModal.hide();
  }
  confirm() {
    if (this.saledet['price'] === '') {
      this.toast.pop('error', '请填写调整后的价格！', '');
      return;
    }
    this.cgbuchaApi.importdet(this.saledet).then(data => {
      this.parentthis.querydata();
      this.closeprice();
      this.bsModalRef.hide();
    });
  }
  data = new Array<any>();
  // 赛选过滤方法
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      const otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
      const queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.search[otherField] === '' || dataElement[otherField] === this.search[otherField];
          })) {
            const fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) === -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions.sort();
      });
    });
  }
  //品名
  selectedgn(value) {
    this.isChandi = true;
    this.attrs = [];
    this.search['gnid'] = this.search['gn']['id'];
    //this.showGuige = false;
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  //产地
  selectedchandi(value) {
    this.attrs = [];
    this.classifyapi.getAttrs(value).then(data => {
      // this.guigelength = data['length'];
      // this.attrs = data;
      data.forEach(element => {
        if(element['name'] === 'caizhiid'){
          this.caizhis = element.options;
        }
      });
    });
    this.jiaohuoaddrs = [];
    this.caizhis = [];
    this.search['chandiids'] = this.search['gnid']['name'];
    this.qihuoapi.getchandigongcha().then(data => {
      data.forEach(element => {
        if (element['chandiid'] === this.search['chandiid']) {
          //交货地址
          element.attr.jiaohuoaddr.forEach(addr => {
            this.jiaohuoaddrs.push({
              value: addr.value,
              label: addr.value
            });
          })
        }
      })//dataforeach
    })//qihuoapi
    //this.showGuige = true;
  }
  selectedchandimdm(value,key) {
    if (key === 'chandi' && value && this.search['gn']) {
      this.jiaohuoaddrs = [];
      const chandigongchaparam = {gn: this.search['gn'], chandi: value};
      this.mdmService.getchandigongcha(chandigongchaparam).then(chandigongchas => {
        for (let index = 0; index < chandigongchas.length; index++) {
          const element = chandigongchas[index];
          if (element.value==='jiaohuoaddr') {
            this.jiaohuoaddrs = element.options;
            break;
          }
        }
      })
    }
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
    console.log('asdas', this.datepipe.transform(value, 'y-MM'));
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    this.attrs = [];
    this.disabled = false;
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi' || element['value'] === 'caizhi') {
        element.options.unshift({ value: '', label: '全部' });
        this.attrs.push(element);
      }
      if (element['value'] === 'chandi') {
        this.chandioptions = element.options;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length>1) {
      this.search['chandi'] = this.chandioptions[1]['value'];
      if (this.search['chandi']) {
        this.selectedchandimdm(this.search['chandi'],'chandi');
      }
    }
  }
}
