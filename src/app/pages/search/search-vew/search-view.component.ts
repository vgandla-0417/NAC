import { Globalconstants } from "../../../Helper/globalconstants";
import { OnlineExamServiceService } from "../../../Services/online-exam-service.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from '@angular/router';


export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}

@Component({
  selector: 'app-klap-search',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {


  entries: number = 10;
  selected: any[] = [];
  temp = [];
  docName: any[] = [];
  activeRow: any;
  SelectionType = SelectionType;
  modalRef: BsModalRef;
  _FilteredList: any;
  _FilteredListAuditor: any;
  _RoleList: any;
  AddBranchInwardForm: FormGroup;
  BatchCloseForm: FormGroup;
  CrownCloseForm: FormGroup;
  submitted = false;
  Reset = false;
  Isreadonly = false;
  //_UserList: any;
  sMsg: string = "";
  //RoleList: any;
  _DocumentType = "";
  _message = "";
  _UserID: any;
  document_typeList: any;
  _IndexPendingList:any;
  documentStatusList: any;
  documentftnr: any;
  documentftnr1: any[] = [];
  User: any;
  first = 0;
  rows = 10;
  class: any;
  myFiles: string[] = [];
  _IndexList: any;
  _FileDetails: string[][] = [];
  FileUPloadForm: any;
  httpService: any;
  isDisabled: boolean;
  document_typeLists: any;
  remarkDisable : boolean;
  //headerList_Crown:any;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private _onlineExamService: OnlineExamServiceService,
    private _global: Globalconstants,
    public toastr: ToastrService,
    private router : Router,
    //private location:Location
  ) { }
  ngOnInit() {

    this.AddBranchInwardForm = this.formBuilder.group({
      BatchNo: [''],
      LANNo: localStorage.getItem('HealthCheckBatch'),
      File_No: [''],
      vault_file_barcode : ['', Validators.required],
      CartonNo: [''],
      ID:[''],
      awb_no: [''],
      Status: [''],
      DocumentType: [''],
      Product: [''],
      Month: [''],
      Customer_Name: [],
      DocumentStatus: [''],
      DocumentFTNR: [''],
      DocumentFTNRList: [''],
      DocumentFTNRList1: [''],
      remark: [''],
      User_Token: localStorage.getItem('User_Token'),
      CreatedBy: localStorage.getItem('UserID'),
      UserId: localStorage.getItem('UserID'),
    });

   

  
    
    //this.GetBatchDetails();
    //this.getAppackDetails();
    this.GetCrownAuditDetails();
    //this.getAuditorDetails()
    //this.GetMatchingAuditDetails();
    
    this.isDisabled = false;
    
  }



  getAuditorDetails() {

    const apiUrl = this._global.baseAPIUrl + 'HealthCheck/GetAuditorUserHealthCheckDetails?lan_no=' + localStorage.getItem('searchLan') + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&batch_no='+localStorage.getItem('searchBatch');
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  this._FilteredList = data;
     
      this.prepareTableData(data, data);
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
  headerList_AUDITOR: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
   
    let tableHeaderCrownRemark: any = [
      { field: 'srNo', header: "SR NO", index: 1 }, 
      { field: 'DocumentRemark1', header: 'CATEGORY 1', index: 3 },
      { field: 'DocumentRemark2', header: 'CATEGORY 2', index: 4 }, 
      {field : 'DocumentRemark3',header :'CATEGORY 3',index:5},
      {field : 'M1Remark',header :'AUDITOR REMARK',index:7},
    
    ];
console.log("My Table Data",tableData)
    tableData.forEach((el, index) => {
      formattedData.push({
        'srNo': parseInt(index + 1),
        // 'LANNo':el.LANNo,
        // 'BatchNo':el.BatchNo,
        'DocumentRemark1': el.DocumentFTNR,
        'DocumentRemark2': el.DocumentFTNRList,
        'DocumentRemark3': el.DocumentFTNRList1,
        'DocumentStatus':el.health_status,
        'remark': el.remark,
        'ID':el.ID,
        'M1VAL':el.M2_VAL,
        "M1Remark": el.M2_Remark, 
        'CheckListID':el.checkList_id,
        'CheckListID2':el.checkList_id2,
        'checklist3':el.checkList_id3,
        
        'LANNo':el.lan_no,
        
        
      });
      this.AddBranchInwardForm.controls['DocumentStatus'].setValue(el.DocumentStatus);
    });
    this.headerList_AUDITOR = tableHeaderCrownRemark;
    //}
   
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }


  
  searchTable($event) {
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

  searchTable1($event) {
    let val = $event.target.value;
 if (val == '') {
   this.CrownTableFormattedData = this.rownTableImmutableFormattedData;
 } else {
   let filteredArr = [];
   const strArr = val.split(',');
   this.CrownTableFormattedData = this.rownTableImmutableFormattedData.filter(function (d) {
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
   this.CrownTableFormattedData = filteredArr;
 }
}



  async CrownHealthCheck(template: TemplateRef<any>, row: any) {

    this.User ="Edit user details";
    console.log("this is the Crown row data",row);
    this.modalRef = this.modalService.show(template);    

    this.CrownCloseForm.patchValue({
      DocumentFTNRList: row.DocumentRemark1,
      DocumentFTNRList1: row.DocumentRemark2,
      CheckListID: row.CheckListID,
      CheckListID2: row.CheckListID2,
      checklist3: row.checkList_id3,
      remark:row.M2Remark,
      LANNo:row.LANNo,
      ID:row.ID

    })
    const checkdata=row.checklist3.split(',').map(Number);
    this.isDisabled = true;
      const apiUrl = this._global.baseAPIUrl + 'CheckList/GetCheckListDetails?User_Token=' + localStorage.getItem('User_Token');
      this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
        this.documentftnr1 = data.filter(x => x.parentId === Number(row.CheckListID2))
        console.log("FTNR", this.documentftnr1)
        const filteredData = data.filter(item => checkdata.includes(item.ID));

        this.CrownCloseForm.controls['checklist_3'].setValue(filteredData)
        console.log(filteredData)
      });
    
  
    
    


  }

  GetCrownAuditDetails() {  

   // HealthCheck/GetCrownUserHealthCheckDetails?lan_no=38959&UserID=1&user_Token=99B53526-62D6-49DA-82B3-A4FA7&batch_no=B1000215

   //https://nacdart.crownims.com/NACAPI/api/FinplexFileInward/GetRemarkDetails?UserID=705&user_Token=0F1F69FB-2677-43DE-8F04-3E9FE&Loan_Id=100
    const apiUrl = this._global.baseAPIUrl + 'FinplexFileInward/GetRemarkDetails?Loan_Id=' + localStorage.getItem('searchLan') + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&batch_no='+localStorage.getItem('searchBatch')
    this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {

      this._FilteredList = data;
     console.log("dataasdsda",data);
      this.CrownTableData(data, data);

    });
  }

  CrownTableFormattedData: any = [];
  CrownTableHeaderList: any;
  rownTableImmutableFormattedData: any;
  CrwTblLoading: boolean = true;

  CrownTableData(tableData, CrownTableHeaderList) {
    let CrownTableFormattedData = [];
   
    let tableHeader: any = [
      { field: 'srNo', header: "SR NO", index: 1 },
      { field: 'LANNo', header: 'Load ID', index: 3 },
      { field: 'ProductName', header: 'Product Name', index: 4 }, 
      { field: 'Loan_App_Form_Argmnt', header: 'Loan App Form', index: 5 },
      { field: 'Sanction_letter', header: 'Sanction letter', index: 5 },
      { field: 'KYC_document', header: 'KYC Document', index: 5 },
      { field: 'DPN', header: 'DPN', index: 5 },
      { field: 'JLG_Availibility', header: 'JLG Availibility', index: 5 },
      { field: 'APP_Co_APP_Sign', header: 'APP Co-APP Sign', index: 5 },
      { field: 'Northern_Arc_Osv', header: 'Northern Arc Osv', index: 6 },
      {field : 'Checklist_Remark',header :'Remark',index:7},   
    
    ];

    tableData.forEach((el, index) => {
      CrownTableFormattedData.push({
        'srNo': parseInt(index + 1),
        'Checklist_Remark': el.Checklist_Remark,
        'Loan_App_Form_Argmnt': el.Loan_App_Form_Argmnt,
        'Sanction_letter': el.Sanction_letter,
        'KYC_document': el.KYC_document,
        'DPN': el.DPN,
        'JLG_Availibility': el.JLG_Availibility,
        'APP_Co_APP_Sign': el.APP_Co_APP_Sign,
        'Northern_Arc_Osv': el.Northern_Arc_Osv,
        'ProductName':el.ProductName,
        'LANNo':el.Loan_Id
        
      });
      this.AddBranchInwardForm.controls['DocumentStatus'].setValue(el.DocumentStatus)

    });
    this.CrownTableHeaderList = tableHeader;
    //}
   
    this.rownTableImmutableFormattedData = JSON.parse(JSON.stringify(CrownTableFormattedData));
    this.CrownTableFormattedData = CrownTableFormattedData;
    this.CrwTblLoading = false;
    //console.log("CrownTableFormattedData",this.CrownTableFormattedData);
    

  }
  
 

  onBack(){
   
    this.router.navigateByUrl('/search/quick-search');
  }
 






}
