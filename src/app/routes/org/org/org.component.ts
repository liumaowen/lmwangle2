import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { OrgApiService } from 'app/dnn/service/orgapi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

const obableses = new Subject();

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.scss']
})
export class OrgComponent implements OnInit {

  @ViewChild('tree') private tree;

  @ViewChild('createModal') private createModal: ModalDirective;

  cancleAdd = true;

  newTreeNode = { name: '', sort: '' };

  customTemplateStringOptions = {
    getChildren: (node) => {
      return this.orgApi.getChildrenTree({ pid: node['data']['id'] }).then((response) => {
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
    // actionMapping,
    allowDrag: true
  };

  // 分组对象
  nodes: any[] = null;

  selectnodes;

  static nextobj(obj) {
    obableses.next(obj);
  }


  constructor(private orgApi: OrgApiService,
    private router: Router,
    private toast: ToasterService) {
    this.getnodes(0);
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
    this.orgApi.getChildrenTree({ pid: id }).then((response) => {
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
      this.nodes = nodelist;
    });
  }
  active(node) {
    this.cancleAdd = false;
    this.selectnodes = node;
    this.router.navigate(['org', node.data['id']]);
  }

  deactivate(node) {
    this.cancleAdd = true;
    this.selectnodes = undefined;
    this.router.navigate(['org']);
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
    this.orgApi.addNode({
      name: this.newTreeNode.name,
      parentid: this.selectnodes.data.id,
      sortorder: this.newTreeNode.sort
    }).then(data => {
      console.log(data);
      if (this.selectnodes.data.hasChildren) {
        if (this.selectnodes.data['children'].length > 1) {
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
