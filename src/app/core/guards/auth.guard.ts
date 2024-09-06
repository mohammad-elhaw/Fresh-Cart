import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  /**
   * Global Object Browser
   * -window
   * -document
   * -localStorage
   * -location
   * -navigation
   * 
   * all of there if you use them in Guard or lifecycle component 
   * will cause server error because it doesn't exist on server
   */

  // Check type Global Object !== undefined
  // (service) PlatformId id--> isPlatformBrowser(id) - isPlatfromServer(id)

  //afterRender(()=>{});
  //afterNextRender(()=>{});


  const _Router = inject(Router);
  const _PLATFORM_ID = inject(PLATFORM_ID);
  
  if(isPlatformBrowser(_PLATFORM_ID)){
    if(localStorage.getItem("userToken")){
      return true;
    }
    
    _Router.navigate(["/login"]);
    return false;
  }
  return false;
};
