import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { element } from 'protractor';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { GridOptions } from 'ag-grid/main';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-goodscode',
  templateUrl: './goodscode.component.html',
  styleUrls: ['./goodscode.component.scss']
})
export class GoodscodeComponent implements OnInit {

  gridOptions: GridOptions;
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  disabled = true;
  constructor(public settings: SettingsService, private classifyapi: ClassifyApiService, private toast: ToasterService) {
    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: 'multiple',
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems,
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;


    // 设置aggird表格列
    this.gridOptions.columnDefs = [

      { cellStyle: { 'text-align': 'center' }, headerName: '编码', field: 'id', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 120},
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57},
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'color', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '漆膜厚度', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '基板', field: 'matbasilarplate', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆涂层种类', field: 'matbackcoatingtype', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '表面结构', field: 'matsurfacestructure', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '板型', field: 'matplatecut', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '板宽', field: 'matplateswidth', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '板厚', field: 'matplatesply', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '外板材质', field: 'matoutertabletexture', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '外板产地', field: 'matoutertableproduction', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '外板厚度', field: 'matoutertableplatesply', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '芯材种类', field: 'matcorematerialsvariety', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内板材质', field: 'matinnertabletexture', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内板产地', field: 'matinnertableproduction', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '内板厚度', field: 'matinnertableplatesply', minWidth: 80 }
    ];
  }

  ngOnInit() {
  }

  // 获取弹窗窗口
  @ViewChild('parentModal') private classicModal: ModalDirective;

  // 打开查询窗口
  openclassicmodal() {
    // 获取品名信息
    // if (this.items.pmitems.length < 2) {
    //   this.classifyapi.listBypid({ pid: 2 }).then(data => {
    //     data.forEach(element => {
    //       this.items.pmitems.push({
    //         value: element.id,
    //         label: element.name
    //       })
    //     });
    //   })
    // };
    this.classicModal.show();
  }

  // 关闭查询窗口
  closeclassicmodal() {
    this.classicModal.hide();
  }

  // 查询条件
  requestparams = {};

  // 查询列表
  query() {
    const param = JSON.parse(JSON.stringify(this.requestparams));
    for (let key in param) {
      if (param.hasOwnProperty(key)) {
        const element = param[key];
        if (!element) {
          delete param[key]
        }
      }
    }
    this.classifyapi.listGc(param).then(data => {
      this.gridOptions.api.setRowData(data);
      // else {
      //   sweetalert({
      //     title: '查询物料编码不存在是否进行添加？',
      //     type: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#23b7e5',
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     closeOnConfirm: false
      //   }, (value) => {
      //     if (value) {
      //       this.classifyapi.addGc(this.requestparams).then(data => {
      //         this.gridOptions.api.setRowData(data);
      //       })
      //       sweetalert.close();
      //     }
      //   });
      // }
    })
    this.closeclassicmodal();
  }

  items = {
    pmitems: [{ value: '', label: '取消' }],
    cditems: [{ value: '', label: '取消' }],
    coloritems: [{ value: '', label: '取消' }],
    widthitems: [{ value: '', label: '取消' }],
    houduitems: [{ value: '', label: '取消' }],
    ducengitems: [{ value: '', label: '取消' }],
    caizhiitems: [{ value: '', label: '取消' }],
    pproitems: [{ value: '', label: '取消' }],
    beiqiitems: [{ value: '', label: '取消' }],
    painttypeitems: [{ value: '', label: '取消' }],
    qimoitems: [{ value: '', label: '取消' }],
    tucengitems: [{ value: '', label: '取消' }],
    neijingitems: [{ value: '', label: '取消' }],
    penmaitems: [{ value: '', label: '取消' }],
    xiubianitems: [{ value: '', label: '取消' }],
    packagetypeitems: [{ value: '', label: '取消' }]
  };

  // 获取产地信息
  selectGnAction(gnid) {
    this.selectNull();
    if (gnid.value) {
      this.requestparams['gnid'] = gnid.value;
      this.classifyapi.listBypid({ pid: gnid.value }).then(data => {
        data.forEach(element => {
          this.items.cditems.push({
            value: element.id,
            label: element.name
          })
        });
        this.cddisabled = false;
      })
    } else {
      this.cddisabled = true;
    }
  }

  // 设置是否禁用
  pprodisabled = true;
  caizhidisabled = true;
  colordisabled = true;
  ducengdisabled = true;
  hoududisabled = true;
  widthdisabled = true;
  cddisabled = true;
  beiqidisabled = true;
  painttypedisabled = true;
  qimodisabled = true;
  tucengdisabled = true;
  neijingdisabled = true;
  penmadisabled = true;
  xiubiandisabled = true;
  packagetypedisabled = true;


  // 选择产地
  selectCdAction(cdid) {
    let gnid = this.requestparams['gnid'];
    this.requestparams = {};
    this.requestparams['gnid'] = gnid;
    this.requestparams['chandiId'] = cdid.value;    
    let cellname = ['caizhi', 'color', 'duceng', 'houdu', 'ppro', 'width', 'beiqi', 'painttype', 'qimo', 'tuceng', 'neijing', 'penma', 'xiubian', 'packagetype']
    this.classifyapi.listproperties({ chandiid: cdid.value }).then(data => {
      cellname.forEach(el => {
        this.items[el + 'items'] = [{ value: '', label: '取消' }];
        if (data[el]) {
          data[el].forEach(element => {
            this.items[el + 'items'].push({
              value: element.id,
              label: element.name
            })
            this[el + 'disabled'] = false;
          });
        }

      })
    })
    
  }

  selectPaintAction(paintid){

    //烨辉彩涂的颜色查询
    let cellname = ['color']
    if(this.requestparams['gnid'] === 3 && this.requestparams['chandiId'] === 8){
      this.classifyapi.listcolors({ chandiid: this.requestparams['chandiId'],painttypeid:this.requestparams['painttypeid'] }).then(data => {
        cellname.forEach(el => {
          this.items[el + 'items'] = [{ value: '', label: '取消' }];
          if (data[el]) {
            data[el].forEach(element => {
              this.items[el + 'items'].push({
                value: element.id,
                label: element.name
              })
              this[el + 'disabled'] = false;
            });
          }

        })
      })
  }
  }

  // 重置按钮
  selectNull() {
    // this.pprodisabled = true;
    // this.cddisabled = true;
    // this.caizhidisabled = true;
    // this.colordisabled = true;
    // this.ducengdisabled = true;
    // this.hoududisabled = true;
    // this.widthdisabled = true;
    // this.beiqidisabled = true;

    // this.painttypedisabled = true;
    // this.qimodisabled = true;
    // this.tucengdisabled = true;
    // this.neijingdisabled = true;
    // this.penmadisabled = true;
    // this.xiubiandisabled = true;
    // this.packagetypedisabled = true;
    this.requestparams = {};
    this.disabled = true;
    this.attrs = [];
    // this.items['cditems'] = [{ value: '', label: '取消' }];
    // this.items['coloritems'] = [{ value: '', label: '取消' }];
    // this.items['widthitems'] = [{ value: '', label: '取消' }];
    // this.items['houduitems'] = [{ value: '', label: '取消' }];
    // this.items['ducengitems'] = [{ value: '', label: '取消' }];
    // this.items['caizhiitems'] = [{ value: '', label: '取消' }];
    // this.items['pproitems'] = [{ value: '', label: '取消' }];
    // this.items['beiqiitems'] = [{ value: '', label: '取消' }];

    // this.items['painttypeitems'] = [{ value: '', label: '取消' }];
    // this.items['qimoitems'] = [{ value: '', label: '取消' }];
    // this.items['tucengitems'] = [{ value: '', label: '取消' }];
    // this.items['neijingitems'] = [{ value: '', label: '取消' }];
    // this.items['penmaitems'] = [{ value: '', label: '取消' }];
    // this.items['xiubianitems'] = [{ value: '', label: '取消' }];
    // this.items['packagetypeitems'] = [{ value: '', label: '取消' }];
  }

  // 添加属性字段
  @ViewChild('childModal') private childModal: ModalDirective;

  // 2018.05.04 色系开发 cpf MOD start
  colorSystem = false;
  colorSysytems = [];
  color = {};
  // 打开窗口
  addPropertyDialog(chandiid, key) {
    if (key === '颜色' && this.requestparams['gnid'] === 3) {
      this.color = {};
      this.colorSysytems = [];
      this.classifyapi.listBypid({ pid: 6674 }).then(data => {
        data.forEach(element => {
          this.colorSysytems.push({
            value: element.id,
            label: element.name
          });
        });
      });
      this.colorSystem = true;
    } else {
      this.colorSystem = false;
    }
    console.log(chandiid, key);
    this.param = {};
    if (!chandiid) {
      this.toast.pop('warning', '请选择产地！');
      return '';
    }
    this.param['chandiid'] = chandiid;
    this.param['key'] = key;
    this.childModal.show();
  }
  // 2018.05.04 色系开发 end

  // 关闭子窗口
  closechildModal() {
    this.childModal.hide();
  }


  // 添加的字段值
  param = {};

  // 创建按钮
  createCls() {
    sweetalert({
      title: '你确定创建吗？',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, (value) => {
      if (value) {
        console.log(value);
        console.log('00000000000'+this.param['name']);
        if (this.param['name'] && this.requestparams['chandiId'] !== 8) {
          if (this.param['key'] === '颜色' && this.requestparams['gnid'] === 3) {
            if (this.color['pid']) {
              this.color['name'] = this.param['name'];
              console.log(this.color);
              this.classifyapi.createColorSystem(this.color).then(() => { });
            }
          }
          this.classifyapi.addNameToCls(this.param).then(() => {
            this.toast.pop('success', '创建成功');
            // this.selectCdAction(this.param['chandiId']);
          });
        }else if(this.param['name'] && this.requestparams['chandiId'] === 8){
            if(this.param['key'] !== '颜色'){
              this.classifyapi.addNameToCls(this.param).then(() => {
                this.toast.pop('success', '创建成功');
              });
            }else{
              this.classifyapi.createYehuiColorSystem({paintypeid:this.param['painttypeid'],color:this.param['name']}).then(() => { });
            }
        }
        sweetalert.close();
        this.closechildModal();
      }
    });
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.requestparams['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.requestparams[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
    for (let i = 0; i < this.attrs.length; i++) {
      const element = this.attrs[i];
      if (element['defaultval'] && element['options'].length) {
        this.requestparams[element['value']] = element['defaultval'];
      }
    }
  }

}
