import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { DecimalPipe } from '@angular/common';
import { FavoritelistComponent } from '../../../dnn/shared/favoritelist/favoritelist.component';
import { StorageService } from '../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { KucunService } from '../kucun.service';
import { UserapiService } from '../../../dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerapiService } from '../../customer/customerapi.service';
import { CaigouService } from '../../caigou/caigou.service';
import { Router } from '@angular/router';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-kucunkuling',
  templateUrl: './kucunkuling.component.html',
  styleUrls: ['./kucunkuling.component.scss']
})
export class KucunkulingComponent implements OnInit {

  search = {
    gnid: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '', color: '',
    width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: '', youhui: '', buyerid: ''
  };
  // 标记跳出循环
  mark;

  // 临时记录查询出来的合计
  lmsg;

  // 记录合计值
  msg;

  // 记录全部数量
  msglength;
  orgtypes: any = [{ value: '', label: '请选择机构' }, { value: '22427', label: '资源中心' }];
  // 默认禁止选择
  disabled = true;
  //边丝调价非邯郸机构不允许查看
  isshowbiansitiaojia = false;

  // 查询出来所有的分类
  data = new Array<any>();
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('tuihuoModal') private tuihuoModal: ModalDirective;
  yuanjigou = false;
  tuihuo: object = { ids: [], supplierid: '', beizhu: '', sorgid: '', innersalePrice: '' };
  // 机构
  items;

  // 品名
  pmitems;

  // 仓库
  ckitems;

  // 产地
  cditems;

  // 颜色
  coloritems;

  // 宽度
  widthitems;

  // 厚度
  hditems;

  // 镀层
  dcitems;

  // 材质
  czitems;

