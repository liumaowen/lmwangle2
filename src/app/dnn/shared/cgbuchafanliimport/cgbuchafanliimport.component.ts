import { CgbuchaModule } from './../../../routes/cgbucha/cgbucha.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DecimalPipe, DatePipe } from '@angular/common';
import { StorageService } from './../../service/storage.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from './../../../core/settings/settings.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { CaigouService } from '../../../routes/caigou/caigou.service';
import { CgbuchaapiService } from '../../../routes/cgbucha/cgbuchaapi.service';

@Component({
  selector: 'app-cgbuchafanliimport',
  templateUrl: './cgbuchafanliimport.component.html',
  styleUrls: ['./cgbuchafanliimport.component.scss']
})
export class CgbuchafanliimportComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('fanlirulelistModal') private fanlirulelistModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  gridOptions: GridOptions;
  fanlirulegridOptions: GridOptions;
  parentthis;
  saledet: object = { id: null, detids: [] };
  search = {start: '', end: '', chandi: '',gn: '', supplierid: '',grno:''};
  start: Date;
  end: Date;
  gangchangs: any[];
  chandioptions: any = [];
  total = { count: 0, tweight: 0, tlength: 0, tmoney: 0 };
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService,
    private toast: ToasterService, private classifyApi: ClassifyApiService, private datepipe: DatePipe,
    private cgbuchaApi: CgbuchaapiService, private caigouApi: CaigouService) {
      this.gridOptions = {
        groupDefaultExpanded: -1,
        suppressAggFuncInHeader: true,
        enableRangeSelection: true,
        rowDeselection: true,
        rowSelection: "multiple",
        overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
        overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
        enableColResize: true,
        enableSorting: true,
        excelStyles: this.settings.excelStyles,
        enableFilter: true,
        localeText: this.settings.LOCALETEXT,
        animateRows: true,
        getContextMenuItems: this.settings.getContextMenuItems,
        getNodeChildDetails: (params) => {
            if (params.group) {
              return {
                group: true,
                expanded: null != params.group,
                children: params.participants,
                field: 'group',
                key: params.group
              };
            } else {
              return null;
            }
        },
        onRowSelected: (params) => {
            if (params.node['selected']) {
              if (params.data) {
                this.total.count += 1;
                this.total.tweight = this.total.tweight['add'](params.node.data.chuhuoweight);
                // this.total.tlength = this.total.tlength['add'](params.node.data.length);
                // const linemoney = Number(params.node.data.pertprice) * Number(params.node.data.weight);
                this.total.tmoney = this.total.tmoney['add'](params.node.data.yugufanlijine);
              }
            } else {
              if (params.data) {
                this.total.count = this.total.count - 1;
                this.total.tweight = this.total.tweight['sub'](params.node.data.chuhuoweight);
                // this.total.tlength = this.total.tlength['sub'](params.node.data.length);
                // const linemoney = Number(params.node.data.pertprice) * Number(params.node.data.weight);
                this.total.tmoney = this.total.tmoney['sub'](params.node.data.yugufanlijine);
              }
            }
          },
        groupSelectsChildren: true // 分组可全选
      };
      this.gridOptions.groupSuppressAutoColumn = true;
      this.gridOptions.onGridReady = this.settings.onGridReady;
      // 设置aggird表格列
      this.gridOptions.columnDefs = [
        { cellStyle: { 'text-align': 'left' }, headerName: '选择', field: 'group', cellRenderer: 'group', minWidth: 40, checkboxSelection: true,headerCheckboxSelection: true,headerCheckboxSelectionFilteredOnly:true },
        // {
        //     cellStyle: { 'text-align': 'center' }, headerName: '采购合同号', field: 'billno', minWidth: 90,
        //     cellRenderer: (params) => {
        //       if (params.data && params.data.billno) {
        //         return '<a target="_blank" href="#/caigou/' + params.data.billid + '">' + params.data.billno + '</a>';
        //       } else {
        //         return '';
        //       }
        //     }
        // },
        {
            cellStyle: { 'text-align': 'center' }, headerName: '入库单号', field: 'rukubillno', minWidth: 90,
            cellRenderer: (params) => {
              if (params.data && params.data.rukubillno) {
                return '<a target="_blank" href="#/ruku/' + params.data.rukubillid + '">' + params.data.rukubillno + '</a>';
              } else {
                return '';
              }
            }
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '月份', field: 'month', minWidth: 100},
        { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'sellername', minWidth: 100},
        { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'rukudate', minWidth: 125},
        { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100},
        { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '采购机构', field: 'orgname', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '返利类型', field: 'youhuitype', minWidth: 90},
        {
            cellStyle: { 'text-align': 'center' }, headerName: '出货量', field: 'chuhuoweight', minWidth: 90,
            valueGetter: (params) => {
              if (params.data) {
                return Number(params.data['chuhuoweight']);
              } else {
                return 0;
              }
            }, valueFormatter: this.settings.valueFormatter3
          },
        // { cellStyle: { 'text-align': 'right' }, headerName: '享受补贴量（吨）', field: 'weight', minWidth: 100 },
        // { cellStyle: { 'text-align': 'right' }, headerName: '补贴单价', field: 'price', minWidth: 80 },
        { cellStyle: { 'text-align': 'right' }, headerName: '预估返利金额', field: 'yugufanlijine', minWidth: 100 },
        // { cellStyle: { 'text-align': 'right' }, headerName: '已补差金额', field: 'ybuchajine', minWidth: 100 },
        // { cellStyle: { 'text-align': 'right' }, headerName: '未补差金额', field: 'wbuchajine', minWidth: 100 },
        { cellStyle: { 'text-align': 'center' }, headerName: '返利id', field: 'fanlidetid', minWidth: 60 }
      ];
      this.fanlirulegridOptions = {
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
      this.fanlirulegridOptions.onGridReady = this.settings.onGridReady;
      // this.fanlirulegridOptions.groupUseEntireRow = true;
      this.fanlirulegridOptions.groupSuppressAutoColumn = true;
      // 设置aggird表格列
      this.fanlirulegridOptions.columnDefs = [
        { cellStyle: { 'text-align': 'center' }, headerName: '选择', field: '', minWidth: 30, checkboxSelection: true, headerCheckboxSelection:true,headerCheckboxSelectionFilteredOnly:true,pinned:true
        },
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
                      return params.data.youhuirule;
                  }
              }
          }, onCellClicked: (params) => {
            this.toast.pop('warning', '新功能开发中...！');
          }
        },
        { cellStyle: { 'text-align': 'center' }, headerName: '优惠金额计算表达式', field: 'jineexpression', minWidth: 120 },
        { cellStyle: { 'text-align': 'center' }, headerName: '补贴优惠周期类型', field: 'zhouqitypename', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '补贴优惠周期(天)', field: 'zhouqi', minWidth: 90 },
        { cellStyle: { 'text-align': 'center' }, headerName: '规则累计预估优惠', field: 'totalyouhuijine', minWidth: 120, valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['totalyouhuijine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2 },
        { cellStyle: { 'text-align': 'center' }, headerName: '规则累计已返金额', field: 'totalyifanjine', minWidth: 120, valueGetter: (params) => {
          if (params.data) {
            return Number(params.data['totalyifanjine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2 },
        { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 120 }
      ];
    }

  ngOnInit() {
  }
  // 补差单中的返利规则表
  showfanlirule() {
    const params = {};
    params['supplierid'] = this.parentthis.caigouModel['supplierid'];
    this.caigouApi.getcgbuchafanlirule(params).then(data => {
        this.fanlirulegridOptions.api.setRowData(data);
    });
    this.fanlirulelistModal.show();
  }
  closefanlirulelistModal() {
    this.fanlirulelistModal.hide();
  }
  // 通过规则表查询返利登记明细表
  queryfanlidet() {
    const fanliruledetid = [];
    let selected = this.fanlirulegridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].isSelected() && selected[i].data['fanliruledetid']) {
        fanliruledetid.push(selected[i].data.fanliruledetid);
      }
    };
    if (!fanliruledetid.length) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.caigouApi.getfanidetgroup(fanliruledetid).then(data => {
        this.gridOptions.api.setRowData(data);
        this.closefanlirulelistModal();
    });
  }
  openquery() {
    this.selectNull();
    // this.caigouApi.getchandi().then(data => {
    //   this.gangchangs = data;
    // });
    this.classicModal.show();
  }
  selectegangchang(value) {
    this.search['chandiid'] = value.id;
  }
  selectNull() {
    this.search = {start: '', end: '', chandi: '',gn: '',supplierid: '',grno:'' };
  }
  close() {
    this.classicModal.hide();
  }
  query() {
    this.search['supplierid'] = this.parentthis.caigouModel['supplierid'];
    if (!this.search['start']) {
      this.toast.pop('error', '请选择开始月份！', '');
      return;
    }
    if (!this.search['end']) {
      this.toast.pop('error', '请选择结束月份！', '');
      return;
    }
    if (this.start > this.end) {
      this.toast.pop('error', '开始月份大于结束月份，请重新选择！', '');
      return;
    }
    this.caigouApi.getfanidetgroup(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
    this.classicModal.hide();
  }
  selectstartmonth(value) {
    this.start = value.getTime();
    this.search['start'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectendmonth(value) {
    this.end = value.getTime();
    this.search['end'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  // 引入
  import() {
    this.saledet['detids'] = [];
    let selected = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].isSelected() && selected[i].data['rukudetid']) {
        this.saledet['detids'].push({fanlidetid:selected[i].data.fanlidetid,rukudetid:selected[i].data.rukudetid,yugufanlijine:selected[i].data.yugufanlijine});
      }
    };
    this.saledet['id'] = this.parentthis.caigouModel.id;
    if (!this.saledet['detids'].length) {
      this.toast.pop('error', '请选择相关明细！', '');
      return;
    }
    this.cgbuchaApi.importfanlinew(this.saledet).then(data => {
      this.parentthis.querydata();
      this.bsModalRef.hide();
    });
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.chandioptions = [];
    for (let index = 0; index < attrs.length; index++) {
      const element = attrs[index];
      if (element['value'] === 'chandi') {
        this.chandioptions = element['options'];
        break;
      }
    }
    this.search['gn'] = item.itemname;
    if (this.chandioptions.length) {
      this.search['chandi'] = this.chandioptions[0]['value'];
    }
  }
	/**打开上传捆包号上传弹窗 */
	showuploadkunbaohao() {
		this.uploaderModel.show();
	}
	// 关闭上传弹窗
	hideDialog() {
		this.uploaderModel.hide();
	}
	// 上传成功执行的回调方法
	uploads($event) {
		const addData = [$event.url];
		const params = {cgbuchaid:this.parentthis.caigouModel.id,url:addData,isupload:false};
		if ($event.length !== 0) {
			this.cgbuchaApi.kunbaohaopipeifanli(params).then(data => {
				let msgs = '上传件数：'+data['tcount']+'，匹配件数：'+data['vcount'];
				if (data['msg']) {
					msgs += '，'+data['msg'];
				}
				if (confirm(msgs)) {
					params.isupload = true;
					this.cgbuchaApi.kunbaohaopipeifanli(params).then(data => {
						this.toast.pop('success', '上传成功！');
					  this.bsModalRef.hide();
						this.parentthis.querydata();
					})
				}
			});
		}
		this.hideDialog();
	}
}
