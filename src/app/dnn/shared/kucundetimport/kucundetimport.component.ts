import { ProorderapiService } from './../../../routes/produce/proorderapi.service';
import { BusinessorderapiService } from './../../../routes/businessorder/businessorderapi.service';
import { InnersaleapiService } from './../../../routes/innersale/innersaleapi.service';
import { AllotapiService } from './../../../routes/allot/allotapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from './../../service/storage.service';
import { UserapiService } from './../../service/userapi.service';
import { DecimalPipe } from '@angular/common';
import { KucunService } from './../../../routes/kucun/kucun.service';
import { CustomerapiService } from './../../../routes/customer/customerapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { XiaoshouapiService } from '../../../routes/xiaoshou/xiaoshouapi.service';

@Component({
  selector: 'app-kucundetimport',
  templateUrl: './kucundetimport.component.html',
  styleUrls: ['./kucundetimport.component.scss']
})
export class KucundetimportComponent implements OnInit {

  // 接收父页面this对象
  componentparent;

  gridOptions: GridOptions;

  // 标记跳出循环
  mark;

  // 临时记录查询出来的合计
  lmsg;

  // 记录合计值
  msg;

  search = {
    gn: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '',
    chandi: '', color: '', width: '', houdu: '', duceng: '',
    caizhi: '', ppro: '', orgid: '', buyerid: '', isallot: false
  };

  // 默认禁止选择
  disabled = true;

  // 查询出来所有的分类
  data = new Array<any>();
  // 记录全部数量
  msglength;
  isallot = false;
  // 常量作为字段名
  fieldArr = [
    'chandi',// 产地
    'color',// 颜色
    'width', // 宽度
    'houdu',// 厚度
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];
  companyIsWiskind = [];
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
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

