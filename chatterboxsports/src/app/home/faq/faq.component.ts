import { Component, OnInit,ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  faqId=0;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.faqId = params['id'];
      
    });
    this.scrollToSection();
  }
  

  scrollToSection()
  {
    let element:HTMLBodyElement  = document.getElementsByTagName('body')[0] as HTMLBodyElement;
    element.scrollIntoView({
        behavior: "smooth", block: "start"
    });
  }

}