  // 后处理
  hclitems;
  // 控制收藏夹中引入按钮的显示与否
  isimport = false;
  // 常量作为字段名
  fieldArr = [
    'chandi', // 产地
    'color', // 颜色
    'width', // 宽度
    'houdu', // 厚度
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];

  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}
  gridOptions: GridOptions;

  // 收藏夹对象
  bsModalRef: BsModalRef;

  constructor(public settings: SettingsService, private toast: ToasterService, private userapi: UserapiService,
    private kucunapi: KucunService, private storage: StorageService, private modalService: BsModalService, private customerApi: CustomerapiService,
    private numberpipe: DecimalPipe, private caigouApi: CaigouService, private router: Router, private classifyapi: ClassifyApiService) {

    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,
      getContextMenuItems: this.settings.getContextMenuItems,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      {
         cellStyle: { 'text-align': 'center' }, headerName: '库存总重量', field: 'tweight', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '权重库龄', field: 'qzkuling', minWidth: 55 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '期货库存量', field: 'qhweight', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '期货权重库龄', field: 'qhkuling', minWidth: 55 },
      { 
        cellStyle: { 'text-align': 'center' }, headerName: '现货库存量', field: 'xhweight', minWidth: 60
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '现货权重库龄', field: 'xhkuling', minWidth: 55 },
    ];

  }

  ngOnInit() {
    this.listDetail();
  }



  // 计算选中行的合计
  datasum() {
    let list = [];
    list = this.gridOptions.api.getSelectedNodes();
    if (list.length === this.msglength) { return; }
    let tlength = 0;
    let tweight = 0;
    let counts = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].data) {
        tlength = tlength + list[i].data.lengths;
        tweight = tweight + list[i].data.weight;
        counts++;
      }
    }
    this.msg = '选中' + counts + '件，' + this.numberpipe.transform(tweight, '1.3-3') + '吨，' + tlength + '米';
  }



  // 查询库存明细表
  listDetail() {
    //this.gridOptions.api.setRowData([]);
    this.kucunapi.kulingListDetail(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });

  }

  // 储存表格状态列
  tabelPostion() {
    this.storage.setObject('permanent_kucunTablePosition', this.gridOptions.columnApi.getColumnState());
  }

  // 打开查询弹窗
  openclassicmodal() {
    if (!this.items) {
      this.items = [{ value: '', label: '全部' }];
      this.userapi.searchjigou(0).then(data => {
        data.forEach(element => {
          this.items.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    if (!this.pmitems) {
      this.pmitems = [{ value: '', label: '全部' }];
      this.classifyapi.getGnAndChandi().then((data) => {
        data.forEach(element => {
          this.pmitems.push({
            label: element['name'],
            value: element['id']
          })
        })
      });
    }
    if (!this.ckitems) {
      this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          });
        });
      });
    }
    this.findWiskind();
    this.classicModal.show();
  }

  // 品名选中改变
  selectGnAction(key) {
    if (!this.search[key]) return;
    else {
      const gnid = this.search['gnid'];
    }
    // this.search['chandi'] = '';
    // this.search['color'] = '';
    // this.search['width'] = '';
    // this.search['houdu'] = '';
    // this.search['duceng'] = '';
    // this.search['caizhi'] = '';
    // this.search['ppro'] = '';
    // let cditems = new Set();
    // let coloritems = new Set();
    // let widthitems = new Set();
    // let hditems = new Set();
    // let dcitems = new Set();
    // let czitems = new Set();
    // let hclitems = new Set();
    // this.cditems = [{value: '',label:'全部'}];
    // this.coloritems = [{value: '',label:'全部'}];
    // this.widthitems = [{value: '',label:'全部'}];
    // this.hditems = [{value: '',label:'全部'}];
    // this.dcitems = [{value: '',label:'全部'}];
    // this.czitems = [{value: '',label:'全部'}];
    // this.hclitems = [{value: '',label:'全部'}];
    this.kucunapi.getConditions({ gnid: this.search['gnid'] }).then(data => {
      this.data = data;
      this.filter();
      // data.forEach(element => {
      //   if(element['chandi']) cditems.add(JSON.stringify({value:element['chandi'],label:element['chandi']}));
      //   if(element['color']) coloritems.add(JSON.stringify({value:element['color'],label:element['color']}));
      //   if(element['width']) widthitems.add(JSON.stringify({value:element['width'],label:element['width']}));
      //   if(element['houdu']) hditems.add(JSON.stringify({value:element['houdu'],label:element['houdu']}));
      //   if(element['duceng']) dcitems.add(JSON.stringify({value:element['duceng'],label:element['duceng']}));
      //   if(element['caizhi']) czitems.add(JSON.stringify({value:element['caizhi'],label:element['caizhi']}));
      //   if(element['ppro']) hclitems.add(JSON.stringify({value:element['ppro'],label:element['ppro']}));
      // });

      // cditems.forEach(e=>{
      //   this.cditems.push(JSON.parse(e));
      // });
      // coloritems.forEach(e=>{
      //   this.coloritems.push(JSON.parse(e));
      // });
      // widthitems.forEach(e=>{
      //   this.widthitems.push(JSON.parse(e));
      // });
      // hditems.forEach(e=>{
      //   this.hditems.push(JSON.parse(e));
      // });
      // dcitems.forEach(e=>{
      //   this.dcitems.push(JSON.parse(e));
      // });
      // czitems.forEach(e=>{
      //   this.czitems.push(JSON.parse(e));
      // });
      // hclitems.forEach(e=>{
      //   this.hclitems.push(JSON.parse(e));
      // });
    });
    this.disabled = false;
  }

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


  // 子类型选择
  selectAction(key, value) {
    this.filter();
    // if(value){
    //   let newarr = this.data.filter(item=>item[key] == value)
    //   let cditems = new Set();
    //   let coloritems = new Set();
    //   let widthitems = new Set();
    //   let hditems = new Set();
    //   let dcitems = new Set();
    //   let czitems = new Set();
    //   let hclitems = new Set();
    //   this.cditems = [{ value: '', label: '全部' }];
    //   this.coloritems = [{ value: '', label: '全部' }];
    //   this.widthitems = [{ value: '', label: '全部' }];
    //   this.hditems = [{ value: '', label: '全部' }];
    //   this.dcitems = [{ value: '', label: '全部' }];
    //   this.czitems = [{ value: '', label: '全部' }];
    //   this.hclitems = [{ value: '', label: '全部' }];
    //   newarr.forEach(element => {
    //     if(element['chandi']) cditems.add(JSON.stringify({value:element['chandi'],label:element['chandi']}));
    //     if(element['color']) coloritems.add(JSON.stringify({value:element['color'],label:element['color']}));
    //     if(element['width']) widthitems.add(JSON.stringify({value:element['width'],label:element['width']}));
    //     if(element['houdu']) hditems.add(JSON.stringify({value:element['houdu'],label:element['houdu']}));
    //     if(element['duceng']) dcitems.add(JSON.stringify({value:element['duceng'],label:element['duceng']}));
    //     if(element['caizhi']) czitems.add(JSON.stringify({value:element['caizhi'],label:element['caizhi']}));
    //     if(element['ppro']) hclitems.add(JSON.stringify({value:element['ppro'],label:element['ppro']}));
    //   });
    //   cditems.forEach(e=>this.cditems.push(JSON.parse(e)));
    //   coloritems.forEach(e=>this.coloritems.push(JSON.parse(e)));
    //   widthitems.forEach(e=>this.widthitems.push(JSON.parse(e)));
    //   hditems.forEach(e=>this.hditems.push(JSON.parse(e)));
    //   dcitems.forEach(e=>this.dcitems.push(JSON.parse(e)));
    //   czitems.forEach(e=>this.czitems.push(JSON.parse(e)));
    //   hclitems.forEach(e=>this.hclitems.push(JSON.parse(e)));
    // }else{
    //   this.selectGnAction('gnid')
    // }
  }

  // 重置查询条件
  selectNull() {
    this.search = {
      gnid: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '', color: '', width: '', houdu: '',
      duceng: '', caizhi: '', ppro: '', orgid: '', youhui: '', buyerid: ''
    };
    this.disabled = true;
  }

  // 查询
  select() {
    this.listDetail();
    this.closeclassicmodal();
  }


  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }
  // 导出权重库龄表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '权重库龄表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  companyIsWiskind = []
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择卖方单位', value: '' })
      this.customerApi.findwiskind().then((response) => {
        for (let i = 1; i < response.length; i++) {
          if (response[i].id === 3453) {
            response.splice(i, 1);
          }
        }
        response.forEach(element => {
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          })
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      })
    }
  }
}
