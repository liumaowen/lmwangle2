import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToasterService } from 'angular2-toaster';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SellproService } from '../sellpro.service';

@Component({
  selector: 'app-daylogdet',
  templateUrl: './daylogdet.component.html',
  styleUrls: ['./daylogdet.component.scss']
})
export class DaylogdetComponent implements OnInit {
  gridOptions: GridOptions;
  alldetgridOptions: GridOptions;
  model: any = {};
  det: any = [];
  search: any = {};
  tongbusearch: any = { start: '', end: ''};
  // 开始时间最大时间
  startmax: Date = new Date();
  // 结束时间最大时间
  endmax: Date = new Date();
  // 开始时间
  start: Date = new Date();
  manualaddworkdate: Date = new Date();
  // 结束时间
  end: Date = new Date();
  isadmin = false;
  isdaylogadmin = false;
  flag = 1; // 区分查询弹窗是从哪点击的
  tongbuflag = 1; // 区分同步弹窗是从哪点击的
  editparams = {id: null, tijiaotype: 1, ureason: ''};
  tijiaos = [{ value: 1, label: '正常' }, { value: 2, label: '迟交' }, { value: 3, label: '未提交' },
   { value: 4, label: '请假' }, { value: 5, label: '休息日' }];
  tijiaos1 = [{ value: 1, label: '正常' }, { value: 4, label: '请假' }];
  manualaddparams = {userpkid: null, tijiaotype: 1, workdate: null};
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('autoModal') private autoModal: ModalDirective;
  @ViewChild('allstatusdetDialog') private allstatusdetDialog: ModalDirective;
  @ViewChild('updateModal') private updateModal: ModalDirective;
  @ViewChild('manualaddModal') private manualaddModal: ModalDirective;

