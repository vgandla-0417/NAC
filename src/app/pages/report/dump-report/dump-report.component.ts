import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as XLSX from 'xlsx';
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;

import swal from "sweetalert2";


export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-dump-report",
  templateUrl: "dump-report.component.html",
})
export class DumpreportComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  DumpReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  _IndexPendingList:any;
  _ReportName :any

// _ColNameList = ["lanno","pod_number","request_no","file_barcode","property_barcode","branch_code","branch_name","ref_request_no","product_type","request_type","request_reason","request_by","request_email","courier_name","request_date","ack_date","pod_entry_date","ref_entry_date","ref_ack_date","file_status","status","file_barcode_status","dispatch_address"];
 
_InwardColNameList = ["ConsignmentNo","CourierName", "LSGNo","DocumentType","Product","State","branch_name","Customer_Name","CreditFile","PropertyDoc","MODT","entry_name","entry_date"];


_ColNameList = ["Batch_No","Loan_Id", "FIleBarcode","CartonBarCode","Entity_Name","DocumentType","ProductName","Loan_App_Form_Argmnt","Sanction_letter","KYC_document","DPN","JLG_Availibility","APP_Co_APP_Sign","Northern_Arc_Osv","File_Status","Status","Remark"];

_InwardPending =["Partner_Loan_id","ProductName","branch_id","Business_Structure","Customer_id","Identity_proof_Name","Disbursement_date","entry_date","status"]


_NOCPL = ["Group_id", "branch_id","FIleBarcode","CartonBarCode","Center_Name","Customer_id","App_id","Disbursement_date","ConsignmentNo","entry_date","Remark"];
  //branch_id

_Sonata =[
"Group_id",
"Partner_Loan_id",
"Enterprice_Name",
"Customer_id",
"Disbursement_date",
"Date_of_birth",
"Identity_proof_number",
"Identity_proof_Name",
"Loan_App_Form_Argmnt",
"APP_Co_APP_Sign",
"KYC_document",
"Northern_Arc_Osv",
"JLG_Availibility",
"Checklist",
"CartonBarCode",
"FIleBarcode",
"ConsignmentNo",
"CourierName",
"FileInward_date",
"Remark"
]

_Finplex =[
 "Partner_Loan_id",
 // "Loan_Id",
  "Entity_Name",
  "Business_Structure",
  "Loan_App_Form_Argmnt",
  "KYC_document",
  "DPN",
  "Sanction_letter",
  "Checklist",
  "CartonBarCode",
  "FIleBarcode",
  "ConsignmentNo",
  "CourierName",
  "FileInward_date",
  "Remark"
  ]

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  first = 0;
  rows = 10;

  constructor(

    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,

  ) {}
  ngOnInit() {
    this.DumpReportForm = this.formBuilder.group({
      ToDate:[Validators.required],
      FromDate:[Validators.required],
      ReportType:[0,Validators.required],
      User_Token:  localStorage.getItem('User_Token') ,  
      userid: localStorage.getItem('UserID') ,      
    });

    //this.getdumpsearch();

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
    { field: 'ConsignmentNo', header: 'CONSIGNMENT NO', index: 3 },
    { field: 'CourierName', header: 'COURIER NAME', index: 3 },
    { field: 'LSGNo', header: 'LSG NO', index: 3},
    { field: 'DocumentType', header: 'DOCUMENT TYPE', index: 2 },
    { field: 'Product', header: 'PRODUCT', index: 3 },
    { field: 'State', header: 'STATE', index: 4},
    { field: 'branch_name', header: 'BRANCH NAME', index: 3 },
    { field: 'Customer_Name', header: 'APPLICANT NAME', index: 4},
    { field: 'CreditFile', header: 'CREDIT FILE', index: 4},
    { field: 'PropertyDoc', header: 'PROPERTY DOCUMENT', index: 2 },
    { field: 'MODT', header: 'MODT', index: 2 },
    { field: 'entry_name', header: 'INWARD BY', index: 3 },
    { field: 'entry_date', header: 'INWARD DATE', index: 3},
    
     
  ];

  tableData.forEach((el, index) => {

    formattedData.push({
      'srNo': parseInt(index + 1),
      'ConsignmentNo': el.ConsignmentNo,
      'LSGNo': el.LSGNo,
      'Product': el.Product,
      'location': el.location,
      'State': el.State,
      'Customer_Name': el.Customer_Name,
      'branch_name': el.branch_id,
      'DocumentType': el.DocumentType,
      'CreditFile': el.CreditFile,
      'PropertyDoc': el.PropertyDoc,
      //'pod_dispatch_date': el.pod_dispatch_date,
      'MODT': el.MODT,
      'entry_name': el.entry_name,
      'entry_date': el.entry_date,  
      'CourierName': el.CourierName,      

    });
  
  });
  this.headerList = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;
  

