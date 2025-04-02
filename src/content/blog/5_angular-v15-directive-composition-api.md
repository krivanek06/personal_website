---
title: 'Angular v15 Directive Composition API'
seoTitle: 'Angular v15 Directive Composition API'
seoDescription: 'One of the advantages of using the Angular ecosystem is that it never forgets about you. If Angular...'
slug: 5_angular-v15-directive-composition-api
tags: javascript, angular, rxjs
order: 5
datePublished: 17.11.2022
readTime: 7
coverImage: article-cover/5_angular-v15-directive-composition-api.png
---

One of the advantages of using the [Angular](https://www.bitovi.com/frontend-javascript-consulting/angular-consulting) ecosystem is that it never forgets about you. If Angular can’t solve your request right away because the current technology doesn’t allow it, they often return to it. An example of this is [issue #8785](https://github.com/angular/angular/issues/8785), which was open for 6 years but was finally solved in 2022.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4cec6f80b25srcj7gga8.png)

## The Problem with Inheritance

Some developers like to work smarter, not harder. They like to define some logic once, create a function only in one place and reuse it everywhere, following the principle of [don’t repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

When having multiple Angular elements (Components, Directives, Pipes) that share the same logic, it is common to abstract that logic into a parent class and extend the parent using Inheritance.

```typescript
@Directive()
export abstract class ParentCalculation {
  calculation1(value: number = 1): number {
    return 1 * value;
  }

  // restricted only for Components
  calculation2(value: number = 2): number {
    return 2 * value;
  }
}
// ---------------------------------------
@Component({
  selector: 'app-component1',
  template: `
    <button (click)="calculation1()">calculation1</button>
    <button (click)="calculation2()">calculation2</button>
  `,
})
export class Component1 extends ParentCalculation {
  constructor() {
    super();
  }
}
// ---------------------------------------
@Pipe({
  name: 'app-pipe1',
})
export class Pipe1 extends ParentCalculation implements PipeTransform {
  transform(value: number) {
    return this.calculation1(value);
  }
}
```

Inheritance works… Until it doesn’t. Let’s demonstrate the following problem: What if the method `calculation2` inside the `ParentCalculation` class would be restricted only to be executed for Components and not for Pipes?

What if many more components would extend the `ParentCalculation` class, and we realize we will need to add an additional `calculation3` method because we, once again, have a repeated logic across multiple places that would be great to abstract?

Abstracting a common logic into the `ParentCalculation` could be a good idea. Still, we would expose unused methods (`calculation2` and `calculation3`) to every child class (Component, Pipe, Directive) even if they don’t need to or can’t use them.

## Enter JavaScript Composition

Composition is a design pattern to [implement a **has-a** relationship](https://www.geeksforgeeks.org/favoring-composition-over-inheritance-in-java-with-examples/). To achieve this, you can use an instance variable that refers to other objects. The main benefits of compositions are:

- Composition allows changing the behavior at runtime as long as the composed object implements the correct behavior
- It Decouples the dependency on the parent class, so if the parent behavior changes, it will not break the child component execution.
- It makes testing less complex because we have to mock Objects, not actual dependency classes

An example of Composition is the following code snippet

```typescript
interface Human {
    name!: string;
}

class Person implements Human {
	name!: string;

	constructor(name: string) {
		this.name = name;
	}
}

class Employee {
	salary!: number;
	human!: Human;

	constructor(h: Human, salary: number) {
		this.human = h;
		this.salary = salary;
	}
}

const person = new Person('Romero');
const employee = new Employee(person, 80000);
```

## Composition API in Angular

Composition sounds interesting in theory, but you might wonder how we can use it in Angular. Let me introduce you to a new composition API directive called [hostDirective](https://angular.io/guide/directive-composition-api), available in Angular v15.

Composition allows composing functionalities from multiple standalone Directives into a more complex Directive or Component. Let me demonstrate it in the following snippet.

```typescript
@Directive({
	selector: '[appClickLogging]',
	standalone: true,
})
export class ButtonDirective {
	@HostBinding('attr.data-button-type')
	@Input()
	type: 'success' | 'primary' | 'default' = 'default';

	@HostListener('click', ['$event'])
	onClick() {
		console.log(`%c [Log]: ${this.type}`, 'color: #3f51b5'));
	}
}

// directive for all primary mat-button
@Directive({
	selector: 'button[color="primary"]',
	standalone: true,
	hostDirectives: [ButtonDirective],
})
export class ButtonPrimaryDirective {
	constructor(@Host() buttonDirective: ButtonDirective) {
		buttonDirective.type = 'primary';
	}
}
```

The `ButtonDirective` we created using Angular’s `@HostListener('click')` is console logging each click event inside the `onClick` method. It is a standard Angular Directive used in the following approach:

```HTML
<button appClickLogging type="success">
  Logging Success button
</button>
```

Let’s consider a scenario where a product manager asks us to track every `primary button` click.

Instead of manually attaching the `appClickLogging` to all `primary buttons`, we can create a `ButtonPrimaryDirective` with a `button[color="primary"]` selector to select all `<button mat-flat-button color="primary">button</button>` buttons. And, using Composition, attach the directive that already implements the logging mechanism inside the `hostDirectives`.

Attaching the `ButtonDirective` class into a `hostDirectives`, we can get a reference to that class inside our child component constructor by using [dependency injection](https://angular.io/guide/dependency-injection) like:

```typescript
constructor(@Host() buttonDirective: ButtonDirective)
```

Using `@Host` is optional but helps Angular resolve dependencies. Learn more about [resolution modifiers](https://angular.io/guide/hierarchical-dependency-injection#resolution-modifiers).

Logging steps for some specific button is quite a common use case when we, for example, want to track how the user navigates through our page to find out how our application is being used.

## Angular Implementation of hostDirectives

Opening the source of the `hostDirectives` implementation, we can inspect that we can pass a class, `Type<unknown>`, into the `hostDirectives` or an object and specify `inputs` and `outputs` properties.

```typescript
// Code snippet from Angular source
/**
  * Standalone directives that should be applied to the
  * host whenever the directive is matched.
  * By default none of the inputs or outputs of the
  * host directives will be available on the host,
  * unless they are specified
  * in the `inputs` or `outputs` properties.
  */
hostDirectives?: (Type<unknown> | {
    directive: Type<unknown>;
    inputs?: string[];
    outputs?: string[];
})[];
```

Let’s look at an example of how to use `inputs` and `outputs` properties for the `hostDirectives`.

```typescript
@Directive({
  selector: '[appClickLogging]',
  standalone: true,
})
export class ButtonDirective {
  @Output() clickedEvent = new EventEmitter<void>();
  @Output() mouseEnterEvent = new EventEmitter<void>();

  @Input() loggingName: string = 'Base';

  @HostBinding('attr.data-button-type')
  @Input()
  type: 'success' | 'primary' | 'default' = 'default';

  @HostListener('click')
  onClick() {
    this.clickedEvent.emit();
  }

  @HostListener('mouseenter')
  onMouseenter() {
    this.mouseEnterEvent.emit();
  }
}

// ---------------------------------------------
@Directive({
  selector: '[appClickLoggingEnhanced]',
  standalone: true,
  hostDirectives: [
    {
      directive: ButtonDirective,
      inputs: ['loggingName'], // <-- inputs
      outputs: ['mouseEnterEvent'], // <-- outputs
    },
  ],
})
export class ButtonDirectiveEnhancedDirective {
  constructor(@Host() buttonDirective: ButtonDirective) {
    buttonDirective.type = 'success';
  }
}

// ---------------------------------------------
@Component({
  selector: 'app-test',
  template: `
    <button
      appClickLoggingEnhanced
      (mouseEnterEvent)="onMouseEnterEvent()"
      [loggingName]="testName">
      Button text
    </button>
  `,
  imports: [ButtonDirectiveEnhancedDirective],
  standalone: true,
})
export class TestComponent {
  testName = 'Test name';

  onMouseEnterEvent(): void {
    console.log('[TestComponent]: mouse enter');
  }
}
```

What `inputs` and `outputs` properties allow is to define which properties from the composite `@Directive` class are allowed to be exposed by the parent directive.

In our case, `ButtonDirective` has two inputs and two outputs, and it works as a normal directive. However, we need to tell `ButtonDirectiveEnhancedDirective` which properties it can expose from the `ButtonDirective`.

Exposing `loggingName` from `ButtonDirectiveEnhancedDirective` allows defining the `@Input()` in `TestComponent`. If the `loggingName` was removed from inputs in `ButtonDirectiveEnhancedDirective`, the compiler would throw the following error.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/osza4xev6xocxxbchgf6.png)

### Angular Composition API restrictions

> **_NOTE:_** Remember the following.

- You can use `hostDirectives` in both Components and Directives
- Classes in `hostDirectives` must be decorated with `@Directive` decorator
- The `hostDirectives` directive can be used only for [standalone components](https://angular.io/guide/standalone-components)
- Use `inputs` and `outputs` to expose properties from the composed `hostDirectives`
- Accessing the composed directive instance inside the `constructor`, like `constructor(buttonDirective: ButtonDirective)`, without including it into `hostDirectives`, would result in an error message **No provider for ButtonDirective found in NodeInjector**

Check out the [proposed PR](https://github.com/angular/angular/pull/46868) and the massive [code implementation](https://github.com/angular/angular/commit/54ceed53e21a6a899617b626becc51ffb1059178) to find out more about implementing the hostDirectives support for the Angular compiler.

## Composition API Examples

Using Composition in Angular instead of Inheritance may be a little bit difficult to wrap your head around. You may not instantly come up with use cases for how to use the new `hostDirectives` directive, so let me demonstrate its purpose in the following examples.

### Example 1

We have created a `TypingTrackingDirective` directive, that by attaching it to any input element will log out the user’s input. We are asked to add this implementation to all `textarea` inputs

```typescript
@Directive({
  selector: 'appTypingTracking',
  standalone: true,
})
export class TypingTrackingDirective {
  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    console.log(value);
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    console.log(`Tracking input: ${value}`);
  }
}

@Directive({
  selector: 'textarea',
  standalone: true,
  hostDirectives: [TypingTrackingDirective],
})
export class InputTrackingDirective {}
```

### Example 2

A common practice is to use [takeUntil RxJS operator](https://rxjs.dev/api/operators/takeUntil) with some Subject when subscribing to an Observable. This logic is repeated in multiple places, so let’s abstract it.

```typescript
// Credits:
// https://twitter.com/_crisbeto/status/1582475442715385858

@Directive({
	standalone: true,
})
export class DestroyDirective implements OnDestroy {
	private destroy$ = new Subject<void>();

	get pipe() {
		return pipe(takeUntil(this.destroy$));
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

@Component({
	selector: 'app-test',
	template: '...',
	standalone: true,
	providers: [ApiService, DestroyDirective],
})
export class CompositionNewComponent {
	private untilDestroyed = inject(DestroyDirective).pipe;

	constructor(private apiService: ApiService) {
		this.apiService.linstenToUserWS()
			.pipe(this.untilDestroyed))
			.subscribe(res => console.log(res))
	}
}
```

### Example 3

We want to extend the behavior of the `*ngIf` directive so that we are able to reveal HTML content when an HTTP request has finished, but we can also toggle its visibility by clicking on a button.

```typescript
@Injectable()
export class ActiveService {
  private active$ = new BehaviorSubject<boolean>(false);

  isActive(): Observable<boolean> {
    return this.active$.asObservable();
  }

  toggleActivation(): void {
    console.log('Toggling state');
    this.active$.next(!this.active$.value);
  }
}

@Directive({
  selector: '[ifActive]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class ActiveDirective implements OnInit {
  private ngIfDirective = inject(NgIf);
  private activeService = inject(ActiveService);

  ngOnInit(): void {
    this.activeService.isActive().subscribe(state => {
      this.ngIfDirective.ngIf = state;
    });
  }
}

@Directive({
  selector: '[toggleActive]',
  standalone: true,
})
export class ToggleActiveDirective {
  constructor(@SkipSelf() private activeService: ActiveService) {}

  @HostListener('click', ['$event'])
  onClick() {
    this.activeService.toggleActivation();
  }
}

Component({
  selector: 'app-test',
  template: `
    <!-- using ngIfActive directive -->
    <button toggleActive>Toggle Reveal</button>

    <!-- display 2 revealing block -->
    <div *ifActive>Toggling state 1111</div>
    <div *ifActive>Toggling state 2222</div>
  `,
  imports: [ToggleActiveDirective, ActiveDirective],
  standalone: true,
  providers: [ActiveService],
});
export class TestComponent {
  constructor(@Host() private activeService: ActiveService) {
    // mocking HTTP request -> reveal content after 3 seconds
    of([])
      .pipe(delay(3000))
      .subscribe(() => this.activeService.toggleActivation());
  }
}
```

### Example 4

Let’s say we are using `CdkDrag` and `matTooltip` plenty of times in our application by the following approach

```HTML
<button cdkDrag matTooltip="Info" [matTooltipHideDelay]="400">
    Click me
</button>
```

To compose the behavior of these two Directives, you may be tempted to create something like

```typescript
@Directive({
  selector: '[appButtonTooltip]',
  standalone: true,
  hostDirectives: [
    {
      directive: MatTooltip,
      inputs: ['matTooltip: tooltip', 'matTooltipHideDelay: tooltipHideDelay'],
    },
    {
      directive: CdkDrag,
    },
  ],
})
export class ButtonTooltipDirective {}
```

Unfortunately, this will not work. The Angular compiler will throw an error because as we previously mentioned you can only use Directives in `hostDirectives` in Standalone Components.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/57guxvatum7qg41gn4q8.png)

Until Angular Material Directives do not migrate to standalone Directives, you have to use the old approach: `<button cdkDrag matTooltip="Info" [matTooltipHideDelay]="400">`.

## Summary

It is good to see that the Angular team is focusing on expanding its ecosystem and bringing new features. In this article, we described the newly added hostDirectives directive, and how it can be useful for abstracting repeated logic into one place and avoiding using Inheritance. The source code that covers this example and additional features can be found in the following [GitHub repository](https://github.com/krivanek06/example_projects/tree/main/angular_composition_api).

For more information check out our [training program](https://www.bitovi.com/academy/)!

### Waiting for Angular to fix your problem?

Let us take a whack at it! Book your free [Angular consulting](https://www.bitovi.com/frontend-javascript-consulting/angular-consulting) call to talk through your project with an expert.

Hope you liked the article and feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/eduard-krivanek) or visit my [dev.to](https://dev.to/krivanek06) account for more content.
