import { ToasterService } from 'angular2-toaster';
import { ProduceapiService } from './../../../routes/produce/produceapi.service';
import { BsModalRef } from 'ngx-bootstrap';
import { GridOptions } from 'ag-grid';
import { SettingsService } from './../../../core/settings/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-basematerialimport',
  templateUrl: './basematerialimport.component.html',
  styleUrls: ['./basematerialimport.component.scss']
})
export class BasematerialimportComponent implements OnInit {
  @ViewChild('createModal') private createModal: ModalDirective;
  // 接收父页面this对象
  parentthis;

  bmgridOptions: GridOptions;
  taskjson = {};
  types = [];
  iszong = true;
  slitlist = [];
  slitjson = {};
  pipeiparams: any = {};
  constructor(public settings: SettingsService, public bsModalRef: BsModalRef, private produceApi: ProduceapiService,
    private toast: ToasterService) {

    this.bmgridOptions = {
      enableFilter: true,
      rowSelection: 'multiple',
      rowDeselection: true,
      suppressRowClickSelection: false,
      enableColResize: true,
      enableSorting: true,
      overlayLoadingTemplate: this.settings.overlayLoadingTemplate,
      overlayNoRowsTemplate: this.settings.overlayNoRowsTemplate,
      onCellClicked: (params) => { params.node.setSelected(true, true); }
    };

    this.bmgridOptions.columnDefs = [
      { headerName: 'id', field: 'id', width: 50, checkboxSelection: true },
      { cellStyle: { 'text-align': 'center' }, headerName: '品名', field: 'gn', width: 60 },
      { cellStyle: { 'text-align': 'center' }, headerName: '产地', field: 'chandi', width: 90 },
      { cellStyle: { 'text-align': 'center' }, headerName: '仓库', field: 'cangkuname', width: 120 },
      { cellStyle: { 'text-align': 'center' }, headerName: '规格', field: 'guige', width: 180 },
      { cellStyle: { 'text-align': 'center' }, headerName: '宽度', field: 'width', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '长度', field: 'length', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '厚度', field: 'houdu', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '镀层', field: 'duceng', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '材质', field: 'caizhi', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '颜色', field: 'color', width: 80 },
      { cellStyle: { 'text-align': 'center' }, headerName: '资源号', field: 'grno', width: 100 },
      { cellStyle: { 'text-align': 'center' }, headerName: '捆包号', field: 'kunbaohao', width: 100 },
      {
        cellStyle: { 'text-align': 'right' }, headerName: '重量', field: 'weight', width: 90,
        valueFormatter: this.settings.valueFormatter3
      },
      { cellStyle: { 'text-align': 'center' }, headerName: '备注', field: 'beizhu', width: 100 },
    ];

    setTimeout(() => {
      this.listbm();
    }, 500);
  }

  ngOnInit() {
  }

