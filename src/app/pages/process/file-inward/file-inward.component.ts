
import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { Router } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-file-inward',
  templateUrl: './file-inward.component.html',
  styleUrls: ['./file-inward.component.scss']
})
export class FileinwardComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _FilteredList: any;
  _lanNumberList: any = [];
  AddFileInwardForm: FormGroup;
  DocumentForm:FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly = false;
  //_UserList: any;
  sMsg: string = "";
  _message = "";
  _UserID: any;
  document_typeLists:any
  documentStatusList:any

  User: any;
  first = 0;
  rows = 10;
  class: any;
  myFiles: string[] = [];
  _FileDetails: string[][] = [];
  FileUPloadForm: any;
  httpService: any;
  IsreadonlyFileno = false;
  _CartonNoReadOnly = false;
  _FileNoReadOnly = false;
  isSaveClicked: boolean;
  isPackCartonClicked = true;
  lanno: string;
  enableFieldsProductWise: string;
  checklListArray: any[] = [];



  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {

    this.AddFileInwardForm = this.formBuilder.group({

      id: [""],
      BatchID: [localStorage.getItem('fileInwardBatch'), [Validators.required]],
      entityName: [""],
      DocumentType: [""],

      enterpriseName: [""],
      Loan_Id: [""],
      
      ProductName: [""],
      location: [""],
      Customer_Name: [""],
      Month: [""],
      dateOfBirth: [""],
      disbursed_date: [""],
      Loan_App_Form_Argmnt: ["", Validators.required],
      Sanction_letter: ["", Validators.required],
      KYC_document: ["", Validators.required],
      Northern_Arc_Osv: ["", Validators.required],
      APP_Co_APP_Sign: ["", Validators.required],
      JLG_Availibility: ["", Validators.required],
      identityProofNo: [""],
      identityProofName: [""],
      centerName: [""],
      CheckList:[],
      
      branchName: [""],
      amount: [""],
      FIleBarcode: [""],
      CartonBarCode: ["", Validators.required],
      status: "",
      DPN: [""],
      Group_id:[""],
      User_Token: localStorage.getItem('User_Token'),
      UserID: localStorage.getItem('UserID'),
      entry_by: localStorage.getItem('UserID'),
      Remark: [""]
    });

    this.DocumentForm = this.formBuilder.group({
      ID:[''], 
      CartonBarCode:[''], 
      FIleBarcode:[''],  
      OLD_FileNo:[''],  
      Loan_Id :[''], 
      BatchID :[''], 
      ProductName:[''],  
      User_Token: localStorage.getItem('User_Token'),   
      UserId: localStorage.getItem('UserID'),
    });
    this.GetBatchDetails();

  }



  GetBatchDetails() {
    //this.AddFileInwardForm.controls['BatchID'].value

    const apiUrl = this._global.baseAPIUrl + 'FinplexFileInward/GetAllBatchDetailsAck?BatchID=' + this.AddFileInwardForm.controls['BatchID'].value + '&Loan_Id=' + localStorage.getItem('LANNo') + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      //this.AddFileInwardForm.controls['BatchID'].setValue(data[0].BatchID);
      this._FilteredList = data;
      this.prepareTableData(data, data);
      this.Isreadonly = true;

      console.log("index", this.isPackCartonClicked);


    });
  }




  GetLanDetails() {

    let lanOfProduct;
    var productNames = this.AddFileInwardForm.controls['ProductName'].value

    if (productNames === 'Finplex') {
      lanOfProduct = 'FinplexFileInward/GetLanDetails'
    }
    else if (productNames === 'Sonata') {
      lanOfProduct = 'SonataFileInward/GetLanDetails'
    }
    else {
      lanOfProduct = 'NOCPLFileInward/GetAppIdDetails'
    }

    const apiUrl = this._global.baseAPIUrl + lanOfProduct + '?BatchID=' + this.AddFileInwardForm.controls['BatchID'].value + '&Loan_Id=' + this.AddFileInwardForm.controls['Loan_Id'].value + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&ProductName=' + this.AddFileInwardForm.controls['ProductName'].value;
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
      
      if (data[0].MSG == 'Record found') {
        this.showmessage(data[0].MSG)
        
        this.AddFileInwardForm.controls['DocumentType'].setValue(data[0].DocumentType);
        
        //Disbursement_Date
        this.AddFileInwardForm.controls['Customer_Name'].setValue(data[0].Customer_Name);
        this.AddFileInwardForm.controls['entityName'].setValue(data[0].Entity_Name);
        console.log(productNames,'productNames')
        if(productNames === 'NOCPL'){
          this.AddFileInwardForm.controls['Group_id'].setValue(data[0].Group_id ?data[0].Group_id:"");
          this.AddFileInwardForm.controls['disbursed_date'].setValue(data[0].Disbursement_Date);
          this.AddFileInwardForm.controls['branchName'].setValue(data[0].Branch_Name);
        this.AddFileInwardForm.controls['Loan_Id'].setValue(data[0].Loan_Id?data[0].Loan_Id:"");
        }
        else if (productNames === 'Sonata'){
          this.AddFileInwardForm.controls['Group_id'].setValue(data[0].Group_Id ?data[0].Group_Id:"");
          this.AddFileInwardForm.controls['disbursed_date'].setValue(data[0].Disbursement_date);
          this.AddFileInwardForm.controls['branchName'].setValue(data[0].branch_name);
          this.AddFileInwardForm.controls['Loan_Id'].setValue(data[0].Partner_Loan_id);
          
          //GetLanDetails
        }
        else{
          this.AddFileInwardForm.controls['branchName'].setValue(data[0].branch_name);
          this.AddFileInwardForm.controls['disbursed_date'].setValue(data[0].Disbursement_Date);
        this.AddFileInwardForm.controls['Loan_Id'].setValue(data[0].Loan_Id?data[0].Loan_Id:"");

        }
        
        //this.AddFileInwardForm.controls['Loan_Id'].setValue(data[0].Loan_Id?data[0].Loan_Id:"");
        this.AddFileInwardForm.controls['Sanction_letter'].setValue(data[0].Sanction_letter?data[0].Sanction_letter:"");
        this.AddFileInwardForm.controls['DPN'].setValue(data[0].DPN?data[0].DPN:"");
        this.AddFileInwardForm.controls['KYC_document'].setValue(data[0].KYC_document?data[0].KYC_document:"");
        this.AddFileInwardForm.controls['Remark'].setValue(data[0].remark);
        this.AddFileInwardForm.controls['dateOfBirth'].setValue(data[0].Date_of_birth);
        this.AddFileInwardForm.controls['identityProofNo'].setValue(data[0].Identity_proof_number);
        this.AddFileInwardForm.controls['identityProofName'].setValue(data[0].Identity_proof_Name);
        this.AddFileInwardForm.controls['enterpriseName'].setValue(data[0].Enterprice_Name);
        this.AddFileInwardForm.controls['JLG_Availibility'].setValue(data[0].JLG_Availibility?data[0].JLG_Availibility:"");
        this.AddFileInwardForm.controls['APP_Co_APP_Sign'].setValue(data[0].APP_Co_APP_Sign?data[0].APP_Co_APP_Sign:"");
        this.AddFileInwardForm.controls['Northern_Arc_Osv'].setValue(data[0].Northern_Arc_Osv ?data[0].Northern_Arc_Osv:"");
        this.AddFileInwardForm.controls['centerName'].setValue(data[0].Center_Name);
        this.AddFileInwardForm.controls['Loan_App_Form_Argmnt'].setValue( data[0].Loan_App_Form_Argmnt ? data[0].Loan_App_Form_Argmnt:"");
        this.AddFileInwardForm.controls['FIleBarcode'].setValue(data[0].FIleBarcode);
        this.AddFileInwardForm.controls['CartonBarCode'].setValue( data[0].CartonBarCode.length > 1 ? data[0].CartonBarCode : ''); 
       

      }
   

else if (data[0].MSG == "Batch no and Loan_Id already exits" || data[0].MSG == "Loan_Id  not found "|| data[0].MSG == "App_id  not found ") {
  this.ShowErrormessage(data[0].MSG);
}

    });
  }


  GetFileInwardDetails() {

    const apiUrl = this._global.baseAPIUrl + 'FileInward/GetFileInwardDetails?LANNo=' + this.lanno + '&BatchID=' + this.AddFileInwardForm.controls['BatchID'].value + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    this._onlineExamService.GetFileInwardDetails(apiUrl).subscribe((data: {}) => {


      // this.AddFileInwardForm.controls['BatchNo'].setValue(data[0].BatchNo);     
      this._FilteredList = data;
      this.prepareTableData(data, data);
      this.Isreadonly = true;

      console.log("index", this.isPackCartonClicked);


    });
  }

  getProductDetails(event:any) {
    var productnames = this.AddFileInwardForm.controls['ProductName'].value
    var productId;
    this.documentStatusList=''
    console.log("productnames", productnames);
    this.enableFieldsProductWise = productnames
    let selectedValue = event.target.value;
    console.log("productnames",selectedValue);
    if(selectedValue === 'Finplex'){
      productId=1

    }
    else{
      productId=2
    }
    
    // if (selectedValue === 'Finplex') {
      //this.isDisabled = true;
      const apiUrl = this._global.baseAPIUrl + 'FinplexFileInward/GetRemark?user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')+'&id='+productId
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
        this.document_typeLists = data;
        this.documentStatusList = this.document_typeLists.filter(x => x.Remark);
        console.log(this.documentStatusList);
        
     
       });
   

   

  }

  onEnterKeyPrevent(event: KeyboardEvent) {
    // Prevent default behavior of Enter key press
    console.log("thisis logged");
    
    event.preventDefault();
  }

  onBack() {
    this.router.navigateByUrl('/process/FileInward');
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




    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'BatchID', header: 'BATCH ID', index: 2 },
      { field: 'Loan_Id', header: 'LAN NO', index: 4 },
      { field: 'FIleBarcode', header: 'FIle Barcode', index: 4 },
      { field: 'CartonBarCode', header: 'Carton BarCode', index: 8 },
      //{ field: 'Entity_Name', header: 'APPLICANT NAME', index: 5 },
      { field: 'DocumentType', header: 'Document Type', index: 5 },
      { field: 'ProductName', header: 'Product Name', index: 5 },
      { field: 'Loan_App_Form_Argmnt', header: 'Loan App Form', index: 5 },
      { field: 'Sanction_letter', header: 'Sanction letter', index: 5 },
      { field: 'KYC_document', header: 'KYC Document', index: 5 },
      { field: 'DPN', header: 'DPN', index: 5 },
      { field: 'JLG_Availibility', header: 'JLG Availibility', index: 5 },
      { field: 'APP_Co_APP_Sign', header: 'APP Co-APP Sign', index: 5 },
      { field: 'Northern_Arc_Osv', header: 'Northern Arc Osv', index: 6 },
      { field: 'File_Status', header: 'File Status', index: 7 },
      { field: 'Remark', header: 'Remark', index: 8 },



    ];
    console.log("tableData", tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'BatchID': el.BatchID,
        'LSGNo': el.LSGNo,
        'CartonBarCode': el.CartonBarCode,
        'Loan_Id': el.Loan_Id,
        'FIleBarcode': el.FIleBarcode,
        'DocumentType': el.DocumentType,
       // 'Status': el.Status,
        'File_Status': el.File_Status,
        'Entity_Name': el.Entity_Name,
        'ProductName': el.ProductName,
        'Loan_App_Form_Argmnt': el.Loan_App_Form_Argmnt,
        'Sanction_letter': el.Sanction_letter,
        'KYC_document': el.KYC_document,
        'DPN': el.DPN,
        'JLG_Availibility': el.JLG_Availibility,
        'APP_Co_APP_Sign': el.APP_Co_APP_Sign,
        'Northern_Arc_Osv': el.Northern_Arc_Osv,
        'Remark':el.Checklist_Remark

      });
     
      this.isPackCartonClicked = false;
     
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

    this.AddFileInwardForm.controls['FIleBarcode'].setValue('');
    this.AddFileInwardForm.controls['Loan_Id'].setValue('');
    
    //this.AddFileInwardForm.controls['LANNo'].focus();

    this.AddFileInwardForm.controls['DocumentType'].setValue('');
    this.AddFileInwardForm.controls['disbursed_date'].setValue('');
    this.AddFileInwardForm.controls['Customer_Name'].setValue('');
    this.AddFileInwardForm.controls['branchName'].setValue('');
    this.AddFileInwardForm.controls['entityName'].setValue('');
    this.AddFileInwardForm.controls['Group_id'].setValue('');

    this.AddFileInwardForm.controls['Sanction_letter'].setValue('');
    this.AddFileInwardForm.controls['DPN'].setValue(''); 
     this.AddFileInwardForm.controls['KYC_document'].setValue('');
    this.AddFileInwardForm.controls['Remark'].setValue('');
    this.AddFileInwardForm.controls['dateOfBirth'].setValue('');
    this.AddFileInwardForm.controls['identityProofNo'].setValue('');
    this.AddFileInwardForm.controls['identityProofName'].setValue('');
    this.AddFileInwardForm.controls['enterpriseName'].setValue('');
    this.AddFileInwardForm.controls['Loan_App_Form_Argmnt'].setValue('');
    this.AddFileInwardForm.controls['JLG_Availibility'].setValue('');
    this.AddFileInwardForm.controls['APP_Co_APP_Sign'].setValue('');
    this.AddFileInwardForm.controls['Northern_Arc_Osv'].setValue('');
    this.AddFileInwardForm.controls['centerName'].setValue('');
    this.AddFileInwardForm.controls['CheckList'].setValue('');

    



    /////////

    this.Isreadonly = false;
    this._message = "";
    this.IsreadonlyFileno = false;

  }

  OnResetdata() {
    this.Reset = true;

    this.AddFileInwardForm.controls['DocumentType'].setValue('');
    this.AddFileInwardForm.controls['disbursed_date'].setValue('');
    this.AddFileInwardForm.controls['branch'].setValue('');
    this.AddFileInwardForm.controls['FileNo'].setValue('');
    this.AddFileInwardForm.controls['Product'].setValue('');
    this.AddFileInwardForm.controls['Customer_Name'].setValue('');
    this.AddFileInwardForm.controls['amount'].setValue('');
    this.AddFileInwardForm.controls['CreditFile'].setValue('');
    this.AddFileInwardForm.controls['PropertyDoc'].setValue('');
    this.AddFileInwardForm.controls['MODT'].setValue('');
    this._CartonNoReadOnly = false;
    this._FileNoReadOnly = false;
    //this.AddFileInwardForm.controls['LANNo'].focus();

    this.Isreadonly = false;
    this._message = "";
    this.IsreadonlyFileno = false;

  }

  OnClose() {
    this.modalService.hide(1);
  }

  OnreadonlyAppc() {
    if (this.AddFileInwardForm.value.appl <= 0) {
      // this.ShowErrormessage("Select appl value");
      // return false;    
      this.Isreadonly = false;
    }
    else {
      this.Isreadonly = true;
    }

  }

  OnchangeCheckListRemark(event: any) {
  this.checklListArray = event.value.map((item: any) => parseInt(item.Checklist_id));
  }



  onSubmit(data: any) {
 
      this.submitted = true;
      var inwardOfProduct;

      var productNames = this.AddFileInwardForm.controls['ProductName'].value
      var formData = this.AddFileInwardForm
      var commonParameters;
      var nocplParam = {
        "User_Token": localStorage.getItem('User_Token'),
        "BatchID": formData.controls['BatchID'].value,
        "Loan_Id": formData.controls['Loan_Id'].value,
        "FIleBarcode": formData.controls['FIleBarcode'].value,
        "CartonBarCode": formData.controls['CartonBarCode'].value,
        "DocumentType": formData.controls['DocumentType'].value,
        "Status": "save",
        "Remark": formData.controls['Remark'].value,

      }

      var finplexParam = {
        "User_Token": localStorage.getItem('User_Token'),
        "BatchID": formData.controls['BatchID'].value,
        "Loan_Id": formData.controls['Loan_Id'].value,
        "FIleBarcode": formData.controls['FIleBarcode'].value,
        "CartonBarCode": formData.controls['CartonBarCode'].value,
        "DocumentType": formData.controls['DocumentType'].value,
        "Status": "save",
        "Remark": formData.controls['Remark'].value,
        "Loan_App_Form_Argmnt": formData.controls['Loan_App_Form_Argmnt'].value,
        "Sanction_letter": formData.controls['Sanction_letter'].value,
        "DPN": formData.controls['DPN'].value,
        "KYC_document": formData.controls['KYC_document'].value,
        "entry_by": localStorage.getItem('UserID'),
        "checklist": this.checklListArray,
        

      }

      var sonataParam = {
        "user_Token": localStorage.getItem('User_Token'),
        "BatchID": formData.controls['BatchID'].value,
        "Partner_Loan_id": formData.controls['Loan_Id'].value,
        "FIleBarcode": formData.controls['FIleBarcode'].value,
        "CartonBarCode": formData.controls['CartonBarCode'].value,
        "DocumentType": formData.controls['DocumentType'].value,
        "Status": "save",
        "Remark": formData.controls['Remark'].value,
        "Loan_App_Form_Argmnt": formData.controls['Loan_App_Form_Argmnt'].value,
        "JLG_Availibility": formData.controls['JLG_Availibility'].value,
        "APP_Co_APP_Sign": formData.controls['APP_Co_APP_Sign'].value,
        "KYC_document": formData.controls['KYC_document'].value,
        "Northern_Arc_Osv": formData.controls['Northern_Arc_Osv'].value,
        "checklist": this.checklListArray,

      }

    if (data==='save'  ) {
      var Isvalidation = this.validation()
      console.log("this is  the inside");
      

      if (productNames === 'Finplex') {
        inwardOfProduct = 'FinplexFileInward/AddEditFiledetails'
        commonParameters = finplexParam
      }
      else if (productNames === 'Sonata') {
        inwardOfProduct = 'SonataFileInward/AddEditFiledetails'
        commonParameters = sonataParam
      }
      else {
        inwardOfProduct = "NOCPLFileInward/AddEditNOCPLFiledetails"
        commonParameters = nocplParam
      }
      if(Isvalidation){
        const apiUrl = this._global.baseAPIUrl + inwardOfProduct;
        this._onlineExamService
          .postData(commonParameters, apiUrl)
          .subscribe((data) => {
             this.GetBatchDetails();
            this.ShowMessage(data);
            document.getElementById("Loan_Id").focus();
            this.OnReset()
           
          });
          this.OnReset()

      }
    
     
    }
    if(data==='courier close'){
      console.log("this is  the else");

      var CloseCourier = {
        "User_Token": localStorage.getItem('User_Token'),
        "BatchID": formData.controls['BatchID'].value,
        "Loan_Id": formData.controls['Loan_Id'].value,
        "FIleBarcode": formData.controls['FIleBarcode'].value,
        "CartonBarCode": formData.controls['CartonBarCode'].value,
        "DocumentType": formData.controls['DocumentType'].value,
        "Status": data,
        "Remark": formData.controls['Remark'].value,
        "Loan_App_Form_Argmnt": formData.controls['Loan_App_Form_Argmnt'].value,
        "Sanction_letter": formData.controls['Sanction_letter'].value,
        "DPN": formData.controls['DPN'].value,
        "KYC_document": formData.controls['KYC_document'].value,
        "entry_by": localStorage.getItem('UserID'),
        "CheckList": formData.controls['CheckList'].value,

      }
  
        inwardOfProduct = 'FinplexFileInward/AddEditFiledetails'
        commonParameters = CloseCourier

        const apiUrl = this._global.baseAPIUrl + inwardOfProduct;
        this._onlineExamService
          .postData(commonParameters, apiUrl)
          .subscribe((data) => {
            setTimeout(()=> this.onBack(),1000)
           
            this.ShowMessage(data);
          
            
          });

    }
      
      

    
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
    if(data == "Record save succesfully" || data =="Courier is Closed"){
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
    this.OnReset()
    }
    else{
      this.ShowErrormessage(data)
    }


  }

  validation() {


    if (this.AddFileInwardForm.value.ProductName === "") {
      this.ShowErrormessage("Select Product Name");
      return false;
    }
    if (this.AddFileInwardForm.value.Loan_Id === "") {
      this.ShowErrormessage("Enter Lan ");
      return false;
    }

    if (this.AddFileInwardForm.value.FIleBarcode === "") {
      this.ShowErrormessage("Enter File Barcode");
      return false;
    }
    if (this.AddFileInwardForm.value.CartonBarCode === "") {
      this.ShowErrormessage("Enter Carton Number");
      return false;
    }
    if ((this.AddFileInwardForm.value.ProductName === "Finplex" || this.AddFileInwardForm.value.ProductName === "Sonata") && this.AddFileInwardForm.value.Loan_App_Form_Argmnt === "") {
      this.ShowErrormessage("Select Loan Application Form");
      return false;
    }
    if ((this.AddFileInwardForm.value.ProductName === "Finplex" || this.AddFileInwardForm.value.ProductName === "Sonata") && (this.AddFileInwardForm.value.KYC_document == "" || this.AddFileInwardForm.value.KYC_document == null)) {
      this.ShowErrormessage("Select KYC Documnet");
      return false;
    }
    if (this.AddFileInwardForm.value.ProductName === "Finplex" && ( this.AddFileInwardForm.value.Sanction_letter === "" || this.AddFileInwardForm.value.Sanction_letter == null)) {
      this.ShowErrormessage("Select Sanction_letter");
      return false;
    }
    if (this.AddFileInwardForm.value.ProductName === "Finplex" && (this.AddFileInwardForm.value.DPN === "" || this.AddFileInwardForm.value.DPN === null) ) {
      this.ShowErrormessage("Select DPN");
      return false;
    }
    if (this.AddFileInwardForm.value.ProductName === "Sonata" && (this.AddFileInwardForm.value.JLG_Availibility === "" || this.AddFileInwardForm.value.JLG_Availibility == null)) {
      this.ShowErrormessage("Select JLG Availibility");
      return false;
    }
    if (this.AddFileInwardForm.value.ProductName === "Sonata" && (this.AddFileInwardForm.value.APP_Co_APP_Sign === "" || this.AddFileInwardForm.value.APP_Co_APP_Sign === null)) {
      this.ShowErrormessage("Select  APPlicant & Co-APP Sign");
      return false;
    }
    if (this.AddFileInwardForm.value.ProductName === "Sonata" && (this.AddFileInwardForm.value.Northern_Arc_Osv === "" || this.AddFileInwardForm.value.Northern_Arc_Osv === null)) {
      this.ShowErrormessage("Select Northern Arc Osv");
      return false;
    }
    if (this.AddFileInwardForm.value.BatchID === "" || this.AddFileInwardForm.value.BatchID == null) {

      this.ShowErrormessage("Enter Batch No value");
      return false;
    }

    // if (this.AddFileInwardForm.value.apac == "" || this.AddFileInwardForm.value.apac == null) {
    //   //alert(this.AddBranchInwardForm.value.apac);

    //   this.ShowErrormessage("Enter Apac value");
    //   return false;
    // }
    // if (this.AddFileInwardForm.value.File_No == "" || this.AddFileInwardForm.value.File_No == null) {
    //   //alert(this.AddBranchInwardForm.value.apac);

    //   this.ShowErrormessage("Enter File No");
    //   return false;
    // }

    return true;
  }

  showmessage(data: any) {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success </span> <span data-notify="message"> ' + data + ' </span></div>',
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
          this.AddFileInwardForm.patchValue({
            apac: Row.apac,
            appl: Row.appl,
            BatchNo: Row.BatchNo,
            User_Token: localStorage.getItem('User_Token'),
          });

          const that = this;
          const apiUrl = this._global.baseAPIUrl + 'BranchInward/Delete';
          this._onlineExamService.postData(this.AddFileInwardForm.value, apiUrl)
            .subscribe(data => {
              swal.fire({
                title: "Deleted!",
                text: "Record has been deleted.",
                type: "success",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-primary",
              });

              // this.GetBatchDetails();
              //  that.getSearchResult(that.AddBranchInwardForm.get('TemplateID').value);
            });

        }
      });

  }

 
  onUpdateDocumentStatus(template: TemplateRef<any>,row:any) {
    var that = this;   
    this.modalRef = this.modalService.show(template);   
 
this.DocumentForm.patchValue({
  
  CartonBarCode: row.CartonBarCode,
  FIleBarcode: row.FIleBarcode,
  OLD_FileNo: row.FIleBarcode,   
  BatchID: row.BatchID,   
  Loan_Id: row.Loan_Id,   
  ProductName: row.ProductName,   
  
})
  
  }
  
  
  onUpdateBarcode()
  {
    this.submitted = true;   
    const apiUrl = this._global.baseAPIUrl + "FinplexFileInward/onUpdateDocumentStatus";
    this._onlineExamService
      .postData(this.DocumentForm.value, apiUrl).subscribe((data) => {
      
        this.showmessage(data); 
      //  this.showmessage(data);
        this.modalRef.hide();
        this.GetBatchDetails();        
      });

  }

}




