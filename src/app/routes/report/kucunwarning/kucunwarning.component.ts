import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../report.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';

@Component({
  selector: 'app-kucunwarning',
  templateUrl: './kucunwarning.component.html',
  styleUrls: ['./kucunwarning.component.scss']
})
export class KucunwarningComponent implements OnInit {
  // 上传信息及格式
  uploadParam: any = { module: 'kucunwarning', count: 1, sizemax: 1, extensions: ['xls'] };
  // 设置上传的格式
  accept = '.xls, application/xls';
  // 上传弹窗实例
  @ViewChild('uploadModal') private uploaderModel: ModalDirective;
  // 修改弹窗
  @ViewChild('updateModal') private updateModal: ModalDirective;
  @ViewChild('createdialog') private createdialog: ModalDirective;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') public mdmgndialog: ModalDirective;
  chandioptions: any = [];
  queryandcreate = 0; // 0-创建，1-查询
  disabled = true;
  isModalShown = false;
  gns: any = [];
  chandis: any = [];
  houdus: any = [];
  widths: any = [];
  painttypes: any = [];
  colors: any = [];
  ducengs: any = [];
  caizhis: any = [];
  isChandi = false;
  attrs: any = [];
  showGuige = false;
  model: any = {};
  gugieobj: any = {};
  requestparams: any = {classifys: {}};
  cuser: any = {};
  gridOptions: GridOptions;
  editparams: any = {};

  start = new Date();
  end: Date;
  constructor(public settings: SettingsService,
    private reportService: ReportService,
    private toast: ToasterService,
    private classifyapi: ClassifyApiService) {
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
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
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
      { cellStyle: { 'text-align': 'center' }, headerName: '低库存预警', field: 'minweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '现库存', field: 'tweight', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '创建人', field: 'cusername', minWidth: 60 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '删除', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">删除</a>';
        }, onCellClicked: (data) => {
          if (confirm('你确定要删除吗？')) {
            this.reportService.deletekucunwarning(data.data.id).then(() => {
              this.toast.pop('success', '删除成功！');
              this.listDetail();
            });
          }
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '修改', field: '', minWidth: 60, enableRowGroup: true, cellRenderer: data => {
          return '<a target="_blank">修改</a>';
        }, onCellClicked: (data) => {
          this.updateshowmodal(data.data);
        }
      }
    ];
  }

  ngOnInit() {
    this.listDetail();
  }

  listDetail() {
    this.reportService.getkucunwarning(this.requestparams).then((response) => {
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
    this.requestparams['classifys'] = {};
    this.attrs = [];
    this.disabled = true;
  }

  // 查询
  query() {
    // this.requestparams.start = this.datePipe.transform(this.start, 'yyyy-MM-dd');
    // if (this.end) {
    //   this.requestparams.end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    // } else {
    //   this.requestparams.end = '';
    // }
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
      fileName: '流通单库存预警明细表.xls',
      columnSeparator: ''
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('refreshmaycurModel') private refreshmaycurModel: ModalDirective;

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
      this.reportService.uploadkucunyujing(addData).then(data => {
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
  save() {
    this.reportService.editkucunyujing(this.editparams).then(data => {
      this.toast.pop('success', '修改成功！');
      this.hideupdateModal();
      this.listDetail();
    });
  }
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
    if (!this.model['gn']) {
      this.toast.pop('warning', '品名必填！');
      return;
    }
    if (!this.model['chandi']) {
      this.toast.pop('warning', '产地必填！');
      return;
    }
    if (!this.model['houdu']) {
      this.toast.pop('warning', '厚度必填！');
      return;
    }
    if (!this.model['width']) {
      this.toast.pop('warning', '宽度必填！');
      return;
    }
    if (!this.model['color']) {
      this.toast.pop('warning', '颜色必填！');
      return;
    }
    if (!this.model['duceng']) {
      this.toast.pop('warning', '镀层必填！');
      return;
    }
    if (!this.model['caizhi']) {
      this.toast.pop('warning', '材质必填！');
      return;
    }
    if (this.model['minweight'] === undefined || this.model['minweight'] === null) {
      this.toast.pop('warning', '低库存预警量必填！');
      return;
    }
    // if (this.model['orderweight'] === undefined || this.model['orderweight'] === null) {
    //   this.toast.pop('warning', '开单预警量必填！');
    //   return;
    // }
    delete this.model['chandio'];
    this.reportService.createkucunyujing(this.model).then(data => {
      this.listDetail();
      this.dialogcoles();
    });
  }
  showmdmgndialog(flag) {
    this.queryandcreate = flag;
    this.isModalShown = true;
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.disabled = false;
    this.attrs = [];
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      element['options'].unshift({ value: '', label: '全部' });
    }
    if (this.queryandcreate === 0) {
      this.model['gn'] = item.itemname;
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        if (element['defaultval'] && element['options'].length) {
          this.model[element['value']] = element['defaultval'];
        }
      }
    } else if (this.queryandcreate === 1) {
      this.requestparams['gn'] = item.itemname;
      for (let i = 0; i < this.attrs.length; i++) {
        const element = this.attrs[i];
        if (element['defaultval'] && element['options'].length) {
          this.requestparams[element['value']] = element['defaultval'];
        }
      }
    }
  }
  onHidden() {
    this.isModalShown = false;
  }

}