//    console.log(this.formattedData);

}
prepareTable(tableData, headerList) {
  let formattedData = [];
  let tableHeader=[]
//  console.log("this.DumpReportForm.controls['ReportType'].value",this.DumpReportForm.controls['ReportType'].value);
  
 // fileinwardpending
if(this.DumpReportForm.controls['ReportType'].value ==='fileinwardpending'){
console.log("loggginginside");

  tableHeader = [
    { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'LANNo', header: 'LAN', index: 4},
    {field:'Business_Structure',header :'BUSSINESS STRUCTURE',index: 2 },
    {field:'Customer_id',header :'CUSTOMER ID',index: 2 },
    { field: 'Identity_proof_Name', header: 'IDENTITY PROOF NAME', index: 3 },
    { field: 'Identity_proof_number', header: 'IDENTITY PROOF NUMBER', index: 3},
    { field: 'entry_date', header: 'UPLOAD DATE', index: 4},
    { field: 'ProductName', header: 'PRODUCT Name', index: 3 },
    //{ field: 'Customer_Name', header: 'APPLICANT NAME', index: 4},
    { field: 'branch_name', header: 'Branch Name', index: 4},
    { field: 'disbursed_date', header: 'DISBURSED DATE', index: 4},
    { field: 'status', header: 'STATUS', index: 3 },
    // { field: 'Remarks', header: 'REMARKS', index: 4},
    // { field: 'Ageing', header: 'AGEING', index: 2 },
    // { field: 'TAT', header: 'TAT', index: 2 },
    
     
  ];

  tableData.forEach((el, index) => {
    formattedData.push({
      'srNo': parseInt(index + 1),
      'LANNo': el.Partner_Loan_id,
    //  'App_id':el.App_id,
      'Business_Structure':el.Business_Structure,
      'disbursed_date': el.Disbursement_date,
      'Customer_id':el.Customer_id,
'Identity_proof_Name':el.Identity_proof_Name,
'status': el.status,
'entry_date':el.entry_date,
      'Identity_proof_number': el.Identity_proof_number,
      'ProductName': el.ProductName,
      //'location': el.location,
      //'State': el.State,
     
       'branch_name': el.branch_id,
    
    
      
     
    });
  
  });



}
else if (this.DumpReportForm.controls['ReportType'].value ==="Finplex")
  {

    tableHeader = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'Loan_Id', header: 'Profile Loan A/C No.', index: 3 },
      { field: 'Entity_Name', header: 'Entity_Name', index: 3},
      { field: 'Business_Structure', header: 'Business_Structure', index: 3 },
      { field: 'Loan_App_Form_Argmnt', header: 'Loan_App_Form_Argmnt', index: 4},
      { field: 'KYC_document', header: 'KYC_document', index: 3 },
      { field: 'DPN', header: 'DPN', index: 4},
      { field: 'Sanction_letter', header: 'Sanction_letter', index: 4},
      { field: 'Checklist', header: 'Checklist_Remark', index: 4},
      { field: 'CartonBarCode', header: 'CartonBarCode', index: 4},
      { field: 'FIleBarcode', header: 'FIleBarcode', index: 2 },
      { field: 'ConsignmentNo', header: 'ConsignmentNo', index: 2 },
      { field: 'CourierName', header: 'CourierName', index: 2 },
      { field: 'FileInward_date', header: 'FileInward_date', index: 2 },
    //{ field: 'ConsignmentNo', header: 'ConsignmentNo', index: 2 },
      { field: 'Remark', header: 'Remark', index: 2 },

       
    ];
  
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        'Loan_Id': el.Partner_Loan_id,
        'Entity_Name': el.Entity_Name,
        'Business_Structure': el.Business_Structure,
        'Loan_App_Form_Argmnt': el.Loan_App_Form_Argmnt,
        'KYC_document': el.KYC_document,
        'DPN': el.DPN,
        'Sanction_letter': el.Sanction_letter,
        'Checklist': el.Checklist,
        'CartonBarCode': el.CartonBarCode,
        'FIleBarcode': el.FIleBarcode,
        'ConsignmentNo': el.ConsignmentNo,
        'CourierName': el.CourierName,
        'FileInward_date': el.FileInward_date,
        'Remark': el.Remark,
        
       
      });
    
    });

  }
  this.headerList = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;  

}

 
prepareTableQuery(tableData, headerList) {
  let formattedData = [];
 
  let tableHeader: any = [
     
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Batch_No', header: 'BATCH ID', index: 2 },
   // { field: 'Partner_Loan_id', header: 'Partner_Loan_Id', index: 2 }, 
    { field: 'Loan_Id', header: 'LAN NO', index: 4 },
    { field: 'Group_id', header: 'Group_Id', index: 2 },
    { field: 'FIleBarcode', header: 'FIle Barcode', index: 4 },
    { field: 'CartonBarCode', header: 'Carton BarCode', index: 8 },
    { field: 'Entity_Name', header: 'APPLICANT NAME', index: 5 },
    { field: 'Checklist', header: 'Checklist Remark', index: 5 },
    { field: 'ProductName', header: 'Product Name', index: 5 },
    { field: 'Loan_App_Form_Argmnt', header: 'Loan App Form', index: 5 },
    { field: 'Sanction_letter', header: 'Sanction letter', index: 5 },
    { field: 'KYC_document', header: 'KYC Document', index: 5 },
    { field: 'DPN', header: 'DPN', index: 5 },
    { field: 'FileInward_date', header: 'FileInward Date', index: 5 },
    { field: 'JLG_Availibility', header: 'JLG Availibility', index: 5 },
    { field: 'APP_Co_APP_Sign', header: 'APP Co-APP Sign', index: 5 },
    { field: 'Northern_Arc_Osv', header: 'Northern Arc Osv', index: 6 },
    { field: 'File_Status', header: 'File Status', index: 7 },
    { field: 'FileInwardBy', header: 'File Inward By', index: 7 },
    { field: 'Status', header: 'Status', index: 8 }, 
    { field: 'Enterprice_Name', header: 'Enterprice_Name', index: 8 }, 
   // { field: 'Customer_id', header: 'Customerd', index: 8 }, 

    
    
  ];
  tableData.forEach((el, index) => {
    //console.log("el.Loan_Id",el.Loan_Id);
    
    formattedData.push({

      'srNo': parseInt(index + 1),
      //'BaID':"5",
      'Batch_No': el.Batch_No,
      'LSGNo': el.LSGNo,
      'CartonBarCode': el.CartonBarCode,
      'Loan_Id': el.Partner_Loan_id,
      'FIleBarcode': el.FIleBarcode,
      'Checklist':el.Checklist,
      'Status': el.status,
      'File_Status': el.File_Status,
      'Entity_Name': el.Enterprice_Name,
      'ProductName': el.ProductName,
      'Loan_App_Form_Argmnt': el.Loan_App_Form_Argmnt,
      'Sanction_letter': el.Sanction_letter,
      'KYC_document': el.KYC_document,
      'DPN': el.DPN,
      "Date_of_birth":el.Date_of_birth,
      'FileInward_date':el.FileInward_date,
      'JLG_Availibility': el.JLG_Availibility,
      'APP_Co_APP_Sign': el.APP_Co_APP_Sign,
      'Northern_Arc_Osv': el.Northern_Arc_Osv,
      'FileInwardBy':el.FileInwardBy,
      'ConsignmentNo':el.ConsignmentNo,
      'Enterprice_Name':el.Enterprice_Name,
      'Identity_proof_number':el.Identity_proof_number,
      'Identity_proof_Name':el.Identity_proof_Name,
      'Partner_Loan_id':el.Partner_Loan_id,
      'Group_id':el.Group_id,
      'Customer_id':el.Customer_id,
      'Disbursement_date':el.Disbursement_date,
      'Checklist_Remark':el.Checklist_Remark,
      'CourierName':el.CourierName,
     'Branch_Name':el.branch_id,
     'Remark':el.Remark
      
      
      
      // 'Pre_Audit_Observation_date':new Date( el.Pre_Audit_Observation_date).getFullYear() == 1 ? '' :new Date( el.Pre_Audit_Observation_date).toLocaleDateString(),
      // 'Pre_Audit_Query_status': el.Pre_Audit_Query_status,
      // 'CA_Observations': el.CA_Observations,
      // 'CA_Observation_date':new Date( el.CA_Observation_date).getFullYear() == 1 ? '' :new Date( el.CA_Observation_date).toLocaleDateString(),
      // 'CA_Observation_status': el.CA_Observation_status,
    
     
    });
   // console.log("el.Partner_Loan_ID,",el.Partner_Loan_ID);
    
  
  });
  this.headerList = tableHeader;
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

getdumpsearch() {  
    const apiUrl = this._global.baseAPIUrl + 'Report/GetInwardReport';          
    this._onlineExamService.postData(this.DumpReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {      
      this._StatusList = data;  
      this._FilteredList = data;      

      if(this.DumpReportForm.controls["ReportType"].value == "Finplex" || this.DumpReportForm.controls["ReportType"].value == "fileinwardpending")   
        {
          this.prepareTable( this._StatusList,  this._FilteredList);   
          console.log("yes entered");
          
        }
        else 
        {
          this.prepareTableQuery( this._StatusList,  this._FilteredList);
   

        }

       
  });

  } 

  onDownload()
  {
    
    this.downloadFile();
  }

  //_Finplex
  GetHeaderNames()
  {
    this._HeaderList="";
    var colList =[];//NOCPL
    if(this.DumpReportForm.controls["ReportType"].value == "Sonata")
    {
      colList = this._Sonata
      this._ReportName = "Sonata Dump Report"
    
      
    }
    else if(this.DumpReportForm.controls["ReportType"].value == "Finplex"){
      colList =  this._Finplex
      this._ReportName ="Finplex Dump Report"
    }
    else if(this.DumpReportForm.controls["ReportType"].value == "NOCPL"){
      colList =  this._NOCPL
      this._ReportName="NOCPL Dump Report"
    }
    else if(this.DumpReportForm.controls["ReportType"].value == "fileinwardpending"){
      colList =  this._InwardPending
      this._ReportName="Finle Inward Pending Report"
    }
    
    else{
      colList = this._ColNameList
    }

    for (let j = 0; j < colList.length; j++) {  
         
        this._HeaderList += colList[j] +((j <= colList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
      //console.log(this._HeaderList,"collist111")  
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < colList.length; j++) {  

        this._HeaderList += (stat[colList[j]]) + ((j <= colList.length-2)?',':'');

        // replaceSpecialCharacters(originalString);
        //headerArray.push(headers[j]);
        if (this._HeaderList==''){
        //  console.log(this._HeaderList,"inside")  
        }
        //console.log(this._HeaderList,"collist")  
      }
      this._HeaderList += '\n'
    });
  }

   replaceSpecialCharacters(inputString: string): string {
    // Define a regular expression pattern to match special characters
    const specialCharPattern = /[^\w\s]/g;
  
    // Use the replace method with the pattern to replace special characters with an empty string
    return inputString.replace(specialCharPattern, '');
  }
  
  downloadFiles() { 


    this.GetHeaderNames()
    let csvData = this._HeaderList;     
    console.log(csvData,"csv data") 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser =-1;

    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download",  this._ReportName + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">There should be some data before you download!</span></div>',
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
  }
  OnReset() {
    this.Reset = true;
    this.DumpReportForm.reset();
  }
  isValid() {
    return this.DumpReportForm.valid 
  } 

  downloadFile()
  {
    // debugger;
    // this.downloadFile();

    if(this.DumpReportForm.controls["ReportType"].value == "Finplex")      
      {
        this.exportToExcel(this.formattedData,'Report');
      }
      else 
      {
          this.downloadFiles();
      }
  }

  exportToExcel(data: any[], fileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xls', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }
  
  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const excelFile: File = new File([data], `${fileName}.xlsx`, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url: string = window.URL.createObjectURL(data);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = this.DumpReportForm.controls["ReportType"].value + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}

