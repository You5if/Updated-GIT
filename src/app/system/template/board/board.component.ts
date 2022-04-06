
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/components/common/common.service';
import { UIService } from 'src/app/components/shared/uiservices/UI.service';
import { MessageBoxService } from 'src/app/components/messagebox/message-box.service';
import { AuthService } from 'src/app/components/security/auth/auth.service';
import { BoardTEntryComponent } from './board-entry/board-entry.component';
import { BoardModel } from './board.model';
import { RightModel } from 'src/app/components/security/auth/rights.model';
import { RouterModule, Routes } from '@angular/router';
import { PageSortComponent } from 'src/app/components/common/pageevents/page-sort/page-sort.component';
import { BoardService } from './board.service';
import { SelectModel } from 'src/app/components/misc/SelectModel';
import { SelectService } from 'src/app/components/common/select.service';
import { AppGlobals } from 'src/app/app.global';
import { Send } from 'src/app/send.model';

import { SystemNavigationComponent } from '../../system-navigation/system-navigation.component';
import { TemplateService } from '../template.service';

import { Direction } from '@angular/cdk/bidi';

@Component({
    selector: 'app-board2',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
  })

export class BoardTComponent implements OnInit {

    displayedColumns: string[] =
        ['boardId'];
    boards: BoardModel[]

        // boards: BoardModel[] = [{
        //   boardId: 0,
        //    boardName: "Hilali",
        //    remarks: "string",
        //    aPIImagePath: "string",
        //    aPIPath: "string",
        //    extension: "string",
        //    fileName: "string",
        //    fullPath: "string",
        //    originalFileName: "string",
        //    workspaceId: 0,
        //    active: true,
        //    entryMode: "string",
        //    readOnly: true,
        //    auditColumns: "any",
        // },{
        //   boardId: 1,
        //    boardName: "GIT",
        //    remarks: "string",
        //    aPIImagePath: "string",
        //    aPIPath: "string",
        //    extension: "string",
        //    fileName: "string",
        //    fullPath: "string",
        //    originalFileName: "string",
        //    workspaceId: 0,
        //    active: true,
        //    entryMode: "string",
        //    readOnly: true,
        //    auditColumns: "any",
        // },{
        //   boardId: 2,
        //    boardName: "LMS",
        //    remarks: "string",
        //    aPIImagePath: "string",
        //    aPIPath: "string",
        //    extension: "string",
        //    fileName: "string",
        //    fullPath: "string",
        //    originalFileName: "string",
        //    workspaceId: 0,
        //    active: true,
        //    entryMode: "string",
        //    readOnly: true,
        //    auditColumns: "any",
        // },{
        //   boardId: 3,
        //    boardName: "GG",
        //    remarks: "string",
        //    aPIImagePath: "string",
        //    aPIPath: "string",
        //    extension: "string",
        //    fileName: "string",
        //    fullPath: "string",
        //    originalFileName: "string",
        //    workspaceId: 0,
        //    active: true,
        //    entryMode: "string",
        //    readOnly: true,
        //    auditColumns: "any",
        // }]
        model: Send;
  edit: string;
  header:string
  submit: string;
  product:string;
  cancel: string;
  direction: Direction;
  workId: number
    dataSource: any;
    isLastPage = false;
    pTableName: string;
    pScreenId: number;
    pTableId: number;
    recordsPerPage: number;
    currentPageIndex: number;
    menuId: number;
    breakpoint: number

    totalRecords: number;
    pageSizeOptions: number[] = [5, 10, 25, 100];

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
        private _cf: CommonService,
        private _globals: AppGlobals,
        private _ui: UIService,
        public _nav: SystemNavigationComponent,
        private _msg: MessageBoxService,
        
