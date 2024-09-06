import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';

export const routes: Routes = [
    // router for auth layout
    {path:"", loadComponent:()=>import("./layouts/auth-layout/auth-layout.component").then((c)=>c.AuthLayoutComponent), canActivate:[loggedInGuard], children:[
        {path:"", redirectTo:"login", pathMatch:"full"},
        {path:"login", loadComponent:()=>import("./components/login/login.component").then((c)=>c.LoginComponent), title:"Login Page"},
        {path:"register", loadComponent:()=>import("./components/register/register.component").then((c)=>c.RegisterComponent), title:"Register Page"},
        {path:"forgetPassword", loadComponent:()=>import("./components/forget-passowrd/forget-passowrd.component").then((c)=>c.ForgetPassowrdComponent), title:"forgetPassword Page"}
    ]},
    // router for blank layout
    {path:"", component:BlankLayoutComponent, canActivate:[authGuard], children:[
        {path:"", redirectTo:"home", pathMatch:"full"},
        {path:"home", component:HomeComponent, title:"Home Page"},
        {path:"cart", loadComponent:()=>import("./components/cart/cart.component").then((c)=>c.CartComponent), title:"Cart Page"},
        {path:"products", component:ProductComponent, title:"Products Page"},
        {path:"brands", loadComponent:()=>import("./components/brands/brands.component").then((c)=>c.BrandsComponent), title:"Brands Page"},
        {path:"categories", loadComponent:()=>import("./components/categories/categories.component").then((c)=>c.CategoriesComponent), title:"Categories Page"},
        {path:"details/:productId", loadComponent: ()=>import("./components/details/details.component").then((c)=>c.DetailsComponent), title:"Details Page"},
        {path:"allorders", loadComponent: ()=>import("./components/all-orders/all-orders.component").then((c)=>c.AllOrdersComponent), title:"All Orders Page"},
        {path:"orders/:cartId", loadComponent: ()=>import("./components/orders/orders.component").then((c)=>c.OrdersComponent), title:"Orders Page"},
        {path:"wishlist", loadComponent: ()=>import("./components/wish-list/wish-list.component").then((c)=>c.WishListComponent), title:"WishList Page"}
    ]},
    
    {path:"**", loadComponent:()=>import("./components/notfound/notfound.component").then((c)=>c.NotfoundComponent), title:"Not Found Page"}
];