  isimport = { flag: false };
  qihuodetid: any;
  tihuodetid: any;
  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private kucunapi: KucunService,
    private numberpipe: DecimalPipe, private userapi: UserapiService, private storage: StorageService,
    private toast: ToasterService, private allotApi: AllotapiService, private innersaleApi: InnersaleapiService,
    private tihuoApi: XiaoshouapiService, private businessOrderApi: BusinessorderapiService, private customerApi: CustomerapiService,
    private proOrderApi: ProorderapiService) {

    // 接收也，页面传递过来的参数；判断是否显示引入按钮；
    // this.isimport = this.componentparent['isimport'];

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
      enableFilter: true,
      onRowSelected: (params) => {
        console.log('asdfsdfgwertqw3etertyedftrgsxdfgwert');
        this.datasum();
      },
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: (params) => {
        let result = [
          { // custom item
            name: '全选',
            action: () => {
              this.mark = true;
              params.api.selectAll();
              this.mark = false;
              this.msg = this.lmsg;
            }
          },
          { // custom item
            name: '全不选',
            action: () => {
              this.mark = true;
              params.api.deselectAll();
              this.mark = false;
              this.msg = '';
            }
          },
          {
            name: '导出',
            subMenu: [
              {
                name: '导出未分组Excel表格', action: () => {
                  params.api.exportDataAsExcel({
                    skipHeader: false, skipFooters: false,
                    allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true,
                    suppressQuotes: false, fileName: '库存明细表.xls'
                  });
                }
              },
              {
                name: '导出分组Excel表格', action: () => {
                  params.api.exportDataAsExcel({
                    skipHeader: false, skipFooters: false,
                    allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false,
                    suppressQuotes: false, fileName: '库存明细表.xls'
                  });
                }
              },
              {
                name: '导出未分组Csv表格', action: () => {
                  params.api.exportDataAsCsv({
                    skipHeader: false, skipFooters: false,
                    allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true,
                    suppressQuotes: false, fileName: '库存明细表.csv', columnSeparator: ''
                  });
                }
              },
              {
                name: '导出分组Csv表格', action: () => {
                  params.api.exportDataAsCsv({
                    skipHeader: false,
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true,
                    skipGroups: false, suppressQuotes: false, fileName: '库存明细表.csv', columnSeparator: ''
                  });
                }
              },
            ]
          },
          'copy',
          {
            name: '自适应',
            action: () => {
              // params.api.exportDataAsCsv(params);
              params.columnApi.autoSizeAllColumns();
            }
          },
          {
            name: '收缩组',
            subMenu: [{ name: '全部展开', action: () => { params.api.expandAll(); } },
            { name: '全部收缩', action: () => { params.api.collapseAll(); } }]
          }
        ];
        return result;
      },
      onCellValueChanged: (params) => { this.kucunapi.modifyBeizhu({ kucunid: params.data.kucunid, beizhu: params.data.beizhu }); },
      onColumnResized: () => { this.tabelPostion(); },
      // onRowSelected:this.calcweight(),
      onColumnMoved: () => { this.tabelPostion(); },
      onGridReady: () => {
        if (this.storage.getObject('permanent_kucunTablePosition')) {
          this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_kucunTablePosition'));
        }
      }
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    // 设置aggird表格列
    this.gridOptions.columnDefs = [

      { cellStyle: { 'text-align': 'left' }, headerName: '机构', field: 'orgname', minWidth: 70, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁', field: 'klock', minWidth: 43 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁货类型', field: 'reason', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'gcid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'color', minWidth: 90 },
      /*2017.12.19 补充规格缺失参数 cpf ADD start */
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 57 },
      /*2017.12.19 补充规格缺失参数 end */
      {
        cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', minWidth: 57,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '米数', field: 'lengths', minWidth: 40 },
      { cellStyle: { 'text-align': 'center' }, headerName: '吨米数', field: 'dunmishu', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP库龄', field: 'kuling', minWidth: 55 },
      { cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '库龄', field: 'cdate', minWidth: 40 },
      { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'createdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'orderstatus', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁货原因', field: 'lockuserorcompany', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'nrno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 70 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60, editable: true, valueGetter: (params) => {
          if (params.data['beizhu'] === undefined) { return null; }
          else { return params.data['beizhu']; }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75, cellRenderer: (params) => {
          if (null != params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">'
              + params.data.kucunid + '</a>';
          }
          return params.data.kucunid;
        }
      }
    ];
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.componentparent.model) {
        this.isallot = true;
      } else {
        this.isallot = false;
      }
    }, 0);
  }
  // 计算选中行的合计
  datasum() {
    let list = [];
    list = this.gridOptions.api.getSelectedNodes();
    if (list.length === this.msglength || list.length === 0) { return; }
    let tlength = 0;
    let tweight = 0;
    for (let i = 0; i < list.length; i++) {
      tlength = tlength + list[i].data.lengths;
      tweight = tweight + list[i].data.weight;
    }
    this.msg = '选中' + list.length + '件，' + this.numberpipe.transform(tweight, '1.3-3') + '吨，' + tlength + '米';
  }

  // 储存表格状态列
  tabelPostion() {
    this.storage.setObject('permanent_kucunTablePosition', this.gridOptions.columnApi.getColumnState());
  }

  // 查询库存明细表
  listDetail() {
    this.kucunapi.listDetail(this.search).then(data => {
      this.msg = '';
      this.gridOptions.api.setRowData(data);
      const total = { count: 0, weight: 0, length: 0 };
      data.forEach(element => {
        total['weight'] = total['weight']['add'](element['weight']);
        total['length'] = total['length']['add'](element['lengths']);
        // tslint:disable-next-line:radix
        element['lengths'] = parseInt(element['lengths']);
        // tslint:disable-next-line:radix
        element['kuling'] = parseInt(element['kuling']);
      });
      this.msg = this.msg + '共' + data.length + '件，' + this.numberpipe.transform(total['weight'], '1.3-3') + '吨，' + total['length'] + '米';
      this.lmsg = this.msg;
      // this.msglength = {lengths:data.length,weight:this.numberpipe.transform(total['weight'],'1.3-3'),length:total['length']};
      this.msglength = data.length;
    });
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
          })
        });
      });
    }
    // if (!this.pmitems) {
    //   this.pmitems = [{ value: '', label: '全部' }];
    //   this.userapi.getAttrsByParentid(2).then(data => {
    //     data.forEach(element => {
    //       this.pmitems.push({
    //         value: element['id'],
    //         label: element['name']
    //       });
    //     });
    //   });
    // }
    if (!this.ckitems) {
      this.ckitems = [{ value: '', label: '全部' }];
      this.userapi.cangkulist().then(data => {
        data.forEach(element => {
          this.ckitems.push({
            value: element['id'],
            label: element['name']
          })
        });
      });
    }
    this.findWiskind();
    this.classicModal.show();
  }

  // 品名选中改变
  selectGnAction(key) {
    // tslint:disable-next-line:curly
    if (!this.search[key]) return;
    else {
      const gnid = this.search['gnid'];
    }
    this.kucunapi.getConditions({ gnid: this.search['gnid'] }).then(data => {
      this.data = data;
      this.filter();
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
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) == -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions;
      });
    });
  }

  selectAction(key, value) {
    this.filter();
  }


  // 重置查询条件
  selectNull() {
    this.search = {
      gn: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '',
      color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '',
      orgid: '', buyerid: '', isallot: false
    };
    this.disabled = true;
    this.attrs = [];
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

  import() {
    const ids = new Array();
    const orgids = new Array();
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected) {
        if (kucuns[i].data.price === '0') {
          this.toast.pop('warning', '货物需要定价才能被引用!');
          return;
        }

        /* if ((null != kucuns[i].data.klock) || (null != kucuns[i].data.orderid)) {
           this.toast.pop('warning', '货物已经被锁定，不允许引用!');
           return;
         }*/
        ids.push(kucuns[i].data.kucunid);
        orgids.push(kucuns[i].data.orgid);
      }
    }
    if (ids.length === 0) {
      this.toast.pop('warning', '请选择要引入的货物!');
      return;
    }
    // 判断引入的是内采来使用还是调拨来使用
    if (this.componentparent.innersale) {
      this.innersaleApi.importFav(this.componentparent['innersale']['id'],
        { id: this.componentparent.innersale.id, kucunids: ids }).then((data) => {
          // this.$emit('innersaleKucun', data);//向父页面传递所引入的数据
          this.componentparent.innersaleKucun(data);
        });
    } else if (this.componentparent.businessorder) {  // 判断是否是业务销售合同引入的数据
      for (let i = 0; i < orgids.length; i++) {
        if (this.componentparent.businessorder.isself) {
          if (this.componentparent.businessorder.org.id !== orgids[i]) {
            this.toast.pop('warning', '自销只能引用自己机构的货物');
            return;
          }
        } else if (this.componentparent.businessorder.ordertype === 11) {

        } else {
          if (this.componentparent.businessorder.org.id === orgids[i]) {
            this.toast.pop('warning', '代销不能引用自己机构的货物');
            return;
          }
          console.log(orgids[i]);
          console.log(this.componentparent.businessorder.buyerid);
          if (!((this.componentparent.businessorder.sellerid === 3786 && orgids[i] === 16609) ||
            orgids[i] === 670 ||
            orgids[i] === 22427 ||
            orgids[i] === 22350 ||
            orgids[i] === 21587)) {
            this.toast.pop('warning', '代销只能引用涂镀应用艺术的货物或者销售邯郸加工中心的净料');
            return;
          }
        }
      }
      this.businessOrderApi.importFav(this.componentparent.businessorder.id, { kucunids: ids }).then((data) => {
        // $scope.$emit('businessorderk', data);//向父页面传递所引入的数据
        this.componentparent.businessorderk(data);
      });
    } else if (this.componentparent.model) {// 库存调拨
      if (ids.length > 0) {
        this.allotApi.allotList({ kucunids: ids }).then((data) => {
          this.componentparent.importAllotKucun(data);

        });
      }
    } else if (this.componentparent.proorder) { // 判断是否是加工合同引入的数据
      for (let i = 0; i < orgids.length; i++) {
        if (this.componentparent.proorder.org.id !== orgids[i] && orgids[i] !== 670 && orgids[i] !== 22427 && orgids[i] !== 22350 && orgids[i] !== 21587) {
          this.toast.pop('warning', '只能引用自己机构或涂镀的货物做基料');
          return;
        }
      }
      this.proOrderApi.importFav(this.componentparent.proorder.id, { kucunids: ids }).then((data) => {
        // $scope.$emit('proorderk', data);//向父页面传递所引入的数据
        this.componentparent.proorderk();
      });
    } else if (this.componentparent.tihuo) {
      if (this.componentparent.isldyinru) { // 临调合同引库存
        const params = { detids: this.componentparent.lddetids, kucunids: ids };
        this.tihuoApi.ldtihuoimportkucun(params).then(data => {
          this.componentparent.ldimportkucunhide();
        });
      } else {
        for (let i = 0; i < orgids.length; i++) {
          // if (this.componentparent.tihuo.org.id != orgids[i]) {
          //   this.toast.pop('warning', '只能引用自己机构的货物');
          //   return;
          // }
        }
        this.componentparent.imp(ids, this.qihuodetid, this.tihuodetid);
      }
    } else if (this.componentparent.qihuomodel) {// 现货转期货
      this.componentparent.imp(ids);
    }


  }


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
          this.companyIsWiskind.push({
            label: element.name,
            value: element.id
          });
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      });
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.search['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.search[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.search[element['value']] = element['defaultval'];
      }
    }
  }

}
