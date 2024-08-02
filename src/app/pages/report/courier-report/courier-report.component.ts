

import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import noUiSlider from "nouislider";
import Dropzone from "dropzone";
Dropzone.autoDiscover = false;

import Selectr from "mobius1-selectr";

import swal from "sweetalert2";
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: 'app-courier-report',
  templateUrl: './courier-report.component.html',
  styleUrls: ['./courier-report.component.scss']
})
export class CourierReportComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
 CourierReportForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  _IndexPendingList:any;

// _ColNameList = ["lanno","pod_number","request_no","file_barcode","property_barcode","branch_code","branch_name","ref_request_no","product_type","request_type","request_reason","request_by","request_email","courier_name","request_date","ack_date","pod_entry_date","ref_entry_date","ref_ack_date","file_status","status","file_barcode_status","dispatch_address"];

_InwardColNameList = ["ConsignmentNo","Batch_No", "CourierName","entry_name","entry_date","branch_name","branch_name","TAT","status"];

    
_ColNameList = ["ConsignmentNo","Batch_No", "CourierName","entry_name","entry_date","branch_name","TAT","status","Customer_Name","amount","LANNo","FileInward_date","FileInwardBy","disbursed_date","entry_by","LSG_No","Month","Product","State"];
 
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
    this.CourierReportForm = this.formBuilder.group({
      ToDate:[],
      FromDate:[],
      ReportType:[0,Validators.required],
      User_Token:  localStorage.getItem('User_Token') ,  
      userid: localStorage.getItem('UserID') ,      
    });

    this.getdumpsearch();

  }
 
  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }

  formattedData: any = [];
