import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { StorageService } from './../../../dnn/service/storage.service';
import { GridOptions } from 'ag-grid/main';
import { KucunService } from './../kucun.service';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CaigouService } from '../../caigou/caigou.service';
import { Router } from '@angular/router';
import { ZaitucangkuComponent } from './zaitucangku/zaitucangku.component';
import { RukuService } from 'app/routes/ruku/ruku.service';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-zaitukucundetail',
  templateUrl: './zaitukucundetail.component.html',
  styleUrls: ['./zaitukucundetail.component.scss']
})
export class ZaitukucundetailComponent implements OnInit {

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
  // 调货合同单号
  tiaohuobillno = '';

  // 查询出来所有的分类
  data = new Array<any>();
  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('daohuoModal') private daohuoModal: ModalDirective;
  @ViewChild('presaleModal') private presaleModal: ModalDirective;
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
  // 控制收藏夹中引入按钮的显示与否
  isimport = false;
  maxdate = new Date;
  kuling: null;
  detids = [];
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
  kulingtixingconfim = false;
  // 收藏夹对象
  bsModalRef: BsModalRef;
  cangkuparams: any = {}; // 修改仓库传递的参数
  flag: number; // 0 修改仓库， 1 修改车船号
  constructor(public settings: SettingsService, private toast: ToasterService, private userapi: UserapiService,
    private kucunapi: KucunService, private storage: StorageService, private modalService: BsModalService, private datepipe: DatePipe,
    private numberpipe: DecimalPipe, private caigouApi: CaigouService, private router: Router, private classifyapi: ClassifyApiService,private rukuapi: RukuService) {

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
        this.tabelPostion();
      },
      onColumnMoved: () => {
        this.tabelPostion();
      },
      onRowSelected: (event) => {
        this.datasum();
      },
      onGridReady: () => {
        if (this.storage.getObject('permanent_zaitukucunTablePosition')) {
          this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_zaitukucunTablePosition'));
        }
      }
    };

    // this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'id1', minWidth: 75,
        cellRenderer: 'group', checkboxSelection: true, headerCheckboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '锁', field: 'islock', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '到货仓库', field: 'cangkuname', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '车船号', field: 'carshipnum', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建时间', field: 'cdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务员', field: 'salename', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色/锌花', field: 'color', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '价格', field: 'price', minWidth: 57,
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
        cellStyle: { 'text-align': 'center' }, headerName: '金额', field: 'jine', minWidth: 57, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return null;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '米数', field: 'lengths', minWidth: 40, aggFunc: 'sum' },
      { cellStyle: { 'text-align': 'center' }, headerName: '吨米数', field: 'dunmishu', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '在途入库单号', field: 'billno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '合同类型', field: 'type', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '批次号', field: 'nrno', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓储号', field: 'storageno', minWidth: 70 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60, editable: true, valueGetter: (params) => {
          if (params.data && params.data['beizhu']) {
            return params.data['beizhu'];
          } else {
            return '';
          }
        }
      }
    ];

  }

  ngOnInit() {
    // this.listDetail();
  }

  // 计算选中行的合计
  datasum() {
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    const list = [];
    rowsparams.forEach(item => {
      if (item.selected) {
        list.push(item.data);
      }
    });
    // if (list.length === this.msglength) { return; }
    let tlength = 0;
    let tweight = 0;
    let counts = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i]) {
        tlength = tlength + Number(list[i].lengths);
        tweight = tweight + Number(list[i].weight);
        counts++;
      }
    }
    this.msg = '选中' + counts + '件，' + this.numberpipe.transform(tweight, '1.3-3') + '吨，' + tlength + '米';
  }
  /**修改仓库0/车船号1 */
  editcangku(flag) {
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    const detids = [];
    rowsparams.forEach(item => {
      if (item.selected) {
        detids.push(item.data['id']);
      }
    });
    if (!detids.length) {
      this.toast.pop('warning', '请选择要修改的库存！');
      return;
    }
    this.cangkuparams['detids'] = detids;
    this.flag = flag;
    this.modalService.config.ignoreBackdropClick = true;
    this.bsModalRef = this.modalService.show(ZaitucangkuComponent);
    this.bsModalRef.content.parentthis = this;
  }
  showDaohuoModal() {
    this.kuling = null;
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    this.detids = [];
    rowsparams.forEach(item => {
      if (item.selected) {
        this.detids.push(item.data['id']);
      }
    });
    if (!this.detids.length) {
      this.toast.pop('warning', '请选择要入库的库存！');
      return;
    }
    this.daohuoModal.show();
  }
  hideDaohuoModal() {
    this.daohuoModal.hide();
  }
  /**入库 */
  ruku(isallot) {
    if (!this.kuling) {
      this.toast.pop('warning', '请填写库龄！');
      return;
    }
    const pa = {};
    pa['detidList'] = this.detids;
    pa['isallot'] = isallot;
    pa['kuling'] = this.datepipe.transform(this.kuling, 'y-MM-dd');
    const now = this.datepipe.transform(new Date(), 'y-MM-dd');
    const dateDiff = this.getdateDiff(new Date(now), new Date(pa['kuling']));
    if (dateDiff >= 10) {
        sweetalert({
          title: '你确定要入库吗？',
          text: '钢卷存在入库后ERP库龄>=10天',
          customClass: 'rukutixing',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#23b7e5',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnConfirm: false
        }, () => {
          this.kucunapi.zaituruku(pa).then(data => {
            sweetalert.close();
            this.listDetail();
            this.hideDaohuoModal();
          });
        });
      } else {
        this.kucunapi.zaituruku(pa).then(data => {
          this.listDetail();
          this.hideDaohuoModal();
        });
      }
  }
  /**
   * 获取两个日期相差天数
   * @param d1
   * @param d2
   */
  getdateDiff(d1: Date, d2: Date) {
    const days = d1.getTime() - d2.getTime();
    const day = parseInt(days / (1000 * 60 * 60 * 24) + '', 10);
    return day;
  }
  /**关闭修改仓库弹窗 */
  closeEditcangku() {
    this.bsModalRef.hide();
    this.listDetail();
  }

  // 查询库存明细表
  listDetail() {
    this.gridOptions.api.setRowData([]);
    this.kucunapi.listzaituDetail(this.search).then(data => {
      this.msg = '';
      this.gridOptions.api.setRowData(data);
      this.gridOptions.columnApi.autoSizeAllColumns();
      const total = { count: 0, weight: 0, length: 0 };
      data.forEach(element => {
        total['weight'] = total['weight'] + Number(element['weight']);
        total['length'] = total['length'] + Number(element['lengths']);
      });
      this.msg = this.msg + '     共' + data.length + '件，' +
        this.numberpipe.transform(total['weight'], '1.3-3') + '吨，' + total['length'] + '米';
      this.lmsg = this.msg;
      this.msglength = data.length;
    });

  }

  // 储存表格状态列
  tabelPostion() {
    this.storage.setObject('permanent_zaitukucunTablePosition', this.gridOptions.columnApi.getColumnState());
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
    // if (!this.pmitems) {
    //   this.pmitems = [{ value: '', label: '全部' }];
    //   this.classifyapi.getGnAndChandi().then((data) => {
    //     console.log(data);
    //     data.forEach(element => {
    //       this.pmitems.push({
    //         label: element['name'],
    //         value: element['id']
    //       })
    //     })
    //   });
    // }
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
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  @ViewChild('carshipnumModal') private carshipnumModal: ModalDirective;
  // 入库单上传信息及格式
  uploadParam: any = { module: 'zaitu', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = ".xls, application/xls";
  // 匹配入库单上传弹窗
  rukuUploader() {
    this.uploaderModel.show();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    console.log($event);
    this.kulingtixingconfim = false;
    const addData = {url: [$event.url], kulingtixingconfim: this.kulingtixingconfim};
    if ($event.length !== 0) {
      this.kucunapi.pipeizaitukucun(addData).then(data => {
        const kulingtixing = data['kulingtixing'];
        if (kulingtixing) {
          sweetalert({
            title: '你确定要上传吗？',
            text: kulingtixing,
            customClass: 'rukutixing',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b7e5',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnConfirm: false
          }, (is) => {
            if (is) {
              this.kulingtixingconfim = true;
              addData.kulingtixingconfim = this.kulingtixingconfim;
              this.kucunapi.pipeizaitukucun(addData).then(data1 => {
                sweetalert.close();
                this.hideDialog();
                this.toast.pop('success', '共匹配    ' + data1.count + '      件货物，共计吨位     ' + data1.tweight + '    吨');
              });
            } else {
              this.rukuapi.deletefile(addData).then(data1 => {
                sweetalert.close();
                this.hideDialog();
              });
            }
          });
        } else {
          this.hideDialog();
          this.toast.pop('success', '共匹配    ' + data.count + '      件货物，共计吨位     ' + data.tweight + '    吨');
        }
      });
    }
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

  perSale() {
    if (!this.tiaohuobillno) {
      this.toast.pop('warning', '请填写调货合同单号！');
      return;
    }
    const params = {};
    params['detidList'] = this.detids;
    params['tiaohuobillno'] = this.tiaohuobillno;
    this.kucunapi.perSale(params).then(data => {
      if (data) {
        this.listDetail();
        this.closePresaleModal();
      }
    });
  }
  cancelPerSale() {
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    this.detids = [];
    let ispersale = true;
    rowsparams.forEach(item => {
      if (item.selected) {
        if (item.data['orderid'] === undefined || !item.data['orderid']) {
          ispersale = false;
        } else {
          this.detids.push(item.data['id']);
        }
      }
    });
    if (!ispersale) {
      this.toast.pop('warning', '只有已经预售的钢卷可以取消预售！');
      return;
    }
    this.kucunapi.cancelPerSale(this.detids).then(data => {
      if (data) {
        this.listDetail();
      }
    });
  }

  showPresaleModal() {
    const rowsparams = this.gridOptions.api.getModel()['rowsToDisplay'];
    this.detids = [];
    this.tiaohuobillno = '';
    let istuduyingyong = true;
    rowsparams.forEach(item => {
      if (item.selected) {
        if (item.data['orgid'] === 22427 || item.data['orgid'] === 22350 || item.data['orgid'] === 21587) {
          this.detids.push(item.data['id']);
        } else {
          this.toast.pop('warning', '请选择资源中心项目或者材料的在途库存！');
          return;
        }
      }
    });
    // if (!istuduyingyong) {
    //   this.toast.pop('warning', '请选择要涂镀应用艺术机构的在途库存！');
    //   return;
    // }
    if (!this.detids.length) {
      this.toast.pop('warning', '请选择要预售的在途库存！');
      return;
    }
    this.presaleModal.show();
  }

  closePresaleModal() {
    this.presaleModal.hide();
  }

  // 匹配车船号上传信息及格式
  uploadParam2: any = { module: 'carshipnum', count: 1, sizemax: 1, extensions: ['xls'] };

  // 匹配车船号弹窗
  carshipnumUploader() {
    this.carshipnumModal.show();
  }

  //关闭弹窗
  hideCarshipnum() {
    this.carshipnumModal.hide();
  }

  uploads2($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.kucunapi.pipeiCarshipnum(addData).then(data => {
        if (data) {
          this.listDetail();
          this.toast.pop('success', '上传成功！');
          this.hideCarshipnum();
        }
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
      if (element['value'] === 'chandi' && element['options'].length) {
        this.search['chandi'] = element['options'][element['options'].length - 1]['value'];
        break;
      }
    }
  }
}
