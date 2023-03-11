import { element } from 'protractor';
import { StorageService } from './../../service/storage.service';
import { UserapiService } from './../../service/userapi.service';
import { Directive, ElementRef, Input, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
  selector: '[NgOpera]'
})
export class NgoperaDirective {
  private hasView = false;

  @Input('NgOpera') set opeara(condition: number) {
    let myrole;
    let accounts;
    this.userapi.myrole().then(data => {
      myrole = data || [];
      if (!myrole.length) return;
      this.userapi.accounts(condition).then((response) => {
        accounts = response || [];
        if (!accounts) return;
        this.hasView = false;
        this.viewContainer.clear();
        for (let i in accounts) {
          let account = accounts[i];
          if (myrole.indexOf(account) != -1) {
            this.hasView = true;
            this.viewContainer.createEmbeddedView(this.templateRef);
            break;
          }
        }
      });
    })
  }

  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef, private userapi: UserapiService) {
  }

}
