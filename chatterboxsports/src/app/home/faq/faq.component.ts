import { Component, OnInit,ViewChild } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor() { }

  ngOnInit(): void {
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
