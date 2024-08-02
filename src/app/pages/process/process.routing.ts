import { Routes } from "@angular/router";
import { CourierEntryComponent } from './Courier-Entry/Courier-Entry.component';
// import { InwardACKComponent } from './InwardACK/InwardACK.component';
// import { FileAcknowledgeComponent } from "./file-acknowledge/file-acknowledge.component";
import { FileAckComponent } from './file-ack/file-ack.component';
import { CreateCourierComponent } from './Create-Courier/Courier-Create.component';

import { FileinwardComponent } from './file-inward/file-inward.component'
 

export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
    
      
      {
        path: "Create-Courier",
        component: CreateCourierComponent
      },
      {
        path: "Courier-Entry",
        component: CourierEntryComponent
      }  
      ,
      {
        path: "FileInward",
        component: FileAckComponent
      },
    
      {
        path:"InwardFile",
        component:FileinwardComponent
      }
     
      
    ]
  }
];
