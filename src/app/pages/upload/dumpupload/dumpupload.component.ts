import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, EventEmitter,Output } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  selector: "app-dumpupload",
  templateUrl: "dumpupload.component.html",
})
export class DumpuploadComponent implements OnInit {
entries: number = 10;
selected: any[] = [];
temp = [];
activeRow: any;
SelectionType = SelectionType;
modalRef: BsModalRef;
_SingleDepartment: any;
submitted = false;
Reset = false;     
sMsg: string = '';      
_FilteredList = []; 
 
_IndexList:any;
_Records :any; 
DataUploadForm: FormGroup;

public message: string;
_HeaderList: any;
_ColNameList = [];
_CSVData: any;
public records: any[] = [];
papa: any;
_TempID: any = 0;

myFiles:string [] = [];
_FileDetails:string [][] = [];
first = 0;
rows = 10;

@Output() public onUploadFinished = new EventEmitter();
  constructor(
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
  ) {}
  ngOnInit() {
    this.DataUploadForm = this.formBuilder.group({    
      product_name:['',Validators.required],
      user_Token: localStorage.getItem('User_Token') ,
      UserID: localStorage.getItem('UserID') ,
      CreatedBy:localStorage.getItem('UserID'),     
      CSVData:[""]
    });     
// this.BindHeader(this._FilteredList,this._FilteredList);
    this.prepareTableData(this._FilteredList,this._FilteredList);
  }
   

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
 //   console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
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

  OnReset() {   
    
  }
  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    //console.log(this.DataUploadForm);
    
