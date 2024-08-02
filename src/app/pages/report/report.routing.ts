import { Routes } from "@angular/router";

import { DumpreportComponent } from "./dump-report/dump-report.component";
import { CourierReportComponent } from "./courier-report/courier-report.component"


export const reportRoutes: Routes = [
  {
    path: "",
    children: [
      
      
      {
        path: "report",
        component: DumpreportComponent
      },
     
      {
        path:"crown-report",
        component: CourierReportComponent
      },
    ]
  }
];
