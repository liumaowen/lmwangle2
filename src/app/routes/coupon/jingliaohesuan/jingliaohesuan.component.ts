import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { ClassifyApiService } from 'app/dnn/service/classifyapi.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-jingliaohesuan',
  templateUrl: './jingliaohesuan.component.html',
  styleUrls: ['./jingliaohesuan.component.scss']
})
export class JingliaohesuanComponent implements OnInit {
  @ViewChild('modifyModal') modifyModal: ModalDirective;
  @ViewChild('addModal') addModal: ModalDirective;
  classifylist = [];
  classify = {};
  gns: any[]= [];
  jingliaomodel = {
    parentid: null,
    name: null,
  };
  modifyHeadName = '价格';
  constructor(public classifyapi: ClassifyApiService, private toast: ToasterService) {
    this.getclassify();
  }

  ngOnInit() {
  }
  getclassify() {
    this.classifyapi.jingliaohesuan({ pid: 11445 }).then(data => {
      this.classifylist = data;
    });
  }
  modify(item) {
    this.classify = item;
    if (item.name === '开平加工费') {
      this.modifyHeadName = '吨位';
    } else {
      this.modifyHeadName = '价格';
    }
    this.modifyModal.show();
  }
  // 查询
  getGnAndChandi() {
    this.classifyapi.getGnAndChandi().then((data) => {
      // console.log(data);
      data.forEach(element => {
        this.gns.push({
          label: element['name'],
          value: element['name']
        });
      });
    });
  }
  add(item) {
    console.log(item);
    this.jingliaomodel.parentid = item.id;
    this.getGnAndChandi();
    this.addModal.show();
  }
  mod() {
    if (null === this.classify['value'] || undefined === this.classify['value']) {
      this.toast.pop('warning', '请填写价格!');
      return;
    }
    this.classifyapi.updatekucunclassify(this.classify).then(data => {
      this.toast.pop('success', '价格设置成功!');
      this.getclassify();
      this.close();
    });
  }
  addpinming(){
    console.log(this.jingliaomodel);
    if (null === this.jingliaomodel['name']) {
      this.toast.pop('warning', '请选择品名!');
      return;
    }
    this.classifyapi.addNode(this.jingliaomodel).then(data =>{
      this.toast.pop('success', '品名添加成功');
      this.getclassify();
      this.close();
    });
  }
  close() {
    this.modifyModal.hide();
    this.addModal.hide();
  }
}
