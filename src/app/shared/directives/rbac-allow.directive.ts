import { Directive, TemplateRef, ViewContainerRef, Input, OnDestroy } from '@angular/core'
import { AuthService, User } from 'app/auth/auth.service'
import { Subscription } from 'rxjs'

@Directive({
  selector: '[appRbacAllow]'
  // selector: 'appRbacAllow'
})
export class RbacAllowDirective implements OnDestroy {
  allowedRoles: string[]
  user: User
  sub: Subscription
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    authService: AuthService
  ) {
    this.sub = authService.user$.subscribe(user => {
      this.user = user
      this.showIfUserAllowed()
    })
  }
  ngOnDestroy() {
    this.sub.unsubscribe()
  }
  @Input()
  set appRbacAllow(allowedRoles: string[]) {
    this.allowedRoles = allowedRoles
    this.showIfUserAllowed()
  }
  showIfUserAllowed() {
    if (!this.allowedRoles || this.allowedRoles.length === 0) {
      return this.viewContainer.clear()
    } else {
      const allowed = this.allowedRoles.some(r => this.user.roles.includes(r))
      if (!allowed) {
        return this.viewContainer.clear()
      } else {
        return this.viewContainer.createEmbeddedView(this.templateRef)
      }
    }
  }
}
