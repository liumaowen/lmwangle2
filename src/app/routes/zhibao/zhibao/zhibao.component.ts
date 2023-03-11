import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ZhibaoService } from './../zhibao.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { element } from 'protractor';

const sweetalert = require('sweetalert');

@Component({
  selector: 'app-zhibao',
  templateUrl: './zhibao.component.html',
  styleUrls: ['./zhibao.component.scss']
})
export class ZhibaoComponent implements OnInit {
  // 品名选择弹窗
  @ViewChild('mdmgndialog') private mdmgndialog: ModalDirective;
  attrs = [];
  isall = false; // 是否全选
  // 查询条件对象
  queryzhibao = {
    gnid: '', kunbaohao: '', grno: '', chandi: '', color: '',
    width: '', houdu: '', duceng: '', caizhi: '', ppro: ''
  }
  // 品名
  pmitems;
  // 产地
  cditems;
  // 颜色
  coloritems;

  // 宽度
  widthitems;

  // 厚度
  hditems;

  // 镀层
  dcitems;

  // 材质
  czitems;

  // 后处理
  hclitems;
  // 定义过滤之后的集合
  filterConditionObj = {};
  // 默认禁止选择
  disabled = true;

  // 查询出来所有的分类
  data = new Array<any>();
  // 常量作为字段名
  fieldArr = [
    'chandi', // 产地
    'color', // 颜色
    'width', // 宽度
    'houdu', // 厚度
    'duceng', // 镀层
    'caizhi', // 材质
    'ppro'// 后处理
  ];
  //添加质保书对象
  addzhibao: any = {
    grno: '',
    kunbaohao: ''
  }

  //获取的表格数据，并显示页面
  singleData = [];

  //查询所有表格数量
  datacounts;

  constructor(private zhibaoApi: ZhibaoService, private toaster: ToasterService, private classifyapi: ClassifyApiService) {
    this.querycounts();
  }

  ngOnInit() {
    this.addModel.isAnimated = false;
    this.uploaderModel.isAnimated = false;
  }

  @ViewChild('staticModal') private addModel: ModalDirective;

  //打开添加质保书弹窗
  addzhibaoshu() {
    this.addselectNull();
    this.addModel.show();
  }

  //关闭添加质保书弹窗
  addcolse() {
    this.addModel.hide();
  }

  //清空添加质保书对象
  addselectNull() {
    this.addzhibao = {
      grno: '',
      kunbaohao: ''
    }
  }

  //添加质保书
  addlist() {
    this.zhibaoApi.verify({ kunbaohao: this.addzhibao['kunbaohao'] }).then(data => {
      if (data.flag) {
        this.addcolse();
        this.showDialog();
      } else {
        if (this.addzhibao.kunbaohao === undefined) {
          this.toaster.pop('error', '捆包号不能为空');
        } else {
          this.toaster.pop('error', '捆包号重复');
        }
      }
    });
  }

  //上传质保书
  @ViewChild('parentModal') private uploaderModel: ModalDirective;
  uploadParam = {
    module: 'ruku', count: 1, sizemax: 10,
    extensions: ['tiff', 'pdf', 'jpeg']
  };

  //设置上传文件类型
  accept = '.jpeg, image/jpeg ,application/pdf,image/tiff';

  //点击上传执行的回调函数
  uploads($event) {
    let addData = {
      url: [$event.url], extensions: this.uploadParam.extensions,
      kunbaohao: this.addzhibao['kunbaohao'], grno: this.addzhibao['grno']
    };
    if ($event.length !== 0) {
      this.zhibaoApi.create(addData).then(data => {
        // data = data.json();
        //如果上传成功urls返回值不为空，放入数据到data中 
        // this.singleData.push(data);
        //重新加载table
        this.querycounts();
        this.queryzhibao['grno'] = this.addzhibao['grno'];
        this.queryzhibao['kunbaohao'] = this.addzhibao['kunbaohao'];
      });
      this.querytable();
    }
    this.hideDialog();
  }

  //关闭上传弹窗
  hideDialog() {
    this.uploaderModel.hide();
  }

  //打开上传弹窗
  showDialog() {
    this.uploaderModel.show();
  }

