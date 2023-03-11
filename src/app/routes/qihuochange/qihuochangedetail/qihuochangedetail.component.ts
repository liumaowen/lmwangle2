import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QihuochangeService } from '../qihuochange.service';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { QihuodetailimpComponent } from 'app/dnn/shared/qihuodetailimp/qihuodetailimp.component';
import { GridOptions } from 'ag-grid';
import { SettingsService } from 'app/core/settings/settings.service';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from 'primeng/primeng';

@Component({
  selector: 'app-qihuochangedetail',
  templateUrl: './qihuochangedetail.component.html',
  styleUrls: ['./qihuochangedetail.component.scss']
})
export class QihuochangedetailComponent implements OnInit {
  qihuochangeid: number;
  model: any = { cuser: '', vuser: '' };
  qihuodetailModalRef: BsModalRef;
  beforegridOptions: GridOptions;
  aftergridOptions: GridOptions;
  //物料编码中规格属性的修改
  values = [];
  newattrid: number;
  modifygcqihuodetid: number;
  attrname: any;
  @ViewChild('gcmodify') private gcmodify: ModalDirective;
  constructor(
    public settings: SettingsService,
    private classifyapi: ClassifyApiService,
    private toast: ToasterService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private qihuochangeApi: QihuochangeService,
    private bsModalService: BsModalService
  ) {
    this.beforegridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: (params) => {
        let result = ['copy', {
          name: '自适应',
          action: () => {
            params.columnApi.autoSizeAllColumns();
          }
        }
        ];
        return result;
      }
    }
    this.beforegridOptions.onGridReady = this.settings.onGridReady;
    this.beforegridOptions.groupSuppressAutoColumn = true;
    this.beforegridOptions.columnDefs = [
      {
        cellStyle: { 'display': 'block' }, headerName: '规格', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60, enableRowGroup: true,
            checkboxSelection: true
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', minWidth: 60, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'goodscode.width', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '颜色|锌花', field: 'goodscode.color', minWidth: 95, enableRowGroup: true,
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '原色号', field: 'sehao', minWidth: 80, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 80, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'goodscode.painttype', minWidth: 90, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '漆膜厚度', field: 'goodscode.qimo', minWidth: 90, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'goodscode.tuceng', minWidth: 90, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'goodscode.neijing', minWidth: 80, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否喷码', field: 'goodscode.penma', minWidth: 90, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'oneweight', minWidth: 80, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'goodscode.xiubian', minWidth: 90, enableRowGroup: true,
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'goodscode.packagetype', minWidth: 90, enableRowGroup: true,
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', minWidth: 80, enableRowGroup: true,
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '公差', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { "text-align": "center" }, headerName: '数量', field: 'weightgongcha', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { "text-align": "center" }, headerName: '厚度', field: 'houdugongcha', minWidth: 60, enableRowGroup: true,
          },
          {
            cellStyle: { "text-align": "center" }, headerName: '宽度', field: 'widthgongcha', minWidth: 60, enableRowGroup: true,
          }
        ]
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '交货地址', field: 'innerjiaohuoaddr', minWidth: 90, enableRowGroup: true,
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内部交货期限', field: 'innerqixian', minWidth: 120, enableRowGroup: true,
        valueFormatter: data => {
          return this.datepipe.transform(data.value, 'y-MM-dd');
        },
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '用途', field: 'yongtu', minWidth: 60, enableRowGroup: true,
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '销售单价', field: 'saleprice', minWidth: 90, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '考核单价', field: 'neibujiesuanprice', minWidth: 90,
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '预估费用单价', field: 'yugufeeprice', minWidth: 120, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '预估毛利', field: 'yugumaoliprice', minWidth: 90, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { "text-align": "center" }, headerName: '费用明细', field: 'yugufeemiaoshu', minWidth: 120, enableRowGroup: true },
      {
        cellStyle: { "text-align": "center" }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 80, enableRowGroup: true,
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '下单备注', field: 'beizhu', minWidth: 60, enableRowGroup: true,
      },

    ];

    this.aftergridOptions = {
      groupDefaultExpanded: -1,
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: (params) => {
        let result = ['copy', {
          name: '自适应',
          action: () => {
            params.columnApi.autoSizeAllColumns();
          }
        }
        ];
        return result;
      }
    }
    this.aftergridOptions.onGridReady = this.settings.onGridReady;
    this.aftergridOptions.groupSuppressAutoColumn = true;
    this.aftergridOptions.columnDefs = [
      {
        cellStyle: { 'display': 'block' }, headerName: '规格', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'goodscode.gn', minWidth: 60, enableRowGroup: true,
            checkboxSelection: true
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'goodscode.chandi', minWidth: 60, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'goodscode.houdu', minWidth: 60, enableRowGroup: true,
            valueFormatter: this.settings.valueFormatter3,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['houduid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'goodscode.width', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['widthid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '锌层', field: 'goodscode.duceng', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['ducengid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '颜色|锌花', field: 'goodscode.color', minWidth: 95, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['colorid'], data['data']['id']);
            }
          },
          { cellStyle: { 'text-align': 'center' }, headerName: '原色号', field: 'sehao', minWidth: 80, enableRowGroup: true },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'goodscode.caizhi', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['caizhiid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'goodscode.ppro', minWidth: 80, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['pproid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'goodscode.painttype', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['painttypeid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'goodscode.beiqi', minWidth: 60, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['beiqiid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '漆膜厚度', field: 'goodscode.qimo', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['qimoid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'goodscode.tuceng', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['tucengid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'goodscode.neijing', minWidth: 80, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['neijingid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否喷码', field: 'goodscode.penma', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['penmaid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '单卷重', field: 'oneweight', minWidth: 80, enableRowGroup: true,
            editable: true,
            onCellValueChanged: (params) => { this.modifyattr(params, '单卷重') }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '是否修边', field: 'goodscode.xiubian', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['xiubianid'], data['data']['id']);
            }
          },
          {
            cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'goodscode.packagetype', minWidth: 90, enableRowGroup: true,
            onCellClicked: (data) => {
              this.showgcmodify(data['data']['goodscode']['packagetypeid'], data['data']['id']);
            }
          }
        ]
      },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '订货量', field: 'weight', minWidth: 80, enableRowGroup: true,
        editable: true,
        valueFormatter: this.settings.valueFormatter3,
        onCellValueChanged: (params) => { this.modifyattr(params, '订货量') }
      },
      {
        cellStyle: { 'display': 'block' }, headerName: '公差', headerClass: 'wis-ag-center', enableRowGroup: true,
        children: [
          {
            cellStyle: { "text-align": "center" }, headerName: '数量', field: 'weightgongcha', minWidth: 60, enableRowGroup: true,
            editable: true,
            onCellValueChanged: (params) => { this.modifyattr(params, "数量公差") }
          },
          {
            cellStyle: { "text-align": "center" }, headerName: '厚度', field: 'houdugongcha', minWidth: 60, enableRowGroup: true,
            editable: true,
            onCellValueChanged: (params) => { this.modifyattr(params, "厚度公差") }
          },
          {
            cellStyle: { "text-align": "center" }, headerName: '宽度', field: 'widthgongcha', minWidth: 60, enableRowGroup: true,
            editable: true,
            onCellValueChanged: (params) => { this.modifyattr(params, "宽度公差") }
          }
        ]
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '交货地址', field: 'innerjiaohuoaddr', minWidth: 90, enableRowGroup: true,
        editable: true,
        onCellValueChanged: (params) => { this.modifyattr(params, "交货地址") }
      },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '内部交货期限', field: 'innerqixian', minWidth: 120, enableRowGroup: true,
        editable: true,
        valueFormatter: data => {
          return this.datepipe.transform(data.value, 'y-MM-dd');
        },
        onCellValueChanged: (params) => { this.modifyattr(params, '交货期限') }
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '用途', field: 'yongtu', minWidth: 60, enableRowGroup: true,
        editable: true,
        onCellValueChanged: (params) => { this.modifyattr(params, "用途") }
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '销售单价', field: 'saleprice', minWidth: 90, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2,
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '考核单价', field: 'neibujiesuanprice', minWidth: 90,
        enableRowGroup: true, editable: true,
        valueFormatter: this.settings.valueFormatter2,
        onCellValueChanged: (params) => { this.modifyattr(params, "考核价") }
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '预估费用单价', field: 'yugufeeprice', minWidth: 120, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      {
        cellStyle: { "text-align": "right" }, headerName: '预估毛利', field: 'yugumaoliprice', minWidth: 90, enableRowGroup: true,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { "text-align": "center" }, headerName: '费用明细', field: 'yugufeemiaoshu', minWidth: 120, enableRowGroup: true },
      {
        cellStyle: { "text-align": "center" }, headerName: '指导价格', field: 'zhidaojiagedesc', minWidth: 80, enableRowGroup: true,
        editable: true,
        cellRenderer: data => {
          if (data.data.zhidaojiagedesc === 0) {
            return '正常';
          } else if (data.data.zhidaojiagedesc === 1) {
            return '低于';
          }
        }, onCellValueChanged: (params) => { this.modifyattr(params, "指导价格") }
      },
      {
        cellStyle: { "text-align": "center" }, headerName: '下单备注', field: 'beizhu', minWidth: 60, enableRowGroup: true,
        editable: true,
        onCellValueChanged: (params) => { this.modifyattr(params, '备注') }
      },

    ];






  }

  ngOnInit() {
    this.route.params.subscribe((data) => { this.qihuochangeid = data['id']; });
    this.getqihuochange();
    this.getDetList();
  }
  getqihuochange() {
    this.qihuochangeApi.getDetail(this.qihuochangeid).then(data => {
      this.model = data;
    });
  }
  impqihuodialog() {
    this.bsModalService.config.class = 'modal-all';
    this.qihuodetailModalRef = this.bsModalService.show(QihuodetailimpComponent);
    this.qihuodetailModalRef.content.parentthis = this;
  }
  impqihuodet() {
    this.qihuodetailModalRef.hide();
    this.getDetList();
  }
  getDetList() {
    this.qihuochangeApi.getDetailList(this.qihuochangeid).then(data => {
      console.log(data);
      this.beforegridOptions.api.setRowData(data['beforelist']);
      this.aftergridOptions.api.setRowData(data['afterlist']);
    });
  }
  //修改规格
  showgcmodify(oldvalueid, qihuodetid) {
    if (!oldvalueid) { return; }
    this.values = [];
    this.newattrid = null;
    this.modifygcqihuodetid = null;
    this.modifygcqihuodetid = qihuodetid;
    let modelcls = { classifyid: oldvalueid };
    this.classifyapi.getParentNode(oldvalueid).then(data => {
      this.attrname = data['value'];
    })
    this.classifyapi.getBrothernode(modelcls).then(data => {
      this.values = [];
      data.forEach(element => {
        this.values.push({
          value: element.id,
          label: element.name
        });
      });
    })
    this.gcmodify.show();
  }
  closegcmodify() {
    this.gcmodify.hide();
  }
  modifygc() {
    let modelgc = { name: this.attrname, value: this.newattrid };
    this.qihuochangeApi.modifygc(this.modifygcqihuodetid, modelgc).then(data => {
      this.closegcmodify();
      this.toast.pop('success', '修改成功');
      this.getDetList();
    })
  }
  //添加的明细中的数据修改
  modifyattr(params, type) {
    if (null != this.model['vuserid']) {
      this.toast.pop('warning', '已经提交审核不允许修改！');
      return;
    }
    this.qihuochangeApi.modifyqihuochangedet(params.data.id, { type: type, value: params.newValue }).then(data => {
      this.toast.pop('success', '修改成功');
      this.getDetList();
    });
  }
  editable() {
    console.log(this.model);
    if (this.model['vuerid']) {
      return false;
    } else {
      return true;
    }
  }
  submitvuser() {
    if (confirm('你确定变更完成要提交审核吗？')) {
      this.qihuochangeApi.submitvuser(this.model['id']).then(data => {
        this.toast.pop('success', '修改成功');
        this.getqihuochange();
      });
    }
  }
  review() {
    if (confirm('请确保检查无误，要审核吗？')) {
      this.qihuochangeApi.review(this.model['id']).then(data => {
        this.toast.pop('success', '审核成功');
      });
    }
  }
}
