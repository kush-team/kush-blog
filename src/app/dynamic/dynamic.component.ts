import { CommonModule } from '@angular/common';
import { Compiler, Component, ComponentRef, OnInit, ViewChild, ViewContainerRef, NgModule, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArticlesService } from '../articles.service';
import { PlaygroundService } from '../playground.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss'],
})
export class DynamicComponent implements OnInit {
  @Input() compile: string = '';
  @Input() compileContext: any;

  public compRef!: ComponentRef<any>;

  constructor(
    private vcRef: ViewContainerRef,
    private compiler: Compiler,
    private playgroundService: PlaygroundService,
    private articleService: ArticlesService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.vcRef) {
      this.vcRef.clear();
      this.addComponent(this.compile);
    }
  }

  updateProperties() {
    this.compRef.instance['articleService'] = this.articleService;
    this.compRef.instance['playgroundService'] = this.playgroundService;
    for (var prop in this.compileContext) {
      this.compRef.instance[prop] = this.compileContext[prop];
    }
  }

  private addComponent(template: string) {
    class TemplateComponent {
      constructor() {}
    }
    class TemplateModule {}

    const componentType = Component({
      template: template,
    })(TemplateComponent);

    const componentModuleType = NgModule({
      imports: [CommonModule],
      declarations: [componentType],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [PlaygroundService, ArticlesService],
    })(TemplateModule);
    const mod = this.compiler.compileModuleAndAllComponentsSync(
      componentModuleType
    );
    const factory = mod.componentFactories.find(
      (comp) => comp.componentType === componentType
    );
    this.compRef = this.vcRef.createComponent(factory);
    this.updateProperties();
  }
}
