import { ProorderapiService } from './../../../routes/produce/proorderapi.service';
import { BusinessorderapiService } from './../../../routes/businessorder/businessorderapi.service';
import { InnersaleapiService } from './../../../routes/innersale/innersaleapi.service';
import { AllotapiService } from './../../../routes/allot/allotapi.service';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { DecimalPipe } from '@angular/common';
import { KucunService } from './../../../routes/kucun/kucun.service';
import { StorageService } from './../../service/storage.service';
import { SettingsService } from './../../../core/settings/settings.service';
import { GridOptions } from 'ag-grid/main';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-favoritelist',
  templateUrl: './favoritelist.component.html',
  styleUrls: ['./favoritelist.component.scss']
})
export class FavoritelistComponent implements OnInit {

  // 接收到父页面传递过来父的对象
  parentthis;

  gridOptions: GridOptions;

  constructor(public bsModalRef: BsModalRef, public settings: SettingsService, private storage: StorageService,
    private kucunapi: KucunService, private numberpipe: DecimalPipe, private toast: ToasterService,
    private allotapi: AllotapiService, private innersaleApi: InnersaleapiService,
    private businessOrderApi: BusinessorderapiService, private proOrderApi: ProorderapiService) {

    this.gridOptions = {
      groupDefaultExpanded: -1,
      rowSelection: "multiple",
      suppressAggFuncInHeader: true,
      enableRangeSelection: true,
      rowDeselection: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      excelStyles: this.settings.excelStyles,
      getContextMenuItems: this.settings.getContextMenuItems
    };

    this.gridOptions.onGridReady = this.settings.onGridReady;
    // this.gridOptions.groupUseEntireRow = true;
    this.gridOptions.groupSuppressAutoColumn = true;

    // 设置aggird表格列
    this.gridOptions.columnDefs = [

      { cellStyle: { 'text-align': 'left' }, headerName: 'id', field: 'id', minWidth: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '采购公司', field: 'buyername', minWidth: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '货权机构', field: 'orgname', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', minWidth: 90 },
      /*2017.12.19 补充规格缺失参数 cpf MOD start */
      // { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '价格', field: 'price', minWidth: 60,
        valueFormatter: this.settings.valueFormatter2
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', minWidth: 57,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '背漆', field: 'beiqi', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色锌花', field: 'color', minWidth: 90 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', minWidth: 70,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, suppressMenu: true, headerName: '米数', field: 'length', minWidth: 50 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', minWidth: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '后处理', field: 'ppro', minWidth: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '卷内径', field: 'neijing', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '膜厚', field: 'qimo', minWidth: 57 },
      { cellStyle: { 'text-align': 'center' }, headerName: '油漆种类', field: 'painttype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '修边', field: 'xiubian', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '包装方式', field: 'packagetype', minWidth: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '喷码', field: 'penma', minWidth: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '涂层', field: 'tuceng', minWidth: 57 },
      {
        cellStyle: { 'text-align': 'center' }, headerName: '操作', field: '', minWidth: 60,
        cellRenderer: (params) => '<a target="_blank">删除</a>', onCellClicked: (params) => {
          sweetalert({
            title: '你确定移除吗？',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#23b7e5',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnConfirm: false
          }, () => {
            let kucunid = params.node.data.id;
            let fav = this.storage.getObject('fav');
            for (var i = 0; i < fav.length; i++) {
              if (kucunid == fav[i]) {
                fav.splice(i, 1);
              }
            }
            storage.setObject('fav', fav);
            this.listDetail();
            sweetalert.close();
            this.toast.pop('success', '数据移除成功^_^!');
          });
        }
      }

    ];


  }

  ngOnInit() {
    this.listDetail();
  }

  // 查询收藏夹数据
  listDetail() {
    let fav = this.storage.getObject('fav');
    if (fav) {
      if (fav.length > 0) {
        this.kucunapi.getlist({ kucunids: fav }).then(data => {
          this.storage.remove('fav');
          let favs = new Array();
          data.forEach(element => {
            favs.push(element['id']);
          });
          this.storage.setObject('fav', favs);
          this.gridOptions.api.setRowData(data);
        });
      } else {
        this.toast.pop('warning', '收藏夹中没有数据');
      }
    } else {
      this.toast.pop('warning', '收藏夹中没有数据');
    }
  }

  // 控制引入按钮是否显示
  isimport = {};

  // 清空
  clear() {
    if (this.storage.getObject('fav')) {
      sweetalert({
        title: '你确定要清除收藏夹中的数据吗？',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#23b7e5',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnConfirm: false
      }, () => {
        this.storage.remove('fav');
        this.toast.pop('success', '数据移除成功^_^!');
        this.gridOptions.api.setRowData(null);
        sweetalert.close();
      });
    } else {
      this.toast.pop('warning', '收藏夹中没有数据');
    }
  }



  // 全选按钮
  checkAll() {
    this.gridOptions.api.selectAll();
  }

  // 需要父页面传方法过来。
  parentVar = (parentThis) => {
    if (this.parentthis.isimport) {
      this.isimport['flag'] = false;
    } else {
      this.isimport = { flag: true };
    }
  }

  // 判断引入的是内采还是调拨来使用其他页面传过来的。
  innersale;

  // 引入
  import() {
    let ids = new Array();
    let orgids = new Array();
    const kucuns = this.gridOptions.api.getModel()['rowsToDisplay'];
    for (let i = 0; i < kucuns.length; i++) {
      if (kucuns[i].selected) {
        ids.push(kucuns[i].data.id);
        orgids.push(kucuns[i].data.orgid);
      }
    }
    console.log(this.parentthis);
    if (ids.length === 0) {
      this.toast.pop('warning', '请选择要引入的货物!');
      return;
    }
    /**判断引入的是内采来使用还是调拨来使用*/
    if (this.parentthis['innersale']) {
      this.innersaleApi.importFav(this.parentthis.innersale.id, { id: this.parentthis.innersale.id, kucunids: ids }).then((data) => {
        const favids = this.storage.getObject('fav');
        for (let i = 0; i < kucuns.length; i++) {
          if (kucuns[i].selected) {
            for (let j = 0; j < favids.length; j++) {// 引入的数据要从本地缓存中删除
              if (kucuns[i].data.id === favids[j]) {
                favids.splice(j, 1);
              }
            }
          }
        }
        this.storage.setObject('fav', favids); // 引入数据后因已经删除部分所以要重新保存 
        // $scope.$emit('innersaleFav', data);// 向父页面传递所引入的数据
        this.parentthis.innersaleFav(data);
      });
    } else if (this.parentthis['businessorder']) { // 判断是否是业务销售合同引入的数据
      for (let i = 0; i < orgids.length; i++) {
        if (this.parentthis.businessorder.isself) {
          if (this.parentthis.businessorder.org.id !== orgids[i]) {
            this.toast.pop('warning', '自销只能引用自己机构的货物!');
            return;
          }
        } else {
          if (this.parentthis.businessorder.org.id === orgids[i]) {
            this.toast.pop('warning', '代销不能引用自己机构的货物!');
            return;
          }
          if (!(orgids[i] === 670 ||
            orgids[i] === 22350 ||
            orgids[i] === 22427 ||
            orgids[i] === 21587)) {
            this.toast.pop('warning', '代销只能引用资源中心的货物!');
            return;
          }
        }
      }
      this.businessOrderApi.importFav(this.parentthis.businessorder.id,
        { id: this.parentthis.businessorder.id, kucunids: ids }).then((data) => {
          const favids = this.storage.getObject('fav');
          for (let i = 0; i < kucuns.length; i++) {
            if (kucuns[i].selected) {
              for (let j = 0; j < favids.length; j++) {// 引入的数据要从本地缓存中删除
                if (kucuns[i].data.id === favids[j]) {
                  favids.splice(j, 1);
                }
              }
            }
          }
          this.storage.setObject('fav', favids); // 引入数据后因已经删除部分所以要重新保存
          // $scope.$emit('businessorder', data);// 向父页面传递所引入的数据
          this.parentthis.businessorderfav(data);
        });
    } else if (this.parentthis['model']) {// 库存调拨
      if (ids.length > 0) {
        this.allotapi.allotList({ kucunids: ids }).then((data) => {
          const favids = this.storage.getObject('fav');
          for (let i = 0; i < kucuns.length; i++) {
            if (kucuns[i].selected) {
              for (let j = 0; j < favids.length; j++) {
                if (kucuns[i].data.id === favids[j]) {
                  favids.splice(j, 1);
                }
              }
            }
          }
          this.storage.setObject('fav', favids);
          // $scope.$emit('importAllotFav', data);// 向父页面传递所引入的数据
          this.parentthis.importAllotFav(data);
        });
      }
    } else if (this.parentthis['proorder']) { // 判断是否是加工合同引入的数据
      for (let i = 0; i < orgids.length; i++) {
        if (this.parentthis.proorder.org.id !== orgids[i] &&
          !(orgids[i] === 670 ||
            orgids[i] === 22350 ||
            orgids[i] === 22427 ||
            orgids[i] === 21587)) {
          this.toast.pop('warning', '只能引用自己机构或者涂镀的货物做基料!');
          return;
        }
      }
      this.proOrderApi.importFav(this.parentthis.proorder.id, { kucunids: ids }).then((data) => {
        const favids = this.storage.getObject('fav');
        for (let i = 0; i < kucuns.length; i++) {
          if (kucuns[i].selected) {
            for (let j = 0; j < favids.length; j++) {// 引入的数据要从本地缓存中删除
              if (kucuns[i].data.id === favids[j]) {
                favids.splice(j, 1);
              }
            }
          }
        }
        this.storage.setObject('fav', favids); // 引入数据后因已经删除部分所以要重新保存  
        // $scope.$emit('proorder', data);// 向父页面传递所引入的数据
        this.parentthis.Proorder();
      });
    }
  }


}
