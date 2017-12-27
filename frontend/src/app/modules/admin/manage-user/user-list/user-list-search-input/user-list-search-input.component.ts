import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-list-search-input',
  templateUrl: './user-list-search-input.component.html',
  styleUrls: ['./user-list-search-input.component.scss'],
})
export class UserListSearchInputComponent implements OnInit {
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
