import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';



// import { Listboxclass } from '../../../Helper/Listboxclass';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-Quicksearch",
  templateUrl: "Quicksearch.component.html",
  styleUrls : ["Quicksearch.component.css"]
})
export class QuicksearchComponent implements OnInit {


  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _IndexListFile:any;
  _FilteredListFile:any;
  modalRef: BsModalRef;
  isReadonly = true;
  DispatchList: any;
  _FilteredList: any;
  _HeaderList:any;

  first:any=0;
  rows:any=0
  
  //_ColNameList:any;
  _IndexList:any;
    
  ContentSearchForm: FormGroup;

  submitted = false;

  Reset = false;
  sMsg: string = '';
  
  _IndexPendingList:any;
  bsValue = new Date();
  

  _ColNameList = ["srNo","BatchID","Loan_Id", "FIleBarcode","CartonBarCode","Entity_Name","DocumentType","ProductName","Loan_App_Form_Argmnt","Sanction_letter","KYC_document","DPN","JLG_Availibility","APP_Co_APP_Sign","Northern_Arc_Osv","File_Status","Status"];
  
  constructor(
    private modalService: BsModalService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    private route: ActivatedRoute,
    private router: Router,
  ){}
  ngOnInit(){
    document.body.classList.add('data-entry');
    this.ContentSearchForm = this.formBuilder.group({
      SearchBy: ["0", Validators.required],
      File_No: ['', Validators.required],    
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      
    });
  
    this.GetDumpdata();
    this.ContentSearchForm.controls['SearchBy'].setValue("0"); 
    
  }

