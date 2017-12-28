import { Component, OnInit } from '@angular/core';
import { Tag } from '../../../models/tag';
import { LoadingService } from '../../../components/loading/loading.service';
import { TagService } from '../../tag/tag.service';

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss'],
})
export class ManageTagsComponent implements OnInit {
  tags: Tag[];

  constructor(private loadingService: LoadingService,
              private tagService: TagService) {
  }

  ngOnInit() {
    this.loadingService.spinnerStart();
    this.tagService.getAll()
      .finally(() => this.loadingService.spinnerStop())
      .subscribe(resp => {
        this.tags = resp;
      });
  }

}
