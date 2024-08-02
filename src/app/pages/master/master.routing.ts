import { Routes } from "@angular/router";
import { DepartmentComponent } from "./department/department.component";
import { BranchMappingComponent } from './branch-mapping/branch-mapping.component';
import { CourierMasterComponent } from "./Courier-Master/Courier-Master.component";
import { CheckListMasterComponent } from "./check-list-master/check-list-master.component";
// import { RetrievalRequestComponent } from "../process/retrieval-request/retrieval-request.component";
// import { ApprovalComponent } from "../process/approval/approval.component";
// import { FileAcknowledgeComponent } from "../process/file-acknowledge/file-acknowledge.component";



export const DepartmentRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "BranchMaster",
        component: DepartmentComponent
      },
      {
        path: "folder-mapping",
        component: BranchMappingComponent
      },
      {
        path: "CourierMaster",
        component: CourierMasterComponent
      },
      {
        path:"checklist",
        component: CheckListMasterComponent
      }
      
      
    ]
  }
];
