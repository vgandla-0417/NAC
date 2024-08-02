
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

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
  selector: 'app-Courier-Create',
  templateUrl: './Courier-Create.component.html',
  styleUrls: ['./Courier-Create.component.scss']
})
export class CreateCourierComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _FilteredList: any;
  _RoleList: any;
  AddBranchInwardForm: FormGroup;
  BatchCloseForm: FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  BranchList: any;
  _DocumentType = "";
  _message = "";
  _UserID: any;
  document_typeList: any;
  User: any;
  first = 0;
  rows = 10;
  class: any;
  myFiles: string[] = [];
  _IndexList: any;
  _FileDetails: string[][] = [];
  FileUPloadForm: any;
  httpService: any;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router
  ) { }
  ngOnInit() {
    this.AddBranchInwardForm = this.formBuilder.group({
      id: [""],
      batch_id: new FormControl('', [Validators.required]),
      courier_id: [0, Validators.required],
      consignment_no: ["", Validators.required],
      user_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')


    });

    this.BatchCloseForm = this.formBuilder.group({
      batch_id: ["", Validators.required],
      apac: ["", Validators.required],

      branch_name: ["", Validators.required],
      consignment_no: ["", Validators.required],
      courier_name: [0, Validators.required],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID')
    });

    this.GetBatchDetails();
    this.getBrachList();

  }

  getBrachList() {
    const apiUrl = this._global.baseAPIUrl + 'BranchMaster/GetBranchList?user_Token=' + localStorage.getItem('User_Token')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      this.BranchList = data;


    });
  }
  GetBatchDetails() {
//this.AddBranchInwardForm.controls['batch_id'].value
    const apiUrl = this._global.baseAPIUrl + 'CourierInward/GetbatchIdByUserID?batch_id=' + '' + '&user_id=' + localStorage.getItem('UserID') + '&User_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      // console.log("data",data[0].BatchNo);
      this.AddBranchInwardForm.controls['batch_id'].setValue(data[0].BatchNo);
      // this._IndexPendingListFile = data;
      this._FilteredList = data;
      this.prepareTableData(data, data);

    });
  }

  getAppackDetails() {

    //console.log("FormData", this.AddBranchInwardForm.value);

    if (this.AddBranchInwardForm.value.appl <= 0) {
      this.ShowErrormessage("Select appl value");
      return;
    }

    const apiUrl = this._global.baseAPIUrl + 'BranchInward/GetAppacDetails';
    this._onlineExamService.postData(this.AddBranchInwardForm.value, apiUrl)

      .subscribe(data => {
        //alert(data[0].message);

        if (data[0].message == "Fresh" || data[0].message == "Insertion") {
          //  console.log("Data",data[0]);
          this.AddBranchInwardForm.controls['product'].setValue(data[0].product);
          this.AddBranchInwardForm.controls['location'].setValue(data[0].location);
          this.AddBranchInwardForm.controls['sub_lcoation'].setValue(data[0].sub_lcoation);
          this.AddBranchInwardForm.controls['maln_party_id'].setValue(data[0].maln_party_id);
          this.AddBranchInwardForm.controls['party_name'].setValue(data[0].party_name);
          this.AddBranchInwardForm.controls['agr_value'].setValue(data[0].agr_value);
          this.AddBranchInwardForm.controls['pdc_type'].setValue(data[0].pdc_type);
          this.AddBranchInwardForm.controls['apac_effective_date'].setValue(data[0].apac_effective_date);
          this._message = data[0].message;
          this.getDocumentdetails();

        }
        else {
          // this.showmessage(data[0].message);
          this.ShowErrormessage(data[0].message);
          this.AddBranchInwardForm.controls['apac'].setValue('');
          //this.OnReset();
          return;
        }

      });

  }



  getDocumentdetails() {
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/getDocumentdetails?user_Token=' + localStorage.getItem('User_Token') + "&appl=" + this.AddBranchInwardForm.get("appl").value + "&apac=" + this.AddBranchInwardForm.get("apac").value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      //  console.log("Doc Type" , data);
      this.document_typeList = data;
    });

  }

  
  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
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
      { field: 'BatchNo', header: 'BATCH ID', index: 2 },
      { field: 'awb_no', header: 'AWB NO', index: 3 },
      { field: 'branchName', header: 'Branch Name', index: 4 },
      { field: 'CourierName', header: 'Courier Name', index: 4 },


    ];

    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'BatchNo': el.BatchNo,
        'CourierName': el.CourierName,
        'branchName': el.branchName,
        'awb_no': el.awb_no,
        // 'product': el.product,
        // 'location': el.location,
        // 'sub_lcoation': el.sub_lcoation,
        // 'maln_party_id': el.maln_party_id,
        // 'party_name': el.party_name,
        // 'agr_value': el.agr_value,
        // 'pdc_type': el.pdc_type,
        // 'apac_effective_date': el.apac_effective_date
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

  OnReset() {

    this.Reset = true;
    
    // this.AddBranchInwardForm.controls['product'].setValue('');
    this.AddBranchInwardForm.controls['courier_id'].setValue(0);
    this.AddBranchInwardForm.controls['consignment_no'].setValue('');
    
    this.Isreadonly = false;
    this._message = "";
    this._DocumentType = "";
  }

  OnClose() {
    this.modalService.hide(1);
  }

  OnreadonlyAppc() {
    if (this.AddBranchInwardForm.value.appl <= 0) {
      // this.ShowErrormessage("Select appl value");
      // return false;    
      this.Isreadonly = false;
    }
    else {
      this.Isreadonly = true;
    }

  }
  onSubmit() {
    this.submitted = true;
    const apiUrl = this._global.baseAPIUrl + "CourierInward/AddEditCourierdetails";
    this._onlineExamService
      .postData(this.AddBranchInwardForm.value, apiUrl)
      .subscribe((data) => {
        this.OnReset();

     
        if (data == 'Record save Succesfully..') {
          this.ShowMessage(data);
          this.GetBatchDetails();
        }
        else {
          this.ShowErrormessage(data);
        }

        
        
       // this.onBack();


      });


  }


  onBack() {
    this.router.navigateByUrl('/process/Courier-Entry')

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



  showmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> ' + data + ' </span></div>',
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

  closeBatch(template: TemplateRef<any>) {

    var that = this;
    var personSize = Object.keys(this._FilteredList).length;//

    if (personSize == 0 && this._FilteredList[0].apac == "") {
      this.showmessage("BatchNo should not be empty Before closing");
      return;

    }
    if (this._FilteredList[0].apac == null) {
      this.showmessage("BatchNo should not be empty Before closing");
      return;

    }


    this.modalRef = this.modalService.show(template);

    this.BatchCloseForm.patchValue({
      BatchNo: this.AddBranchInwardForm.get('BatchNo').value,
      pod_no: "",
      courier_name: 0,

    })

  }

  onUpdateBatchNo() {
    this.submitted = true;

    //  alert(this.RequestFormvalidation());
    //  return;
    // if(!this.RequestFormvalidation()) {
    //   return;
    // }
    // const frmData = new FormData();
    // const that = this;
    // for (var i = 0; i < this.myFiles.length; i++) {
    //   frmData.append("fileUpload", this.myFiles[i]);
    // }    

    // //  alert('Hi');
    //   const apiUrl = this._global.baseAPIUrl + 'BranchInward/UpdateBatchNo';
    // //   this._onlineExamService.postData(frmData,apiUrl)
    //   this.httpService.post(apiUrl, this.BatchCloseForm.value).subscribe( data => {
    const apiUrl = this._global.baseAPIUrl + "BranchInward/UpdateBatchNo";
    this._onlineExamService
      .postData(this.BatchCloseForm.value, apiUrl).subscribe((data) => {


        this.toastr.show(
          '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> ' + data + ' </span></div>',
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
        this.modalRef.hide();
        this.Print(this.AddBranchInwardForm.controls['BatchNo'].value);
        this.AddBranchInwardForm.controls['BatchNo'].setValue('');
        this.OnReset();
        // this.GetInwardData();   
        this.GetBatchDetails();

      });
    // }

  }


  Print(batch_no: any) {

    //console.log("Print",row);
    // const fileExt = _File.filePath.substring(_File.filePath.lastIndexOf('.'), _File.filePath.length);
    const apiUrl = this._global.baseAPIUrl + 'BranchInward/DownloadFile?BatchNo=' + batch_no + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
      if (res) {

        const pdf = new Blob([res], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdf);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl; //this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
        //   }


      }
    });

  }


  DeleteFile(Row: any) {
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
          this.AddBranchInwardForm.patchValue({
            apac: Row.apac,
            appl: Row.appl,
            BatchNo: Row.BatchNo,
            User_Token: localStorage.getItem('User_Token'),
          });

          const that = this;
          const apiUrl = this._global.baseAPIUrl + 'BranchInward/Delete';
          this._onlineExamService.postData(this.AddBranchInwardForm.value, apiUrl)
            .subscribe(data => {
              swal.fire({
                title: "Deleted!",
                text: "Record has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });
              this.GetBatchDetails();
              this.OnReset();
              //  that.getSearchResult(that.AddBranchInwardForm.get('TemplateID').value);
            });

        }
      });

  }



}

