import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ColDef, GridOptions } from 'ag-grid/main';
import { YijiaapiService } from '../yijiaapi.service';
import { SettingsService } from '../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { DatePipe } from '@angular/common';

const sweetalert = require('sweetalert');
@Component({
  selector: 'app-customerlevel',
  templateUrl: './customerlevel.component.html',
  styleUrls: ['./customerlevel.component.scss']
})
export class CustomerlevelComponent implements OnInit {
  addData: any = {}; // 上传的参数
  companys = {};

  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  @ViewChild('lclassicModal') private lclassicModal: ModalDirective;

  // 构造传入参数 //调用上传功能的模块名称//文件最大尺寸//支持的文件扩展名
  uploadParam = { module: 'customerlevel', count: 1, sizemax: 1, extensions: ['xls'] };

  // 设置上传文件类型
  accept = '.xls, application/xls';

  requestparams = {
    sellerid: ''
  };

  gridOptions: GridOptions;
  lgridOptions: GridOptions;

  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private yijiaApi: YijiaapiService,

    // private addressparseService: AddressparseService,
    // private classifyapi: ClassifyApiService,
    private datePipe: DatePipe,) {

    this.gridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableRangeSelection: true,
      onCellClicked: (params) => {
        params.node.setSelected(true, true);
      },
      getContextMenuItems: this.settings.getContextMenuItems,
      localeText: this.settings.LOCALETEXT,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;

    this.gridOptions.columnDefs = [
      //{ cellStyle: { 'text-align': 'center' }, headerName: '选择', minWidth: 56, checkboxSelection: true,colId: 'check' },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户名称', field: 'name', minWidth: 130 },
      { cellStyle: { 'text-align': 'center' }, headerName: '客户分类', field: 'usernature', minWidth: 80,
        cellRenderer: (params) => {
          if (params.data.usernature == 2) {
            return '终端用户';
          } else if (params.data.usernature == 1) {
            return '流通商';
          }else if (params.data.usernature == 0) {
            return '直接用户';
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '用户等级', field: 'namelevel', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '销售排名', field: 'salesrank', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '业务负责人', field: 'realname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '所属机构', field: 'orgname', minWidth: 86 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否停用', field: 'isdel', minWidth: 80, 
        cellRenderer: (params) => {
        return params.data.isdel ? '是' : '否';
      }
      },
      // { cellStyle: { 'text-align': 'center' }, headerName: '议价次数', field: 'negonum', minWidth: 80 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '议价未购买次数', field: 'negonotnum', minWidth: 80 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '使用优惠券次数', field: 'coupon_num', minWidth: 80 },
    
    ];

  }

  ngOnInit() {
    this.listDetail();
    
  }

  // 网格赋值
  listDetail() {
    this.yijiaApi.getList(this.requestparams).then((data) => {
      this.gridOptions.api.setRowData(data);
    });
  }


  // 弹出查询对话框
  query() {
    if (typeof (this.companys) === 'string' || !this.companys) {
      this.requestparams['sellerid'] = '';
    } else if (typeof (this.companys) === 'object') {
      this.requestparams.sellerid = this.companys['code'];
    }
    console.log(this.requestparams);
    this.listDetail();
    this.close();
  }

  selectNull() {
    this.requestparams = {
       sellerid: ''
    };
    this.companys = undefined;
  }

  openQueryDialog() {
    this.classicModal.show();
  }

  close() {
    this.classicModal.hide();
  }


  //上传弹窗
  customerLevelUploader() {
    this.uploaderModel.show();
  }

    // 上传成功执行的回调方法
    uploads($event) {
      const addData = [$event.url];
      console.log(addData);
      if ($event.length !== 0) {
        this.yijiaApi.create(addData).then(data => {
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

    //测试：发送钉钉消息
    sendinfo(){
      this.yijiaApi.postInfo();
    }

}
