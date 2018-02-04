import {
  AfterContentInit,
  ContentChildren,
  Directive,
  QueryList
} from '@angular/core'
import { TabComponent } from './tab.component'

@Directive({
  selector: 'chatTabs'
  // selector: '[chatTabs]'   // change tslint rule to attribute if this is used
})
export class TabsDirective implements AfterContentInit {

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>
  public activeTab: TabComponent

  constructor() {
  }

  ngAfterContentInit() {
    this.tabs.map((t: TabComponent) => {
      t.minimizeTab.subscribe(() => { this.setTab() })
    })
  }

  public setTab(tabId: number = null) {
    this.tabs.map((t) => {
      t.active = (t.id === tabId) ? true : false
      if (t.id === tabId) { this.activeTab = t }
    })
  }

}