  constructor(public settings: SettingsService,
    private toast: ToasterService,
    private sellproApi: SellproService,
    private datepipe: DatePipe) {

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
      animateRows: true,
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '工作/出差日期', field: 'workdate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提交日期', field: 'commitdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'username', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'ddepname', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '所属中心', field: 'orgcenter', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '工作类型', field: 'worktype', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '提交类型', field: 'tijiaotype', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '日志类型', field: 'logtype', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 100,
        cellRenderer: data => {
          if (data.data.tijiaotype === '未提交' && !data.data.commitdate) {
            return '<a target="_blank">修改</a>';
          } else {
            return '';
          }
        }, onCellClicked: (data) => {
          if (data.data.tijiaotype === '未提交' && !data.data.commitdate) {
            this.manualaddshowmodal(data.data);
          }
        }
      }
    ];
    this.alldetgridOptions = {
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
      animateRows: true,
      rowSelection: 'multiple',
    };
    this.alldetgridOptions.onGridReady = this.settings.onGridReady;
    this.alldetgridOptions.groupSuppressAutoColumn = true;
    this.alldetgridOptions.columnDefs = [
      {
        cellStyle: { 'text-align': 'center' }, headerName: '选择', field: 'group', minWidth: 100, cellRenderer: 'group',
        headerCheckboxSelection: true, checkboxSelection: true
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '工作/出差日期', field: 'workdate', minWidth: 110 },
      { cellStyle: { 'text-align': 'center' }, headerName: '提交日期', field: 'commitdate', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '姓名', field: 'username', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '部门', field: 'ddepname', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '所属中心', field: 'orgcenter', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '工作类型', field: 'worktype', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '提交类型', field: 'tijiaotypename', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '日志类型', field: 'logtype', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '审批状态', field: 'approvalstatus', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '审批结果', field: 'approvalresult', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '修改原因', field: 'ureason', minWidth: 100},
      // { cellStyle: { 'text-align': 'center' }, headerName: '审批id', field: 'processid', minWidth: 100},
      { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: 'beizhu', minWidth: 100,
        cellRenderer: data => {
          return '<a target="_blank">修改</a>';
        }, onCellClicked: (data) => {
          this.updateshowmodal(data.data);
        }
      }
    ];
  }

  ngOnInit() {
    this.getMyRole();
  }
  getMyRole() {
    const myrole = JSON.parse(localStorage.getItem('myrole'));
    if (myrole.some(item => item === 1)) {
      this.isadmin = true;
    } else {
      this.isadmin = false;
    }
    if (myrole.some(item => item === 28)) {
      this.isdaylogadmin = true;
    } else {
      this.isdaylogadmin = false;
    }
  }
  selectmonth(value) {
    this.search['month'] = this.datepipe.transform(value, 'y-MM-dd');
  }
  selectNull() {
    this.search = {
      cuserid: '',
      month: ''
    };
  }
  querylist() {
    if (!this.search['month']) {
      this.toast.pop('warning', '请选择月份！！！');
      return;
    }
    if (this.search['userid'] instanceof Object) {
      this.search['userid'] = this.search['userid'].code;
    }
    if (this.flag === 1) {
      if (!this.search['userid']) {
        if (this.isdaylogadmin) {
          if (confirm('没有选择提交人，要查询全部吗？')) {
            this.coles();
            setTimeout(() => {
              this.sellproApi.daylogfindall(this.search).then(data => {
                this.allstatusdetDialog.show();
                setTimeout(() => {
                  this.alldetgridOptions.api.setRowData(data);
                  this.alldetgridOptions.columnApi.autoSizeAllColumns();
                }, 100);
              });
            }, 800);
          }
        } else {
          this.toast.pop('warning', '请选择提交人！！！');
          return;
        }
      } else {
        this.sellproApi.daylogfinddet(this.search).then(data => {
          this.model = data['huizong'];
          this.gridOptions.api.setRowData(data['det']);
          this.gridOptions.columnApi.autoSizeAllColumns();
          this.coles();
        });
      }
    } else if (this.flag === 2) {
      this.sellproApi.daylogfindall(this.search).then(data => {
        this.alldetgridOptions.api.setRowData(data);
        this.alldetgridOptions.columnApi.autoSizeAllColumns();
        this.coles();
      });
    }
  }
  showDialog(flag) {
    this.flag = flag;
    this.selectNull();
    this.classicModal.show();
  }
  // 关闭弹窗
  coles() {
    this.classicModal.hide();
  }
  showtongbu(tongbuflag) {
    this.tongbuflag = tongbuflag;
    this.autoModal.show();
  }
  tongbucoles() {
    this.autoModal.hide();
  }
  /**同步数据 */
  tongbu() {
    if (this.start) {
      this.tongbusearch['start'] = this.datepipe.transform(this.start, 'y-MM-dd');
      this.tongbusearch['end'] = this.datepipe.transform(this.end, 'y-MM-dd');
    }
    if (!this.tongbusearch['start']) {
      this.toast.pop('warning', '请选择开始日期');
      return '';
    }
    if (!this.tongbusearch['end']) {
      this.toast.pop('warning', '请选择结束日期');
      return '';
    }
    if (this.tongbuflag === 1) {
      this.sellproApi.autodaylog(this.tongbusearch).then(data => {
        this.toast.pop('success', '同步日报成功');
        this.tongbucoles();
      });
    } else if (this.tongbuflag === 2) {
      this.sellproApi.autoxiujia(this.tongbusearch).then(data => {
        this.toast.pop('success', '同步休假成功');
        this.tongbucoles();
      });
    }
  }
  showallstatusdet() {
    this.allstatusdetDialog.show();
  }
  closeallstatusdetDialog() {
    this.allstatusdetDialog.hide();
  }
  showalldetquery(flag) {
    this.flag = flag;
    this.selectNull();
    this.classicModal.show();
  }
  // 修改提交状态弹窗
  updateshowmodal(params) {
    const prams = JSON.parse(JSON.stringify(params));
    this.editparams = {id: prams.id, tijiaotype: prams.tijiaotype, ureason: ''};
    this.updateModal.show();
  }
  hideupdateModal() {
    this.updateModal.hide();
  }
  /**
   * 更新当前明细的提交状态
   */
  updatetijiaostatus() {
    this.sellproApi.updateTijiaostatus(this.editparams).then(data => {
      this.toast.pop('success', '修改成功');
      this.hideupdateModal();
      this.sellproApi.daylogfindall(this.search).then(data1 => {
        this.alldetgridOptions.api.setRowData(data1);
        this.alldetgridOptions.columnApi.autoSizeAllColumns();
      });
    });
  }
  /**
   * 更新当前明细的审批状态
   */
   gengxin() {
    const daylogs = this.alldetgridOptions.api.getModel()['rowsToDisplay']; // 获取选中的日报明细。
    const processids = [];
    for (let i = 0; i < daylogs.length; i++) {
      if (!daylogs[i].data.group && daylogs[i].selected) {
        if (daylogs[i].data.approvalstatus !== '审批中') {
          this.toast.pop('warning', '请选择审批中的日报');
          return '';
        }
        processids.push(daylogs[i].data.processid); // 将审批id放到数组中
      }
    }
    if (!processids.length) {
      this.toast.pop('warning', '请选择日报明细后再点击更新状态！！！');
      return '';
    }
    this.sellproApi.updatedaylog(processids).then(data => {
      this.toast.pop('success', '修改成功');
      this.hideupdateModal();
      this.sellproApi.daylogfindall(this.search).then(data1 => {
        this.alldetgridOptions.api.setRowData(data1);
        this.alldetgridOptions.columnApi.autoSizeAllColumns();
      });
    });
  }
  // 手动添加日报弹窗
  manualaddshowmodal(params) {
    const prams = JSON.parse(JSON.stringify(params));
    this.manualaddworkdate = new Date(prams['workdate']);
    this.manualaddparams = {userpkid: prams.userpkid, tijiaotype: 1, workdate: null};
    this.manualaddModal.show();
  }
  hidemanualaddModal() {
    this.manualaddModal.hide();
  }
  /**手动添加日报 */
  manualaddsave() {
    if (this.manualaddworkdate) {
      this.manualaddparams['workdate'] = this.datepipe.transform(this.manualaddworkdate, 'y-MM-dd');
    }
    if (!this.manualaddparams['workdate']) {
      this.toast.pop('warning', '请选择工作/出差日期！！！');
      return;
    }
    if (!this.manualaddparams['tijiaotype']) {
      this.toast.pop('warning', '请选择提交状态！！！');
      return;
    }
    this.sellproApi.manualadd(this.manualaddparams).then(data => {
      this.toast.pop('success', '修改成功');
      this.hidemanualaddModal();
      this.sellproApi.daylogfinddet(this.search).then(data1 => {
        this.model = data1['huizong'];
        this.gridOptions.api.setRowData(data1['det']);
        this.gridOptions.columnApi.autoSizeAllColumns();
      });
    });
  }
}