  listbm() {
    console.log(this.parentthis['tasklist']);
    if (this.parentthis['tasklist']['producemode'] === 1) {// 如果是OEM的加工
      this.produceApi.getOEMBmlist({ cangkuid: this.parentthis['tasklist']['cangkuid'] }).then((response) => {
        this.bmgridOptions.api.setRowData(response);
      });
    } else if (this.parentthis['tasklist']['producemode'] === 3) {// 如果是维实品牌的加工
      this.produceApi.getWeishiBmlist({ cangkuid: this.parentthis['tasklist']['cangkuid'] }).then((response) => {
        this.bmgridOptions.api.setRowData(response);
      });
    } else if (this.parentthis['tasklist']['sellerid'] === 3786) {
      this.produceApi.getHDBmlist({ cangkuid: this.parentthis['tasklist']['cangkuid'] }).then((response) => {
        this.bmgridOptions.api.setRowData(response);
      });
    } else {
      const param = { buyerid: this.parentthis['tasklist']['buyerid'], cangkuid: this.parentthis['tasklist']['cangkuid'] };
      this.produceApi.getBmlist(param).then((response) => {
        const rowData = new Array();
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          const model = {};
          model['id'] = response[i].id;
          model['gn'] = response[i].goodscode.gn;
          model['chandi'] = response[i].goodscode.chandi;
          model['cangkuname'] = response[i].cangku.name;
          model['cangkuid'] = response[i].cangkuid;
          model['guige'] = response[i].guige;
          model['grno'] = response[i].grno;
          model['kunbaohao'] = response[i].kunbaohao;
          model['weight'] = response[i].weight;
          model['width'] = response[i].width;
          model['length'] = response[i].length;
          model['houdu'] = response[i].houdu;
          model['duceng'] = response[i]['goodscode'].duceng;
          model['caizhi'] = response[i]['goodscode'].caizhi;
          model['color'] = response[i]['goodscode'].color;
          rowData.push(model);
        }
        this.bmgridOptions.api.setRowData(rowData);
      });
    }
  }

  checkAll() {
    this.bmgridOptions.api.selectAll();
  }


  importBm() {
    console.log(this.taskjson);
    if (!this.taskjson['type']) {
      this.toast.pop('warning', '请选择加工类型！');
      return;
    }
    if (!this.taskjson['packton']) {
      this.toast.pop('warning', '请输入打包吨位！');
      return;
    }
    if (this.taskjson['type'] === '1') {
      if (this.slitlist.length === 0) {
        this.toast.pop('warning', '请填写纵剪要求！');
        return;
      }
    } else {
        if (!this.taskjson['guige']) {
            this.toast.pop('warning', '请填写横切要求！');
            return;
        }
    }
    this.taskjson['slitjson'] = this.slitlist;
    if (this.parentthis.qihuodetid) {
      this.taskjson['qihuodetid'] = this.parentthis.qihuodetid;
    }
    if (this.parentthis['tasklist']['producemode'] === 3) {
      this.taskjson['guige'] = this.parentthis['weishihoudu'] + '*' + this.parentthis['weishiwidth'] + '*' + this.taskjson['guige'];
    }
    this.produceApi.impBm(this.taskjson).then((data) => {
      // $scope.$emit('impBm', data);//向父页面传递所引入的数据
      console.log(data);
      if (data['flag']) {
        this.toast.pop('success', data['msg']);
      } else {
        this.toast.pop('error', data['msg']);
      }
      this.parentthis.impBm();
    });
  }
  add() {
    const ids = new Array();
    const bm = this.bmgridOptions.api.getModel()['rowsToDisplay'];
    // console.log(bm);
    const widtharr = new Set(),houduarr = new Set();
    let tweight = 0;
    for (let i = 0; i < bm.length; i++) {
      if (bm[i].selected) {
        ids.push(bm[i].data.id);
        // console.log('aa', this.parentthis['tasklist']['cangkuid']);
        // console.log('bb', bm[i].data.cangkuid);
        if (bm[i].data.cangkuid !== this.parentthis['tasklist']['cangkuid']) {
          this.toast.pop('warning', '请选择指定仓库的基料！');
          return;
        }
        tweight = tweight['add'](bm[i].data['weight']);
        widtharr.add(bm[i].data['width']);
        houduarr.add(bm[i].data['houdu']);
      }
    }

    // console.log(ids);
    if (ids.length <= 0) {
      this.toast.pop('warning', '请选择要引入的基料！');
      // Notify.alert('请选择要引入的基料！', { status: 'warning' });
      return '';
    }
    if (this.parentthis['tasklist']['sellerid'] === 3786 ||
      this.parentthis['tasklist']['producemode'] === 1 ||
      this.parentthis['tasklist']['producemode'] === 3) {
      this.taskjson['kucunids'] = ids;
    } else {
      this.taskjson['proorderdetids'] = ids;
    }
    this.pipeiparams = {originwidth:Array.from(widtharr).join(','),originhoudu:Array.from(houduarr).join(','),packagetype:this.parentthis['tasklist']['packagetype'],cangkuid:this.parentthis['tasklist']['cangkuid'],weight:tweight};
    this.taskjson['pid'] = this.parentthis['tasklist']['id'];
    this.types = [{ id: '1', text: '纵剪' }, { id: '2', text: '横切' }, { id: '3', text: '纵剪+横切' }];
    this.createModal.show();
  }
  selectetype(e) {
    // console.log(e);
    this.taskjson['type'] = e.id;
    if (e.id === '1') {
        this.iszong = true;
      } else {
        this.iszong = false;
    }
  }
  closeq() {
    this.createModal.hide();
    this.slitlist = [];
    this.slitjson = {};
    this.taskjson = {};
  }
  addslit() {
    if (!this.slitjson['slittingguige']) {
      this.toast.pop('warning', '请填写规格再添加！');
      return '';
    }
    if (!this.slitjson['slittingcount']) {
      this.toast.pop('warning', '请填写纵剪数量再添加！');
      return '';
    }
    if (this.slitjson['slittingcount'] <= 0 || this.slitjson['slittingguige'] <= 0) {
      this.toast.pop('warning', '纵剪规格、数量不能为零或负数！');
      return;
    }
    this.slitlist.push({ slittingguige: this.slitjson['slittingguige'], slittingcount: this.slitjson['slittingcount'] });
    this.slitjson = {};
    // console.log('list', this.slitlist);
    // console.log('json', this.slitjson);
  }
  delitem(index) {
    console.log('del', index);
    this.slitlist.splice(index, 1);
  }
  pipeifee() {
    const typeint = this.taskjson['type'];
    if (!typeint) {
        this.toast.pop('warning', '请选择加工类型！');
        return; 
    }
    let type = '';
    let zongjiancount:any = 0;
    let hengqielength = "";
    let hengqiewidth = "";
    if (typeint === '1') {
        type = '纵剪';
        if (!this.slitlist.length) {
            this.toast.pop('warning', '请填写纵剪要求！');
            return;
        }
        this.slitlist.forEach(ele => {
            zongjiancount = zongjiancount['add'](ele['slittingcount']);
        });
    } else if (typeint === '2') {
        type = '横切';
        if (!this.taskjson['guige']) {
            this.toast.pop('warning', '请填写横切要求！');
            return;
        }
        hengqielength = this.taskjson['guige'];
    } else {
        type = '纵剪+横切';
        if (!this.slitlist.length) {
            this.toast.pop('warning', '请填写纵剪要求！');
            return;
        }
        const widthlist = [];
        this.slitlist.forEach(ele => {
            zongjiancount = zongjiancount['add'](ele['slittingcount']);
            widthlist.push(ele['slittingguige']);
        });
        hengqiewidth = widthlist.join(',');
        if (!this.taskjson['guige']) {
            this.toast.pop('warning', '请填写横切要求！');
            return;
        }
        hengqielength = this.taskjson['guige'];
    }
    const packton = this.taskjson['packton'];
    if (!packton) {
        this.toast.pop('warning', '请填写打包吨位！');
        return; 
    }
    this.pipeiparams['type'] = type;
    this.pipeiparams['zongjiancount'] = zongjiancount;
    this.pipeiparams['hengqielength'] = hengqielength;
    this.pipeiparams['packton'] = packton;
    this.pipeiparams['hengqiewidth'] = hengqiewidth;
    this.pipeiparams['type'] = type;
    this.produceApi.pipeiprocessfee(this.pipeiparams).then((data) => {
        if (data['fee'] && !isNaN(data['fee'])) {
            this.taskjson['fee'] = data['fee'];
        } else {
            this.toast.pop('warning', '没有匹配到加工费！');
        }
    });
  }
}