  GetDumpdata() {   
   // https://dmstest.crownims.com/NACAPI/api/FinplexFileInward/GetDumpSearch?user_Token=EA0DCFC7-4CD1-4CB5-B75F-7A4AA&UserID=705  
    
    const apiUrl = this._global.baseAPIUrl + 'FinplexFileInward/GetDumpSearch?UserID='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
    this._IndexPendingList = data;
    this._FilteredList = data;
  // this._ColNameList = data;
    this.prepareTableData(this._FilteredList, this._IndexPendingList); 
    });
  } 
    GetFilterSearch() {     
      console.log("this.ContentSearchForm.get('File_No').value",this.ContentSearchForm.get('File_No').value)
      const apiUrl = this._global.baseAPIUrl + 'FinplexFileInward/SearchRecordsByFilter?UserID='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&searchType='+this.ContentSearchForm.get('SearchBy').value+'&SearchBy='+this.ContentSearchForm.get('File_No').value;
      this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     
      this._IndexPendingList = data;
      this._FilteredList = data;    
      this.prepareTableData(this._FilteredList, this._IndexPendingList);

      });
    }
   
    OnReset()
    {
      this.ContentSearchForm.controls['SearchBy'].setValue("0");
      this.ContentSearchForm.controls['File_No'].setValue("");
      this.GetDumpdata();
    }
  
    hidepopup()
{

  this.modalRef.hide();
  
} 

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  ngOnDestroy() {
    document.body.classList.remove('data-entry')
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
  
    selectedEntries = [];
    allSelected = false;
    selectRow(e, fileNo) {
      if(e.target.checked) {
        this.selectedEntries.push(fileNo);
      } else {
        this.selectedEntries.splice(this.selectedEntries.indexOf(fileNo), 1);
      }

      // check if all rows are individually selected
      if(this._FilteredList.length === this.selectedEntries.length) {
        setTimeout(() => {
          this.allSelected = true;
        }, 100);
      } else {
        setTimeout(() => {
          this.allSelected = false;
        }, 100);
      }
      console.log(this.selectedEntries);
    }

    selectAll(e) {
      console.log('All files selected');
      if(e.target.checked) {
        this._FilteredList.forEach(element => {
          this.selectedEntries.push(element.FileNo);
        });
      } else {
        this.selectedEntries = [];
      }
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
               // { field: 'BaID', header: 'BATCH ID', index: 2 },
                { field: 'Loan_Id', header: 'LAN NO', index: 4 },
                { field: 'FIleBarcode', header: 'FIle Barcode', index: 4 },
                { field: 'CartonBarCode', header: 'Carton BarCode', index: 8 },
                { field: 'Entity_Name', header: 'APPLICANT NAME', index: 5 },
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
                { field: 'Status', header: 'Courier Status', index: 8 },                 
            ];
         
            tableData.forEach((el, index) => {
              formattedData.push({
                'srNo': parseInt(index + 1),
                //'BaID':"5",
                'BatchID': el.BatchID,
                'LSGNo': el.LSGNo,
                'CartonBarCode': el.CartonBarCode,
                'Loan_Id': el.Loan_Id,
                'FIleBarcode': el.FIleBarcode,
                'DocumentType':el.DocumentType,
                'Status': el.Status,
                'File_Status': el.File_Status,
                'Entity_Name': el.Entity_Name,
                'ProductName': el.ProductName,
                'Loan_App_Form_Argmnt': el.Loan_App_Form_Argmnt,
                'Sanction_letter': el.Sanction_letter,
                'KYC_document': el.KYC_document,
                'DPN': el.DPN,
                'JLG_Availibility': el.JLG_Availibility,
                'APP_Co_APP_Sign': el.APP_Co_APP_Sign,
                'Northern_Arc_Osv': el.Northern_Arc_Osv
              });
            
            });
            this.headerList = tableHeader;
            this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
            this.formattedData = formattedData;
            this.loading = false;
            

         console.log(this.formattedData,"tableHeader");

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


          
GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList += '\n'
  this._FilteredList.forEach(stat => {
    for (let j = 0; j < this._ColNameList.length; j++) {  
      this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
  });

  console.log(this._HeaderList,"this._HeaderList");
  
  

}

downloadFile() { 
  this.GetHeaderNames()
  let csvData = this._HeaderList;     
  var csvDatas = csvData.replace("null", ""); 

 // console.log(csvData) 
  if(this._FilteredList.length>0) {
  let blob = new Blob(['\ufeff' +  csvDatas], { 
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
  dwldLink.setAttribute("download",  "dump_data" + ".csv"); 
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

ViewRepayement(template: TemplateRef<any> ,Row: any) {
  if (Row.document_type=='Repayment' || Row.document_type=='Repayment Insert')
  { 
  this.modalRef = this.modalService.show(template); 
  this.getRepayementData(Row.File_No);
  }
} 


SearchDocumentList(Row: any) {
  localStorage.setItem('searchLan',Row.Loan_Id  );
  localStorage.setItem('searchBatch',Row.BatchID);
 this.router.navigateByUrl('/search/search-history');
 console.log('rowwwwwwwwww',Row.Loan_Id)
  
} 



closmodel()
{

  this.modalRef.hide();
}

formattedFileData: any = [];
headerListFile: any;
immutableFormattedDataFile: any;
//loading: boolean = true;

//  Repayement Code here 

getRepayementData(File_No:any) {     
    
const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsRepayement?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+File_No;
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

this._IndexListFile = data;
this._FilteredListFile = data ;

this.BingRepayementData(this._FilteredListFile, this._IndexListFile);

});
}

BingRepayementData(tableData, headerList) {
let formattedFileData = [];
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  //  { field: 'pod_no', header: 'POD NO', index: 3 },
   { field: 'repayment', header: 'ACTIVITY', index: 4 },
   { field: 'remark', header: 'REMARK', index: 5 },
   { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
   { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
   { field: 'updated_by', header: 'MODIFY BY', index: 5 },
   { field: 'updated_date', header: 'MODIFY DATE', index: 5 },

];

tableData.forEach((el, index) => {
  formattedFileData.push({
    'srNo': parseInt(index + 1),
    'File_No': el.File_No,    
   'entry_by': el.entry_by,  
    'repayment': el.repayment,   
     'remark': el.remark, 
       'entry_date': el.entry_date,  
     'updated_by': el.updated_by,    
     'updated_date': el.updated_date,    

  });
 
});
this.headerListFile = tableHeader;
this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
this.formattedFileData = formattedFileData;
this.loading = false;
}

//  Docket Code here 
ViewDocket(template: TemplateRef<any> ,Row: any) {
 
if (Row.document_type=='Docket' || Row.document_type=='Docket Insert')
{
    this.modalRef = this.modalService.show(template); 
    this.getDocketData(Row.File_No);
}
} 

getDocketData(File_No:any) {     
    
const apiUrl = this._global.baseAPIUrl + 'BranchInward/SearchRecordsDocket?USERId='+localStorage.getItem('UserID')+'&user_Token='+ localStorage.getItem('User_Token') +'&FileNo='+File_No;
this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {     

this._IndexListFile = data;
this._FilteredListFile = data ;

this.BingDocketData(this._FilteredListFile, this._IndexListFile);

});
}

BingDocketData(tableData, headerList) {
let formattedFileData = [];
let tableHeader: any = [
  { field: 'srNo', header: "SR NO", index: 1 },
  { field: 'File_No', header: 'FILE NO', index: 2 },
  //  { field: 'pod_no', header: 'POD NO', index: 3 },
   { field: 'status', header: 'ACTIVITY', index: 4 },
   { field: 'remark', header: 'REMARK', index: 5 },
   { field: 'entry_by', header: 'UPLOAD BY', index: 5 },
   { field: 'entry_date', header: 'UPLOAD DATE', index: 5 },
   { field: 'updated_by', header: 'MODIFY BY', index: 5 },
   { field: 'updated_date', header: 'MODIFY DATE', index: 5 },

];

tableData.forEach((el, index) => {
  formattedFileData.push({
    'srNo': parseInt(index + 1),
    'File_No': el.File_No,    
   'entry_by': el.entry_by,  
    'status': el.status,   
     'remark': el.remark, 
       'entry_date': el.entry_date,  
     'updated_by': el.updated_by,    
     'updated_date': el.updated_date,    

  });
 
});
this.headerListFile = tableHeader;
this.immutableFormattedData = JSON.parse(JSON.stringify(formattedFileData));
this.formattedFileData = formattedFileData;
this.loading = false;
}
 
  
}
