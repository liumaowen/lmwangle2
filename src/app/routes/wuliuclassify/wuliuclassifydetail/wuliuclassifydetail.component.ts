import { WuliuclassifyComponent } from '../wuliuclassify/wuliuclassify.component';
import { Router } from '@angular/router';
import { ClassifyApiService } from '../../../dnn/service/classifyapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-wuliuclassifydetail',
  templateUrl: './wuliuclassifydetail.component.html',
  styleUrls: ['./wuliuclassifydetail.component.scss']
})
export class WuliuclassifydetailComponent implements OnInit {

  model = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private classifyApi: ClassifyApiService) {

  }

  ngOnInit() {
    this.route.params.subscribe(parans => {
      this.classifyApi.get(parans['id']).then(data => {
        this.model = data;
      });
    });
  }

  updateModel() {
    if (confirm('确定要保存？')) {
      this.classifyApi.update(this.model['id'], this.model).then((model) => {
        WuliuclassifyComponent.nextobj(this.model);
      });
    }
  }

}
