import { Inject, Injectable } from '@angular/core';
//import { Workbook } from 'exceljs';
const ExcelJS = require('exceljs/dist/es5');
const fs = require('file-saver');
const async = require("async");
import { CoreService } from './core.service';
import * as XLSX from "xlsx";
import { HttpClient } from "@angular/common/http";
//import { DatePipe } from '../../node_modules/@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(
    private _coreService: CoreService,
    @Inject(HttpClient) private httpClient: HttpClient,
  ) {
  }
  generateExcel(periodId:any) {

    //Excel Title, Header, Data
    const titleShift = 'Ca làm việc';
    let header: any[] = [];
    let data: any[] = [];
    let headerShift = ["Id", "Mã", "Tên"];
    let dataShift: any[] = []
    async.waterfall([
      (cb: any) => {
        let lstHeader = ["TenantId","PeriodId","EmployeeId","Code", "Tên", "Phòng ban", "Chức danh"];
        var dt = new Date();
        var month = dt.getMonth() + 1;
        var year = dt.getFullYear();
        var daysInMonth = new Date(year, month, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          let str = "Day" + i;
          lstHeader.push(str)
          
        }
        header = lstHeader
        return cb();
      },
      (cb1: any) => {
        this._coreService.Get("hr/Employee/GetListEmpToImport").subscribe((res: any) => {
          if (res.statusCode == "200") {
            let dataApi = res.data;
            dataApi.map((item: any) => {
              item.periodId = periodId;
              data.push(Object.values(item));
            })
          }
          return cb1();
        })

      }
      ,
      (cb2: any) => {
        this._coreService.Get("hr/Shift/GetListToImport").subscribe((res: any) => {
          if (res.statusCode == "200") {
            let dataApi = res.data;
            dataApi.map((item: any) => {
              
              dataShift.push(Object.values(item));
            })
          }
          return cb2();
        })

      }
    ], () => {
      //Create workbook and worksheet
      let workbook = new ExcelJS.workbook();
      let worksheetTimeSort = workbook.addWorksheet('Time Sort');
      let worksheetShift = workbook.addWorksheet('Shift');
      //Add Row and formatting
      let titleRowShift = worksheetShift.addRow([titleShift]);
      titleRowShift.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }
      worksheetShift.addRow([]);
      // let subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')])
      //Add Image
      // let logo = workbook.addImage({
      //   base64: logoFile.logoBase64,
      //   extension: 'png',
      // });
      // worksheet.addImage(logo, 'E1:F3');
      // worksheet.mergeCells('A1:D2');
      //Blank Row 
      worksheetShift.addRow([]);
      //Add Header Row
      let headerRow = worksheetTimeSort.addRow(header);
      let headerRowShift = worksheetShift.addRow(headerShift);

      // Cell Style : Fill and Border
      headerRow.eachCell((cell: any, number: any) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' },
          bgColor: { argb: 'FF0000FF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      headerRowShift.eachCell((cell: any, number: any) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' },
          bgColor: { argb: 'FF0000FF' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      // worksheet.addRows(data);
      // Add Data and Conditional Formatting
      data.forEach(d => {
        let row = worksheetTimeSort.addRow(d);
        // let qty = row.getCell(5);
        // let color = 'FF99FF99';
        // if (+qty.value < 500) {
        //   color = 'FF9999'
        // }
        // qty.fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor: { argb: color }
        // }
      }
      );
      dataShift.forEach(d => {
        let row = worksheetShift.addRow(d);
        // }
      }
      );
      worksheetTimeSort.getColumn(4).width = 30;
      worksheetTimeSort.getColumn(5).width = 30;
      worksheetTimeSort.getColumn(6).width = 30;
      worksheetTimeSort.getColumn(7).width = 30;
      worksheetShift.getColumn(1).width = 10;
      worksheetShift.getColumn(2).width = 20;
      worksheetShift.getColumn(3).width = 40;
      worksheetTimeSort.addRow([]);
     
      //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data: any) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'TimeSort.xlsx');
      })
    })


  }
  async generateExcelProfile() {
   
   this.httpClient.get('./assets/template/ImportProfile.xlsx', { responseType: 'blob' }).subscribe(data => {
    //this.readFile(data);
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(data);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: "binary" });

      //Generate Excel File with given name
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'ImportProfile.xlsx');
      
      };
  },
    error => {
      
    })
    //Excel Title, Header, Data
    const titleShift = 'Hồ sơ nhân viên';
    let headerlst = ["ID","Mã", "Tên"];
    let data = [];
    let lstPosition = []; // chức danh
    let lstOrg = []; // phòng ban
    let lstNationality = []; // quốc tịch
    let lstNation = [] // dân tộc
    let lstReligion = []; // tôn giáo
    let lstGender = [];
    let lstWorkStatus = [];
    let lstProvince = [];
    let lstCurProvince = [];
    let lstMaritalStatus = [];
    let lstEmpSituation = [];
    let lstTrainingForm = [];
    let lstLearningLevel = [];
    let lstBank = [];
    let lstResident = [];
    // Promise.all([
    //   this.getOrg(), // 0
    //   this.getPosition(), //1
    //   this.getGender(), //2
    //   this.getNation(), //3
    //   this.getNationality(), //4
    //   this.getReligion(), //5
    //   this.getListStatusEmp(), //6
    //   this.getProvince(), //7
    //   this.getListFamilyStatus(), //8
    //   this.getEmpSituation(),
    //   this.getlstTrainingFormId(),
    //   this.GetListLearningLevel(),
    //   this.getlstBankId(),
    //   this.getlstResident()
    // ]).then((res: any) => {
    //   lstOrg = res[0];
    //   lstPosition = res[1];
    //   lstGender = res[2];
    //   lstNation = res[3];
    //   lstNationality = res[4];
    //   lstReligion = res[5];
    //   lstWorkStatus = res[6];
    //   lstProvince = res[7];
    //   lstCurProvince = res[7];
    //   lstMaritalStatus = res[8];
    //   lstEmpSituation = res[9];
    //   lstTrainingForm = res[10];
    //   lstLearningLevel = res[11];
    //   lstBank = res[12];
    //   lstResident =  res[13];
     
    // });
  }

  getGender() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GENDER").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getOrg() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Organization/GetList").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getEmpSituation() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/EmpSituation").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getNation() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/NATION").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getNationality() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/NATIONALITY").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getReligion() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/RELIGION").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getListFamilyStatus() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListFamilyStatus")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getListStatusEmp() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/STATUSEMPLOYEE").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getPosition() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/GetList").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getProvince() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/province/getListProvince").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstTrainingFormId() {
    //hình thức đào tạo
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListTrainingForm")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  GetListLearningLevel() {
    //trình độ học vấn
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListLearningLevel")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstBankId() {
    //hình thức đào tạo
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/bank/GetList")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstResident() {
    //đối tượng thường trú
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetResident")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
}