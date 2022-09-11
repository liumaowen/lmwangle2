import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid';
import { ToasterService } from 'angular2-toaster';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { Console } from 'console';
import { ModalDirective } from 'ngx-bootstrap';
import { RukuService } from '../ruku.service';

@Component({
  selector: 'app-weishizhibao',
  templateUrl: './weishizhibao.component.html',
  styleUrls: ['./weishizhibao.component.scss']
})
export class WeishizhibaoComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  // 上传弹窗实例
  @ViewChild('uploaderModel') private uploaderModel: ModalDirective;
  @ViewChild('detailmodify') private detailmodify: ModalDirective;
  // 合同上传信息及格式
  uploadParam: any = {
    module: 'ruku', count: 1, sizemax: 1,
    extensions: ['xls', 'pdf']
  };
  // 设置上传的格式
  accept = null; // ".xls, application/xls";
  gridOptions: GridOptions;
  uploadtype: number;
  search = { provincecode: '', factorygrno: '', kunbaohao: '', level: '', cangkuid: '', label: '' };
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date;
  // 结束时间
  end: Date = new Date();
  chandiprovinces = [{ value: '', label: '全部' }, { value: 'Z', label: 'Z' }, { value: 'J', label: 'J' }, { value: 'S', label: 'S' }];
  levels = [{ value: '', label: '全部' }, { value: 'A', label: 'A' }, { value: 'D', label: 'D' }];
  labels = [{ value: '', label: '全部' }, { value: '已换', label: '已换' }, { value: '未换', label: '未换' }];
  factorycodes = [{ value: '', label: '全部' }, { value: '01', label: '01' }, { value: '02', label: '02' }, { value: '03', label: '03' }];
  jibans = [{ value: '', label: '全部' }, { value: 'AZ', label: 'AZ' }, { value: 'Z', label: 'Z' }];
  tuliaogongsis = [{ value: '', label: '全部' }, { value: 'N', label: 'N' }, { value: 'Z', label: 'Z' }];
  cangkus: { label: string; value: string; }[];
  productzhijian: any = {
    id: '',
    kunbaohao: '',
    guige: '',
    length: '',
    weight: '',
    c: '',
    si: '',
    mn: '',
    p: '',
    s: '',
    ti: '',
    yp: '',
    ts: '',
    el: '',
    quqiangbi: '',
    ducengboth: '',
    ducengtop: '',
    ducengbot: ''
  };
  constructor(public settings: SettingsService, private rukuapi: RukuService, private router: Router,
    private classifyApi: ClassifyApiService, private datepipe: DatePipe, private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      rowSelection: 'multiple',
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
      { cellStyle: { 'text-align': 'center' }, headerName: '钢卷号', field: 'kunbaohao', minWidth: 60, enableRowGroup: true },
      {
        cellStyle: { 'display': 'block' }, headerName: '规格及重量', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {cellStyle: { 'text-align': 'right' }, headerName: '规格', field: 'guige', minWidth: 60},
          {cellStyle: { 'text-align': 'right' }, headerName: '长度', field: 'length', minWidth: 90, aggFunc: 'avg'},
          {cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 90, aggFunc: 'sum2'},
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '化学成分', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {cellStyle: { 'text-align': 'right' }, headerName: 'C', field: 'c', minWidth: 60},
          {cellStyle: { 'text-align': 'right' }, headerName: 'Si', field: 'si', minWidth: 90, aggFunc: 'avg'},
          {cellStyle: { 'text-align': 'right' }, headerName: 'Mn', field: 'mn', minWidth: 90, aggFunc: 'sum2'},
          {cellStyle: { 'text-align': 'right' }, headerName: 'P', field: 'p', minWidth: 60},
          {cellStyle: { 'text-align': 'right' }, headerName: 'S', field: 's', minWidth: 90, aggFunc: 'avg'},
          {cellStyle: { 'text-align': 'right' }, headerName: 'Ti', field: 'ti', minWidth: 90, aggFunc: 'sum2'},
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '力学性能', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {cellStyle: { 'text-align': 'right' }, headerName: '屈服', field: 'yp', minWidth: 60},
          {cellStyle: { 'text-align': 'right' }, headerName: '抗拉', field: 'ts', minWidth: 90, aggFunc: 'avg'},
          {cellStyle: { 'text-align': 'right' }, headerName: '伸长率', field: 'el', minWidth: 90, aggFunc: 'sum2'},
          {cellStyle: { 'text-align': 'right' }, headerName: '屈强比', field: 'quqiangbi', minWidth: 60}
        ]
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '镀层重量', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {cellStyle: { 'text-align': 'right' }, headerName: '两面', field: 'ducengboth', minWidth: 60},
          {cellStyle: { 'text-align': 'right' }, headerName: '上面', field: 'ducengtop', minWidth: 90, aggFunc: 'avg'},
          {cellStyle: { 'text-align': 'right' }, headerName: '下面', field: 'ducengbot', minWidth: 90, aggFunc: 'sum2'},
        ]
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '修改', field: 'modify', minWidth: 100,
        cellRenderer: (params) => {
          return '<a>修改</a>';
        },
        onCellClicked: (data) => {
          this.showgcmodify(data);
        }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '证书编号', field: 'certificateno', minWidth: 60,
        onCellClicked: (params) => {
          this.rukuapi.printWeishiZhibaoshu(params.data.kunbaohao).then((response) => {
            if (!response['flag']) {
              this.toast.pop('warning', response['msg']);
            } else {
              window.open(response['msg']);
            }
          });
        }
      }
    ];
  }
  ngOnInit() {
  }
  query() {
    if (this.start) {
      this.search['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
    } else {
      this.search['start'] = '';
    }

    this.search['end'] = this.datepipe.transform(this.end, 'y-MM-dd');

    console.log(this.search);
    this.rukuapi.queryWeishiZhibao(this.search).then(data => {
      console.log(data);
      this.gridOptions.api.setRowData(data);
      this.close();
    });
  }
  close() {
    this.classicModal.hide();
  }

  // 打开查询对话框
  openquery() {
    this.cangkus = [{ label: '全部', value: '' }];
    this.classifyApi.cangkulist().then((response) => {
      response.forEach(element => {
        this.cangkus.push({
          label: element.name,
          value: element.id
        });
      });
    });
    this.classicModal.show();
  }
  // 合同上传弹窗
  excelUploader(uploadtype) {
    this.uploadtype = uploadtype;
    this.uploaderModel.show();
  }

  // 上传成功执行的回调方法
  uploadProductzhijian($event) {
    console.log($event);
    const addData = [$event.url];
    if ($event.length !== 0) {
      this.rukuapi.uploadWeishiProductzhijian(addData).then(data => {
        this.query();
      });
    }
    this.hideDialog();
  }
  // 关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

  selectnull() {
    this.search['start'] = '';
    this.search = { provincecode: '', factorygrno: '', kunbaohao: '', level: '', cangkuid: '', label: '' };
  }
  // 删除产品质量反馈表明细
  deleteDetail() {
    const dets = this.gridOptions.api.getModel()['rowsToDisplay'];
    const detids = new Array();
    for (let i = 0; i < dets.length; i++) {
      if (dets[i].selected && dets[i]['id']) {
        detids.push(dets[i].data['id']);
      }
    }
    if (detids.length <= 0) {
      this.toast.pop('warning', '请选择要删除的货物!');
      return;
    }
    console.log(detids);
    if (confirm('你确定要删除选中的明细吗？')) {
      this.rukuapi.removeWeishiDets({ detids: detids }).then(data => {
        this.toast.pop('success', '删除成功！');
        this.query();
      });
    }
  }

  showgcmodify(data) {
    console.log(data);
    this.productzhijian = data['data'];
    this.detailmodify.show();
  }
  closedetailmodify() {
    this.detailmodify.hide();
  }
  modifydetail() {
    if (confirm('你确定要修改吗？')) {
      this.rukuapi.modifyweishidetail(this.productzhijian).then(data => {
        this.closedetailmodify();
        this.query();
      });
    }

  }

}
