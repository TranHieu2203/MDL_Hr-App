import { Routes } from "@angular/router";
import { TenantPermisstionGuard } from "src/app/common/auth.guard";

export const ProfileBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "/hrms/profile/business/inschange",
    pathMatch: "full",
  },
  {
    path: "staffprofile",
    //loadChildren: "./staffprofile/staffprofile.module#StaffProfileModule",
    loadChildren: () => import("./staffprofile/staffprofile.module").then(m => m.StaffProfileModule),
    //canActivate: [TenantPermisstionGuard]
  },
  {
    path: "contactprofile",
    //loadChildren: "./contactprofile/contactprofile.module#ContacProfileModule",
    loadChildren: () => import("./contactprofile/contactprofile.module").then(m => m.ContactProfileModule),
    //canActivate: [TenantPermisstionGuard]
  },
  {
    path: "contractinfor",
    //loadChildren: "./contractinfor/contractinfor.module#ContractInforModule",
    loadChildren: () => import("./contractinfor/contractinfor.module").then(m => m.ContractInforModule),
  },
  {
    path: "concurrentlymng",
    //loadChildren: "./concurrentlymng/concurrentlymng.module#ConcurrentlyMngModule",
    loadChildren: () => import("./concurrentlymng/concurrentlymng.module").then(m => m.ConcurrentlyMngModule),
  },
  {
    path: "decision",
    //loadChildren: "./decision/decision.module#DecisionModule",
    loadChildren: () => import("./decision/decision.module").then(m => m.DecisionModule),
  },
  {
    path: "commend",
    //loadChildren: "./commend/commend.module#CommendModule",
    loadChildren: () => import("./commend/commend.module").then(m => m.CommendModule),
  },
  {
    path: "discipline",
    //loadChildren: "./discipline/discipline.module#DisciplineModule",
    loadChildren: () => import("./discipline/discipline.module").then(m => m.DisciplineModule),
  },
  {
    path: "leavejob",
    //loadChildren: "./leavejob/leavejob.module#LeaveJobModule",
    loadChildren: () => import("./leavejob/leavejob.module").then(m => m.LeaveJobModule),
  },
  {
    path: "inschange",
    //loadChildren: "./inschange/inschange.module#InsChangeModule",
    loadChildren: () => import("./inschange/inschange.module").then(m => m.InsChangeModule),
  },
  {
    path: "insinformation",
    //loadChildren: "./insinformation/insinformation.module#InsInformationModule",
    loadChildren: () => import("./insinformation/insinformation.module").then(m => m.InsInformationModule),
  },
  {
    path: "staffprofile-change",
    //loadChildren:      "./staffprofile-change/staffprofile-change.module#StaffProfileChangeModule",
    loadChildren: () => import("./staffprofile-change/staffprofile-change.module").then(m => m.StaffProfileChangeModule),
  },
  {
    path: "family-change",
    //loadChildren: "./family-change/family-change.module#FamilyChangeModule",
    loadChildren: () => import("./family-change/family-change.module").then(m => m.FamilyChangeModule),
  },
  // {
  //   path: "angular-tree-grid",
  //   //loadChildren:
  //     "./angular-tree-grid/angular-tree-grid.module#AngularTreeGridModule",
  // },
  {
    path: "candidatescancv",
    //loadChildren: "./candidatescancv/candidatescancv.module#CandidatescancvModule",
    loadChildren: () => import("./candidatescancv/candidatescancv.module").then(m => m.CandidatescancvModule),
  },
  {
    path: "workingbefore",
    //loadChildren: "./decision/decision.module#DecisionModule",
    loadChildren: () => import("./workingbefore/workingbefore.module").then(m => m.WorkingbeforeModule),
  },
  {
    path: "trainingbefore",
    //loadChildren: "./decision/decision.module#DecisionModule",
    loadChildren: () => import("./trainingbefore/trainingbefore.module").then(m => m.TrainingbeforeModule),
  },
  {
    path: "welfaremng",
    //loadChildren: "./decision/decision.module#DecisionModule",
    loadChildren: () => import("./welfaremng/welfaremng.module").then(m => m.WelfareMngModule),
  },
  {
    path: "welfarecal",
    loadChildren: () => import("./welfarecal/welfarecal.module").then(m => m.WelfarecalModule),
  },
  {
    path: "leavejobsettlement",
    //loadChildren: "./leavejob/leavejob.module#LeaveJobModule",
    loadChildren: () => import("./leavejobsettlement/leavejobsettlement.module").then(m => m.LeaveJobSettlementModule),
  },
  {
    path: "insregimemng",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./insregimemng/insregimemng.module").then(m => m.InsRegimeMngModule),
  },
  {
    path: "talentsetting",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./talentsetting/talentsetting.module").then(m => m.TalentSettingModule),
  },
  {
    path: "report-dynamic",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./report-dynamic/report-dynamic.module").then(m => m.ReportDynamicModule),
  },
  {
    path: "searchtalent",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./searchtalent/searchtalent.module").then(m => m.SearchTalentModule),
  },
  {
    path: "talentmng",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./talentmng/talentmng.module").then(m => m.TalentMngModule),
  },
  {
    path: "insarising",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./insarising/insarising.module").then(m => m.InsArisingModule),
  },
  {
    path: "employeetrain",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./employeetrain/employeetrain.module").then(m => m.EmployeeTrainModule),
  },
  {
    path: "recruitmentplan",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./recruitmentplan/recruitmentplan.module").then(m => m.RecruitmentPlanModule),
  },
  {
    path: "trainingdemand",
    //loadChildren: "./salarylevel/salarylevel.module#SalaryLevelModule",
    loadChildren: () => import("./trainingdemand/trainingdemand.module").then(m => m.TrainingDemandModule),
  },
  {
    path: "trainingbefore-change",
    //loadChildren: "./trainingbefore-change/trainingbefore-change.module#trainingbeforeChangeModule",
    loadChildren: () => import("./trainingbefore-change/trainingbefore-change.module").then(m => m.TrainingBeforeChangeModule),
  },
  {
    path: "workingbefore-change",
    //loadChildren: "./workingbefore-change/workingbefore-change.module#workingbeforeChangeModule",
    loadChildren: () => import("./workingbefore-change/workingbefore-change.module").then(m => m.WorkingBeforeChangeModule),
  },
];
