
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/components/common/common.service';
import { UIService } from 'src/app/components/shared/uiservices/UI.service';
import { MessageBoxService } from 'src/app/components/messagebox/message-box.service';
import { AuthService } from 'src/app/components/security/auth/auth.service';
import { BrdMemberModel, BrdStateModel, CardModel } from './brdstate.model';
import { RightModel } from 'src/app/components/security/auth/rights.model';
import { RouterModule, Routes } from '@angular/router';
import { PageSortComponent } from 'src/app/components/common/pageevents/page-sort/page-sort.component';
import { BrdStateService } from './brdstate.service';
import { SelectModel } from 'src/app/components/misc/SelectModel';
import { SelectService } from 'src/app/components/common/select.service';
import { AppGlobals } from 'src/app/app.global';
import { SystemNavigationComponent } from '../../system-navigation/system-navigation.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { DatePipe, formatDate } from '@angular/common';
import { AlertifyService } from 'src/app/alertify.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { Direction } from '@angular/cdk/bidi';

@Component({
    selector: 'app-brdstate2',
    templateUrl: './brdstate.component.html',
    styleUrls: ['./brdstate.component.scss']
  })

export class BrdStateTComponent implements OnInit {

    displayedColumns: string[] =
        ['brdStateId', 'edit', 'delete', 'view'];

    dataSource: any;
    isLastPage = false;
    pTableName: string;
    pScreenId: number;
    pTableId: number;
    recordsPerPage: number;
    currentPageIndex: number;
    menuId: number;

    dragState: boolean = false

    Add:boolean
    AddC:boolean = true
    showStateName:boolean = true

    res: any
    listName: string = ""
    lastState: BrdStateModel = {
      stateTemplateId: 0,
      stateName: "",
      orderNo: 0,
      comment: "",
      showStateName: true,
      AddC: true,
      cardArray: [],
      boardTemplateId: Number(localStorage.getItem(this._globals.baseAppName + '_boardTId')),
      entryMode: 'A',
      active: true,
      readOnly: true,
      auditColumns: {
        approvalStatusId: 1100001,
        companyId: 10001,
        branchId: 201,
        financialYearId: 1,
        userId: 1,
        mACAddress: "unidentified",
        hostName: "unidentified",
        iPAddress: "unidentified",
        deviceType: "Win32"
      },
    }

    lastCard: CardModel = {
      cardTemplateId: 0,
      title: "",
      description: "",
      aPIImagePath: "",
      aPIPath: "",
      extension: "",
      fileName: "",
      fullPath: "",
      originalFileName: "",
      startDate: null,
      endDate: null,
      boardTemplateId: Number(localStorage.getItem(this._globals.baseAppName + '_boardTId')),
      stateTemplateId: 0,
      orderNo: 0,
      totalChecklist: 0,
      checkCompl: 0,
      attachNo: 0,
      active: true,
      entryMode: 'A',
      readOnly: true,
      auditColumns: {
        approvalStatusId: 1100001,
        companyId: 10001,
        branchId: 201,
        financialYearId: 1,
        userId: 1,
        mACAddress: "unidentified",
        hostName: "unidentified",
        iPAddress: "unidentified",
        deviceType: "Win32"
      },
    }
    direction: Direction;

    states: BrdStateModel[]

    // states = [
    //   {
    //      brdStateId: 0,
    //      stateName: "One",
    //      stateOrder: 0,
    //      boardId: 0,
         
    //      entryMode: null,
    //      active: null,
    //      readOnly: null,
    //      auditColumns: null,
    //   },
    //   {
    //     brdStateId: 1,
    //     stateName: "Two",
    //     stateOrder: 1,
    //     boardId: 1,
        
    //     entryMode: null,
    //     active: null,
    //     readOnly: null,
    //     auditColumns: null,
    //  }
    // ]

    name: string

    role: string|null = localStorage.getItem('role');

    totalRecords: number;
    pageSizeOptions: number[] = [5, 10, 25, 100];

    todo = [
      'Get to work',
      'Pick up groceries',
      'Go home',
      'Fall asleep'
    ];
  
    done = [
      'Get up',
      'Brush teeth',
      'Take a shower',
      'Check e-mail',
      'Walk dog'
    ];
  
    members:string[] = ['richard rick' , 'alphonse dave' , 'kilin mbappe' , 'brock lesnae' , 'kane wills' , 'Mark angel' , 'astro boy']
    myDate: Date
   

    screenRights: RightModel = {
        amendFlag: true,
        createFlag: true,
        deleteFlag: true,
        editFlag: true,
        exportFlag: true,
        printFlag: true,
        reverseFlag: true,
        shortCloseFlag: true,
        viewFlag: true
      };

