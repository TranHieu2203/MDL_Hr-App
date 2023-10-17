import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Registering Syncfusion license key
import { registerLicense } from '@syncfusion/ej2-base';
// //ORg4AjUWIQA/Gnt2VVhiQlFaclxJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZjWH9adXdXRmZYVEY=
// //registerLicense('Mgo+DSMBaFt/QHRqVVhkVFpHaVxCQmFJfFBmRGNTfld6dFVWACFaRnZdQV1gSX9TckZrWX5dcXNV;Mgo+DSMBPh8sVXJ0S0J+XE9AflRBQmBJYVF2R2BJfl56dVxMYFxBJAtUQF1hSn5QdkRjXXxWcHVWRWFc;ORg4AjUWIQA/Gnt2VVhkQlFacldJXnxKfkx0RWFab19wflRPalxRVBYiSV9jS31TdUViWXtdeHRURWRYUQ==;MTIyODk2MkAzMjMwMmUzNDJlMzBDSWc2aHdjc3R5eElVOWVLOHlRa1ppQ3NPWTVKZ05CYzF5aGJkV3pKc0RRPQ==;MTIyODk2M0AzMjMwMmUzNDJlMzBKeTRaWXpsbzZCbitacE9WMUkvektWYmNvMiswMllsSHVnZzdmMXpCU0Z3PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmBWfVNpR2NbfE5xdF9HaVZRRGY/P1ZhSXxQdkZjWH9ac3xVR2RdUUQ=;MTIyODk2NUAzMjMwMmUzNDJlMzBlQkZPUEJZajZHRUNTMGwwRUFrOFFwL1ZPZG10SGZKSWVrTHR1Y1MxRk0wPQ==;MTIyODk2NkAzMjMwMmUzNDJlMzBTUUdIb3MzdWZncHFZWVhpek5RbDRMeTBTNHFJUk14MldNb1NJUFk3akVNPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJXnxKfkx0RWFab19wflRPalxRVBYiSV9jS31TdUViWXtdeHRUQmZbUQ==;MTIyODk2OEAzMjMwMmUzNDJlMzBMckxsM3BSMVBoT0xmSHNXVFdmTmFuS0pSeFZmOGo3aGJzeUpFMmQyY2RnPQ==;MTIyODk2OUAzMjMwMmUzNDJlMzBKV0JrT2QzMHFpdTlRVVFaK3JhNWNDVzV4djJLcklkQjk4ZWdmUnpPemJRPQ==;MTIyODk3MEAzMjMwMmUzNDJlMzBlQkZPUEJZajZHRUNTMGwwRUFrOFFwL1ZPZG10SGZKSWVrTHR1Y1MxRk0wPQ==');
// registerLicense('ORg4AjUWIQA/Gnt2VVhiQlFaclxJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxQdkZjWH9bcHVWRGRcVEU=');
registerLicense('ORg4AjUWIQA/Gnt2VVhiQlFadVlJXmJWf1FpTGpQdk5yd19DaVZUTX1dQl9hSXlTckVmXHtfcHNVRGM=');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
