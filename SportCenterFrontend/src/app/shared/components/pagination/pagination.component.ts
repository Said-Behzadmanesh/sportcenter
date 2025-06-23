import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() totalElements!: number;
  @Input() currentPage!: number;
  @Input() pageSize!: number;
  @Output() pageChanged = new EventEmitter();
}
