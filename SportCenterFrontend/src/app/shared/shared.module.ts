import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PaginationHeaderComponent } from './components/pagination-header/pagination-header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    PaginationHeaderComponent,
    PaginationComponent,
    OrderSummaryComponent
  ],
  imports: [
    CommonModule,
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  exports: [
    PaginationModule,
    PaginationHeaderComponent,
    PaginationComponent,
    CarouselModule,
    OrderSummaryComponent,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule
  ]
})
export class SharedModule { }
