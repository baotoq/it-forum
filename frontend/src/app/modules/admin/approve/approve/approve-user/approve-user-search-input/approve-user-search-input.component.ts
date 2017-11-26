import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approve-user-search-input',
  templateUrl: './approve-user-search-input.component.html',
  styleUrls: ['./approve-user-search-input.component.scss'],
})
export class ApproveUserSearchInputComponent implements OnInit {
  search = false;
  searchControl = new FormControl();
  @ViewChild('searchInput') searchInput: ElementRef;

  @Output() searchOut = new EventEmitter<any>();
  @Output() approve = new EventEmitter<any>();
  @Output() decline = new EventEmitter<any>();
  @Output() approveAll = new EventEmitter<any>();
  @Output() declineAll = new EventEmitter<any>();

  @Input() approveLoading = false;

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

  onApprove() {
    this.searchControl.setValue('');
    this.approve.emit();
  }

  onDecline() {
    this.searchControl.setValue('');
    this.decline.emit();
  }

  onApproveAll() {
    this.searchControl.setValue('');
    this.approveAll.emit();
  }

  onDeclineAll() {
    this.searchControl.setValue('');
    this.declineAll.emit();
  }
}
