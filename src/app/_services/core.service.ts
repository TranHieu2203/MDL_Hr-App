// GLOBAL IMPORT
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  DataStateChangeEventArgs,
  Sorts,
  DataResult,
} from "@syncfusion/ej2-angular-grids";
import { Subject } from "rxjs";
import { catchError, map,last,tap,retry } from "rxjs/operators";
import { HttpClient as Http } from "@angular/common/http";
import { Globals } from "../common/globals";
import { ExtraParams } from "../_models/index";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { DataUtil } from "@syncfusion/ej2-data";
import * as XLSX from "xlsx";
const FileSaver = require("file-saver");
import * as moment from "moment";


const headers = new HttpHeaders({
  'Content-Type': 'application/json',
})
@Injectable()
export class CoreService extends Subject<DataStateChangeEventArgs> {
  public organization: Subject<any> = new Subject<any>();
  public isDisso: Subject<any> = new Subject<any>();
  public organizationSelect: Subject<any> = new Subject<any>();
  public isDissoChecked: Subject<any> = new Subject<any>();

  public mapSubject: Subject<any> = new Subject<any>();
  public reportSubject: Subject<any> = new Subject<any>();
  public reportExport: Subject<any> = new Subject<any>();
  ipAddress = "";
  public gridState!: any;
  constructor(
    @Inject(Http) private http: Http,
    @Inject(HttpClient) private httpClient: HttpClient,
    @Inject(Router) private router: Router,
    @Inject(Globals) private globals: Globals
  ) {
    super();
  }
  // Http client
  Get(url: string): any {
    const url_request = this.globals.apiURL + url;
    return this.httpClient.get(url_request);
  }

  GetOther(url: string): any {
    return this.httpClient.get(url);
  }

  Post(url: string, option: any): any {
    const url_request = this.globals.apiURL + url;
    return this.httpClient.post(url_request, option);
  }
  

  // GetNavigationPermision

