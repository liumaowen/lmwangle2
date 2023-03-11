import { ToasterService } from 'angular2-toaster';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { Subject } from 'rxjs/Subject';


const obableses = new Subject();

@Component({
  selector: 'app-wuliuclassify',
  templateUrl: './wuliuclassify.component.html',
  styleUrls: ['./wuliuclassify.component.scss']
})
export class WuliuclassifyComponent implements OnInit {

  @ViewChild('tree') private tree;

  @ViewChild('createModal') private createModal: ModalDirective;

  cancleAdd = true;

  newTreeNode = { name: '', sort: '' };

  customTemplateStringOptions = {
    getChildren: (node) => {
      return this.classifyApi.getChildrenTree({ pid: node['data']['id'] }).then((response) => {
        const nodelist = new Array();
        response.forEach(element => {
          if (element.children) {
            nodelist.push({
              id: element.id,
              name: element.label,
              hasChildren: true
            });
          } else {
            nodelist.push({
              id: element.id,
              name: element.label,
              hasChildren: false
            });
          }
        });
        return nodelist;
      });

    },
    allowDrag: true
  };

  // 分组对象
  nodes: any[] = null;

  selectnodes;

  static nextobj(obj) {
    obableses.next(obj);
  }

  constructor(private classifyApi: ClassifyApiService,
    private toast: ToasterService,
    private router: Router) {
    this.getnodes(14390);
  }

  ngOnInit() {
    obableses.subscribe(data => {
      this.selectnodes.data.name = data['name'];
      this.tree.treeModel.update();
    });
  }

  // 展开分组显示
  onEvent(msg) {
    console.log(msg);
  }

  // 过滤筛选菜单导航
  filterNodes(text, tree) {
    tree.treeModel.filterNodes(text, true);
  }

  getnodes(id): any {
    this.classifyApi.getChildrenTree({ pid: id }).then((response) => {
      const nodelist = new Array();
      response.forEach(element => {
        if(element.id == '14399'||element.id == '14412'){
          if (element.children) {
            nodelist.push({
              id: element.id,
              name: element.label,
              hasChildren: true
            });
          } else {
            nodelist.push({
              id: element.id,
              name: element.label,
              hasChildren: false
            });
          }
        }
      });
      this.nodes = nodelist;
    });
  }

  active(node) {
    console.log(node);
    this.cancleAdd = false;
    this.selectnodes = node;
    this.router.navigate(['wuliuclassify', node.data['id']]);
  }

  deactivate(node) {
    this.cancleAdd = true;
    this.selectnodes = undefined;
    this.router.navigate(['wuliuclassify']);
  }

  openAddDialog(tree) {
    this.newTreeNode = { name: '', sort: '' };
    if (this.selectnodes.data) {
      this.showcreateModal();
    } else {
      this.toast.pop('warning', '请选择要添加的节点');
    }
  }

  addNode(tree) {
    if (!this.newTreeNode.name) {
      this.toast.pop('warning', '节点名称不能为空！');
      return;
    }
    if (!this.newTreeNode.sort) {
      this.toast.pop('warning', '排序序号不能为空！');
      return;
    }
    this.classifyApi.addNode({
      name: this.newTreeNode.name,
      parentid: this.selectnodes.data.id,
      sortorder: this.newTreeNode.sort
    }).then(data => {
      console.log(data);
      if (this.selectnodes.data.hasChildren) {
        if (this.selectnodes.data['children'] && this.selectnodes.data['children'].length > 1) {
          this.selectnodes.data['children'].push({
            id: data.json().id,
            name: this.newTreeNode.name,
            hasChildren: false
          });
        }
      } else {
        this.selectnodes.data.hasChildren = true;
        this.selectnodes['children'] = [];
        this.selectnodes['children'].push({
          id: data.json().id,
          name: this.newTreeNode.name,
          hasChildren: false
        });
      }
      tree.treeModel.update();
      this.hidecreateModal();
    });

  }

  showcreateModal() {
    this.createModal.show();
  }

  hidecreateModal() {
    this.createModal.hide();
  }

}
