import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { GridOptions } from 'ag-grid/main';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { UserapiService } from './../../../dnn/service/userapi.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { RukuService } from './../ruku.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CustomerapiService } from './../../customer/customerapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
const sweetalert = require('sweetalert');

@Component({
  selector: 'app-rukudetreport',
  templateUrl: './rukudetreport.component.html',
  styleUrls: ['./rukudetreport.component.scss']
})
export class RukudetreportComponent implements OnInit {
  addData: any = {}; // 上传的参数
  // 查询条件对象
  search = {
    gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', sellerid: '',
    caizhi: '', ppro: '', orgid: '', cuserid: '', id: '', start: new Date(), end: NaN, grno: ''
  };
  supplier: any;
  gridOptions: GridOptions;
  lgridOptions: GridOptions;
  maxDate = new Date();
  // 上传弹窗实例
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  @ViewChild('lclassicModal') private lclassicModal: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
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
  // 选择品名后才能选择产地等信息
  disabled = true;
  // 入库单上传信息及格式
  uploadParam: any = { module: 'ruku', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  kulingtixingconfim = false;
  attrs = [];
  constructor(private rukuapi: RukuService, public settings: SettingsService, private userapi: UserapiService,
    private datepipe: DatePipe, private toast: ToasterService,private customerApi: CustomerapiService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
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
    this.lgridOptions = {
      groupDefaultExpanded: -1,
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
      suppressRowClickSelection: true, // 点击不会选择行，用于多选框
      rowSelection: 'multiple',
    };
    this.lgridOptions.onGridReady = this.settings.onGridReady;
    this.lgridOptions.groupSuppressAutoColumn = true;

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置入库汇总aggird表格列
    this.lgridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'left' }, headerName: '选择', field: '', width: 65,
        checkboxSelection: true, suppressMovable: true, headerCheckboxSelection: true,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '状态', field: 'isfinish', width: 80,
        cellRenderer: (params) => {
          if (params.data.isfinish) {
            return '已完成';
          } else {
            return '未完成';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'goodscode.guige', minWidth: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'tweight', minWidth: 90 }
    ];
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { field: 'group', rowGroup: true, headerName: '合计', hide: true, valueGetter: (params) => '合计' },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '单号', field: 'billno', minWidth: 100,
        valueFormatter: this.settings.valueFormatter,
        // cellRenderer: (params) => {
        //   if (null != params.data.billid) return '<a target="_blank" href="#/ruku/' + params.data.billid + '">'
        //  + params.data.billno + '</a>'
        //   return params.data.billno
        // }
        cellRenderer: (params) => {
          if (params && params.data && null != params.data.billno) {
            return '<a target="_blank" href="#/ruku/' + params.data.billid + '">' + params.data.billno + '</a>';
          } else {
            return '合计';
          }
        }
      },

