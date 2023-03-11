import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { KucunService } from '../kucun.service';

@Component({
  selector: 'app-autopaidan',
  templateUrl: './autopaidan.component.html',
  styleUrls: ['./autopaidan.component.scss']
})
export class AutopaidanComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  chandioptions: any = [];
  attrs = [];
  queryandcreate = 0; // 0-创建，1-查询
  // 上传信息及格式
  uploadParam: any = { module: 'autopaidan', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 上传弹窗实例
  @ViewChild('uploadModal') private uploaderModel: ModalDirective;
  // 修改弹窗
  @ViewChild('updateModal') private updateModal: ModalDirective;
  @ViewChild('createdialog') private createdialog: ModalDirective;
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('refreshmaycurModel') private refreshmaycurModel: ModalDirective;
  gns: any = [];
  chandis: any = [];
  houdus: any = [];
  widths: any = [];
  painttypes: any = [];
  colors: any = [];
  ducengs: any = [];
  caizhis: any = [];
  isChandi = false;
  showGuige = false;
  model: any = {};
  gugieobj: any = {};
  requestparams: any = {};
  cuser: any = {};
  gridOptions: GridOptions;
  editparams: any = {};

  start = new Date();
  end: Date;
  constructor(public settings: SettingsService,
    private kucunapi: KucunService,
    private toast: ToasterService,
    private classifyapi: ClassifyApiService) {
    this.gridOptions = {
      rowSelection: 'multiple', 
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 ,
      checkboxSelection: true, headerCheckboxSelection: true},
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57},
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '库存量', field: 'tweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '未产量', field: 'noweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销量（指数平移年度销量/12）', field: 'saleweight1', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销量（近三月月均销量）', field: 'saleweight2', minWidth: 200 },
      { cellStyle: { 'text-align': 'center' }, headerName: '推荐下单量', field: 'paidanweight', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '删除', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">删除</a>';
        }, onCellClicked: (data) => {
          if (confirm('你确定要删除吗？')) {
            this.kucunapi.deleteautopaidan(data.data.id).then(() => {
              this.toast.pop('success', '删除成功！');
              this.listDetail();
            });
          }
        }
      },
      // {
      //   cellStyle: { 'text-align': 'center' }, headerName: '修改', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
      //     return '<a target="_blank">修改</a>';
      //   }, onCellClicked: (data) => {
      //     this.updateshowmodal(data.data);
      //   }
      // }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.kucunapi.getautopaidan(this.requestparams).then((response) => {
      this.gridOptions.api.setRowData(response); // 网格赋值
    });
  }
  openQueryDialog() {
    this.showclassicModal();
    this.selectNull();
  }

  openRefreshDialog() {
    this.showrefreshmaycurModel();
  }

  selectNull() {
    this.requestparams = {};
    this.model = {};
    this.gugieobj = {};
    this.isChandi = false;
    this.showGuige = false;
    this.chandis = [];
    this.houdus = [];
    this.widths = [];
    this.colors = [];
    this.ducengs = [];
    this.caizhis = [];
    this.cuser = null;
    // this.getGnAndChandi();
    this.attrs = [];
  }

  // 查询
  query() {
    if (typeof (this.cuser) === 'string' || !this.cuser) {
      this.requestparams['cuserid'] = '';
    } else if (typeof (this.cuser) === 'object') {
      this.requestparams.cuserid = this.cuser['code'];
    }
    this.listDetail();
    this.hideclassicModal();
  }
  // 导出明细表
  agExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      allColumns: false,
      onlySelected: false,
      suppressQuotes: false,
      fileName: '自动排单明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  showclassicModal() {
    this.classicModal.show();
  }
  showrefreshmaycurModel() {
    this.refreshmaycurModel.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }
  hiderefreshmaycurModel() {
    this.refreshmaycurModel.hide();
  }
  /**查询弹窗选择品名 */
  selectedgn1(value) {
    delete this.requestparams['chandiid'];
    this.requestparams['gnid'] = value.id;
    this.isChandi = true;
    this.chandis = [];
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element.id,
        label: element.name
      });
    });
  }
  // 上传弹窗
  upload() {
    this.uploaderModel.show();
  }
  // 上传成功执行的回调方法
  uploads($event) {
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.kucunapi.uploadautopaidan(addData).then(data => {
        this.toast.pop('success', '上传成功！');
        this.listDetail();
      });
    }
    this.hideDialog();
  }
  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }
  /**打开修改弹窗 */
  updateshowmodal(params) {
    this.editparams = JSON.parse(JSON.stringify(params));
    this.updateModal.show();
  }
  hideupdateModal() {
    this.updateModal.hide();
  }
  // save() {
  //   this.kucunapi.editkucunyujing(this.editparams).then(data => {
  //     this.toast.pop('success', '修改成功！');
  //     this.hideupdateModal();
  //     this.listDetail();
  //   });
  // }
  add() {
    this.createdialog.show();
    this.selectNull();
  }
  dialogcoles() {
    this.createdialog.hide();
  }
  /**获取品名 */
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      this.gns = [];
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element
        });
      });
    });
  }
  selectedgn(value) {
    this.model = {};
    this.model['gn'] = value.name;
    this.isChandi = true;
    this.attrs = [];
    this.showGuige = false;
    this.chandis = [];
    this.painttypes = [];
    this.gugieobj = {};
    value.attrs.forEach(element => {
      this.chandis.push({
        value: element,
        label: element.name
      });
    });
  }
  /**选择产地 */
  selectedchandi(event) {
    const value = event.id;
    this.model['chandi'] = event.name;
    this.attrs = [];
    delete this.model['houdu'];
    delete this.model['width'];
    delete this.model['color'];
    delete this.model['duceng'];
    delete this.model['caizhi'];
    delete this.model['painttype'];
    this.gugieobj = {};
    this.classifyapi.getAttrs(value).then(data => {
      this.attrs = data;
      this.attrs.forEach(item => {
        if (item.name === 'houduid') {
          this.houdus = [];
          item.options.forEach(ele => {
            this.houdus.push({
              value: ele.label,
              label: ele.label
            });
          });
        }
        if (item.name === 'widthid') {
          this.widths = [];
          item.options.forEach(ele => {
            this.widths.push({
              value: ele.label,
              label: ele.label
            });
          });
        }
        if (item.name === 'painttypeid') {
          this.painttypes = [];
          item.options.forEach(ele => {
            this.painttypes.push({
              value: ele,
              label: ele.label
            });
          });
        }
        if (item.name === 'colorid') {
          this.colors = [];
          item.options.forEach(ele => {
            this.colors.push({
              value: ele.label,
              label: ele.label
            });
          });
        }
        if (item.name === 'ducengid') {
          this.ducengs = [];
          item.options.forEach(ele => {
            this.ducengs.push({
              value: ele.label,
              label: ele.label
            });
          });
        }
        if (item.name === 'caizhiid') {
          this.caizhis = [];
          item.options.forEach(ele => {
            this.caizhis.push({
              value: ele.label,
              label: ele.label
            });
          });
        }
      });
    });
    this.showGuige = true;
  }
  /**选择油漆种类 */
  selectedpainttype(event) {
    const value = event.value;
    this.model['painttype'] = event.label;
    if (this.model['chandi'] === '烨辉彩涂') {
      delete this.model['color'];
      this.classifyapi.getAttrs(value).then(data => {
        data.forEach(item => {
          if (item.name === 'colorid') {
            this.colors = [];
            item.options.forEach(ele => {
              this.colors.push({
                value: ele.label,
                label: ele.label
              });
            });
          }
        });
      });
    }
  }
  /**选择规格 */
  selectedguige(event,label) {
    this.model[label] = event.label;
  }
  create() {
    console.log(this.requestparams)
    if (!this.requestparams['gn']) {
      this.toast.pop('warning', '品名必填！');
      return;
    }
    if (!this.requestparams['chandi']) {
      this.toast.pop('warning', '产地必填！');
      return;
    }
    if (!this.requestparams['houdu']) {
      this.toast.pop('warning', '厚度必填！');
      return;
    }
    if (!this.requestparams['width']) {
      this.toast.pop('warning', '宽度必填！');
      return;
    }
    if (!this.requestparams['color']) {
      this.toast.pop('warning', '颜色必填！');
      return;
    }
    if (!this.requestparams['duceng']) {
      this.toast.pop('warning', '镀层必填！');
      return;
    }
    if (!this.requestparams['caizhi']) {
      this.toast.pop('warning', '材质必填！');
      return;
    }
    delete this.requestparams['chandio'];
    this.kucunapi.createautopaidan(this.model).then(data => {
      this.listDetail();
      this.dialogcoles();
    });
  }
  showmdmgndialog(flag) {
    this.queryandcreate = flag;
    this.mdmgndialog.show();
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    if (this.queryandcreate === 0) {
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        element['options'].unshift({ value: '', label: '全部' });
        if (element['value'] === 'chandi') {
          this.chandioptions = element['options'];
        }
      }
      this.requestparams['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.requestparams['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
      }
      this.attrs = attrs;
    } else {
      this.chandioptions = [];
      for (let index = 0; index < attrs.length; index++) {
        const element = attrs[index];
        if (element['value'] === 'chandi') {
          this.chandioptions = element['options'];
          this.chandioptions.unshift({ value: '', label: '全部' });
          break;
        }
      }
      this.requestparams['gn'] = item.itemname;
      if (this.chandioptions.length) {
        this.requestparams['chandi'] = this.chandioptions[this.chandioptions.length - 1]['value'];
      }
    }
  }
  autopaidanandetids: any = [];
  //批量删除明细
  deleteautopaidanandet() {
    this.autopaidanandetids = new Array();
    const autopaidanandetlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < autopaidanandetlist.length; i++) {
      if (autopaidanandetlist[i].selected && autopaidanandetlist[i].data && autopaidanandetlist[i].data['id'] ) {
        this.autopaidanandetids.push(autopaidanandetlist[i].data.id);
      }
    }
    if (!this.autopaidanandetids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.kucunapi.delautopaidan(this.autopaidanandetids).then(data => {
      this.toast.pop('success', '删除成功！');
      this.listDetail(); 
      });
    }
  }
}
