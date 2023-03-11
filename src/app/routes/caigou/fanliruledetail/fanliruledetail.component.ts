import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QihuoService } from '../../qihuo/qihuo.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { StorageService } from 'app/dnn/service/storage.service';
import { QualityobjectionService } from 'app/routes/qualityobjection/qualityobjection.service';
import { TihuodetimportComponent } from 'app/routes/qualityobjection/qualityobjectiondetail/tihuodetimport/tihuodetimport.component';
import { CaigouService } from '../caigou.service';
import { MdmService } from 'app/routes/mdm/mdm.service';
import { DatePipe } from '@angular/common';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-fanliruledetail',
  templateUrl: './fanliruledetail.component.html',
  styleUrls: ['./fanliruledetail.component.scss'],
  providers: [QihuoService,QualityobjectionService]
})
export class FanliruledetailComponent implements OnInit {
  @ViewChild('adddetModal') adddetModal: ModalDirective;
  // 资源号弹窗
	@ViewChild('grnoModal') private grnoModal: ModalDirective;
  // 资源号弹窗
  @ViewChild('caigoudetModal') private caigoudetModal: ModalDirective;
  @ViewChild('youhuirulemodifyModal') youhuirulemodifyModal: ModalDirective;
	@ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  gridOptions: GridOptions;
	grnogridOptions: GridOptions;
	caigoudetgridOptions: GridOptions;
	fanliruledetid = null;
  fanliruledet = { youhuirule: '', jineexpression: '', fanliruleid: null};
  fanlirulemain: any = { cuser:{},seller: {} };
	ismodify = false; // 是否修改明细
	chandioptions: any = [];
  painttypes: any = [];
  caizhis: any = [];
  ducengs: any = [];
  jiesuantypes = [{ value: '', label: '全部' },{ value: 1, label: '后结' },{ value: 2, label: '锁单' }];
  zhouqitypes = [{ value: '', label: '全部' },{ value: 1, label: '月度' },{ value: 2, label: '季度' },{ value: 3, label: '半年度' },{ value: 4, label: '年度' }];
  youhuitypes = [];
  jisuanvalues = [{ value: '', label: '全部' },{ value: 1, label: '累计合同量' },{ value: 2, label: '累计出货量' },{ value: 3, label: '资源号' },{value:4, label:'金额'},{value:5, label:'付款金额'}];
	start: Date = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1);
  end: Date = new Date(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + 1);
  fanlirule = {gn:'',chandi:'',painttype:'',caizhi:'',sellerid:null,jiesuantype:'',monthstart:this.datepipe.transform(this.start, 'y-MM-dd'),monthend:this.datepipe.transform(this.end, 'y-MM-dd'),youhuitype:'',jisuanvalue:'',youhuirule:'',jineexpression:'',beizhu:'',zhouqi: null,zhouqitype:'',itemcode:''};
  loglist: any = [];
	tabviewindex: number;
	jineplaceholder = '请输入金额计算表达式，如 X*2.5%/2.25';
	jineplaceholdervalue = '例：X*2.5%/2.25、X*20';
	ruleplaceholdervalue = '例：0&lt;X≤500、X>500';
  constructor(
    private caigouApi: CaigouService,
    private actroute: ActivatedRoute,
    public settings: SettingsService,
    private toast: ToasterService,
    private router: Router,
		public mdmService: MdmService,
		private datepipe: DatePipe) {
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
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
		{ field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
    { cellStyle: { 'text-align': 'center' }, headerName: 'id', field: 'id', minWidth: 30, checkboxSelection: (params)=> params.data, headerCheckboxSelection:true,
        valueGetter: (params) => {
            if (params.data && params.data['id']) {
                return params.data['id'];
            } else {
                return '合计';
            }
        }  
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠规则', field: 'youhuirule', minWidth: 80,editable:() => this.fanlirulemain['jisuanvalue'] !== 3 && this.fanlirulemain['jisuanvalue'] !== 4 && this.fanlirulemain['jisuanvalue'] !== 5,
				cellRenderer: (params) => {
					if (params['data']) {
							if (this.fanlirulemain['jisuanvalue'] === 3 || this.fanlirulemain['jisuanvalue'] === 4) {
									if(params.data.youhuirule) {
											return `<a>查看资源号</a>`;
									} else {
											return `<a>添加资源号</a>`;
									}
							} else {
									return `<a>${params.data.youhuirule?params.data.youhuirule.replace("<","&lt;"):''}</a>`;
							}
					}
				}, 
				onCellClicked: (params) => {
					if (this.fanlirulemain['jisuanvalue'] === 3 || this.fanlirulemain['jisuanvalue'] === 4) {
						this.showgrnomodal(params.data);
					}
				},
				onCellValueChanged: (params) => this.jiagongvaluechanged(params, "youhuirule")
		  },
      { cellStyle: { 'text-align': 'center' }, headerName: '优惠金额计算表达式', field: 'jineexpression', minWidth: 100,editable:true,
				cellRenderer: (params) => {
					if (params['data']) {
							return `<a>${params.data.jineexpression}</a>`;
					}
				}, onCellValueChanged: (params) => this.jiagongvaluechanged(params, "jineexpression")  
		  },
      { cellStyle: { 'text-align': 'center' }, headerName: '规则累计预估优惠', field: 'totalyouhuijine', minWidth: 100,aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['totalyouhuijine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规则累计已返金额', field: 'totalyifanjine', minWidth: 100,aggFunc: 'sum', valueGetter: (params) => {
        if (params.data) {
          return Number(params.data['totalyifanjine']);
        } else {
          return 0;
        }
      }, valueFormatter: this.settings.valueFormatter2 },
      { cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'statusname', minWidth: 60 }
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
  }

  ngOnInit() {
    this.getdetail();
	this.getyouhuitypes();
  }
  getdetail() {
    this.caigouApi.getdetail(this.actroute.params['value']['id']).then(data => {
      this.fanlirulemain = data.fanlirule;
		this.setjineplaceholder(this.fanlirulemain['jisuanvalue'],this.fanlirulemain['jisuanvaluename']);
      this.gridOptions.api.setRowData(data.list);
    });
    this.caigouApi.getfanlirulelog(this.actroute.params['value']['id']).then(data => {
        this.loglist = data;
    });
  }
	setjineplaceholder(jisuanvalue,jisuanvaluename) {
		if (jisuanvalue === 4) {
			this.jineplaceholder = "请输入金额计算表达式，如 X*(Y-10)*0.01";
			this.jineplaceholdervalue = "例：X*(Y-10)*0.01，X指出货量，Y指采购单价（包含采购补差）";
			this.ruleplaceholdervalue = '例：0<X≤500、X>500';
		} else {
			this.jineplaceholder = "请输入金额计算表达式，如 X*2.5%/2.25";
			if(jisuanvalue === 1 || jisuanvalue === 2) {
				this.jineplaceholdervalue = this.jineplaceholdervalue + '，X指出货量';
				this.ruleplaceholdervalue = '例：0<X≤500、X>500' + '，X指' + jisuanvaluename;
			} else if (jisuanvalue === 5) {
                this.jineplaceholdervalue = this.jineplaceholdervalue + '，X指采购付款单总金额';
            }
		}
	}
  /**打开添加返利明细弹窗 */
  showadddet() {
    this.fanliruledet = {youhuirule: '', jineexpression: '', fanliruleid: this.fanlirulemain['id']};
    this.adddetModal.show();
  }
  adddetModalclose() {
    this.adddetModal.hide();
  }
  confirmadddet() {
    if ((Number(this.fanlirulemain['jisuanvalue'])==1 || Number(this.fanlirulemain['jisuanvalue'])==2) &&!this.fanliruledet['youhuirule']) {
        this.toast.pop('error', '请填写优惠规则！');
        return;
    }
    if (!this.fanliruledet['jineexpression']) {
        this.toast.pop('error', '请填写金额计算表达式！');
        return;
    }
    this.caigouApi.savefanliruledet(this.fanliruledet).then(data => {
        this.adddetModalclose();
        this.autofanlidet(null);
    });
  }
	// 修改行加工费
	jiagongvaluechanged(params, filed) {
		if (filed === 'youhuirule' && (this.fanlirulemain['jisuanvalue'] === 3 || this.fanlirulemain['jisuanvalue'] === 4)) {
			return false;
		}
		if (params.newValue === params.oldValue) return false;
		const obj = JSON.parse(JSON.stringify(params.data));
		this.caigouApi.modifydetail(obj).then(data => {
			this.autofanlidet(params.data['id'])
		}, err => {
			params.node.data[filed] = params.oldValue;
			params.node.setData(params.node.data);
		});
	}
  /**
   * 作废
   */
   zuofei() {
    const detids = new Array();
    const selectdata = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < selectdata.length; i++) {
        if (selectdata[i].selected && selectdata[i]['data']) {
            detids.push(selectdata[i]['data']['id']);
        }
    }
    if (!detids.length) {
        this.toast.pop('warning', '请选择要作废的明细！');
        return;
    }
    if (confirm('确定后会发起审批到资源中心负责人，你确定要作废吗？')) {
        this.caigouApi.fanlirulezuofei({detids:detids}).then(data => {
          this.getdetail();
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
            detids.push(selectdata[i]['data']['id']);
        }
    }
    if (!detids.length) {
        this.toast.pop('warning', '请选择要完成的明细！');
        return;
    }
    if (confirm('完成之后则不会再计算返利，你确定要完成吗？')) {
        this.caigouApi.finishfalirule({detids:detids}).then(data => {
          this.getdetail();
        });
    }
  }
	// 资源号
	showgrnomodal(params) {
		this.grnoModal.show();
		this.fanligrnoApi(params['id']);
		this.fanliruledetid = params['id'];
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
        this.grnoModalDialog();
        this.autofanlidet(this.fanliruledetid);
    })
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
            this.grnoModalDialog();
            this.autofanlidet(this.fanliruledetid);
		});
	}
	showmodify() {
    const params = JSON.parse(JSON.stringify(this.fanlirulemain));
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
    this.youhuirulemodifyModal.show();
  }
	hideyouhuirulemodifyModal() {
		this.youhuirulemodifyModal.hide();
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
	selectmonth1(value) {
    this.fanlirule['monthstart'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectmonth2(value) {
    this.fanlirule['monthend'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  modify() {
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
    if (this.fanlirule['sellerid'] instanceof Object) {
        this.fanlirule['sellerid'] = this.fanlirule['sellerid'].code;
    } else {
    this.fanlirule['sellerid'] = null;
    }
    this.caigouApi.updatefanlirule(this.fanlirule).then(data => {
        this.hideyouhuirulemodifyModal();
        this.autofanlidet(null);
    })
  }
  // 同步返利登记表
  autofanlidet(fanliruledetid) {
    this.toast.pop('wait', '正在同步返利登记表...');
    this.caigouApi.getdetail(this.actroute.params['value']['id']).then(data => {
        this.fanlirulemain = data.fanlirule;
        this.gridOptions.api.setRowData(data.list);
        data.list.forEach(element => {
            if (fanliruledetid) {
                if (!element['status'] && fanliruledetid === element['id']) {
                    this.caigouApi.autofanlidet({fanliruledetid:element['id']});
                }
            } else {
                if (!element['status']) {
                    this.caigouApi.autofanlidet({fanliruledetid:element['id']});
                }
            }
        });
    });
    this.caigouApi.getfanlirulelog(this.actroute.params['value']['id']).then(data => {
        this.loglist = data;
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
}