      { cellStyle: { 'text-align': 'center' }, headerName: '入库时间', field: 'cdate', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否退货', field: 'istuihuo', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '供应商', field: 'supplier', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 150 },
      { cellStyle: { 'text-align': 'center' }, headerName: '机构', field: 'orgname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 60,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 60},
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 70 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 60, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['weight']) {
            return Number(params.data['weight']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter3
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '成本价', field: 'cprice', minWidth: 80,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '金额', field: 'jine', minWidth: 100, aggFunc: 'sum',
        valueGetter: (params) => {
          if (params.data && params.data['jine']) {
            return Number(params.data['jine']);
          } else {
            return 0;
          }
        }, valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否上传质保书', field: 'zhibaouploaded', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '制单人', field: 'cusername', minWidth: 75 },
      { cellStyle: { 'text-align': 'center' }, headerName: '代理人', field: 'ausername', minWidth: 75 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '库存ID', field: 'kucunid', minWidth: 75, cellRenderer: (params) => {
          if (params && params.data && null != params.data.kucunid) {
            return '<a target="_blank" href="#/chain/' + params.data.kucunid + '">' + params.data.kucunid + '</a>';
          } else {
            return '';
          }
        }
      }
    ];

    this.rukudet();
  }

  ngOnInit() {
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
      this.userapi.getarea().then(data => {
        data['gn'].forEach(element => {
          this.pmitems.push({
            value: element['id'],
            label: element['name']
          });
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
          });
        });
      });
    }
    this.findWiskind();
    this.classicModal.show();
  }

  // 品名选中改变
  selectGnAction(key) {
    if (!this.search[key]) { return; }
    else {
      const gnid = this.search['gnid'];
    }
    this.search['chandi'] = '';
    this.search['color'] = '';
    this.search['width'] = '';
    this.search['houdu'] = '';
    this.search['duceng'] = '';
    this.search['caizhi'] = '';
    this.search['ppro'] = '';
    const cditems = new Set();
    const coloritems = new Set();
    const widthitems = new Set();
    const hditems = new Set();
    const dcitems = new Set();
    const czitems = new Set();
    const hclitems = new Set();
    this.cditems = [{ value: '', label: '全部' }];
    this.coloritems = [{ value: '', label: '全部' }];
    this.widthitems = [{ value: '', label: '全部' }];
    this.hditems = [{ value: '', label: '全部' }];
    this.dcitems = [{ value: '', label: '全部' }];
    this.czitems = [{ value: '', label: '全部' }];
    this.hclitems = [{ value: '', label: '全部' }];
    this.rukuapi.getGoodscodeAttribute({ gnid: this.search['gnid'] }).then(data => {
      data.forEach(element => {
        if (element['chandi']) { cditems.add(JSON.stringify({ value: element['chandi'], label: element['chandi'] })); }
        if (element['color']) { coloritems.add(JSON.stringify({ value: element['color'], label: element['color'] })); }
        if (element['width']) { widthitems.add(JSON.stringify({ value: element['width'], label: element['width'] })); }
        if (element['houdu']) { hditems.add(JSON.stringify({ value: element['houdu'], label: element['houdu'] })); }
        if (element['duceng']) { dcitems.add(JSON.stringify({ value: element['duceng'], label: element['duceng'] })); }
        if (element['caizhi']) { czitems.add(JSON.stringify({ value: element['caizhi'], label: element['caizhi'] })); }
        if (element['ppro']) { hclitems.add(JSON.stringify({ value: element['ppro'], label: element['ppro'] })); }
      });

      cditems.forEach((e: any) => {
        this.cditems.push(JSON.parse(e));
      });
      coloritems.forEach((e: any) => {
        this.coloritems.push(JSON.parse(e));
      });
      widthitems.forEach((e: any) => {
        this.widthitems.push(JSON.parse(e));
      });
      hditems.forEach((e: any) => {
        this.hditems.push(JSON.parse(e));
      });
      dcitems.forEach((e: any) => {
        this.dcitems.push(JSON.parse(e));
      });
      czitems.forEach((e: any) => {
        this.czitems.push(JSON.parse(e));
      });
      hclitems.forEach((e: any) => {
        this.hclitems.push(JSON.parse(e));
      });
    });
    this.disabled = false;
  }

  // 查询
  select() { 
    this.rukudet();
    this.closeclassicmodal();
  }

  rukudet() {
    const search = {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', caizhi: '',
      ppro: '',  cuserid: '', id: '', start: null, end: '', sellerid: ''
    };
    search['start'] = this.datepipe.transform(this.search['start'], 'y-MM-dd');
    if (this.search['end']) { search['end'] = this.datepipe.transform(this.search['end'], 'y-MM-dd'); }
    search['caizhi'] = this.search['caizhi'];
    search['cangkuid'] = this.search['cangkuid'];
    search['chandi'] = this.search['chandi'];
    search['color'] = this.search['color'];
    search['cuserid'] = this.search['cuserid']['code'] || '';
    search['duceng'] = this.search['duceng'];
    search['gn'] = this.search['gn'];
    if (this.search['grno']) { search['grno'] = this.search['grno']; }
    search['houdu'] = this.search['houdu'];
    search['id'] = this.search['id'];
    search['orgid'] = this.search['orgid'];
    search['ppro'] = this.search['ppro'];
    search['width'] = this.search['width'];
    search['buyerid'] = this.search['buyerid'];
    if (this.supplier instanceof Object) {
      search['sellerid'] = this.supplier.code;
    }
    this.rukuapi.rukudet(search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }

  // 关闭查询弹窗
  closeclassicmodal() {
    this.classicModal.hide();
  }

  // 清空查询对象，重置按钮
  selectNull() {
    this.search = {
      gn: '', cangkuid: '', chandi: '', color: '', width: '', houdu: '', duceng: '', sellerid: '',
      caizhi: '', ppro: '', orgid: '', cuserid: '', id: '', start: new Date(), end: NaN, grno: ''
    };
    this.disabled = true;
    this.attrs = [];
  }



  // 查询
  query() {

   }


  // 入库单上传弹窗
  rukuUploader() {
    this.uploaderModel.show();
  }

  // 上传成功执行的回调方法
  uploads($event) {
    this.kulingtixingconfim = false;
    const addData = {url: [$event.url], kulingtixingconfim: this.kulingtixingconfim};
    if ($event.length !== 0) {
      this.rukuapi.create(addData).then(data => {
        if (data.length) {
          const kulingtixing = data[0]['kulingtixing'];
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
              this.rukuapi.create(addData).then(data1 => {
                sweetalert.close();
                this.lclassicModal.show();
                this.lclassicModal.config.ignoreBackdropClick = true;
                this.toast.pop('success', '上传成功，等待推送通知！');
                this.lgridOptions.api.setRowData(data1);
                this.addData['cgdetlist'] = data1;
              });
            } else {
              this.rukuapi.deletefile(addData).then(data1 => {
                sweetalert.close();
              });
            }
          });
          } else {
            this.lclassicModal.show();
            this.lclassicModal.config.ignoreBackdropClick = true;
            this.toast.pop('success', '上传成功，等待推送通知！');
            this.lgridOptions.api.setRowData(data);
            this.addData['cgdetlist'] = data;
          }
        }
      });
    }
  }

  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

  // 导出
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      allColumns: false,
      onlySelected: false,
      columnGroups: true,
      skipGroups: true,
      suppressQuotes: false,
      fileName: '入库明细表.xls'
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
  closelclassicmodal() {
    this.lclassicModal.hide();
  }
  /**合同完成 */
  finishedchange() {
    const params = [];
    const rows = [];
    const rowCount = this.lgridOptions.api.getModel()['rowsToDisplay'];
    rowCount.forEach(item => {
      if (item.selected) {
        item.data.isfinish = !item.data.isfinish;
        rows.push(item.data);
      }
      const objectparams = {
        cgdetid: item.data.cgdetid, isfinish: item.data.isfinish, tweight: item.data.tweight, tcount : item.data.tcount, tlength : item.data.tlength
      };
      params.push(objectparams);
    });
    if (!rows.length) {
      this.toast.pop('warning', '请选择明细后再点击合同完成！');
      return;
    }
    rowCount.forEach(rownode => {
      rownode.setDataValue('isfinish', rownode.data.isfinish);
      this.lgridOptions.api.refreshCells({ columns: ['isfinish'] });
    });
    // this.lgridOptions.api.refreshRows(rowCount);
    this.addData['cgdetlist'] = params;
  }
  /**推送信息 */
  sendmsg() {
    this.rukuapi.rukusendmsg(this.addData).then(data => {
      this.rukudet();
      this.toast.pop('success', '推送成功！');
      this.closelclassicmodal();
      this.hideDialog();
    });
  }

  //查询采购单位
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

  showmdmgndialog() {
    this.mdmgndialog.show();
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