    constructor(
        public dialog: MatDialog,
        private datePipe: DatePipe,
        private _cf: CommonService,
        private _ui: UIService,
        private _msg: MessageBoxService,
        private _globals: AppGlobals,
        public _nav: SystemNavigationComponent,
        private alertify: AlertifyService,
        private _auth: AuthService,
        private _select: SelectService,
        private brdstateservice: BrdStateService,
        private dialogRef: MatDialogRef<BrdStateTComponent>,
      ) {
        this.pTableName = 'StateTemplate';
        this.pScreenId = 72;
        this.pTableId = 72;
        this.recordsPerPage = 10;
        this.currentPageIndex = 1;
        this.menuId = 1019106011;
      }

  ngOnInit() {
    this.Add = true
    
      this.refreshMe();
      this._ui.loadingStateChanged.next(true);
      this.brdstateservice.getBoardEntry(Number(localStorage.getItem(this._globals.baseAppName + '_boardTId'))).subscribe((res) =>{
        this._ui.loadingStateChanged.next(false);
        this.name = res.tempName
      })
  }

  refreshMe() {
    // this._cf.getPageData('BrdState', this.pScreenId, this._auth.getUserId(), this.pTableId,
    //   this.recordsPerPage, this.currentPageIndex, false).subscribe(
    //     (result) => {
    //       this.totalRecords = result[0].totalRecords;
    //       this.recordsPerPage = this.recordsPerPage;
    //       this.dataSource = new MatTableDataSource(result);
    //       this.states = result
    //       console.log(result);
          
    //     }
    //   );
    this.brdstateservice.getBoardStateEntry(Number(localStorage.getItem(this._globals.baseAppName + '_boardTId'))).subscribe((result1) => {
      this.states = result1
      this.states.forEach((brdSt) => {
        brdSt.AddC = true
        brdSt.auditColumns = {
          approvalStatusId: 1100001,
          companyId: 10001,
          branchId: 201,
          financialYearId: 1,
          userId: 1,
          mACAddress: "unidentified",
          hostName: "unidentified",
          iPAddress: "unidentified",
          deviceType: "Win32"
        }
        brdSt.showStateName = true
        brdSt.cardArray = []
      })
      this.states.sort(function(a:any, b:any) { 
        return a.orderNo - b.orderNo  ||  a.title.localeCompare(b.title);
      });
      this.brdstateservice.getCards(Number(localStorage.getItem(this._globals.baseAppName + '_boardTId'))).subscribe((result2) => {
      this.states.forEach((brdSt) => {
          console.log(result2);
            result2.forEach((r) => {
              r.auditColumns = {
                approvalStatusId: 1100001,
                companyId: 10001,
                branchId: 201,
                financialYearId: 1,
                userId: 1,
                mACAddress: "unidentified",
                hostName: "unidentified",
                iPAddress: "unidentified",
                deviceType: "Win32"
              }
              if (r.stateTemplateId == brdSt.stateTemplateId) {
                brdSt.cardArray.push(r)
              }
            })
          
          console.log(this.states);
        })
        this.states.forEach((brdSt) => {
          
            brdSt.cardArray.sort(function(a:any, b:any) { 
              return a.orderNo - b.orderNo  ||  a.title.localeCompare(b.title);
            });
          })
          
      })
      // console.log(result);
    })
    

    // this.brdstateservice.getMembers(+localStorage.getItem(this._globals.baseAppName + '_boardId')).subscribe((result) => {
    //   this.members = result
    // })



      

    this._auth.getScreenRights(this.menuId).subscribe((rights: RightModel) => {
      this.screenRights = {
        amendFlag: true,
        createFlag: true,
        deleteFlag: true,
        editFlag: true,
        exportFlag: true,
        printFlag: true,
        reverseFlag: true,
        shortCloseFlag: true,
        viewFlag: true
      };
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // onNewEditState(state: BrdStateModel) {
  //   this.brdstateservice.editState(state).subscribe((res:any) => {
  //   })
  //   this.states.forEach((brdSt) => {
       
  //     brdSt.showStateName = true
   
  // })
  // }

  paginatoryOperation(event: PageEvent) {
    try {
      this._cf.getPageDataOnPaginatorOperation(event, this.pTableName, this.pScreenId, this._auth.getUserId(),
        this.pTableId, this.totalRecords).subscribe(
          (result: any) => {
            this._ui.loadingStateChanged.next(false);
            this.totalRecords = result[0].totalRecords;
            this.recordsPerPage = event.pageSize;
            this.dataSource = result;
          }, error => {
            this._ui.loadingStateChanged.next(false);
            this._msg.showAPIError(error);
            return false;
          });
    } catch (error:any) {
      this._ui.loadingStateChanged.next(false);
      this._msg.showAPIError(error);
      return false;
    }
  }

  onDragState () {
    this.dragState = !this.dragState
  }

  dropColumns(event: CdkDragDrop<string[]>) {
    console.log(event.previousIndex, event.currentIndex);
    moveItemInArray(this.states, event.previousIndex, event.currentIndex);
    this.alertify.success('State moved')
    var num = 0
    this.states.forEach((brdSt) => {
      brdSt.orderNo = num
      brdSt.auditColumns =  {
        approvalStatusId: 1100001,
        companyId: 10001,
        branchId: 201,
        financialYearId: 1,
        userId: 1,
        mACAddress: "unidentified",
        hostName: "unidentified",
        iPAddress: "unidentified",
        deviceType: "Win32"
      }     
      num ++
      console.log(JSON.stringify(brdSt));
      this.brdstateservice.editState(brdSt).subscribe(nextoU => {
        
        console.log(nextoU);
        
      })
      console.log(this.states);
      
      })

  }

 
  drop(event: CdkDragDrop<CardModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.states.forEach((brdSt) => {
        var num = 0
        brdSt.cardArray.forEach((cArray) => {
          cArray.stateTemplateId = brdSt.stateTemplateId
          cArray.orderNo = num
          num ++
          this.brdstateservice.CardE(cArray).subscribe(nextoU => {
            console.log(nextoU);
            
          })
        })
        })
  
        console.log(this.states);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
                        this.states.forEach((brdSt) => {
                          var num = 0
                          brdSt.cardArray.forEach((cArray) => {
                            cArray.stateTemplateId = brdSt.stateTemplateId
                            cArray.orderNo = num
                            num ++
                            this.brdstateservice.CardE(cArray).subscribe(nextoU => {
                              console.log(nextoU);
                              
                            })
                          })
                          })
                    
                          console.log(this.states);


    }
    this.alertify.success('Card moved')

    // this.brdstateservice.getCards(+localStorage.getItem(this._globals.baseAppName + '_boardId')).subscribe((result2) => {
    //   console.log(result2);
      
    // })

    
    // this.states[0].cardArray[5].title = "CA#"
    //       console.log(JSON.stringify(this.states[0].cardArray[5]));
          // this.brdstateservice.CardE(this.states[0].cardArray[5]).subscribe(nextoU => {
          //   this.res = nextoU;
            
            
          // })
    
      // this.refreshMe();
    
  }

  getInitials(nameString:string , i:number){
    const fullName:any = nameString.split(' ');
const initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
return initials.toUpperCase();
  }

  onAddN() {
    this.listName = ""
    this.Add = false
  }
  onAddC(id: number) {
    this.lastCard.title = ""
    this.states.forEach((brdSt) => {
      if (id === brdSt.stateTemplateId) {
        brdSt.AddC = false
      }else {
        brdSt.AddC = true
      }
    })
  }

  onCancelCard() {
    this.lastCard.title = ""
    this.states.forEach((brdSt) => {
      brdSt.AddC = true
    })
  }
  onCancelList() {
    this.listName = ""
    this.Add = true
  }

  onEditStateName(state: BrdStateModel) {
    console.log(state);
    
        state.showStateName = false
     
   
    
  }

  onNewEditState(state: BrdStateModel) {
    this.brdstateservice.editState(state).subscribe((res) => {
    })
    this.states.forEach((brdSt) => {
       
      brdSt.showStateName = true
   
  })
  }
  onCancelEditState(state: BrdStateModel) {
    this.states.forEach((brdSt) => {
       
      brdSt.showStateName = true
   
  })
  }

  onSaveCard(id: number) {
    this.states.forEach((brdSt) => {
      
        brdSt.AddC = true
      
    })
    this.lastCard.stateTemplateId = id
    this.lastCard.endDate = new Date()
    this.lastCard.startDate = new Date()
  
    this.states.forEach((brdSt) => {
      brdSt.AddC = true
            if (this.lastCard.stateTemplateId == brdSt.stateTemplateId) {
              this.lastCard.orderNo = brdSt.cardArray.length
              this.lastCard.orderNo = brdSt.cardArray.length
                brdSt.cardArray.push(this.lastCard)
              
            }
      })
      // this.states.forEach((brdSt) => {
      //   brdSt.AddC = true
        
          
      //         if (this.lastCard.brdStateId == brdSt.brdStateId) {
      //           this.lastCard.orderNo = brdSt.cardArray.length
      //           brdSt.cardArray.push(this.lastCard)
      //         }
         
          
      //     console.log(this.states);
      //   })
    this.brdstateservice.CardA(this.lastCard).subscribe(nexto => {
      this.res = nexto;
      this.alertify.success('Added card')
        
        // this.brdstateservice.getCards(+localStorage.getItem(this._globals.baseAppName + '_boardId')).subscribe((result2) => {
        

          this.lastCard = {
            cardTemplateId: 0,
            title: "",
            description: "",
            aPIImagePath: "",
            aPIPath: "",
            extension: "",
            fileName: "",
            fullPath: "",
            originalFileName: "",
            startDate: null,
            endDate: null,
            boardTemplateId: Number(localStorage.getItem(this._globals.baseAppName + '_boardTId')),
            stateTemplateId: 0,
            orderNo: 0,
            totalChecklist: 0,
            checkCompl: 0,
            attachNo: 0,
            active: true,
            entryMode: 'A',
            readOnly: true,
            auditColumns: {
              approvalStatusId: 1100001,
              companyId: 10001,
              branchId: 201,
              financialYearId: 1,
              userId: 1,
              mACAddress: "unidentified",
              hostName: "unidentified",
              iPAddress: "unidentified",
              deviceType: "Win32"
            },
          }
          this.refreshMe()
      
        // console.log(result);
      
    }, error => {
      console.log(error);
    });
    
  }

  onSave(){
    this.Add = true
    this.lastState.stateName = this.listName
    console.log(JSON.stringify(this.lastState));
    
    this.brdstateservice.EntryA(this.lastState).subscribe(nexto => {
      this.res = nexto;
      // this.states.push(this.lastState)
      this.refreshMe();
    //   if(localStorage.getItem(this._globals.baseAppName + '_language') == "16001") {
    //    this._msg.showInfo("Message", "saved succesfully");
    //  this.dialogRef.close();

    //  }else if(localStorage.getItem(this._globals.baseAppName + '_language') == "16002") {
    //    this._msg.showInfo("رسالة", "تم الحفظ بنجاح");
    //  this.dialogRef.close();
    //  }

    }, error => {
      console.log(error);
      this.refreshMe();
    //   if(localStorage.getItem(this._globals.baseAppName + '_language') == "16001") {
    //    this._msg.showInfo("Message", "Error!!");
    //  this.dialogRef.close();
    //  }else if(localStorage.getItem(this._globals.baseAppName + '_language') == "16002") {
    //    this._msg.showInfo("رسالة", "توجد مشكلة");
    //  this.dialogRef.close();
    //  }
    });
  }
  onSort () {
    const dialogRef = this.dialog.open(PageSortComponent, {
      disableClose: true,
      data: this.pTableId
    });
  };

  // onAdd () {
  //   const result: BrdStateModel = {
      
  //     'brdStateId': 0,
  //     'stateName': '',
  //     'AddC': true,
  //     'cardArray': null,
  //     'stateOrder': 0,
  //     'boardId': 0,
  //     'auditColumns': null,
  //     'entryMode': 'A',
  //     'active': true,
  //     'readOnly': false
  //   };
  //   this.openEntry(result);
  // };

  // onView = (id: number) => {
  //   this._ui.loadingStateChanged.next(true);
  //   this.brdstateservice.getBrdStateEntry(id).subscribe((result: BrdStateModel) => {
  //     this._ui.loadingStateChanged.next(false);
  //     result.entryMode = 'V';
  //     result.readOnly = true;
  //     this.openEntry(result);
  //   });
  // }

  // onEdit = (id: number) => {
  //   this._ui.loadingStateChanged.next(true);
  //   this.brdstateservice.getBrdStateEntry(id).subscribe((result: BrdStateModel) => {
  //     this._ui.loadingStateChanged.next(false);
  //     result.entryMode = 'E';
  //     result.readOnly = false;
  //     this.openEntry(result);
  //   });
  // }

  onDelete = function(id: number) {
      
  };

  // openEntry (result: BrdStateModel) {
  //   if (result === undefined) {
  //     const dialogRef = this.dialog.open(BrdStateEntryComponent, {
  //       disableClose: true,
  //       data: {}
  //     });
  //   } else {
  //     const dialogRef = this.dialog.open(BrdStateEntryComponent, {
  //       disableClose: false,
  //       data: result
  //     });
  //   }
  //   this.dialogRef.afterClosed().subscribe(() => {
  //     this.refreshMe();
  //   });
  // };
  onCancel() {
    this._nav.onClickListItem('WS2');
  }

}
