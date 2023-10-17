import { Routes } from "@angular/router";

export const WebsiteRoutes: Routes = [
  {
    path: "category",
    //loadChildren:      "./category/category.module#CategoryModule",
    loadChildren: () => import("./category/category.module").then(m => m.CategoryModule)
  },
  {
    path: "blog",
    //loadChildren:      "./blog/blog.module#BlogModule",
    loadChildren: () => import("./blog/blog.module").then(m => m.BlogModule)
  },
  {
    path: "themeblog",
    //loadChildren:      "./themeblog/themeblog.module#ThemeBlogModule",
    loadChildren: () => import("./themeblog/themeblog.module").then(m => m.ThemeBlogModule)
  },
  {
    path: "contract",
    //loadChildren:      "./contract/contract.module#ContractModule",
    loadChildren: () => import("./contract/contract.module").then(m => m.ContractModule)
  }
];
