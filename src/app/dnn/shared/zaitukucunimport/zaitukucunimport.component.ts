import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { StorageService } from '../../service/storage.service';
import { UserapiService } from '../../service/userapi.service';
import { DecimalPipe } from '@angular/common';
import { KucunService } from '../../../routes/kucun/kucun.service';
import { BusinessorderapiService } from '../../../routes/businessorder/businessorderapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from '../../../core/settings/settings.service';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-zaitukucunimport',
  templateUrl: './zaitukucunimport.component.html',
})
export class ZaitukucunimportComponent implements OnInit {
  // 接收父页面this对象
  componentparent;
  gridOptions: GridOptions;
  //标记跳出循环
  mark;
  // 临时记录查询出来的合计
  lmsg;
  // 记录合计值
  msg;
  // 记录全部数量
  msglength;

  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private kucunapi: KucunService,
    private numberpipe: DecimalPipe, private userapi: UserapiService, private storage: StorageService,
    private businessorderapi : BusinessorderapiService,
    private toast: ToasterService, ) {
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
                    skipFooters: false, allColumns: false, onlySelected: false, columnGroups: true, skipGroups: false, suppressQuotes: false, fileName: '库存明细表.csv', columnSeparator: ''
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
            subMenu: [{ name: '全部展开', action: () => { params.api.expandAll(); } }, { name: '全部收缩', action: () => { params.api.collapseAll(); } }]
          }
        ];
        return result;
      },
      onCellValueChanged: (params) => { this.kucunapi.modifyBeizhu({ kucunid: params.data.kucunid, beizhu: params.data.beizhu }); },
      onGridReady: () => {
        if (this.storage.getObject('permanent_kucunTablePosition')) {
          this.gridOptions.columnApi.setColumnState(this.storage.getObject('permanent_kucunTablePosition'));
        }
      }
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'left' }, headerName: '机构', field: 'orgname', minWidth: 70, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 80 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 60, editable: true, valueGetter: (params) => {
          if (params.data['beizhu'] === undefined) return null;
          else return params.data['beizhu'];
        }
      },
    ];
  }

  ngOnInit() {
  }

  // 计算选中行的合计
  datasum() {
    let list = [];
    list = this.gridOptions.api.getSelectedNodes();
    if (list.length == this.msglength || list.length == 0) { return; };
    let tlength = 0;
    let tweight = 0;
    for (let i = 0; i < list.length; i++) {
      tlength = tlength + Number(list[i].data.lengths);
      tweight = tweight + Number(list[i].data.weight);
    }
    this.msg = '选中' + list.length + '件，' + this.numberpipe.transform(tweight, '1.3-3') + '吨，' + tlength + '米';
  }

  // 查询库存明细表
  listDetail() {

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
    if (!this.pmitems) {
      this.pmitems = [{ value: '', label: '全部' }];
      this.userapi.getarea().then(data => {
        data['gn'].forEach(element => {
          this.pmitems.push({
            value: element['id'],
            label: element['name']
          })
        });
      });
    }
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
    this.classicModal.show();
  }
  
  items; // 机构
  pmitems; // 品名
  ckitems; // 仓库
  cditems; // 产地
  coloritems;// 颜色
  widthitems;// 宽度
  hditems;// 厚度
  dcitems;// 镀层
  czitems;// 材质
  hclitems;// 后处理

  search = {
    gnid: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '',
    chandi: '', color: '', width: '', houdu: '', duceng: '',
    caizhi: '', ppro: '', orgid: ''
  };

  // 默认禁止选择
  disabled = true;

  // 查询出来所有的分类
  data = new Array<any>();

  // 品名选中改变
  selectGnAction(key) {
    if (!this.search[key]) return;
    else {
      let gnid = this.search['gnid'];
    }
    this.kucunapi.getConditions({ gnid: this.search['gnid'] }).then(data => {
      this.data = data;
      this.filter();
    });
    this.disabled = false;
  }

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

  // 定义过滤之后的集合
  filterConditionObj = {}; // {chandi:[],width:[]}

  // 赛选过滤方法
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      let otherFieldArr = this.fieldArr.filter(element => element != fieldElement);
      let queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.search[otherField] == '' || dataElement[otherField] == this.search[otherField];
          })) {
            let fieldValue = dataElement[fieldElement];
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
    this.search = { gnid: '', cangkuid: '', kunbaohao: '', grno: '', nrno: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '', ppro: '', orgid: '' };
    this.disabled = true;
  }

  // 查询
  select() {
    this.listDetail();
    this.closeclassicmodal();
  }

  // 查询弹窗对象
  @ViewChild('classicModal') private classicModal: ModalDirective;



  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }

  isimport = { flag: false };
  qihuodetid: any;
  tihuodetid: any;

  import() {

  }




}