headerList: any;
immutableFormattedData: any;
loading: boolean = true;
// "RecievedDate": "2023-12-11T16:35:47.793",
// "CourierName": null,
// "ConsignmentNo": null,
// "Product": null,
// "LSGNo": "100",
// "LANNo": "1000",
// "State": null,
// "branch_name": null,
// "Customer_Name": null,
// "DocumentType": "Main",
// "CreditFile": "Yes",
// "PropertyDoc": "Yes",
// "MODT": "Yes",
// "Remarks": null,
// "entry_by": 705,
// "entry_date": "2023-12-21T19:54:31.94",
// "ToDate": "0001-01-01T00:00:00",
// "FromDate": "0001-01-01T00:00:00",
// "ReportType": null,
// "DateCreated": null,
// "CreatedBy": 0,
// "User_Token": null
// if (ReportType=' Inward Report')
prepareTableData(tableData, headerList) {
  let formattedData = [];

  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Batch_No', header: 'BATCH NO', index: 3 },
    { field: 'ConsignmentNo', header: 'CONSIGNMENT NO', index: 3 },
    { field: 'CourierName', header: 'COURIER NAME', index: 3 },
    { field: 'entry_name', header: 'INWARD BY', index: 3 },
    { field: 'entry_date', header: 'INWARD DATE', index: 3},
    { field: 'branch_name', header: 'BRANCH NAME', index: 3 },
    { field: 'TAT', header: 'TAT', index: 4},
    { field: 'status', header: 'STATUS', index: 4},
   
   // { field: 'file_status', header: 'FILE STATUS', index: 3},  
    // { field: 'status', header: 'STATUS', index: 3 },
   // { field: 'pod_dispatch_date', header: 'DISPATCH DATE', index: 3 },
   //  { field: 'pod_ack_date', header: 'ACK DATE', index: 3 },  
    
     
  ];

  tableData.forEach((el, index) => {
    
    formattedData.push({
      'srNo': parseInt(index + 1),
      'ConsignmentNo': el.ConsignmentNo,
      'Batch_No': el.Batch_No,
      'CourierName': el.CourierName,
      'entry_name': el.entry_name,
      'entry_date': new Date( el.entry_date).toLocaleDateString(),
      'branch_name': el.branch_name,
      'TAT': el.TAT,
      'status': el.status,
      
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

  let tableHeader: any = [
    { field: 'srNo', header: "SR NO", index: 1 },
    { field: 'Batch_No', header: 'BATCH NO', index: 3 },
    { field: 'ConsignmentNo', header: 'CONSIGNMENT NO', index: 3 },
    { field: 'CourierName', header: 'COURIER NAME', index: 3 },
    { field: 'entry_name', header: 'INWARD BY', index: 3 },
    { field: 'entry_date', header: 'INWARD DATE', index: 3},
    { field: 'branch_name', header: 'BRANCH NAME', index: 3 }, 
    { field: 'Customer_Name', header: 'APPLICANT NAME', index: 2 },
    { field: 'amount', header: 'AMOUNT', index: 3 },
    { field: 'LANNo', header: 'LAN NO', index: 4},
    { field: 'FileInward_date', header: 'FILE INWARD DATE', index: 4},
    { field: 'FileInwardBy', header: 'FILE INWARD BY ', index: 2 },
    { field: 'disbursed_date', header: 'DISBURSED DATE', index: 4},
    { field: 'entry_by', header: 'UPLOAD BY', index: 4},
    { field: 'entry_date', header: 'UPLOAD DATE', index: 2 },
    { field: 'LSG_No', header: 'LSG NO', index: 4},
    { field: 'Month', header: 'MONTH', index: 2 },
    { field: 'Product', header: 'PRODUCT', index: 4},
    { field: 'State', header: 'STATE', index: 2 },
    { field: 'TAT', header: 'TAT', index: 4},
    { field: 'status', header: 'STATUS', index: 4},
    // { field: 'entry_name', header: 'INWARD BY', index: 3 },
    // { field: 'entry_date', header: 'INWARD DATE', index: 3},
   // { field: 'file_status', header: 'FILE STATUS', index: 3},  
    // { field: 'status', header: 'STATUS', index: 3 },
   // { field: 'pod_dispatch_date', header: 'DISPATCH DATE', index: 3 },
   //  { field: 'pod_ack_date', header: 'ACK DATE', index: 3 },  
    
     
  ];

  tableData.forEach((el, index) => {
    debugger;
    formattedData.push({
      'srNo': parseInt(index + 1),
      'ConsignmentNo': el.ConsignmentNo,
      'Batch_No': el.Batch_No,
      'CourierName': el.CourierName,
      'entry_name': el.entry_name,
      'entry_date':new Date( el.entry_date).getFullYear() == 1 ? '' : new Date( el.entry_date).toLocaleDateString(),
      'branch_name': el.branch_name,
      'Customer_Name': el.Customer_Name,
      'amount': el.amount,
      'LANNo': el.LANNo,
      'FileInward_date': new Date( el.FileInward_date).getFullYear() == 1 ? '' : new Date( el.FileInward_date).toLocaleDateString(),
      'FileInwardBy': el.FileInwardBy,
      'disbursed_date':new Date( el.disbursed_date).getFullYear() == 1 ? '' :new Date( el.disbursed_date).toLocaleDateString(),
      'entry_by': el.entry_by,
      'LSG_No': el.LSG_No,
      'Month': el.Month,
      'Product': el.Product,
      'State': el.State,
      'TAT': el.TAT,
      'status': el.status,
    
     
    });
  
  });
  this.headerList = tableHeader;
  this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
  this.formattedData = formattedData;
  this.loading = false;
  

//    console.log(this.formattedData);

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
    const apiUrl = this._global.baseAPIUrl + 'Report/GetCourierReport';          
    this._onlineExamService.postData(this.CourierReportForm.value,apiUrl)
    // .pipe(first())

    .subscribe( data => {      
      this._StatusList = data; 
              
      this._FilteredList = data;     
      if (data[0].status =='Courier Complete')
      {
        debugger
        this.prepareTableData( this._StatusList,  this._FilteredList);
      
      }
      
      else{
        this.prepareTable( this._StatusList,  this._FilteredList);
      }
  });

  } 

  onDownload()
  {
   
    this.downloadFile();
  }

  GetHeaderNames()
  {
    this._HeaderList="";
    var colList =[];
    if(this.CourierReportForm.controls["ReportType"].value == "couriercomplete")
    {
      colList = this._InwardColNameList
    }
    else{
      colList = this._ColNameList
    }

    for (let j = 0; j < colList.length; j++) {  
      debugger;
         
        this._HeaderList += colList[j] +((j <= colList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < colList.length; j++) {  
        this._HeaderList += (stat[colList[j]]) + ((j <= colList.length-2)?',':'') ;
        // headerArray.push(headers[j]);  
      }
      this._HeaderList += '\n'
    });
    
  
  }
  
  downloadFile() { 
    this.GetHeaderNames()
    let csvData = this._HeaderList;     
 //   console.log(csvData) 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser =-1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download",  "Dump Report" + ".csv"); 
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
    this.CourierReportForm.reset();
  }
  isValid() {
    return this.CourierReportForm.valid 
  } 
}