  GetNavigationPermision(): Observable<any> {
    return this.httpClient.get(this.globals.apiURL + 'author/userpermission/GetPermisionFunction?lang=' + this.globals.currentLang)
      .pipe(map((resp: any) => resp),
        catchError(error => this.throwError(error))
      )
  }
  throwError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }



  //node service
  GetNode(url: string): any {
    const url_request = this.globals.apiUrlNode + url;
    return this.httpClient.get(url_request);
  }
  PostNode(url: string, option: any): any {
    const url_request = this.globals.apiUrlNode + url;
    return this.httpClient.post(url_request, option);
  }

  public execute(state: any, url: string, extraParams?: Array<ExtraParams>): void {
    this.getAll(state, url, extraParams).subscribe((x) => super.next(x));
  }
  public execute1(state: any, url: string, extraParams?: Array<ExtraParams>): void {
    this.getAll(state, url, extraParams).subscribe((x) => super.next(x));
  }
  public executePage(
    state: any,
    url: string,
    extraParams?: Array<ExtraParams>
  ): void {
    this.GetAllPage(state, url, extraParams).subscribe((x) => super.next(x));
  }
  getAll = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    const url_request = this.globals.getCommonURLGetAll(
      state,
      url,
      extraParams
    );
    return this.httpClient
      .get(url_request)
      .pipe(
        map((res: any) => {
          return {
            result: res && res.data ? res.data : [],
            count: res && res.paging ? res.paging.totalRecordCount : 0,
          } as DataResult;
        })
      )
      .pipe((data: any) => {
        return data;
      });
  };

  // Export all page to export

  ExecuteToExport = (
    
    url: string,
    extraParams?: any,
    state?: DataStateChangeEventArgs
  ) => {
    
   state!.skip = 0 
   state!.take = 5000
    const url_request = this.globals.getCommonURLGetAll(
      state!,
      url,
      extraParams
    );

    //  const body = this.globals.getCommonBodyGetAll(state, extraParams);
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http
      .get(url_request, options)
      .pipe((data: any) => {

        return data;
      });
  };


  // Function GetAll
  GetAll = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    const url_request = this.globals.getCommonURLGetAll(
      state,
      url,
      extraParams
    );

    //  const body = this.globals.getCommonBodyGetAll(state, extraParams);
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http
      .get(url_request, options)
      // .pipe(map((response: any) => response.json()))
      .pipe(
        map((res: any) => {

          return {
            result: res && res.data ? res.data : [],
            count: res && res.paging ? res.paging : 0,
          } as DataResult;
        })
      )
      .pipe((data: any) => {
        return data;
      });
  };

  // Function GetAll
  GetAllPage = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    const url_request = this.globals.getCommonURLGetAll(
      state,
      url,
      extraParams
    );

    //  const body = this.globals.getCommonBodyGetAll(state, extraParams);
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http
      .get(url_request, options)
      .pipe(map((response: any) => response.json()))
      .pipe(
        map((res: any) => {

          return {
            result: res && res.data ? res.data.data : [],
            count: res && res.data.paging ? res.data.paging : 0,
          } as DataResult;
        })
      )
      .pipe((data: any) => {
        return data;
      });
  };

  /// Upload file
  uploadFile = (formData: any, folder: string): Observable<any> => {
    const url = this.globals.apiUrlFileManager.toString();
    return this.http.post(url, formData).pipe(
      map((response: any) => {
        return response.json();
      })
    );
  };

  uploadFileV2Hrm = (formData: any, _module: string, _function: string): Observable<any> => {
    const url = this.globals.apiUrlFileManager + "file/uploadv2" + "?module=" + _module + "&function=" + _function;
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };

  binaryImage = (formData: any, _module: string, _function: string,_filename: string): Observable<any> => {
    // const url = this.globals.apiUrlFileManager + "file/Binary-Image" + "?module=" + _module + "&function=" + _function + "&filename=" + _filename;
    // return this.http.get(url).pipe(
    //   map((response: any) => {

    //     return response;
    //   })
    // );
    const url = this.globals.apiUrlFileManager + "file/Binary-Image" + "?module=" + _module + "&function=" + _function +"&filename=" + _filename ;
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };
  commonGetFile(url: string) {
    url = this.globals.apiUrlFileManager.toString() + url;
    return this.http.get<any>(url, {
      headers: headers, observe: 'response', reportProgress: true, withCredentials: true,
    })
      .pipe(
        retry(1),
        
        map(response => response),

        /*===========================================================*/

        last(), // :void return last (completed) message to caller

      )
  }

  uploadFileToGroupV2Hrm = (formData: any, _module: string, _function: string, _group: string = ""): Observable<any> => {
    const url = this.globals.apiUrlFileManager + "file/uploadtogroupv2" + "?module=" + _module + "&function=" + _function + "&group=" + _group;
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };


  /// ReportDynamic
  reportDynamicV2Hrm = (formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + 'ReportDynamic/export-report-dynamic';
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };

  saveReportDynamicV2Hrm = (formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + 'ReportDynamic/save-report-dynamic';
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };
  getReportDynamicV2Hrm = (formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + 'ReportDynamic/get-report-dynamic';
    return this.http.post(url, formData).pipe(
      map((response: any) => {

        return response;
      })
    );
  };

  /// ReportWithConfig

  reportWithConfigsV2Hrm = (formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + 'ReportWithConfig/export-report';
    return this.http.post(url, formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  };
  /// ReportTemplate
  templateImportV2Hrm = (functionName: string, formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + 'ExportTemplate/' + functionName;
    return this.http.post(url, formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  };
  importTemplateV2Hrm = (controllerName: string, functionName: any, formData: any): Observable<any> => {
    const url = this.globals.apiUrlReport + controllerName + '/' + functionName;
    return this.http.post(url, formData).pipe(
      map((response: any) => {
        return response;
      })
    );
  };



  Upload = (url: any, formData: any): Observable<any> => {
    const url_request = this.globals.apiURL + url;
    return this.httpClient.post<any>(url_request, formData);
  };
  // Upload = (url: any, formData: any): Observable<any> => {
  //   return this.http.post(this.globals.apiURL +url, formData).pipe(
  //     map((response: any) => JSON.parse(response._body))
  //   );
  // };

  Download(url: string, option: any) {
    const url_request = this.globals.apiURL + url;
    return this.httpClient.post<Blob>(url_request, option, {
      observe: "response",
      responseType: "blob" as "json",
    });
  }

  acceptType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
  fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  fileExtension = ".xlsx";
  // export
  public exportExcel(jsonData: any[], fileName: string, header?: object): void {
    let worksheet: XLSX.WorkSheet;
    // ex headers: any = { Cust: 'Customer Name', Addr1: 'Address 1' };
    if (header) {
      //const headers: any = { EMPLOYEE_NAME: "Customer Name", EMPLOYEE_CODE: "Address 1" };
      jsonData.unshift(header);
      worksheet = XLSX.utils.json_to_sheet(jsonData, { skipHeader: true });
    } else {
      worksheet = XLSX.utils.json_to_sheet(jsonData);
    }
    const wb: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };
    const excelBuffer: any = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveExcelFile(
      excelBuffer,
      fileName + moment().format("MM-DD-YYYY_hh:mm:ss").toString()
    );
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }
  // import
  public readExcel(file: File): any {
    if (file) {
      return new Promise((resolve) => {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
          var workbook = XLSX.read(reader.result, { type: "binary", cellDates: true });
          var worksheet = workbook.Sheets[workbook.SheetNames[0]];
          var data = XLSX.utils.sheet_to_json(worksheet);
          resolve(data);
        };
      });
    }
  }
  // Function create Model
  Create = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    body = Object.assign(
      {
        ip_address: this.ipAddress || "101.99.13.167",
        channel_code: "W",
      },
      body
    );
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.post(url_request, body, options);
  };

  public getResult(response: any) {
    if (
      this.gridState.group !== undefined &&
      (this.gridState.action === undefined ||
        this.gridState.action.rows !== undefined)
    ) {
      let json = response;
      this.gridState.group.forEach((element: any) => {
        json = DataUtil.group(json, element);
      });
      return json;
    } else {
      return response;
    }
  }

  public processPlan(lstPlans: any) {
    if (lstPlans && lstPlans.length > 0) {
      for (let i = 0; i < lstPlans.length; i++) {
        if (lstPlans[i].childs && lstPlans[i].childs.length > 0) {
          for (let j = 0; j < lstPlans[i].childs.length; j++) {
            lstPlans[i].childs[j].sprint_name = lstPlans[i].childs[j].name;
            delete lstPlans[i].childs[j].name;
          }
        }
      }
    } else {
      lstPlans = [];
    }
    return lstPlans;
  }

  // Function update Model
  Update = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    body = Object.assign(
      {
        ip_address: this.ipAddress || "101.99.13.167",
        channel_code: "W",
      },
      body
    );
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.put(url_request, body, options);
  };

  // Function Delete Model
  Delete = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    body = Object.assign(
      {
        ip_address: this.ipAddress || "101.99.13.167",
        channel_code: "W",
      },
      body
    );
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.put(url_request, body, options);
  };

  // SERVICE POST
  post = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);
    return this.http
      .post(url_request, body, options)
      .pipe(map((response: any) => JSON.parse(response._body)));
  };

  // SERVICE PUT
  Put = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    body = Object.assign(
      {
        ip_address: this.ipAddress || "101.99.13.167",
        channel_code: "W",
      },
      body
    );
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.put(url_request, body, options);
  };

  // SERVICE DEL
  Del = (url: string, body: any) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request, body);

    return this.http.delete(url_request, options);
  };

  // SERVICE GET
  get = (url: string) => {
    const url_request = this.globals.apiURL + url;
    const options = this.globals.getCommonOptionsWithAuth(url_request);

    return this.http
      .get(url_request, options)
      .pipe(map((response: any) => response.json()));
  };

  // SERVICE GET
  GetOtherUrl = (url: string) => {
    const url_request = url;
    const options = this.globals.getCommonOptions(url_request);

    return this.http
      .get(url_request, options)
      .pipe(map((response: any) => response.json()));
  };

  uploadImage = (file: any): Observable<any> => {
    const url_request = this.globals.imgurReq.url;
    const body = {
      image: file,
    };

    const options = this.globals.getCommonOptionImage(url_request, body);

    return this.http
      .post(url_request, body, options)
      .pipe(map((response: any) => response.json()));
  };

  // Function GetAll Non Paging
  GetAllNonePaging = (
    state: DataStateChangeEventArgs,
    url: string,
    extraParams?: any
  ): Observable<DataStateChangeEventArgs> => {
    const url_request = this.globals.getCommonURLGetAll(state, url);

    const options = this.globals.getCommonOptionsWithAuth(url_request);
    return this.http
      .get(url_request, options)
      .pipe(map((response: any) => response.json()));
  };
}
