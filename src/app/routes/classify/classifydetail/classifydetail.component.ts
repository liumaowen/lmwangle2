import { ClassifyComponent } from './../classify/classify.component';
import { Router } from '@angular/router';
import { ClassifyApiService } from './../../../dnn/service/classifyapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-classifydetail',
  templateUrl: './classifydetail.component.html',
  styleUrls: ['./classifydetail.component.scss']
})
export class ClassifydetailComponent implements OnInit {

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
        // classifyController 给父亲传值
        ClassifyComponent.nextobj(this.model);
        // this.router.navigate(['classify']);
      });
    }
  }

}
