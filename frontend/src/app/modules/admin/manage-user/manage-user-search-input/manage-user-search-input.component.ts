import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-user-search-input',
  templateUrl: './manage-user-search-input.component.html',
  styleUrls: ['./manage-user-search-input.component.scss'],
})
export class ManageUserSearchInputComponent implements OnInit {
  search = false;
  searchControl = new FormControl();
  @ViewChild('searchInput') searchInput: ElementRef;

  @Output() searchOut = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onSearchFocus() {
    this.search = true;
    this.searchInput.nativeElement.focus();
  }

  onSearchOut() {
    this.search = false;
    this.searchOut.emit(this.searchControl.value);
  }
}
