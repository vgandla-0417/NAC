import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { OnlineExamServiceService } from 'src/app/Services/online-exam-service.service';
import { Globalconstants } from 'src/app/Helper/globalconstants';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from "src/app/Services/common.service";


var misc: any = {
  sidebar_mini_active: false
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}


export let ROUTES: RouteInfo[] = []
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  AddRoleForm: FormGroup;

  public routes = []
  _PageList = []
  _RList = []
  get roles() {
    return this.AddRoleForm.get("Roles") as FormArray;
  }
  constructor(private router: Router, private _auth: AuthenticationService, private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService, private _global: Globalconstants, private _commonService: CommonService) { }

  ngOnInit() {
    this.AddRoleForm = this.formBuilder.group({
      roleName: ["", Validators.required],
      remarks: ["", Validators.required],
      Roles: this.formBuilder.array([]),
    });
    this.getPageList(this._auth.getUserInfo.tid)
    this.minimizeSidebar();
    this.onMouseLeaveSidenav();
    this.getRightList();
    this._onlineExamService.isRoleChanged.subscribe(res => {
      this.AddRoleForm.get("Roles") as FormArray;
      this.initializeRoutes();
      //console.log("Roles change timestamp: " + res);
    })
  }

  initializeRoutes() {
    this.routes = [];
    this.AddRoleForm.value.Roles.forEach(role => {
      if (role.isChecked || role.subItems.filter(el => el.isChecked).length > 0) {
        let route = this.getRoute(role.page_name);
        if (route && Object.keys(route).length !== 0) {
          route.ParentID = role.ParentID;
          route.ChildID = role.ChildID;
        }
        if (route) {
          role.subItems.forEach(subRoute => {
            if (subRoute.isChecked) {
              let matchedRoute = this.getRoute(subRoute.page_name);
              if (matchedRoute && Object.keys(matchedRoute).length !== 0) {
                matchedRoute.ParentID = subRoute.ParentID;
                matchedRoute.ChildID = subRoute.ChildID;
              }
              if (matchedRoute && route.children)
                route.children.push(matchedRoute);
            }
          });
        }
        this.routes.push(route)
      }
    });
    console.log('Routes', this.routes);
    this.routes.sort((a: any, b: any) => a.ParentID - b.ParentID);
    this.routes.map(route => {
      route.children.sort((a: any, b: any) => a.ChildID - b.ChildID);
    });
    this.menuItems = this.routes.filter(menuItem => menuItem);
    this._commonService.setMenuAccess(this.menuItems);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }

  getRoute(routeName: string): any {
    let route: any = {}
    //console.log(routeName);

    switch (routeName) {
      case "Dashboard": {
        route = {
          path: "/dashboards",
          title: "Dashboards",
          type: "sub",
          icontype: "ni-shop text-primary",
          isCollapsed: true,
          children: [
            { path: "dashboard", title: "Dashboard", type: "link", ChildID: 0 },

          ]
        }
        break;
      }
      case "Userdashboard": {
        route = { path: "Userdashboard", title: "User Dashboard", type: "link" }
        break;
      }
      case "User Management": {
        route = {
          path: "/usermanagement",
          title: "User Management",
          type: "sub",
          icontype: "fa fa-users text-orange",
          isCollapsed: true,
          children: []
        }
        break;
      }
      case "Add User": {
        route = { path: "users", title: "Users", type: "link" }
        break;
      }
      case "Add Role": {
        route = { path: "roles", title: "Roles", type: "link" }
        break;
      }
      case "Change Password": {
        route = { path: "change-password", title: "Change Password", type: "link" }
        break;
      }

      // case "Document list": {
      //   route = { path: "document-list", title: "Document list", type: "link" }
      //   break;
      // }

      case "Upload": {
        route = {
          path: "/upload",
          title: "Upload",
          type: "sub",
          icontype: "fas fa-file-upload text-danger",
          isCollapsed: true,
          children: []
        }
        break;
      }

 
      case "Dumpupload": {
        // route.children.push({ path: "file-upload", title: "File Upload", type: "link" })
        route = { path: "Dumpupload", title: "Dump Upload", type: "link" }
        break;
      }
      case "Invupload": {
        // route.children.push({ path: "file-upload", title: "File Upload", type: "link" })
        route = { path: "Invupload", title: "Inv upload", type: "link" }
        break;
      }

      case "Master": {
        route = {
          path: "/master",
          title: "Masters",
          type: "sub",
          icontype: "fa fa-certificate text-danger",
          isCollapsed: true,
          children: [

          ]
        }
        break;
      }
      case "Product": {
        route = { path: "checklist", title: "Add Product", type: "link" }
        break;
      }
      case "Courier Master": {
        route = { path: "CourierMaster", title: "Courier Master", type: "link" }
        break;
      }

      

 
  
  
      case "Process": {
        route = {
          path: "/process",
          title: "Process",
          type: "sub",
          icontype: "fa fa-database text-pink",
          isCollapsed: true,
          children: [

            //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
            //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
            //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
          ]
        }
        break;
      }



    

      case "Courier-Entry": {
        route = { path: "Courier-Entry", title: "Courier Inward", type: "link" }
        break;
      }

      case "FileInward": {
        route = { path: "FileInward", title: "File Inward", type: "link" }
        break;
      }
     

      


// case "Fincare Auditor": {
//   route = {
//     path: "/FincareAuditor",
//     title: "Fincare Audit",
//     type: "sub",
//     icontype: "fa fa-database text-pink",
//     isCollapsed: true,
//     children: [

//       //  {path: "Retrivalrequest", title: "Retrieval Request", type: "link", ChildID: 0 } //,
//       //  {path: "HealthCheck", title: "Health Check", type: "link", ChildID: 0 },
//       //  {path: "branch-inward", title: "Branch Inward", type: "link", ChildID: 0 }
//     ]
//   }
//   break;
// }

//  AckByAuditor
//  AuditorHealthAck
//  FincareHealthAck

// AckByAuditor
// AuditorHealthAck

// case "AckByAuditor": {
//   route = { path: "AckByAuditor", title: "Ack by Audit", type: "link" }
//   break;
// }

// case "AuditorHealthAck": {
//   route = { path: "AuditorHealthAck", title: "Audit Scrutiny", type: "link" }
//   break;
// }



// case "FincareHealthAck": {
//   route = { path: "FincareHealthAck", title: "Final Scrutiny", type: "link" }
//   break;
// }

 
      case "Search": {
        route = {
          path: "/search",
          title: "Search",
          type: "sub",
          icontype: "fa fa-search text-green",
          isCollapsed: true,
          children: [
            // { path: "advance-search", title: "Advanced Search", type: "link" },
             { path: "quick-search", title: "Quick Search", type: "link" },
            
          ]
        }
        break;
      }

      case "Report": {
        route = {
          path: "/report",
          title: "Reports",
          type: "sub",
          icontype: "fa fa-book text-default",
          isCollapsed: true,
          children: []
        }
        break;
      }

      
      case "Crown Report": {
        route = { path: "crown-report", title: "Crown Report", type: "link" }
        break;
      }

      case "Status Report": {
        route = { path: "report", title: "Report", type: "link" }
        break;
      }
 
   

      default: { route = null }
    }
    return route
  }

  getPageList(TID: number) {
    const apiUrl =
      this._global.baseAPIUrl +
      "Role/GetPageList?ID=" +
      Number(localStorage.getItem('sysRoleID')) +
      "&user_Token=" + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: []) => {

      this._PageList = data;
      this._PageList.forEach((item) => {
        if (item.parent_id == 0) {
          item.subItem = [];
          let fg = this.formBuilder.group({
            page_name: [item.page_name],
            isChecked: [item.isChecked],
            subItems: this.formBuilder.array([]),
            id: [item.id],
            parent_id: [item.parent_id],
            ParentID: [item.ParentID],
            ChildID: [item.ChildID]
          });
          this.roles.push(fg);
        }
      });

      this._PageList.forEach((item) => {
        if (item.parent_id && item.parent_id != 0) {
          let found = this.roles.controls.find(
            (ctrl) => ctrl.get("id").value == item.parent_id
          );
          if (found) {
            let fg = this.formBuilder.group({
              page_name: [item.page_name],
              isChecked: [item.isChecked],
              subItems: [[]],
              id: [item.id],
              parent_id: [item.parent_id],
              ParentID: [item.ParentID],
              ChildID: [item.ChildID]
            });
            let subItems = found.get("subItems") as FormArray;
            subItems.push(fg);
          }
        }
      });
      this.initializeRoutes()
    });
  }

  getRightList() {
    const apiUrl =
      this._global.baseAPIUrl +
      "Role/GetRightList?ID=" +
      Number(localStorage.getItem('sysRoleID')) +
      "&user_Token=" + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: []) => {
      this._RList = data;
      localStorage.setItem('Download', "0");
      localStorage.setItem('Delete', "0");
      localStorage.setItem('Email', "0");
      localStorage.setItem('Link', "0");
      localStorage.setItem('Edit', "0");
      localStorage.setItem('Document View', "0");

      this._RList.forEach((item) => {
        if (item.page_right == "Download") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Download', item.isChecked);
        }
        if (item.page_right == "Delete") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Delete', item.isChecked);
        }
        if (item.page_right == "Link") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Link', item.isChecked);
        }
        if (item.page_right == "Email") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Email', item.isChecked);
        }
        if (item.page_right == "Edit") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Edit', item.isChecked);
        }
        if (item.page_right == "Document View") {
          //localStorage.getItem('sysRoleID') = 
          localStorage.setItem('Document View', item.isChecked);
        }
      });
      this._commonService.setRightList(this._RList);
    });
  }

  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {

    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {

    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
