import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination-header',
  templateUrl: './pagination-header.component.html',
  styleUrl: './pagination-header.component.scss'
})
export class PaginationHeaderComponent {

  @Input() totalElements!: number;
  @Input() currentPage!: number;
  @Input() pageSize!: number;

}
