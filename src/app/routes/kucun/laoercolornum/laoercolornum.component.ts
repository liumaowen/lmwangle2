import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { KucunService } from './../kucun.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-laoercolornum',
  templateUrl: './laoercolornum.component.html',
  styleUrls: ['./laoercolornum.component.scss']
})
export class LaoercolornumComponent implements OnInit {
  @ViewChild('classicModal') private classicModal: ModalDirective;
  @ViewChild('addModal') private addModal: ModalDirective;
  // aggird表格原型
  gridOptions: GridOptions;
  params = { laoercolor: ''};
  search = { laoercolor: ''};
  gns;
  chandis: any[];
  cs;
  // 定义下载传递时间
  date: Date;
  // 最大时间
  maxdate = new Date();
  constructor(public settings: SettingsService, private kucunapi: KucunService,
    private classifyApi: ClassifyApiService, private toast: ToasterService) {
    this.gridOptions = {
      groupIncludeFooter: true,
      groupSuppressRow: true,
      enableFilter: true, // 过滤器
      groupDefaultExpanded: 1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
      // singleClickEdit: true, // 单击编辑
      // stopEditingWhenGridLosesFocus: true // 焦点离开停止编辑
    };
    this.gridOptions.onGridReady = this.settings.onGridReady;
    this.gridOptions.groupSuppressAutoColumn = true;
    // 设置aggird表格列
    this.gridOptions.columnDefs = [
      { cellStyle: { 'text-align': 'center' }, headerName: '劳尔色号', field: 'laoercolor', minWidth: 90 }
    ];
    this.getchandilist();
  }
  
  ngOnInit() {
    this.getdata();
  }
  getdata() {
    this.kucunapi.getLaoercolornumList(this.search).then(data => {
      this.gridOptions.api.setRowData(data);
    });
  }
  getchandilist() {
    this.classifyApi.listclassify('laoercolor_chandi').then(data => {
      this.getcolumnDefs(data);
    });
  }
  /**
   * 动态获取每个月列
   */
   getcolumnDefs(chandis) {
    for (let index = 0; index < chandis.length; index++) {
      const column = { cellStyle: { 'text-align': 'center' }, headerName: chandis[index]['name'],
      field: chandis[index]['value'], minWidth: 80,
        editable: (params) => params.node.data['laoercolor'],
        onCellValueChanged: (params) => { this.updateorgplan(params, chandis[index]['value']); }
      };
      this.gridOptions.columnDefs.push(column);
    }
    const column1 = { cellStyle: { 'text-align': 'center' }, headerName: '操作', field: `caozuo`, minWidth: 50,
      cellRenderer: (params) => { return '<a target="_blank">删除</a>'; } , onCellClicked: (data) => {
        if (confirm('你确定要删除吗？')) {
          this.delete(data.data);
        }
      }
    };
    this.gridOptions.columnDefs.push(column1);
    this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
    this.gridOptions.onGridReady = this.settings.onGridReady;
  }
  query() {
    this.search = { laoercolor: ''};
    this.classicModal.show();
  }
  querylist() {
    this.getdata();
    this.close();
  }
  close() {
    this.classicModal.hide();
  }
  /**添加劳尔色号 */
  showaddmodal() {
    this.params = {laoercolor: ''};
    this.addModal.show();
  }
  closeaddModal() {
    this.addModal.hide();
  }
  add() {
    if (!this.params.laoercolor) {
      this.toast.pop('warning', '请输入劳尔色号！');
      return;
    }
    this.kucunapi.laoercolornumAdd(this.params).then(data => {
      this.getdata();
      this.closeaddModal();
    });
  }
  /**修改色号对照表中颜色 */
  updateorgplan(params, filed) {
    if (!params.node.data.laoercolor) {
      this.toast.pop('warning', '请先选择要修改的行！');
      return;
    }
    this.kucunapi.updatelaoernum(params.node.data).then(data => {
      this.getdata();
    }, err => {
      params.node.data[filed] = params.oldValue;
      params.node.setData(params.node.data);
    });
  }
  /**根据色号删除 */
  delete(params) {
    this.kucunapi.deleteLaoercolornum({laoercolor: params.laoercolor}).then(data => {
      this.getdata();
    });
  }
}