    if(this.DataUploadForm.valid && files.length>0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
            // console.log(this.test);
            // console.log('Parsed: k', results.data);
          }
        });
      }
    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select <br> <b>Csv File</b><br><b>Template</b><br> before uploading!</span></div>',
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

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {
      
      let input = $event.target;
      let reader = new FileReader();
     // console.log(input.files[0]);
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        // alert(headersRow);
        // alert(this._ColNameList);
        //let ColName = 
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
        //  console.log('Not Valid File', csvRecordsArray);
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
       
          this._FilteredList = this.records;

        //  console.log(this.records);
          //console.log("_FilteredList",this._FilteredList);

          this.prepareTableDataForCSV(this._FilteredList);         

          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        //  console.log('Records', this._FilteredList);
        }
  

      };

      reader.onerror = function () {
       // console.log('error is occurred while reading file!');
      };

    } else {
      this.toastr.show(
        '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Error!</span> <span data-notify="message">Please Select A Valid CSV File And Template</span></div>',
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
      this.fileReset();
    }
    this._FilteredList = this.records
  }

  checkDateFormat(date) {
  //  console.log("Date",date);

    if (date !="")
    {
    let dateArr = date.split('-');
    const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    if(isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
      return false;
    }
    if(isNaN(new Date(dateString).getTime())) {
      return false;
    }
    return true;
  }
  else
  {
    return true;
  }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    var  headers;
    var productName=this.DataUploadForm.get("product_name").value
    //console.log( this.DataUploadForm.get("product_name").value," this.DataUploadForm.get(product_name).value");
    
   // headers ="NewCBSAccountNo,ApplicationNo,CBSCUSTIC,Team,HandliedBy,ProductCode,Product,ProductDescription,JCCode,JCName,Zone,CustomerName,DBDate,FinalRemarks,DisbursedMonth";
   if(productName==="Finplex"){
    headers =['Loan_Id','Product_Name','Entity_Name','Branch_Name','Business_Structure','Disbursement_Date'];
   }
   else if(productName==="Sonata"){
    headers =['Group_id','Partner_Loan_id','Enterprice_Name','Customer_id','Disbursement_date','Date_of_birth','Identity_proof_number','Identity_proof_Name'];
   }
   else if(productName==="NOCPL"){
    headers =['Group_id','Branch_Name','Center_Name','No_of_member','Customer_id','App_id','Disbursement_date'];
   }

   //headers base on the upload 
   
    return headers;


  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

        this.submitted = true;      
  
 if(this._CSVData != null && this._CSVData != undefined)
 {

   var uploadData;

    uploadData = {
      userid: localStorage.getItem('UserID'),
      CSVData: this._CSVData,     
      user_Token: localStorage.getItem('User_Token'),
      CreatedBy:localStorage.getItem('UserID')

    };    
    
    // API header parameters will be changed on the bases of selection

    var productName=this.DataUploadForm.get("product_name").value
    var productWiseApi;

    if(productName==="Finplex"){
      productWiseApi='FinplexUpload/AddEditFinplexUpload'

    }
    else if(productName==="Sonata"){
      productWiseApi='SonataUpload/AddEditSonataUpload'
     }
     else if(productName==="NOCPL"){
      productWiseApi='NOCPLUpload/AddEditNOCPLUpload'
     }

    const apiUrl = this._global.baseAPIUrl + productWiseApi;
    this._onlineExamService.postData(uploadData, apiUrl)
      // .pipe(first())
      .subscribe(data => {
        
      // alert(data);
      this.showSuccessmessage(data); 
         this.downloadStatusFile(data);
        this.BindHeader(this._FilteredList,this._FilteredList);

      });

    //  }     
    }
    else
    {
      this.showmessage("please select file"); 

    }
  }

  ShowErrormessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

  onFormat(csvRecordsArr: any) {
    //   let dt;
 
  }

  getDisplayNames(csvRecordsArr: any) {

  //  console.log("csvRecordsArr",csvRecordsArr);

    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
 
// Add validation on the bases of the upload count

var productName=this.DataUploadForm.get("product_name").value

    if (productName==="Finplex" && headers.length != 6) {
     var msg= 'Invalid No. of Column Expected :- ' + 6; 
     //this.showmessage(msg);
     this.ShowErrormessage(msg);

      return false;
    }
    else if (productName==="Sonata" && headers.length != 8) {
      var msg= 'Invalid No. of Column Expected :- ' + 8; 
      //this.showmessage(msg);
      this.ShowErrormessage(msg);
 
       return false;
     }
     else if (productName==="NOCPL" && headers.length != 7) {
      var msg= 'Invalid No. of Column Expected :- ' + 7; 
      //this.showmessage(msg);
      this.ShowErrormessage(msg);
 
       return false;
     }
   // this._HeaderList ="POD No,Invoice Details,Invoice No,Invoice Date,Vendor Name,Barcode No";
  // headers =['Loan_Id','Product_Name','Entity_Name','Branch_Name','State','Business_Structure','Disbursement_Date'];
 //  this._ColNameList[0] ="appl_apac"; 'Loan Number','Product','Month','Applicant Name'
 // headers =['Group_id','Partner_Loan_id','Enterprice_Name','Customer_id','Disbursement_date','Date_of_birth','Identity_proof_number','Identity_proof_Name'];
//headers =['Group_id','Branch_Name','Center_Name','No_of_member','Customer_id','App_id','Disbursement_date'];

 if(productName==="Finplex"){
   this._ColNameList[0] ="Loan_Id"; 
   this._ColNameList[1] ="Product_Name";
   this._ColNameList[2] ="Entity_Name";
   this._ColNameList[3] ="Branch_Name";
   this._ColNameList[4] ="Business_Structure";
   this._ColNameList[5] ="Disbursement_Date";
  }
  else if (productName==="Sonata"){
    this._ColNameList[0] ="Group_id"; 
    this._ColNameList[1] ="Partner_Loan_id";
    this._ColNameList[2] ="Enterprice_Name";
    this._ColNameList[3] ="Customer_id";
    this._ColNameList[4] ="Disbursement_date";
    this._ColNameList[5] ="Date_of_birth";
    this._ColNameList[6] ="Identity_proof_number";
    this._ColNameList[7] ="Identity_proof_Name";
  }
  else if (productName==="NOCPL"){
    this._ColNameList[0] ="Group_id"; 
    this._ColNameList[1] ="Branch_Name";
    this._ColNameList[2] ="Center_Name";
    this._ColNameList[3] ="No_of_member";
    this._ColNameList[4] ="Customer_id";
    this._ColNameList[5] ="App_id";
    this._ColNameList[6] ="Disbursement_date";
    
  }
 
  return true;
}

  GetHeaderNames() {

    this._HeaderList ="Loan_AC_no,LSG_No,Product,Customer_Name,DisbursedDate,Branch,Amount";
  
  }

  downloadFile() {
    //format will be downloaded on the bases of the product
    var productName=this.DataUploadForm.get("product_name").value
    
    var filename ;
    var csvData;
    if(productName==="Finplex"){
      filename = 'Finplex_DumpUpload_CSV';
    
     csvData ="Loan_Id,Product_Name,Entity_Name,Branch_Name,Business_Structure,Disbursement_Date";
    }
    else if(productName==="Sonata"){
      filename = 'Sonata_DumpUpload_CSV';
      csvData = "Group_id,Partner_Loan_id,Enterprice_Name,Customer_id,Disbursement_date,Date_of_birth,Identity_proof_number,Identity_proof_Name";

    }
    else if(productName==="NOCPL"){
      filename = 'NOCPL_DumpUpload_CSV';
      csvData = "Group_id,Branch_Name,Center_Name,No_of_member,Customer_id,App_id,Disbursement_date";

    }
   
  
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 

    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);  
  }  

  showmessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
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

  showSuccessmessage(data:any)
  {
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title"> </span> <span data-notify="message"> '+ 'Record saved successfully' +' </span></div>',
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

  formattedData: any = [];
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;


//Loan Number,Product,Month,Applicant Name
//'Loan_AC_no','Product','Branch','Customer_Name','Month'

  prepareTableDataForCSV(tableData) {
    let formattedData = [];
    var productName=this.DataUploadForm.get("product_name").value

    // csvData ="Loan_Id,Product_Name,Entity_Name,Branch_Name,State,Business_Structure,Disbursement_Date";
//Group_id,Partner_Loan_id,Enterprice_Name,Customer_id,Disbursement_date,Date_of_birth,Identity_proof_number,Identity_proof_Name
    var tableHeader : any;
    if(productName==="Finplex"){
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Loan_Id', header: 'Loan ID', index: 2 },
        { field: 'Product_Name', header: 'Product Name', index: 2 },
        { field: 'Entity_Name', header: 'Entity Name', index: 1 }, 
         { field: 'Branch_Name', header: 'Branch Name', index: 1 }, 
        // { field: 'State', header: "State", index: 1 }, 
        { field: 'Business_Structure', header: 'Business Structure', index: 2 },
        { field: 'Disbursement_Date', header: 'Disbursement Date', index: 2 },
      
      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),   
          'Loan_Id': el[0],
          'Product_Name': el[1],
          'Entity_Name': el[2],  
           'Branch_Name': el[3],
          // 'State': el[4],
          'Business_Structure': el[4],
          'Disbursement_Date': el[5],
          
        });
     
      });

    }
    else if (productName === "Sonata") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Partner_Loan_id', header: 'Partner Loan ID', index: 2 },
        { field: 'Enterprice_Name', header: 'Enterprice Name', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 1 },
        { field: 'Disbursement_date', header: 'Disbursement Date', index: 2 },
        { field: 'Date_of_birth', header: "Date of birth", index: 1 },
        { field: 'Identity_proof_number', header: "Identity Proof Number", index: 1 },
        { field: 'Identity_proof_Name', header: 'Identity Proof Name', index: 2 },


      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'Group_id': el[0],
          'Partner_Loan_id': el[1],
          'Enterprice_Name': el[2],
          'Customer_id': el[3],
          'Disbursement_date': el[4],
          'Date_of_birth': el[5],
          'Identity_proof_number': el[6],
          'Identity_proof_Name': el[7],
        });

      });

    }

    //['Group_id','Branch_Name','Center_Name','No_of_member','Customer_id','App_id','Disbursement_date']

    else if (productName === "NOCPL") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Branch_Name', header: 'Branch Name', index: 2 },
        { field: 'Center_Name', header: 'Center Name', index: 1 },
        { field: 'No_of_member', header: 'No Of Member', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 2 },
        { field: 'App_id', header: "App ID", index: 1 },
        { field: 'Disbursement_date', header: "Disbursement Date", index: 1 },
        
      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'Group_id': el[0],
          'Branch_Name': el[1],
          'Center_Name': el[2],
          'No_of_member': el[3],
          'Customer_id': el[4],
          // 'Date_of_birth': el[5],
          'App_id': el[5],
          'Disbursement_date': el[6],
        });

      });

    }
   
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
   // console.log("this.formattedData", this.formattedData);
  }

  prepareTableData(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    var productName=this.DataUploadForm.get("product_name").value

    // csvData ="Loan_Id,Product_Name,Entity_Name,Branch_Name,State,Business_Structure,Disbursement_Date";

    var tableHeader : any;
    if(productName==="Finplex"){
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Loan_Id', header: 'Loan ID', index: 2 },
        { field: 'Product_Name', header: 'Product Name', index: 2 },
        { field: 'Entity_Name', header: 'Entity Name', index: 1 }, 
         { field: 'Branch_Name', header: 'Branch Name', index: 1 }, 
        //{ field: 'State', header: "State", index: 1 }, 
        { field: 'Business_Structure', header: 'Business Structure', index: 2 },
        { field: 'Disbursement_Date', header: 'Disbursement Date', index: 2 },
      
      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),   
          'Loan_Id': el[0],
          'Product_Name': el[1],
          'Entity_Name': el[2],  
           'Branch_Name': el[3],
          // 'State': el[4],
          'Business_Structure': el[4],
          'Disbursement_Date': el[5],
       
        });
     
      });

    }

    else if (productName === "Sonata") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Partner_Loan_id', header: 'Partner Loan ID', index: 2 },
        { field: 'Enterprice_Name', header: 'Enterprice Name', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 1 },
        { field: 'Disbursement_date', header: 'Disbursement Date', index: 2 },
        { field: 'Date_of_birth', header: "Date of birth", index: 1 },
        { field: 'Identity_proof_number', header: "Identity Proof Number", index: 1 },
        { field: 'Identity_proof_Name', header: 'Identity Proof Name', index: 2 },


      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'Group_id': el[0],
          'Partner_Loan_id': el[1],
          'Enterprice_Name': el[2],
          'Customer_id': el[3],
          'Disbursement_date': el[4],
          'Date_of_birt': el[5],
          'Identity_proof_number': el[6],
          'Identity_proof_Name': el[7],
        });

      });

    }


    else if (productName === "NOCPL") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Branch_Name', header: 'Branch Name', index: 2 },
        { field: 'Center_Name', header: 'Center Name', index: 1 },
        { field: 'No_of_member', header: 'No Of Member', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 2 },
        { field: 'App_id', header: "App ID", index: 1 },
        { field: 'Disbursement_date', header: "Disbursement Date", index: 1 },
        
      ];

      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'Group_id': el[0],
          'Branch_Name': el[1],
          'Center_Name': el[2],
          'No_of_member': el[3],
          'Customer_id': el[4],
         // 'Date_of_birth': el[5],
          'App_id': el[5],
          'Disbursement_date': el[6],
        });

      });

    }
    this.headerList = tableHeader;
  //}
  
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  
  }
  
  BindHeader(tableData, headerList) {
    let formattedData = [];
   // alert(this.type);
  
  // if (this.type=="Checker" )
  //{
    var productName=this.DataUploadForm.get("product_name").value
    var tableHeader : any;
    if(productName==="Finplex"){
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Loan_Id', header: 'Loan ID', index: 2 },
        { field: 'Product_Name', header: 'Product Name', index: 2 },
        { field: 'Entity_Name', header: 'Entity Name', index: 1 }, 
         { field: 'Branch_Name', header: 'Branch Name', index: 1 }, 
        { field: 'Business_Structure', header: 'Business Structure', index: 2 },
        { field: 'Disbursement_Date', header: 'Disbursement Date', index: 2 },
      
      ];
    }

    else if (productName === "Sonata") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Partner_Loan_id', header: 'Partner Loan ID', index: 2 },
        { field: 'Enterprice_Name', header: 'Enterprice Name', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 1 },
        { field: 'Disbursement_date', header: 'Disbursement Date', index: 2 },
        { field: 'Date_of_birth', header: "Date of birth", index: 1 },
        { field: 'Identity_proof_number', header: "Identity Proof Number", index: 1 },
        { field: 'Identity_proof_Name', header: 'Identity Proof Name', index: 2 },


      ];


    }
    
    else if (productName === "NOCPL") {
      tableHeader = [
        { field: 'srNo', header: "SR NO", index: 1 },
        { field: 'Group_id', header: 'Group ID', index: 2 },
        { field: 'Branch_Name', header: 'Branch Name', index: 2 },
        { field: 'Center_Name', header: 'Center Name', index: 1 },
        { field: 'No_of_member', header: 'No Of Member', index: 1 },
        { field: 'Customer_id', header: 'Customer ID', index: 2 },
        { field: 'App_id', header: "App ID", index: 1 },
        { field: 'Disbursement_date', header: "Disbursement_date", index: 1 },
        
      ];
    }
    
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

  
paginate(e) {
this.first = e.first;
this.rows = e.rows;
}
 
downloadStatusFile(strmsg:any) {
  const filename = 'File upload status';
  
 // let csvData = "FileNo,";    
  //console.log(csvData)
  let blob = new Blob(['\ufeff' + strmsg], {
    type: 'text/csv;charset=utf-8;'
  });
  let dwldLink = document.createElement("a");
  let url = URL.createObjectURL(blob);
  let isSafariBrowser = -1;
  // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
  // navigator.userAgent.indexOf('Chrome') == -1; 

  //if Safari open in new window to save file with random filename. 
  if (isSafariBrowser) {
    dwldLink.setAttribute("target", "_blank");
  } 
  dwldLink.setAttribute("href", url);
  dwldLink.setAttribute("download", filename + ".csv");
  dwldLink.style.visibility = "hidden";
  document.body.appendChild(dwldLink);
  dwldLink.click();
  document.body.removeChild(dwldLink);
//}
} 
 
}
