import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';
import swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-role",
  templateUrl: "role.component.html",
})
export class RoleComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  _FilteredList: any;
  _RoleList: any;
  RoleForm: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];

  myFiles: string[] = []; 
  first = 0;
  rows = 10; 


  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrService,
    
    private http: HttpClient,
    private httpService: HttpClient  
  ) {}
  ngOnInit() {
    this.RoleForm = this.formBuilder.group({ 
      id:[0],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
    });
  
    this.getRoleList();
    this.geRoleList();
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
   // console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._RoleList.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (key == "roleName" || key == "remarks") {
          if (d[key].toLowerCase().indexOf(val.toLowerCase()) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  geRoleList() {
    const apiUrl = this._global.baseAPIUrl + "Role/GetList?user_Token="+this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this._RoleList = data;
      this._FilteredList = data;
      this.prepareTableData( this._RoleList,  this._FilteredList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
prepareTableData(tableData, headerList) {
  let formattedData = [];
 // alert(this.type);

// if (this.type=="Checker" )
//{
  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'roleName', header: 'ROLE NAME', index: 3 },
    { field: 'remarks', header: 'REMARKS', index: 2 },

    // { field: 'Ref3', header: 'Ref3', index: 3 },
    // { field: 'Ref4', header: 'Ref4', index: 3 },
    // { field: 'Ref5', header: 'Ref5', index: 3 },
    // { field: 'Ref6', header: 'Ref6', index: 3 },
//    { field: 'SubfolderName', header: 'SUB FOLDER', index: 3 }
    //,{ field: 'DownloadDate', header: 'DownloadDate', index: 3 },
   // { field: 'SendDate', header: 'SendDate', index: 7 }, { field: 'IsSend', header: 'IsSend', index: 8 },

  ];
 
  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'roleName': el.roleName,
      'id': el.id,
      'remarks': el.remarks,
      // 'Ref4': el.Ref4,
      // 'Ref5': el.Ref5,
      // 'Ref6': el.Ref6
    
    });
 
  });
  this.headerList = tableHeader;
//}

  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;

}

searchTable($event) {
  // console.log($event.target.value);

  let val = $event.target.value;
  if(val == '') {
    this.formattedData = this.immutableFormattedData;
  } else {
    let filteredArr = [];
    const strArr = val.split(',');
    this.formattedData = this.immutableFormattedData.filter(function (d) {
      for (var key in d) {
        strArr.forEach(el => {
          if (d[key] && el!== '' && (d[key]+ '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
            if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
              filteredArr.push(d);
            }
          }
        });
      }
    });
    this.formattedData = filteredArr;
  }
}
  
  OnReset() {
    this.Reset = true;
    this.RoleForm.reset({User_Token: localStorage.getItem('User_Token')});
  }

  OnDelete(id: any) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonClass: "btn btn-danger",
        confirmButtonText: "Yes, delete it!",
        cancelButtonClass: "btn btn-secondary",
      })
      .then((result) => {
        if (result.value) {
          this.RoleForm.patchValue({
            id: id.id,
            User_Token: localStorage.getItem('User_Token'),
          });

          const apiUrl = this._global.baseAPIUrl + "Role/Delete";
          this._onlineExamService
            .postData(this.RoleForm.value, apiUrl)
            .subscribe((data) => {
              swal.fire({
                title: "Deleted!",
                text: "Role has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.geRoleList();
            });
        }
      });
  }
  
  getRoleList() {  

    const apiUrl=this._global.baseAPIUrl+'Role/GetList?user_Token='+this.RoleForm.get('User_Token').value
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._RoleList = data;
    this._FilteredList = data;

    //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
    }
  
  OnEdit(RoleL: any)
  {  
  localStorage.setItem('_RoleID',RoleL.id) ;    
  localStorage.setItem('_RoleName',RoleL.roleName) ;    
  localStorage.setItem('_RoleRemark',RoleL.roleName) ;    
  //this.localStorage.setItem('_TempID') =_TempID;
  this.router.navigate(['/usermanagement/addrole']);
  //, {queryParams: {_TempID : _TempID}})
  }

  AddRole()
  {
    this.router.navigate(['/usermanagement/addrole']);
  }  


  ShowErrormessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error ! </span> <span data-notify="message"> '+ data +' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
  
  
  }

  ShowMessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> '+ data +' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-success alert-notify"
      }
    );
  
  
  }
}
