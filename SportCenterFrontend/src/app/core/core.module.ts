import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './section-header/section-header.component';
// 1. IMPORT THE STANDALONE COMPONENT, NOT THE MODULE
import { BreadcrumbComponent } from 'xng-breadcrumb';



@NgModule({
  declarations: [
    NavBarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }), // ToastrModule added
    // 2. ADD THE STANDALONE COMPONENT TO THE IMPORTS ARRAY
    BreadcrumbComponent,
  ],
  exports: [
    NavBarComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SectionHeaderComponent,
    // 3. EXPORT THE BREADCRUMB COMPONENT SO IT CAN BE USED IN APPCOMPONENT
    BreadcrumbComponent
  ]
})
export class CoreModule { }
