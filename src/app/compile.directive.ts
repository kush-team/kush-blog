import { CommonModule } from "@angular/common";
import { Compiler, Component, ComponentRef, CUSTOM_ELEMENTS_SCHEMA, Directive, Input, ModuleWithComponentFactories, NgModule, OnChanges, Type, ViewContainerRef } from "@angular/core";
import { PlaygroundService } from "./playground.service";

@Directive({
  selector: '[compile]'
})

export class CompileDirective implements OnChanges {
  @Input() compile: string = "";
  @Input() compileContext: any;

  public compRef!: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {}

  ngOnChanges() {
    if(!this.compile) {
      if(this.compRef) {
        this.updateProperties();
        return;
      }
      throw Error('You forgot to provide template');
    }

    this.vcRef.clear();
    //this.compRef = null;

    const component = this.createDynamicComponent(this.compile);
    const module = this.createDynamicModule(component);

    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        let compFactory = moduleWithFactories.componentFactories.find(x => x.componentType === component);
        if (compFactory) {
          this.compRef = this.vcRef.createComponent(compFactory);
        }
        this.updateProperties();
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateProperties() {
    for(var prop in this.compileContext) {
      this.compRef.instance[prop] = this.compileContext[prop];
    }
  }

  private createDynamicComponent (template:string) {
    @Component({
      selector: 'custom-dynamic-component',
      template: template,
    })
    class CustomDynamicComponent {
      constructor(private playground: PlaygroundService) {}
    }
    return CustomDynamicComponent;
  }


  private createDynamicModule (component: Type<any>) {
    @NgModule({
      imports: [CommonModule],
      declarations: [component],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [PlaygroundService]
    })
    class DynamicModule {}
    return DynamicModule;
  }
}
