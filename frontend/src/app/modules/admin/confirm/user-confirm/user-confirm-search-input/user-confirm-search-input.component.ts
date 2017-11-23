import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-confirm-search-input',
  templateUrl: './user-confirm-search-input.component.html',
  styleUrls: ['./user-confirm-search-input.component.scss'],
})
export class UserConfirmSearchInputComponent implements OnInit {
  search = false;
  searchControl = new FormControl();
  @ViewChild('searchInput') searchInput: ElementRef;

  @Output() searchOut = new EventEmitter<any>();
  @Output() confirm = new EventEmitter<any>();
  @Output() deny = new EventEmitter<any>();
  @Output() confirmAll = new EventEmitter<any>();
  @Output() denyAll = new EventEmitter<any>();

  @Input() confirmLoading = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.searchControl.setValue('');
    });
  }

  onSearchFocus() {
    this.search = true;
    this.searchInput.nativeElement.focus();
  }

  onSearchOut() {
    this.search = false;
    this.searchOut.emit(this.searchControl.value);
  }

  onConfirm() {
    this.searchControl.setValue('');
    this.confirm.emit();
  }

  onDeny() {
    this.searchControl.setValue('');
    this.deny.emit();
  }

  onConfirmAll() {
    this.searchControl.setValue('');
    this.confirmAll.emit();
  }

  onDenyAll() {
    this.searchControl.setValue('');
    this.denyAll.emit();
  }
}