        private _auth: AuthService,
        private _select: SelectService,
        private boardservice: BoardService
      ) {
        this.pTableName = 'BoardTemplate';
        this.pScreenId = 83;
        this.pTableId = 83;
        this.recordsPerPage = 10;
        this.currentPageIndex = 1;
        this.menuId = 1019106011;
      }

  ngOnInit() {
    this._ui.loadingStateChanged.next(true);
    // this.dapiService.getWorkspaceEntry(Number(localStorage.getItem(this._globals.baseAppName + '_workspaceId'))).subscribe(res => {
    //   this._ui.loadingStateChanged.next(false);
    //   this.header = res.workspacename
    //   this.workId = res.workspaceId
    // })
      this.refreshMe();
  }

  refreshMe() {
    this.breakpoint =
        window.innerWidth <= 960
          ? 2
          : 4;
    if(localStorage.getItem(this._globals.baseAppName + '_language') == "16001") {
      this.direction = "ltr"
      this.header = "Template"
      this.edit = "Edit"
      this.submit = "Submit"
      this.cancel = "Cancel"
    }else if(localStorage.getItem(this._globals.baseAppName + '_language') == "16002") {
      this.direction = "rtl"
      this.header = "عينات"
      this.edit = "تعديل"
      this.submit = "ارسال"
      this.cancel = "الغاء"
    }
    
    // this._cf.getPageData('BoardTemplate', this.pScreenId, this._auth.getUserId(), this.pTableId,
    //   this.recordsPerPage, this.currentPageIndex, false).subscribe(
    //     (result) => {
    //       this._ui.loadingStateChanged.next(false);
    //   this.boards = result
    //   console.log(result);
    //     }
    //   );
    this._ui.loadingStateChanged.next(true);
    this.boardservice.getBoardsEntry().subscribe((result) => {
      this._ui.loadingStateChanged.next(false);
      this.boards = result
      console.log(result);
    })

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

  onSort () {
    const dialogRef = this.dialog.open(PageSortComponent, {
      disableClose: true,
      data: this.pTableId
    });
  };

  onBoardState(id: number) {
    localStorage.setItem(this._globals.baseAppName + '_boardTId', id.toString())
    this._nav.onClickListItem('BS2');
  }
  onAdd () {
    this.model = {
      tableId: 83,
      recordId: 0,
      userId: 26,
      roleId: 2,
      languageId: Number(localStorage.getItem(this._globals.baseAppName + '_language'))
    };
    if(localStorage.getItem(this._globals.baseAppName + '_language') == "16001") {
      localStorage.setItem(this._globals.baseAppName + '_Add&Edit', "Add board");
    }else if(localStorage.getItem(this._globals.baseAppName + '_language') == "16002") {
      localStorage.setItem(this._globals.baseAppName + '_Add&Edit', "اضافة لوحة");
    }
    
    this.openEntry2(this.model);
  };

  // onView = (id: number) => {
  //   this._ui.loadingStateChanged.next(true);
  //   this.boardservice.getBoardEntry().subscribe((result: BoardModel) => {
  //     this._ui.loadingStateChanged.next(false);
  //     result.entryMode = 'V';
  //     result.readOnly = true;
  //     this.openEntry(result);
  //   });
  // }

  onEdit = (id: number) => {
    // this._ui.loadingStateChanged.next(true);
    // this.boardservice.getBoardEntry(id).subscribe((result: WorkspaceModel) => {
    //   this._ui.loadingStateChanged.next(false);
    //   result.entryMode = 'E';
    //   result.readOnly = false;
    //   this.openEntry(result);
    // });
  }

  onDelete = function(id: number) {
      
  };

  openEntry (result: BoardModel) {
    if (result === undefined) {
      const dialogRef = this.dialog.open(BoardTEntryComponent, {
        disableClose: true,
       data: {}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.refreshMe();
      });
    } else {
      const dialogRef = this.dialog.open(BoardTEntryComponent, {
        disableClose: false,
        data: result
     });
      dialogRef.afterClosed().subscribe(() => {
        this.refreshMe();
      });
    }
  };
  openEntry2 (result: Send) {
    if (result === undefined) {
      const dialogRef = this.dialog.open(BoardTEntryComponent, {
        disableClose: true,
       data: {}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.refreshMe();
      });
    } else {
      const dialogRef = this.dialog.open(BoardTEntryComponent, {
        disableClose: true,
        
        data: result
     });
      dialogRef.afterClosed().subscribe(() => {
        this.refreshMe();
      });
    }
  };

  onResize(event:any) {
    
    this.breakpoint =
      event.target.innerWidth <= 960
        ? 2
        : 4;
  }

  onCancel() {
    this._nav.onClickListItem('WS');
  }

}
