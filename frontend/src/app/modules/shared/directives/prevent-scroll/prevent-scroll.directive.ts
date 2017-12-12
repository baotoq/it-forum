import { Directive, OnInit } from '@angular/core';

@Directive({
  selector: '[preventScroll]',
})
export class PreventScrollDirective implements OnInit {

  ngOnInit() {
  }
}
