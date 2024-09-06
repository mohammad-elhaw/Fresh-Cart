import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedInGuard: CanActivateFn = (route, state) => {
  
  const _Router = inject(Router);
  

  if(typeof localStorage != "undefined"){
    if(localStorage.getItem("userToken")){
      _Router.navigate(["/home"]);
      return false;
    }
    return true;
  }

  return false;
};
