import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddressparseService } from 'app/dnn/service/address_parse';
import { MatchcarService } from 'app/routes/matchcar/matchcar.service';

@Component({
  selector: 'app-cangku',
  templateUrl: './cangku.component.html',
  styleUrls: ['./cangku.component.scss']
})
export class CangkuComponent implements OnInit {

  @ViewChild('classicModal') private classicModal: ModalDirective;

  @ViewChild('createModal') private createModal: ModalDirective;
  results: any;
  tableData;

  // 分页显示的总数量
  totalItems;

  // 分页初始化页码
  currentPage = 1;

  // 查询数据
  querys: object = { pagenum: 1, pagesize: 10 };

  // 省市县
  provinces = [];
  citys = [];
  countys = [];

  constructor(
    private classifyApi: ClassifyApiService,
    private toast: ToasterService,
    private router: Router,
    private addressparseService: AddressparseService) {
    this.querydata();
  }

  ngOnInit() {
    setTimeout(() => {
      this.addressparseService.getData();
    }, 1000);
  }

  // 分页点击查询数据
  pageChanged(event) {
    this.querys['pagenum'] = event.page;
    this.querys['pagesize'] = event.itemsPerPage;
    this.querydata();
  }

  // 查询时序表数据
  querydata() {
    this.classifyApi.query(this.querys).then(data => {
      // 获取到总条目
      this.totalItems = data.headers.get('total');
      // 获取到当前数据
      this.tableData = data.json();
    });
  }

  // 启动查询对话框
  queryDialog() {
    this.showclassicModal();
  }

  // 查询收款信息
  query() {
    this.querys['pagenum'] = 1;
    this.querydata();
    this.hideclassicModal();
  }
  areas = new Array();

  model = {};

  // 启动添加对话框
  createDialog() {
    this.areas = [];
    this.classifyApi.listBypid({ pid: 3814 }).then((data) => {
      const arealist = [{ label: '请选择所在区域', value: '' }];
      data.forEach(element => {
        arealist.push({
          label: element['name'],
          value: element['id']
        });
      });
      this.areas = arealist;
    });
    this.showcreateModal();
  }

  selectNull() {
    this.model = {};
  }

  // 创建收款单登记表
  addCangku() {
    if (!this.model['areaid']) {
      this.toast.pop('warning', '请填写仓库所在的区域！');
      return;
    }
    if (!this.model['name']) {
      this.toast.pop('warning', '请填写仓库名称！');
      return;
    }
    if (!this.model['address']) {
      this.toast.pop('warning', '请填写仓库地址！');
      return;
    }
    if (!this.model['tihuotime']) {
      this.toast.pop('warning', '请填写提货时间！');
      return;
    }
    if (!this.model['contactway']) {
      this.toast.pop('warning', '请填写联系电话！');
      return;
    }
    if (!this.model['fax']) {
      this.toast.pop('warning', '请填写传真号！');
      return;
    }
    if (!this.model['startprovinceid']) {
      this.toast.pop('warning', '请填写所在省！');
      return;
    }
    if (!this.model['startcityid']) {
      this.toast.pop('warning', '请填写所在市！');
      return;
    }
    if (!this.model['startcountyid']) {
      this.toast.pop('warning', '请填写所在县！');
      return;
    }
    // 2017.04.13 仓库重构仓库管理修改 cpf MOD start
    this.model['proviceid'] = this.model['startprovinceid'];
    this.model['cityid'] = this.model['startcityid'];
    this.model['countryid'] = this.model['startcountyid'];
    this.classifyApi.addcangku(this.model).then((response) => {
      this.hidecreateModal();
      this.toast.pop('success', '添加成功');
      this.router.navigate(['cangku', response.json()['id']]);
    });
    // 2017.04.13 仓库重构仓库管理修改 end
  }

  showclassicModal() {
    this.classicModal.show();
  }

  hideclassicModal() {
    this.classicModal.hide();
  }

  showcreateModal() {
    this.getProvince();
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

  selectedaddress(destination) {
    console.log('#########', destination);
    if (destination) {
      const addressObj = this.addressparseService.parsingAddress(destination);
      this.citys = []; this.countys = [];
      this.model['startprovinceid'] = '';
      this.model['startcityid'] = '';
      this.model['startcountyid'] = '';
      if (addressObj['provinceValue']) {
        if (this.provinces.length) {
          this.model['startprovinceid'] = addressObj['provinceValue'];
          this.getpcc(this.model['startprovinceid'], this.citys).then(cityData => {
            if (addressObj['cityValue']) {
              if (cityData.length) {
                this.model['startcityid'] = addressObj['cityValue'];
                this.getpcc(this.model['startcityid'], this.countys).then(countyData => {
                  if (addressObj['countyValue']) {
                    if (countyData.length) {
                      if (countyData.some(d => d['value'] === addressObj['countyValue'])) {
                        this.model['startcountyid'] = addressObj['countyValue'];
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  }
  getpcc(pid, pccname: any[]) {
    return new Promise((resolve: (data) => void) => {
      this.classifyApi.getChildrenTree({ pid: pid }).then((data) => {
        data.forEach(element => {
          pccname.push({
            label: element.label,
            value: element.id + ''
          });
        });
        resolve(pccname);
      });
    });
  }

  getProvince() {
    this.classifyApi.getChildrenTree({ pid: 263 }).then((data) => {
      data.forEach(element => {
        this.provinces.push({
          label: element.label,
          value: element.id
        });
      });
      this.citys = [];
      this.countys = [];
      this.provinces = this.provinces;
      this.citys = [];
      this.countys = [];
    });
  }

  getcity1() {
    this.citys = [];
    delete this.model['cityid'];
    delete this.model['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['startprovinceid'] }).then((data) => {
      data.forEach(element => {
        this.citys.push({
          label: element.label,
          value: element.id
        });
        console.log(element.label)
      });

      this.countys = [];
    });
  }

  getcounty1() {
    this.countys = [];
    delete this.model['countyid'];
    this.classifyApi.getChildrenTree({ pid: this.model['startcityid'] }).then((data) => {
      data.forEach(element => {
        this.countys.push({
          label: element.label,
          value: element.id
        });
      });
    });
  }
  // 增加腾讯地图地址自动补充
  searchplace(e) {
    this.classifyApi.getSuggestionPlace(e.query).then(data => {
      this.results = [];
      data.forEach(element => {
        this.results.push({
          name: element.address + '\r\n' + element.title,
          code: element
        });
      });
    });
  }
}
