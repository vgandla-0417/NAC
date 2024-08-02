import { OnlineExamServiceService } from "../../Services/online-exam-service.service";
import { NgModule  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// import { NgxPrintModule } from "ngx-print";
import { ModalModule } from 'ngx-bootstrap/modal';
import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from "@angular/router";
import { DepartmentRoutes } from "./process.routing";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CourierEntryComponent } from './Courier-Entry/Courier-Entry.component';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FileAckComponent } from './file-ack/file-ack.component';
import { CreateCourierComponent } from './Create-Courier/Courier-Create.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { ButtonModule } from "primeng/button";

import { FileinwardComponent } from './file-inward/file-inward.component';
import {MultiSelectModule} from 'primeng';

  

@NgModule({
  declarations:  [CreateCourierComponent,FileinwardComponent,FileAckComponent, CourierEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ProgressbarModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CheckboxModule,
    TableModule,
    MultiSelectModule,
   // BrowserModule,
    //BrowserAnimationsModule,
    TableModule,
    
    FormsModule,
    ButtonModule
   
  ],
 })
export class ProcessModule {}