  //获取查询质保书弹窗
  @ViewChild('classicModal') private classModel: ModalDirective;
  //查询质保书
  query() {
    this.selectNull();
    if (!this.pmitems) {
      this.pmitems = [{ value: '', label: '全部' }];
      this.classifyapi.getGnAndChandi().then((data) => {
        console.log(data);
        data.forEach(element => {
          this.pmitems.push({
            label: element['name'],
            value: element['name']
          });
        });
      });
    }
    this.classModel.show();
  }
  // 品名选中改变
  selectGnAction(key) {
    if (!this.queryzhibao[key]) {
      return;
    } else {
      const gnid = this.queryzhibao['gn'];
    }
    this.zhibaoApi.getConditions({ gn: this.queryzhibao['gn'] }).then(data => {
      this.data = data;
      // console.log(data);
      this.filter();
    });
    this.disabled = false;
  }
  filter() {
    this.fieldArr.forEach(fieldElement => {
      // 除自己以外其他字段
      const otherFieldArr = this.fieldArr.filter(element => element !== fieldElement);
      const queryOptions = [{ value: '', label: '全部' }];
      otherFieldArr.forEach(otherFieldElement => {
        this.data.forEach(dataElement => {
          if (otherFieldArr.every(otherField => {
            return this.queryzhibao[otherField] === '' || dataElement[otherField] === this.queryzhibao[otherField];
          })) {
            const fieldValue = dataElement[fieldElement];
            if (fieldValue != null && JSON.stringify(queryOptions).indexOf(JSON.stringify(fieldValue)) === -1) {
              queryOptions.push({ value: fieldValue, label: fieldValue });
            }
          }
        });
        this.filterConditionObj[fieldElement] = queryOptions;
      });
    });
  }
  selectAction(key, value) {
    this.filter();
  }
  //关闭查询质保书的弹窗
  colse() {
    this.classModel.hide();
  }

  //重选功能
  selectNull() {
    this.queryzhibao = {
      gnid: '', kunbaohao: '', grno: '', chandi: '', color: '',
      width: '', houdu: '', duceng: '', caizhi: '', ppro: ''
    }
    this.disabled = true;
  }

  //点击查询，调用查询质保书接口
  querylist() {
    this.querytable();
    this.colse();
  }

  //查询质保书列表信息
  querytable() {
    this.zhibaoApi.getlist(this.queryzhibao).then(data => {
      this.singleData = data;
    });
  }

  //查询质保书所有数量
  querycounts() {
    this.zhibaoApi.getcounts().then(data => {
      this.datacounts = data['counts'];
    })
  }

  //点击删除质保书
  delzhibao(id, grno) {
    sweetalert({
      title: '你确定要删除吗？',
      text: '你即将删除资源号为:' + grno + '的质保书',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#23b7e5',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnConfirm: false
    }, () => {

      this.zhibaoApi.delzhibao(id).then(data => {
        this.querytable();
        this.querycounts();
      })
      sweetalert.close();
    });

  }

  @ViewChild('lgModal') private lgModal: ModalDirective;

  viewzhibao = {
    grno: '',
    kunbaohao: '',
    url: ''
  }

  //查看单个质保书
  view(id) {
    this.zhibaoApi.get(id).then(data => {
      this.viewzhibao = data;
    })
    this.lgModal.show();
  }

  viewclose() {
    this.lgModal.hide();
  }
  /**选择多选框 */
  checkboxchange(event) {
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }
  /**全选 */
  allcheck() {
    if (this.isall) {
      this.singleData.forEach(item => {
        item.checked = false;
      });
    } else {
      this.singleData.forEach(item => {
        item.checked = true;
      });
    }
    const isnotall = this.singleData.some(item => !item.checked);
    if (isnotall) {
      this.isall = false;
    } else {
      this.isall = true;
    }
  }
  /**一键下载质保书 */
  alldownload() {
    const files = [];
    this.singleData.forEach(item => {
      if (item.checked && item.url) {
        files.push(item.url);
      }
    });
    if (files.length) {
      this.zhibaoApi.generatezip({ pathList: files }).then(data => {
        if (data['zipurl']) {
          window.open(data['zipurl']);
        }
      });
    } else {
      this.toaster.pop('warning', '请选择要下载的质保书！');
    }
  }
  selectgn(params) {
    this.mdmgndialog.hide();
    const item = params['item'];
    const attrs = params['attrs'];
    this.queryzhibao['gn'] = item.itemname;
    this.disabled = false;
    for (let i = 0; i < attrs.length; i++) {
      const element = attrs[i];
      this.queryzhibao[element.value] = '';
      element['options'].unshift({ value: '', label: '全部' });
    }
    this.attrs = attrs;
  }
}
