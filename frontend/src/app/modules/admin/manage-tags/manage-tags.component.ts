import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../models/tag';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { MatDialog } from '@angular/material';
import { EditTagDialogComponent } from './edit-tag-dialog/edit-tag-dialog.component';

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss'],
})
export class ManageTagsComponent implements OnInit {
  tags: Tag[];

  constructor(private loadingService: LoadingService,
              private tagService: TagService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.tagService.getAll()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.tags = resp;
      });
  }

  create() {
    this.dialog.open(CreateTagDialogComponent, {
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.tags.push(result);
        }
      });
  }

  edit(tag) {
    this.dialog.open(EditTagDialogComponent, {
      data: tag,
      width: '600px',
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          tag.name = result.name;
        }
      });
  }
}
