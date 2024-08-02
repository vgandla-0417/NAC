import { Globalconstants } from "./../../../Helper/globalconstants";
import { OnlineExamServiceService } from "./../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-check-list-master',
  templateUrl: './check-list-master.component.html',
  styleUrls: ['./check-list-master.component.scss']
})
export class CheckListMasterComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;

  UserList: any;
  _FilteredList: any;
  ProductList: any;
  AddUserForm: FormGroup;
  ProductForm: FormGroup;
  submitted = false;
  Reset = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _SingleUser: any = [];
  _UserID: any;
  User: any;
  first = 0;
  rows = 10;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
  ) {


    this.geRoleList();
  }
  ngOnInit() {
    this.AddUserForm = this.formBuilder.group({
      id: [""],
      Product_id: [0, Validators.required],
      Remark: [""],
      User_Token: localStorage.getItem('User_Token'),
    });
    this.ProductForm = this.formBuilder.group({
      id: [""],
      Product_Name: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token'),
    });

    this.geRoleList();
    this.geUserList();
    this.User = "Create User";

  }

  //Newly added code 
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  get f() {
    return this.AddUserForm.controls;
  }

  get fp() {
    return this.ProductForm.controls;
  }



  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    //  console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this.UserList.filter(function (d) {
      //  console.log(d);
      for (var key in d) {
        if (key == "name" || key == "email" || key == "userid" || key == "mobile" || key == "roleName") {
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
    debugger;
    //const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "CheckList/GetProduct?user_Token=" + localStorage.getItem('User_Token') + '&user_id=' + localStorage.getItem('UserID');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.ProductList = data;
      console.log("this is the list",this.ProductList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())ser
    });
  }
  geUserList() {
    const userToken = this.AddUserForm.get('User_Token').value || localStorage.getItem('User_Token');
    const apiUrl = this._global.baseAPIUrl + "CheckList/GetProductDetails?user_Token=" + localStorage.getItem('User_Token') + '&user_id=' + localStorage.getItem('UserID');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.UserList = data;
      this._FilteredList = data;
      this.prepareTableData(this.UserList, this._FilteredList);
      console.log("this is the data",data);
      
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
      { field: 'Product_Name', header: 'PRODUCT NAME', index: 2 },
      { field: 'Remark', header: 'REMARK', index: 3 },

    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Product_Name': el.Product_Name,
        'Remark': el.Remark,
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
    if (val == '') {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(',');
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach(el => {
            if (d[key] && el !== '' && (d[key] + '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
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

addRemark(){
 // CheckList/AddProductRemark 
}

  OnReset() {
    this.Reset = true;
    this.AddUserForm.reset();
    this.User = "Create User";
  }

  OnResetP() {
    this.Reset = true;
    this.ProductForm.reset();
    
  }

  OnClose() {
    this.modalService.hide(1);
  }
  onSubmitProduct() {
    this.submitted = true;
    debugger;
    if(this.ProductForm.value.Product_Name.trim() =="") {
      this.ShowErrormessage("Please enter Product");
      return;
     }
    var Data = {
      'Product_Name': this.ProductForm.controls["Product_Name"].value,
      'user_Token': localStorage.getItem('User_Token')
    }
    const apiUrl = this._global.baseAPIUrl + "Product/AddProduct";
    this._onlineExamService
      .postData(Data, apiUrl)
      .subscribe((data) => {
        this.ShowMessage("Record Saved Successfully..");

        this.OnResetP();
        this.geUserList();
        this.modalService.hide(1);

      });

  }
  onSubmit() {
    this.submitted = true;
    debugger;
    if (this.AddUserForm.value.Product_id <= 0) {
      this.ShowErrormessage("Select Product Type");
      return;
    }

    // if(this.AddUserForm.value.userid.trim() =="") {
    //   this.ShowErrormessage("Please enter user ID");
    //   return;
    //  }
    //  if(this.AddUserForm.value.name.trim() =="") {
    //   this.ShowErrormessage("Please enter user");
    //   return;
    //  }



    // if(this.AddUserForm.value.User_Token == null) {
    //   this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
    //  }
    //  if (this.AddUserForm.get('id').value) {

    // const apiUrl = this._global.baseAPIUrl + "Admin/Update";
    // this._onlineExamService

    //   .postData(data, apiUrl)
    //   // .pipe(first())
    //   .subscribe((data) => {
    //     if (data != null) {

    // this.ShowMessage("Record Updated Successfully.."); 
    // alert("Record Updated Succesfully..");
    // this.modalService.hide(1);
    //this.OnReset();
    //this.router.navigate(['/student']);
    //  this.geUserList();
    // } else {
    // Open Modal like you have opned in other pages
    //alert("User already exists.");
    //  }
    // });
    // } else {
    // console.log('Form',this.AddUserForm.value);
    // console.log('Inside Create');
    var Data = {
      'Product_id': this.AddUserForm.controls["Product_id"].value,
      'Remark': this.AddUserForm.controls['Remark'].value,
      'user_Token': localStorage.getItem('User_Token')
    }
    const apiUrl = this._global.baseAPIUrl + "CheckList/AddProductRemark";
    this._onlineExamService
      .postData(Data, apiUrl)
      // .pipe(first())
      .subscribe((data) => {
        //  if (data == 1) {
        // alert("Record Saved Successfully..");
        this.ShowMessage("Record Saved Successfully..");

        this.OnReset();
        //this.router.navigate(['/student']);
        this.geUserList();
        this.modalService.hide(1);
        // } else {
        //   this.ShowErrormessage("User already exists.");
        // alert("User already exists.");
        // }
      });
    //  }

    //this.studentForm.patchValue({File: formData});
  }

  editEmployee(template: TemplateRef<any>, value: any) {

    this.User = "Edit user details";

    console.log("value", value);
    const apiUrl =
      this._global.baseAPIUrl +
      "Admin/GetDetails?ID=" +
      value.id + "&user_Token=" + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
      var that = this;
      that._SingleUser = data;
      //   console.log('data', data);
      this.AddUserForm.patchValue({
        id: that._SingleUser.id,
        name: that._SingleUser.name,
        userid: that._SingleUser.userid,
        pwd: that._SingleUser.pwd,
        confirmPass: that._SingleUser.pwd,
        email: that._SingleUser.email,
        mobile: that._SingleUser.mobile,
        sysRoleID: that._SingleUser.sysRoleID,
        Remarks: that._SingleUser.remarks,
        // AccountType:that._SingleUser.AccountTypeID,
      })
      //  console.log('form', this.AddUserForm);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });

    this.modalRef = this.modalService.show(template);
  }

  deleteEmployee(id: any) {

    if (id != localStorage.getItem('UserID')) {
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
            this.AddUserForm.patchValue({
              id: id.id,
              User_Token: localStorage.getItem('User_Token'),
            });

            const apiUrl = this._global.baseAPIUrl + "Admin/Delete";
            this._onlineExamService
              .postData(this.AddUserForm.value, apiUrl)
              .subscribe((data) => {
                swal.fire({
                  title: "Deleted!",
                  text: "User has been deleted.",
                  type: "success",
                  buttonsStyling: false,
                  confirmButtonClass: "btn btn-primary",
                });
                this.geUserList();
              });
          }
        });
    }
    else {

      this.ShowErrormessage("Your already log in so you can not delete!");
    }
  }
  //---
  addUser(template: TemplateRef<any>) {
    debugger
    this.modalRef = this.modalService.show(template);
    this.geRoleList();
    this.AddUserForm.patchValue({
      name: '',
      userid: '',
      pwd: '',
      confirmPass: '',
      email: '',
      mobile: '',
      sysRoleID: 0,
      Remarks: '',
      id: ''

    })
    this.User = "Create user";
  }


  ShowErrormessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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

  ShowMessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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

