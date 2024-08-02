import { Routes } from "@angular/router";
  
import { QuicksearchComponent } from './Quicksearch/Quicksearch.component';
import { SearchViewComponent } from './search-vew/search-view.component';

//DataUploadComponent
 
 
export const searchRoutes: Routes = [
  {
    path: "",
    children: [      
      
      {
        path: "quick-search",
       component: QuicksearchComponent
      },
      {
        path: "search-history",
       component: SearchViewComponent
      }
      
    //search/Klap-search
      
            
    ]
  }
];
