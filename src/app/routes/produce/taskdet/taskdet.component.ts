import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { BasematerialimportComponent } from './../../../dnn/shared/basematerialimport/basematerialimport.component';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { ProduceapiService } from './../produceapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerapiService } from './../../customer/customerapi.service';
import { DatePipe } from '@angular/common';
import { CaigoudetimportComponent } from 'app/dnn/shared/caigoudetimport/caigoudetimport.component';

@Component({
  selector: 'app-taskdet',
  templateUrl: './taskdet.component.html',
  styleUrls: ['./taskdet.component.scss']
})
export class TaskdetComponent implements OnInit {
  @ViewChild('createModal') private createModal: ModalDirective;
  @ViewChild('dateModal') private dateModal: ModalDirective;
  @ViewChild('yaoqiuModal') private yaoqiuModal: ModalDirective;
  @ViewChild('jiesuantypeModal') private jiesuantypeModal: ModalDirective;
  tasklist = { cuser: {} };
  modifytask = {};
  modifytaskyaoqiu: any = {};
  showbutton = {};
  neijings = [];
  packages = [];
  mindate: Date = new Date();
  start: Date = new Date();
  am_pms = [];
  am_pm = '';
  jstype: object = {};
  types: any = [{ value: '', label: '请选择打包带材料' }, { value: '1', label: '钢带' }, { value: '2', label: '其他' }];
  // 是否是邯郸维实的加工任务单
  isweishi = false;
  companyIsWiskind = [];
  qihuodetid: any;
  basematerialImpbsModalRef: BsModalRef;
  fproductbsModalRef: BsModalRef;
  gridOptions: GridOptions;
  weishihoudu: any;
  weishiwidth: any;
  weishibeizhu:any;
  constructor(public settings: SettingsService, private produceApi: ProduceapiService, private route: ActivatedRoute,
    private toast: ToasterService, private router: Router, private bsModalService: BsModalService,
    private customerApi: CustomerapiService, private datepipe: DatePipe) {
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
      singleClickEdit: true, // 单击编辑
      stopEditingWhenGridLosesFocus: true, // 焦点离开停止编辑
      getContextMenuItems: (params) => {
        const result = [
          'copy',
          {
            name: '自适应',
            action: () => {
              params.columnApi.autoSizeAllColumns();
            }
          }
        ];
        return result;
      }
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', cellRenderer: 'group',
        minWidth: 90, checkboxSelection: true, headerCheckboxSelection: true
      },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '成品汇总id', field: 'qihuodetid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '物料编码', field: 'gcid', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'duceng', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '重量', field: 'weight', minWidth: 80 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '加工费', field: 'fee', minWidth: 80,
        editable: (params) => !this.tasklist['isv'],
        cellRenderer: (params) => {
          if (params.data.fee) {
            if (!this.tasklist['isv']) {
              return `<a>${params.data.fee}</a>`;
            } else {
              return params.data.fee + '';
            }
          }
        }, onCellValueChanged: (params) => this.jiagongvaluechanged(params, "fee"),
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '加工类型', field: 'type', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '是否引用', field: 'isuse', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '分条规格', field: 'slitguige', minWidth: 200 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '分条数量', field: 'slittingcount', minWidth: 80 },
      // { cellStyle: { 'text-align': 'center' }, headerName: '理算重量', field: 'lweight', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '横切规格', field: 'guige', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '横切数量', field: 'hengqieaccount', minWidth: 120 },
    //   { cellStyle: { 'text-align': 'center' }, headerName: '打包吨位', field: 'packton', minWidth: 120 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '打包要求', field: 'yaoqiu', minWidth: 120,
        tooltipField: 'yaoqiu',
        onCellClicked: (params) => {
          if (!this.tasklist['isv']) {
            this.modifylist(params.data);
          }
        }
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 120, 
      editable: (params) => !this.tasklist['isv'],
      cellRenderer: (params) => {
        if (params.data.beizhu) {
          if (!this.tasklist['isv']) {
            return `<a>${params.data.beizhu}</a>`;
          } else {
            return params.data.beizhu + '';
          }
        }
      }, onCellValueChanged: (params) => this.beizhuchanged(params, "beizhu"),
     },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', minWidth: 100,
        cellRenderer: (params) => {
          if (!this.tasklist['isv']) {
            return '<a ng-hide="tasklist.isv" target="_blank">删除</a>';
          } else {
            return '';
          }
        },
        onCellClicked: (params) => {
          if (!this.tasklist['isv']) {
            if (confirm('你确定删除这个基料吗？')) {
              this.produceApi.removetaskbm(params.data.id).then(() => {
                // Notify.alert('删除成功', { status: 'success' });
                this.toast.pop('success', '删除成功');
                this.getdetail();
              });
            }
          }
        }
      }
    ];
    this.getdetail();
  }

  ngOnInit() {
  }
  getdetail() {
    this.produceApi.getTask(this.route.params['value']['id']).then(data => {
      this.tasklist = data.tasklist;
      if (this.tasklist['sellerid'] === 3786) {
        this.isweishi = true;
      }
      if (data.tasklist['vuserid'] === null) {
        this.showbutton['imp'] = true;
      } else {
        this.showbutton['imp'] = false;
      }
      if (data.tasklist['vuserid'] !== null && !data.tasklist['isv']) {
        this.showbutton['verify'] = true;
      } else {
        this.showbutton['verify'] = false;
      }
      if (data.tasklist['isv']) {
        this.showbutton['qishen'] = true;
      } else {
        this.showbutton['qishen'] = false;
      }
      if (data.tasklist['isentrust']) {
        if (data.tasklist['status']) {
          this.showbutton['isentrust'] = false;
        } else {
          this.showbutton['isentrust'] = true;
        }
      } else {
        this.showbutton['isentrust'] = false;
      }
      this.gridOptions.api.setRowData(data.detlist);
      this.getCailiao();
    });
  }
  // 基料引入
  basematerialImp() {
    // if (this.tasklist['producemode'] === 3) {
    //   this.qihuodetid = null;
    //   let j = 0;
    //   const tasklistdets = this.gridOptions.api.getModel()['rowsToDisplay'];
    //   for (let i = 0; i < tasklistdets.length; i++) {
    //     if (tasklistdets[i].selected) {
    //       j++;
    //     }
    //     if (this.qihuodetid && tasklistdets[i].selected) {
    //       this.toast.pop('warning', '请选择一条，引入基料！！！');
    //       return;
    //     }
    //     if (tasklistdets[i].selected && !tasklistdets[i].data.qihuodetid) {
    //       this.toast.pop('warning', '请选择成品汇总明细引入基料！');
    //       return;
    //     }
    //     if (tasklistdets[i].selected && tasklistdets[i].data.qihuodetid) {
    //       this.qihuodetid = tasklistdets[i].data.qihuodetid;
    //       this.weishihoudu = tasklistdets[i].data.houdu;
    //       this.weishiwidth = tasklistdets[i].data.width;
    //     }
    //   }
    //   if (j === 0) {
    //     this.toast.pop('warning', '请选择销售明细引入基料！');
    //     return;
    //   }
    // }
    this.bsModalService.config.class = 'modal-all';
    this.basematerialImpbsModalRef = this.bsModalService.show(BasematerialimportComponent);
    this.basematerialImpbsModalRef.content.parentthis = this;
  }
  // 销售明细引入
  importdet() {
    this.bsModalService.config.class = 'modal-all';
    this.fproductbsModalRef = this.bsModalService.show(CaigoudetimportComponent);
    this.fproductbsModalRef.content.parentthis = this;
  }
  impBm() {
    this.basematerialImpbsModalRef.hide();
    this.getdetail();
  }
  submit() {
    this.produceApi.submittask(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '提交成功');
      this.getdetail();
    });
  }
  verifytask() {
    this.produceApi.verifytask(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '审核成功');
      this.getdetail();
    });
  }
  refusverify() {
    this.produceApi.refusverify(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '拒审成功');
      this.getdetail();
    });
  }
  qishen() {
    this.produceApi.qishen(this.route.params['value']['id']).then(data => {
      this.toast.pop('success', '弃审成功');
      this.getdetail();
    });
  }
  reload() {
    this.produceApi.reload(this.route.params['value']['id']).then((response) => {
      this.toast.pop('warning', response['msg']);
    });
  }
  jiesuantypclose(){
    this.jiesuantypeModal.hide();
  }
  selectNull(){

  }
  showJiesuanType(){
    this.jiesuantypeModal.show();
  }
  print() {
    this.produceApi.print(this.route.params['value']['id']).then((response) => {
      console.log(response);
      if (!response['flag']) {
        this.toast.pop('warning', response['msg']);
      } else {
        this.getdetail();
        window.open(response['msg']);

      }
    });
  }
  deletetask() {
    if (confirm('你确定要删除吗？')) {
      this.produceApi.removetaskById(this.route.params['value']['id']).then(() => {
        this.toast.pop('success', '删除成功');
        this.router.navigateByUrl('tasklist');
      });
    }
  }
  openmodify() {
    this.findWiskind();
    this.neijings = [{ value: '508', label: '508' }, { value: '610', label: '610' }];
    this.packages = [{ value: '裸包', label: '裸包' }, { value: '油纸', label: '油纸' }, { value: '简包', label: '简包' },
    { value: '精包', label: '精包' }, { value: '原包', label: '原包' }];
    this.modifytask = this.tasklist;
    // this.modifytask['jiaoqi'] = this.tasklist['jiaoqi'];
    this.createModal.show();
  }
  modify() {
    console.log(this.modifytask);
    // if (this.modifytask['gangdai'] !== null && this.modifytask['gangdai'] !== undefined && this.modifytask['gangdai'] <= 0) {
    //   this.toast.pop('warning', '钢带数量不能为零或负数');
    //   return;
    // }
    this.produceApi.modifytask(this.modifytask).then(data => {
      this.getdetail();
      this.hidecreatemodal();
    });
  }
  /**明细打包要求弹窗 */
  modifylist(params) {
    this.modifytaskyaoqiu = JSON.parse(JSON.stringify(params));
    this.yaoqiuModal.show();
  }
  /**修改打包要求 */
  modifyYaoqiu() {
    this.produceApi.modifylistyaoqiu(this.modifytaskyaoqiu).then(data => {
      this.getdetail();
      this.hideyaoqiumodal();
    });
  }
  hideyaoqiumodal() {
    this.yaoqiuModal.hide();
    this.modifytaskyaoqiu = {};
  }
  hidecreatemodal() {
    this.createModal.hide();
  }
  selectstart() {
    // console.log('dsasd', this.start);
  }
  findWiskind() {
    if (this.companyIsWiskind.length < 1) {
      this.companyIsWiskind.push({ label: '请选择盖章单位', value: '' });
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
          });
        });
        console.log(this.companyIsWiskind);
        // this.companyIsWiskind = response;
      });
    }
  }
  hidedatemodal() {
    this.dateModal.hide();
  }
  modifydate() {
    if (this.am_pm === '') {
      this.toast.pop('warning', '请选择时间段');
      return;
    }
    this.modifytask['jiaoqi'] = this.datepipe.transform(this.start, 'y-MM-dd') + ' ' + this.am_pm;
    this.produceApi.modifydate(this.modifytask).then(data => {
      this.getdetail();
      this.hidedatemodal();
    });
  }
  showdate() {
    this.modifytask['id'] = this.tasklist['id'];
    this.modifytask['jiaoqi'] = this.tasklist['jiaoqi'];
    this.am_pms = [{ value: '上午', label: '上午' }, { value: '下午', label: '下午' }];
    this.dateModal.show();
  }
  /**
   * 加工完成
   */
  processfinished() {
    if (!this.tasklist['isprint']) {
      this.toast.pop('warning', '未打印的加工单不能点击完成！');
      return;
    }
    if (this.tasklist['status']) {
      this.toast.pop('warning', '货物状态已有，不能再次改变。');
      return;
    }
    if (confirm('请确定加工任务单已经打印，你确定加工完成吗？')) {
      this.produceApi.processfinished(this.tasklist['id']).then(data => {
        this.getdetail();
        this.toast.pop('success', '货物已经加工完成，已经通知客户或者物流员可以创建提单！');
      });
    }
  }
  cailiao = '';
  getCailiao() {
    let cailiao = this.tasklist['cailiao'];
    if (cailiao === 1) {
      this.cailiao = '钢带';
    } else if (cailiao === 2) {
      this.cailiao = this.tasklist['cailiaobeizhu'];
    } else if (!cailiao) {
      this.cailiao = cailiao;
    }
  }
  //批量删除明细
  detids: any = [];
  removeDet() {
    this.detids = new Array();
    const detlist = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < detlist.length; i++) {
      if (detlist[i].selected && detlist[i].data) {
        this.detids.push(detlist[i].data.id);
      }
    }
    if (!this.detids.length) {
      this.toast.pop('warning', '请选择明细之后再删除！');
      return;
    }
    if (confirm('你确定要删除吗？')) {
      this.produceApi.removeDet(this.detids).then(data => {
        this.toast.pop('success', '删除成功！');
        this.getdetail();
      });
    }
  }
  // 修改行加工费
  jiagongvaluechanged(params, filed) {
    if (params.newValue === params.oldValue) return false;
    const obj = JSON.parse(JSON.stringify(params.data));
    this.produceApi.modifylistyaoqiu(obj).then(data => {
      this.getdetail();
      this.hideyaoqiumodal();
    }, err => {
      params.node.data[filed] = params.oldValue;
      params.node.setData(params.node.data);
    });
  }
   // 修改行备注
   beizhuchanged(params, filed) {
    if (params.newValue === params.oldValue) return false;
    const obj = JSON.parse(JSON.stringify(params.data));
    this.produceApi.modifylistyaoqiu(obj).then(data => {
      this.getdetail();
      this.hideyaoqiumodal();
    }, err => {
      params.node.data[filed] = params.oldValue;
      params.node.setData(params.node.data);
    });
  }
  // 主表修改
  modifybeizhu(params) {
    this.produceApi.updatetasklist(this.tasklist['id'], params).then(() => {
      this.getdetail();
    });
  }


}
