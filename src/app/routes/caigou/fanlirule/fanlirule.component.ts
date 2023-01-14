import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { MdmService } from 'app/routes/mdm/mdm.service';
import { ModalDirective } from 'ngx-bootstrap';
import { CaigouService } from '../caigou.service';

@Component({
  selector: 'app-fanlirule',
  templateUrl: './fanlirule.component.html',
  styleUrls: ['./fanlirule.component.scss']
})
export class FanliruleComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('youhuirulecreateModal') private youhuirulecreateModal: ModalDirective;
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  // 资源号弹窗
  @ViewChild('grnoModal') private grnoModal: ModalDirective;
  // 资源号弹窗
  @ViewChild('caigoudetModal') private caigoudetModal: ModalDirective;
  // 操作记录弹窗
  @ViewChild('youhuirulelogModal') private youhuirulelogModal: ModalDirective;
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  start: Date = new Date();
  end: Date = new Date();
  gridOptions: GridOptions;
  grnogridOptions: GridOptions;
  caigoudetgridOptions: GridOptions;
  search: object = { month: '' };
  fanlirule = {gn:'',chandi:'',painttype:'',caizhi:'',sellerid:null,jiesuantype:'',monthstart:this.datepipe.transform(this.start, 'y-MM-dd'),monthend:this.datepipe.transform(this.end, 'y-MM-dd'),youhuitype:'',jisuanvalue:'',youhuirule:'',jineexpression:'',beizhu:'',zhouqi: null,zhouqitype:'',itemcode:''};
  chandioptions: any = [];
  painttypes: any = [];
  caizhis: any = [];
  ducengs: any = [];
  jiesuantypes = [{ value: '', label: '全部' },{ value: 1, label: '后结' },{ value: 2, label: '锁单' }];
  zhouqitypes = [{ value: '', label: '全部' },{ value: 1, label: '月度' },{ value: 2, label: '季度' },{ value: 3, label: '半年度' },{ value: 4, label: '年度' }];
  youhuitypes = [];
  loglist = [];
  jisuanvalues = [{ value: '', label: '全部' },{ value: 1, label: '累计合同量' },{ value: 2, label: '累计出货量' },{ value: 3, label: '资源号' },{value:4, label:'金额'},{value:5, label:'付款金额'}];
  fanliruledetid = null;
  ismodify = false; // 是否修改明细
  constructor(public settings: SettingsService, private caigouApi: CaigouService,
     private datepipe: DatePipe, private toast: ToasterService,public mdmService: MdmService, private router: Router) {
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
      enableFilter: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      { cellStyle: { 'text-align': 'center' }, headerName: 'ID', field: 'id', minWidth: 30, checkboxSelection: (params)=> params.data, headerCheckboxSelection:true,valueGetter: (params) => {
        if (params.data && params.data['billid']) {
          return params.data['billid'];
        } else {
          return '合计';
        }
      }  },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 100,
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billid) {
            return '<a target="_blank" href="#/fanlirule/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单时间', field: 'cdate', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '结算方式', field: 'jiesuantypename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠类型', field: 'youhuitype', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠范围-起', field: 'monthstart', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠范围-止', field: 'monthend', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '计算值', field: 'jisuanvaluename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠规则', field: 'youhuirule', minWidth: 120,
        cellRenderer: (params) => {
            if (params['data']) {
                if ((params['data']['jisuanvalue'] === 3 || params['data']['jisuanvalue'] === 4) && params['data']['fanliruledetid']) {
                    if(params.data.youhuirule) {
                        return `<a>查看资源号</a>`;
                    } else {
                        return `<a>添加资源号</a>`;
                    }
                } else {
                    return `${params.data.youhuirule?params.data.youhuirule.replace("<","&lt;"):''}`;
                }
            }
        }, onCellClicked: (params) => {
            if ((params['data']['jisuanvalue'] === 3 || params['data']['jisuanvalue'] === 4) && params['data']['fanliruledetid']) {
            this.showgrnomodal(params.data);
            }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠金额计算表达式', field: 'jineexpression', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '补贴优惠周期类型', field: 'zhouqitypename', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '补贴优惠周期(天)', field: 'zhouqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规则累计预估优惠', field: 'totalyouhuijine', minWidth: 120, aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['totalyouhuijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规则累计已返金额', field: 'totalyifanjine', minWidth: 120,   aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['totalyifanjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 120 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'a', minWidth: 60,
    //     cellRenderer: (params) => {
    //       if (params['data']) {
    //         return `<a>修改</a>`;
    //       }
    //     }, onCellClicked: (params) => {
    //         this.showmodify(params.data);
    //     } 
    //   },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 60,
    //     cellRenderer: (params) => {
    //       if (params['data']) {
    //         return `<a>日志</a>`;
    //       }
    //     }, onCellClicked: (params) => {
    //         this.showlog(params.data);
    //     } 
    //   }
    ];
    this.grnogridOptions = {
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
        enableFilter: true,
      };
      this.grnogridOptions.onGridReady = this.settings.onGridReady;
      this.grnogridOptions.groupSuppressAutoColumn = true;
      // 设置aggird表格列
      this.grnogridOptions.columnDefs = [
        { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
        { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 110, checkboxSelection: (params)=> params.data, headerCheckboxSelection:true,valueGetter: (params) => {
            if (params.data && params.data['grno']) {
              return params.data['grno'];
            } else {
              return '合计';
            }
          } },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'caigoubillno', minWidth: 80,
          cellRenderer: (params) => {
            if (params && params.data && null != params.data.caigoubillno) {
              return '<a target="_blank" href="#/caigou/' + params.data.caigouid + '">' + params.data.caigoubillno + '</a>';
            } else {
              return '';
            }
          }
        },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 80
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'month', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
        {
            cellStyle: { 'text-align': 'right' }, headerName: '采购量', field: 'caigouweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['caigouweight']) {
              return Number(params.data['caigouweight']);
            } else {
              return 0;
            }
          },
          valueFormatter: this.settings.valueFormatter3
        },
        {
            cellStyle: { 'text-align': 'right' }, headerName: '合同量', field: 'htweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['htweight']) {
              return Number(params.data['htweight']);
            } else {
              return 0;
            }
          },
          valueFormatter: this.settings.valueFormatter3
        },
        {
          cellStyle: { 'text-align': 'right' }, headerName: '入库量', field: 'rukuweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['rukuweight']) {
              return Number(params.data['rukuweight']);
            } else {
              return 0;
            }
        }, valueFormatter: this.settings.valueFormatter3
        },
        {
            cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'tuihuoweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['tuihuoweight']) {
              return Number(params.data['tuihuoweight']);
            } else {
                return 0;
            }
        }, valueFormatter: this.settings.valueFormatter3
        },
        // {
        //   cellStyle: { 'text-align': 'right' }, headerName: '在途量', field: 'zaituweight', aggFunc: 'sum', minWidth: 80,
        //   valueGetter: (params) => {
        //     if (params.data && params.data['zaituweight']) {
        //       return Number(params.data['zaituweight']);
        //     } else {
        //       return 0;
        //     }
        //   }, valueFormatter: this.settings.valueFormatter3
        // },
        {
          cellStyle: { 'text-align': 'right' }, headerName: '出货量', field: 'chuhuoweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['chuhuoweight']) {
              return Number(params.data['chuhuoweight']);
            } else {
              return 0;
            }
          }, valueFormatter: this.settings.valueFormatter3
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '结算单价', field: 'jiesuanprice', minWidth: 80 },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
          valueFormatter: this.settings.valueFormatter3
        },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 200 }
      ];
    this.caigoudetgridOptions = {
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
        enableFilter: true,
      };
      this.caigoudetgridOptions.onGridReady = this.settings.onGridReady;
      this.caigoudetgridOptions.groupSuppressAutoColumn = true;
      // 设置aggird表格列
      this.caigoudetgridOptions.columnDefs = [
        { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
        { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 110, checkboxSelection: (params)=> params.data, headerCheckboxSelection:true,valueGetter: (params) => {
            if (params.data && params.data['grno']) {
              return params.data['grno'];
            } else {
              return '合计';
            }
          } },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '编号', field: 'billno', minWidth: 80,
          cellRenderer: (params) => {
            if (params && params.data && null != params.data.billno) {
              return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
            } else {
              return '';
            }
          }
        },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 80
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '合同月份', field: 'gcmonth', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
        {
            cellStyle: { 'text-align': 'right' }, headerName: '采购量', field: 'caigouweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['caigouweight']) {
              return Number(params.data['caigouweight']);
            } else {
              return 0;
            }
          },
          valueFormatter: this.settings.valueFormatter3
        },
        {
          cellStyle: { 'text-align': 'right' }, headerName: '入库量', field: 'rukuweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['rukuweight']) {
              return Number(params.data['rukuweight']);
            } else {
              return 0;
            }
        }, valueFormatter: this.settings.valueFormatter3
        },
        {
            cellStyle: { 'text-align': 'right' }, headerName: '退货量', field: 'tuihuoweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['tuihuoweight']) {
              return Number(params.data['tuihuoweight']);
            } else {
                return 0;
            }
        }, valueFormatter: this.settings.valueFormatter3
        },
        // {
        //   cellStyle: { 'text-align': 'right' }, headerName: '在途量', field: 'zaituweight', aggFunc: 'sum', minWidth: 80,
        //   valueGetter: (params) => {
        //     if (params.data && params.data['zaituweight']) {
        //       return Number(params.data['zaituweight']);
        //     } else {
        //       return 0;
        //     }
        //   }, valueFormatter: this.settings.valueFormatter3
        // },
        {
          cellStyle: { 'text-align': 'right' }, headerName: '出货量', field: 'chuhuoweight', aggFunc: 'sum', minWidth: 80,
          valueGetter: (params) => {
            if (params.data && params.data['chuhuoweight']) {
              return Number(params.data['chuhuoweight']);
            } else {
              return 0;
            }
          }, valueFormatter: this.settings.valueFormatter3
        },
    {
          cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80,
          valueFormatter: this.settings.valueFormatter3
        },
        {
          cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80,
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 80 },
        { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 200 }
      ];
      this.getdate();
  }
  getdate() {
    let month:any = new Date().getMonth()+1;
    if (month<10) {
        month = '0'+month;
    }
    this.start = new Date(new Date().getFullYear() + '-' + month + '-01');
    this.end = new Date(new Date().getFullYear() + '-' + month + '-01');
    this.fanlirule['monthstart'] = this.datepipe.transform(this.start, 'y-MM-dd');
    this.fanlirule['monthend'] = this.datepipe.transform(this.end, 'y-MM-dd');
  }

  ngOnInit() {
    const date = new Date();
    // this.search['month'] = this.datepipe.transform(new Date(date.getFullYear(), date.getMonth(), 1), 'y-MM-dd');
    this.getDetail();
  }
  getDetail() {
    this.caigouApi.getfanliruledet(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  /**优惠类型 */
  getyouhuitypes() {
    this.youhuitypes = [];
    this.caigouApi.listkid("fanlirole_youhuitype").then(data => {
        data.forEach(element => {
            this.youhuitypes.push({value:element.name,label:element.name});
        });
    });
  }
  openquery() {
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.fanlirule = {gn:'',chandi:'',painttype:'',caizhi:'',sellerid:null,jiesuantype:'',monthstart:this.datepipe.transform(this.start, 'y-MM-dd'),monthend:this.datepipe.transform(this.end, 'y-MM-dd'),youhuitype:'',jisuanvalue:'',youhuirule:'',jineexpression:'',beizhu:'',zhouqi:null,zhouqitype:'',itemcode:''};
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    if (!this.search['month']) {
      this.toast.pop('error', '请选择月份！', '');
      return;
    }
    this.getDetail();
    this.classicModal.hide();
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 采购明细弹窗
  showquerycaigoudet() {
    this.querycaigoudet();
    this.caigoudetModal.show();
  }
  // 关闭弹窗
  querycaigoudethideDialog() {
    this.caigoudetModal.hide();
  }
  // 查询采购明细
  querycaigoudet() {
    this.caigoudetgridOptions.api.setRowData([]);
    this.caigouApi.getfanlirulecaigoudet({fanliruledetid:this.fanliruledetid}).then(data => {
        this.caigoudetgridOptions.api.setRowData(data);
    });
  }
  importcaigoudet() {
    const caigoudetids = new Array();
    const selectdata = this.caigoudetgridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selectdata.length; i++) {
        if (selectdata[i].selected && selectdata[i]['data']) {
            caigoudetids.push(selectdata[i]['data']['caigoudetid']);
        }
    }
    if (!caigoudetids.length) {
        this.toast.pop('warning', '请选择要添加的采购明细！');
        return;
    }
    this.caigouApi.importcaigoudet({fanliruledetid:this.fanliruledetid,caigoudetids:caigoudetids}).then(data => {
        this.querycaigoudethideDialog();
        this.fanligrnoApi(this.fanliruledetid);
        this.getDetail();
    });
  }
  // 添加优惠规则
  showyouhuirulemodal() {
    this.getyouhuitypes();
    this.selectNull();
    this.youhuirulecreateModal.show();
  }
  hideyouhuirulecreateModal() {
    this.youhuirulecreateModal.hide();
  }
  selectmonth1(value) {
    this.fanlirule['monthstart'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectmonth2(value) {
    this.fanlirule['monthend'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    this.painttypes = [];
    this.caizhis = [];
    this.ducengs = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
      }
      if (element['value'] === 'painttype') {
        this.painttypes = element['options'];
        this.painttypes.unshift({ value: '', label: '全部' });
      }
      if (element['value'] === 'caizhi') {
        this.caizhis = element['options'];
        this.caizhis.unshift({ value: '', label: '全部' });
      }
      if (element['value'] === 'duceng') {
        this.ducengs = element['options'];
        this.ducengs.unshift({ value: '', label: '全部' });
      }
    }
    this.fanlirule['gn'] = item.itemname;
    this.fanlirule['itemcode'] = item.itemcode;
    if (this.chandioptions.length) {
      this.fanlirule['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
    } 
  }
  create() {
    if (!this.fanlirule.gn) {
        this.toast.pop('error', '请填写品名！');
        return;
    }
    if (!this.fanlirule.chandi) {
        this.toast.pop('error', '请填写产地！');
        return;
    }
    if (!this.fanlirule.monthstart) {
        this.toast.pop('error', '请填写优惠范围-起！');
        return;
    }
    if (!this.fanlirule.monthend) {
        this.toast.pop('error', '请填写优惠范围-止！');
        return;
    }
    if (!this.fanlirule.youhuitype) {
        this.toast.pop('error', '请填写优惠类型！');
        return;
    }
    if (!this.fanlirule.jisuanvalue) {
        this.toast.pop('error', '请填写计算值！');
        return;
    }
    if (this.fanlirule.zhouqi === null || this.fanlirule.zhouqi === undefined) {
        this.toast.pop('error', '请填写优惠周期！');
        return;
    }
    if (!this.fanlirule.zhouqitype) {
        this.toast.pop('error', '请填写优惠周期类型！');
        return;
    }
    // if (Number(this.fanlirule.jisuanvalue)!==3 &&!this.fanlirule.jineexpression) {
    //     this.toast.pop('error', '请填写优惠规则！');
    //     return;
    // }
    // if (!this.fanlirule.jineexpression) {
    //     this.toast.pop('error', '请填写金额计算表达式！');
    //     return;
    // }
    if (this.fanlirule['sellerid'] instanceof Object) {
        this.fanlirule['sellerid'] = this.fanlirule['sellerid'].code;
    } else {
    this.fanlirule['sellerid'] = null;
    }
    if(this.ismodify) {
        this.caigouApi.updatefanlirule(this.fanlirule).then(data => {
            this.youhuirulecreateModal.hide();
            this.getDetail();
            this.ismodify = false;
        })
    } else {
        this.caigouApi.createfanlirule(this.fanlirule).then(data => {
            this.youhuirulecreateModal.hide();
            this.getDetail();
            this.router.navigate(['fanlirule', data['id']]);
        })
    }
  }
  // 资源号
  showgrnomodal(params) {
    this.grnoModal.show();
    this.fanligrnoApi(params['fanliruledetid']);
    this.fanliruledetid = params['fanliruledetid'];
  }
  fanligrnoApi(fanliruledetid) {
    this.caigouApi.getfanlirulegrnodet({fanliruledetid:fanliruledetid}).then(data => {
        this.grnogridOptions.columnApi.autoSizeAllColumns();
        this.grnogridOptions.api.setRowData(data);
    })
  }
  grnoModalDialog() {
    this.grnoModal.hide();
  }
  deletegrno() {
    const fanlirulegrnoids = new Array();
    const selectdata = this.grnogridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selectdata.length; i++) {
        if (selectdata[i].selected && selectdata[i]['data']) {
            fanlirulegrnoids.push(selectdata[i]['data']['id']);
        }
    }
    if (!fanlirulegrnoids.length) {
        this.toast.pop('warning', '请选择要删除的资源号明细！');
        return;
    }
    this.caigouApi.deletefanlirulegrno(fanlirulegrnoids).then(data => {
        this.fanligrnoApi(this.fanliruledetid);
        this.getDetail();
    })
  }
  /**
   * 作废
   */
  zuofei() {
    const detids = new Array();
    const selectdata = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selectdata.length; i++) {
        if (selectdata[i].selected && selectdata[i]['data']) {
            detids.push(selectdata[i]['data']['fanliruledetid']);
        }
    }
    if (!detids.length) {
        this.toast.pop('warning', '请选择要作废的明细！');
        return;
    }
    if (confirm('确定后会发起审批到资源中心负责人，你确定要作废吗？')) {
        this.caigouApi.fanlirulezuofei({detids:detids}).then(data => {
          this.getDetail();
        });
    }
  }
  /**
   * 批量完成
   */
  finishfanlirule() {
    const detids = new Array();
    const selectdata = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selectdata.length; i++) {
        if (selectdata[i].selected && selectdata[i]['data']) {
            detids.push(selectdata[i]['data']['fanliruledetid']);
        }
    }
    if (!detids.length) {
        this.toast.pop('warning', '请选择要完成的明细！');
        return;
    }
    if (confirm('完成之后则不会再计算返利，你确定要完成吗？')) {
        this.caigouApi.finishfalirule({detids:detids}).then(data => {
          this.getDetail();
        });
    }
  }
  // 打开操作记录
  showlog(params) {
    this.caigouApi.getfanlirulelog(params['id']).then(data => {
      this.loglist = data;
      this.youhuirulelogModal.show();
    });
  }
  hideyouhuirulelogModal() {
    this.youhuirulelogModal.hide();
  }
  showmodify(data) {
    const params = JSON.parse(JSON.stringify(data));
    this.ismodify = true;
    this.mdmService.getMdmAttributeDic({ itemcode: params['itemcode'] }).then(data1 => {
        this.chandioptions = [];
        this.painttypes = [];
        this.caizhis = [];
        this.ducengs = [];
        for (let index = 0; index < data1.length; index++) {
          const element = data1[index];
          if (element['value'] === 'chandi') {
            this.chandioptions = element['options'];
          }
          if (element['value'] === 'painttype') {
            this.painttypes = element['options'];
            this.painttypes.unshift({ value: '', label: '全部' });
          }
          if (element['value'] === 'caizhi') {
            this.caizhis = element['options'];
            this.caizhis.unshift({ value: '', label: '全部' });
          }
          if (element['value'] === 'duceng') {
            this.ducengs = element['options'];
            this.ducengs.unshift({ value: '', label: '全部' });
          }
        }
        this.fanlirule = params;
        this.start = new Date(params['monthstart'] + '-01');
        this.end = new Date(params['monthend'] + '-01');
        this.fanlirule.sellerid = {name:params['sellername'],code:params['sellerid']};
        this.fanlirule['monthstart'] = this.datepipe.transform(this.start, 'y-MM-dd');
        this.fanlirule['monthend'] = this.datepipe.transform(this.end, 'y-MM-dd');
    });
    this.youhuirulecreateModal.show();
  }
}
