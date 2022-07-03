import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { DecimalPipe } from '@angular/common';
import { FavoritelistComponent } from './../../../dnn/shared/favoritelist/favoritelist.component';
import { StorageService } from './../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { KucunService } from './../kucun.service';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../../caigou/caigou.service';
import { Router } from '@angular/router';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-onlinekucundetail',
  templateUrl: './onlinekucundetail.component.html',
  styleUrls: ['./onlinekucundetail.component.scss']
})
export class OnlinekucundetailComponent implements OnInit {

  search = {
    gn: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '', color: '',
    width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: ''
  };
  // 标记跳出循环
  mark;

  // 临时记录查询出来的合计
  lmsg;

  // 记录合计值
  msg;

  // 记录全部数量
  msglength;
  // 默认禁止选择
  disabled = true;

  // 查询出来所有的分类
  data = new Array<any>();
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('tuihuoModal') private tuihuoModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  tuihuo: object = { ids: [], supplierid: '', beizhu: '', sorgid: '' };
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
    private kucunapi: KucunService, private storage: StorageService, private modalService: BsModalService,
    private numberpipe: DecimalPipe, private caigouApi: CaigouService, private router: Router, private classifyapi: ClassifyApiService) {

    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      localeText: this.settings.LOCALETEXT,
      suppressRowClickSelection: true,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      enableFilter: true,

      getContextMenuItems: (params) => {
        const result = [
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
                    skipHeader: false,
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true, suppressQuotes: false,
                    fileName: '库存明细表.xls'
                  });
                }
              },
              {
                name: '导出分组Excel表格', action: () => {
                  params.api.exportDataAsExcel({
                    skipHeader: false,
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false, suppressQuotes: false,
                    fileName: '库存明细表.xls'
                  });
                }
              },
              {
                name: '导出未分组Csv表格', action: () => {
                  params.api.exportDataAsCsv({
                    skipHeader: false,
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: true, suppressQuotes: false,
                    fileName: '库存明细表.csv', columnSeparator: ''
                  });
                }
              },
              {
                name: '导出分组Csv表格', action: () => {
                  params.api.exportDataAsCsv({
                    skipHeader: false,
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false, suppressQuotes: false,
                    fileName: '库存明细表.csv', columnSeparator: ''
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
            subMenu: [{ name: '全部展开', action: () => { params.api.expandAll(); } }, {
              name: '全部收缩', action: () => {
                params.api.collapseAll();
              }
            }]
          }
        ];
        return result;
      },
      onCellValueChanged: (params) => { this.kucunapi.modifyBeizhu({ kucunid: params.data.kucunid, beizhu: params.data.beizhu }); },
      onColumnResized: () => {
        // this.tabelPostion();
      },
      onColumnMoved: () => {
        // this.tabelPostion();
      },
      onRowSelected: (event) => {
        this.datasum();
      },
      onGridReady: () => {
        console.log(122312);
        // if (this.storage.getObject('permanent_kucunOnlineTablePosition')) {
        //   this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_kucunTablePosition'));
        // }
      }
    };

    // this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'left' }, headerName: '机构', field: 'orgname', minWidth: 70,
      checkboxSelection: (params) => (!params.value && !params.data) ? false : true,
       cellRenderer: (params) => (!params.value && !params.data) ? params.node.key : params.data['orgname'] },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁', field: 'klock', minWidth: 43 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备货', field: 'beihuo', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色/锌花', field: 'color', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '线上价格', field: 'olprice', minWidth: 57,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '线下价格', field: 'price', minWidth: 57,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 57, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      { 
        cellStyle: { 'text-align': 'center' }, suppressMenu: false, headerName: '米数', field: 'lengths', minWidth: 40, aggFunc: 'sum' ,
        valueFormatter: this.settings.valueFormatter
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '吨米数', field: 'dunmishu', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ERP库龄', field: 'kuling', minWidth: 55 },
      { cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '机构库龄', field: 'cdate', minWidth: 40 },
      { cellStyle: { 'text-align': 'center' }, headerName: '上架日期', field: 'createdate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '订单号', field: 'billno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'orderstatus', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁货原因', field: 'lockuserorcompany', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'nrno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否标记', field: 'issign', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否外贸', field: 'isft', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 70 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60, editable: true, valueGetter: (params) => {
          if (params.data && params.data['beizhu']) {
            return params.data['beizhu'];
          } else {
            return '';
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75, cellRenderer: (params) => {
          if (params.data && null != params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          }
          return '';
        }
      }
    ];

  }

  ngOnInit() {
    // this.listDetail();
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
    console.log(this.search);
    this.gridOptions.api.setRowData([]);
    this.kucunapi.listOnlineDetail(this.search).then(data => {
      this.msg = '';
      this.gridOptions.api.setRowData(data);
      this.gridOptions.columnApi.autoSizeAllColumns();
      const total = { count: 0, weight: 0, length: 0 };
      data.forEach(element => {
        total['weight'] = total['weight'] + element['weight'];
        total['length'] = total['length'] + element['lengths'];
      });
      this.msg = this.msg + '共' + data.length + '件，' + this.numberpipe.transform(total['weight'], '1.3-3') + '吨，' + total['length'] + '米';
      this.lmsg = this.msg;
      this.msglength = data.length;
    });

  }

  // 储存表格状态列
  tabelPostion() {
    this.storage.setObject('permanent_kucunOnlineTablePosition', this.gridOptions.columnApi.getColumnState());
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
        console.log(data);
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
    this.classicModal.show();
  }

  // 品名选中改变
  selectGnAction(key) {
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
  }

  // 重置查询条件
  selectNull() {
    this.search = {
      gn: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '', color: '', width: '', houdu: '',
      duceng: '', caizhi: '', ppro: '', orgid: ''
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

  // 加入收藏夹功能
  addToFav() {
    const fav = this.storage.getObject('fav') ? this.storage.getObject('fav') : new Array();
    const kucunselects = new Array();
    const kucuns = this.gridOptions.api.getModel().forEachNode(element => {
      if (element['selected'] && element['data']) kucunselects.push(element);
    });
    if (kucunselects.length > 0) {

      for (let i = 0; i < kucunselects.length; i++) {
        if (kucunselects[i]['selected'] && kucunselects[i]['data']) {
          const goods = kucunselects[i]['data'];
          // 判断是否有定价
          if (goods['price'] === null || goods['price'] === '0') {
            this.toast.pop('warning', '所选货物' + goods['kucunid'] + '需要定价才能收藏！！！');
            return '';
          }
          // 判断所选货物是否下单或者锁定
          if (goods['orderid']) {
            this.toast.pop('warning', '所选货物' + goods['kucunid'] + '已下单不允许收藏！！！');
            return '';
          }
          if (goods['lockuserid']) {
            this.toast.pop('warning', '所选货物' + goods['kucunid'] + '已锁定不允许收藏！！！');
            return '';
          }
          // 首先判断favorite中的数据是不是空如果是空就直接添加
          if (!fav) {
            fav.push(goods['kucunid']);
          } else {
            // 如果不是空的话就不能添加了,要判断是不是重复了去掉重复的再添加
            // 判断如果fav中和选择的有重复的则删除掉fav中的数据,重新添加
            for (let j = 0; j < fav.length; j++) {
              if (goods.kucunid === fav[j]) {
                fav.splice(j, 1);
              }
            }
            fav.push(goods.kucunid);
          }
        }
      }
      this.storage.setObject('fav', fav);
      this.toast.pop('success', '成功加入收藏夹^_^');
    } else {
      this.toast.pop('warning', '请选择要收藏的货物！');
    }
  }
  // 查看收藏夹
  openFav() {
    const fav = this.storage.getObject('fav');
    if (fav) {
      this.modalService.config.class = 'modal-all';
      this.bsModalRef = this.modalService.show(FavoritelistComponent);
      this.bsModalRef.content.isimport = this.isimport;
      this.bsModalRef.content.parentthis = this;
    } else {
      this.toast.pop('warning', '收藏夹中没有数据');
    }
  }

  // 锁货
  lock() {
    const ids = new Array();
    let tweight = 0;
    let count = 0;
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected && kucuns[i].data) {
        if (kucuns[i].data.lockuserorcompany) {
          count++;
        }
        ids.push(kucuns[i].data.kucunid);
        tweight = tweight + kucuns[i].data.weight;
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择将要锁定的货物');
      return '';
    }
    if (count > 0) {
      this.toast.pop('warning', '选择的货物已下单或已锁定');
      return '';
    }

    sweetalert({
      title: '你确定要锁定总重为' + this.numberpipe.transform(tweight, '1.3-3') + '吨的货物吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      const param = {};
      param['kucunids'] = ids;
      this.kucunapi.addlock(param).then(data => {
        this.toast.pop('success', '所选货物加锁成功');
        this.listDetail();
        sweetalert.close();
      });
    });

  }

  // 解锁
  unlock() {
    const ids = new Array();
    let tweight = 0;
    let count = 0;
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected && kucuns[i].data) {
        if (!kucuns[i].data.lockuserid) {
          count++;
        }
        ids.push(kucuns[i].data.kucunid);
        tweight = tweight + kucuns[i].data.weight;
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择将要解锁的货物');
      return '';
    }
    if (count !== 0) {
      this.toast.pop('warning', '选择的货物已下单或未锁定');
      return '';
    }

    sweetalert({
      title: '你确定要解锁总重为' + this.numberpipe.transform(tweight, '1.3-3') + '吨的货物吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {
      const param = {};
      param['kucunids'] = ids;
      this.kucunapi.unlock(param).then(data => {
        this.toast.pop('success', '所选货物解锁成功');
        this.listDetail();
        sweetalert.close();
      });
    });
  }
  // 采购退货
  addToTuihuo() {
    this.tuihuo = { ids: [], beizhu: '', sorgid: '' };
    const ids = new Array();
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    let count = 0;
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected && kucuns[i].data) {
        console.log('saasaa', kucuns[i]);
        count++;
        if (null !== kucuns[i].data.klock) {
          this.toast.pop('warning', '选择的货物已经被锁定');
          return '';
        }
        ids.push(kucuns[i].data.kucunid);
      }
    }
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择将要退货的货物');
      return '';
    }
    this.tuihuo['ids'] = ids;
    this.tuihuoModal.show();
  }
  tuihuoclose() {
    this.tuihuoModal.hide();
  }
  confirmtuihuo() {
    console.log('tuihuo', this.tuihuo);
    if (this.tuihuo['sorgid'] === '') {
      this.toast.pop('warning', '请选择收货机构!');
      return '';
    }
    this.caigouApi.createtuihuo(this.tuihuo).then(data => {
      this.router.navigate(['cgtuihuo', data.id]);
    });
  }

  // 导出库存明细表
  agExport() {
    let params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '库存明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  // 标记不被上架
  sign() {
    let list = [];
    let kucunids = [];
    list = this.gridOptions.api.getModel()['rowsToDisplay'];
    list.forEach(element => {
      console.log(element);
      if (element.selected) {
        if (element.data.klock || element.data.orderid) {
          this.toast.pop('warning', '请选择自由的货物进行操作!');
          return;
        }
        kucunids.push(element.data.kucunid)
      }
    })
    if (kucunids.length === 0) {
      this.toast.pop('warning', '请选择库存!');
      return;
    }
    const param = { kucunids: null };
    param.kucunids = kucunids;
    if (confirm('你确定标记这些库存中的货物不允许上架吗？')) {
      this.kucunapi.sign({ search: param }).then(data => {
        this.toast.pop('warning', '标记成功!');
      })
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
