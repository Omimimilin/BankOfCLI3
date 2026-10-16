import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../service/toast';
import { TransactionFlow } from '../../service/transaction-flow';
import { TransactionType } from '../../models/TransactionType.model';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { Dropdown } from '../../shared/components/dropdown/dropdown';
import { Input } from '../../shared/components/input/input';
import { Label } from '../../shared/components/label/label';
import { ToastContainer } from '../../shared/components/toast/toast';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

// Snippets live here (not in the template) so Angular doesn't parse `{{`, `@` or tags inside them.
const snippets = {
  button: `<app-button type="button" [disabled]="false" (clicked)="onClick()">Click me</app-button>`,
  card: `<app-card class="max-w-sm">Anything goes in here</app-card>

<!-- skeleton instead of content while loading -->
<app-card [loading]="isLoading()">Your content</app-card>`,
  dropdown: `<app-dropdown
  [options]="['Apple', 'Banana', 'Orange']"
  placeHolder="Pick a fruit"
  [(value)]="fruit"
/>`,
  input: `<app-input inputId="account-id" type="text" [(value)]="accountId" />

<!-- eye icon toggles visibility -->
<app-input inputId="pw" type="password" [(value)]="password" />

<!-- search icon -->
<app-input inputId="q" type="search" [(value)]="query" />`,
  label: `<app-label status="Approved" />   <!-- 'Approved' | 'Pending' | 'Rejected' -->`,
  toast: `// app.html (once, at the root)
<app-toast />

// anywhere
private toast = inject(ToastService);
this.toast.success('Saved!');
this.toast.error('Something went wrong');
this.toast.show('Custom', 'success', 5000); // message, type, duration ms`,
  styling: `// card.ts
classes = computed(() =>
  twMerge('border-1 border-gray-200 p-4 rounded-xl w-full bg-white', this.class()),
);

<!-- card.html -->
<div [class]="classes()"><ng-content /></div>

<!-- usage: p-8 replaces p-4... -->
<app-card class="max-w-sm bg-purple-50 p-8">Merged</app-card>`,
  passedClass: `<app-button class="bg-amber-200">Click Me</app-button>`,
};

@Component({
  imports: [
    Button,
    Card,
    Dropdown,
    Input,
    Label,
    ToastContainer,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  selector: 'app-docs',
  template: `
    <app-toast />
    <main
      class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10 [&_code]:rounded-md [&_code]:bg-purple-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-normal [&_code]:text-purple-800"
    >
      <h1 class="text-4xl font-bold tracking-tight text-purple-900">Component docs</h1>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Styling: component CSS + Tailwind
        </h2>
        <p class="text-gray-600">A component's final look comes from three sources:</p>
        <ol class="list-decimal space-y-2 pl-6">
          <li><strong>Its own CSS file</strong></li>
          <li>
            <strong>Default Tailwind classes inside the component file</strong>
          </li>
          <li><strong>Tailwind classes passed from outside via the 'class' input</strong></li>
        </ol>
        <!-- <p class="text-gray-600">
          <strong>twMerge</strong> merges 2 and 3 into one class string: when both set the same property
          (<strong>p-4</strong> vs <strong>p-8</strong>), the outside class wins and the default is dropped;
          everything else is kept. That string goes on the element with
          <strong>[class]="classes()"</strong>. The component CSS (1) applies alongside it through
          normal CSS rules, so it is <em>not</em> merged by <strong>twMerge</strong>: it only loses to a
          utility if the CSS sits in <strong>&#64;layer components</strong> (Tailwind utilities live in
          a later layer). Unlayered CSS beats utilities regardless of order. Button's rules are
          currently unlayered (the <strong>&#64;layer</strong> wrapper is commented out), so
          <strong>button.css</strong> wins over conflicting classes passed to Button.
        </p> -->
        <div class="flex flex-col gap-3">
          <app-card class="max-w-sm"><p>Defaults only</p></app-card>
          <app-card class="max-w-sm bg-purple-50 p-8"><p>Passed: bg-purple-50 p-8</p></app-card>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.styling
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Button <strong>app-button</strong>
        </h2>
        <p class="text-gray-600">
          Inputs: <strong>type</strong> ('button' | 'submit'), <strong>disabled</strong>,
          <strong>class</strong>. Output: <strong>clicked</strong>.
        </p>
        <div class="flex flex-wrap gap-3">
          <app-button class="w-48" (clicked)="toast.success('Clicked')">Click me</app-button>
          <app-button class="w-48" [disabled]="true">Disabled</app-button>
          <app-button class="w-48" [disabled]="true" [loading]="true">Loading</app-button>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.button
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Card <strong>app-card</strong>
        </h2>
        <!-- <p class="text-gray-600">
          Content-projected container with a border, padding and shadow. Input:
          <strong>loading</strong> (boolean) swaps the content for a skeleton.
        </p> -->
        <app-card class="max-w-sm"> <p>Anything goes in here</p></app-card>
        <app-card class="max-w-sm" [loading]="cardLoading()">
          <p>Loaded content: this is hidden while loading.</p>
        </app-card>
        <app-button class="w-48" (clicked)="cardLoading.set(!cardLoading())">
          {{ cardLoading() ? 'Stop loading' : 'Start loading' }}
        </app-button>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.card
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Dropdown <strong>app-dropdown</strong>
        </h2>
        <p class="text-gray-600">
          Inputs: <strong>options</strong> (string[]), <strong>placeHolder</strong>. Two-way:
          <strong>[(value)]</strong>.
        </p>
        <app-dropdown [options]="fruits" placeHolder="Pick a fruit" [(value)]="fruit" />
        <p class="text-gray-600">
          Selected: <strong>{{ fruit() || 'nothing' }}</strong>
        </p>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.dropdown
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Input <strong>app-input</strong>
        </h2>
        <p class="">
          Inputs: <strong>inputId</strong> (required), <strong>name</strong>,
          <strong>type</strong> ('text' | 'password' | 'search'), <strong>class</strong>. Two-way:
          <strong>[(value)]</strong>.
        </p>
        <ul class="list-disc pl-6">
          <li><strong>text</strong>: plain input, no icon.</li>
          <li>
            <strong>password</strong>: eye icon button on the right that toggles the password.
          </li>
          <li><strong>search</strong>: decorative search icon on the right.</li>
        </ul>
        <app-input inputId="docs-demo-text" [(value)]="text" />
        <app-input inputId="docs-demo-password" [(value)]="password" type="password" />
        <app-input inputId="docs-demo-search" [(value)]="search" type="search" />

        <p class="text-gray-600">
          Value: <strong>{{ text() }}</strong>
        </p>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.input
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Label <strong>app-label</strong>
        </h2>
        <p>Status pill. Input: <strong>status</strong> ('Approved' | 'Pending' | 'Rejected').</p>
        <div class="flex flex-wrap gap-3">
          <app-label status="Approved" />
          <app-label status="Pending" />
          <app-label status="Rejected" />
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.label
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Toast <strong>app-toast</strong> + <strong>ToastService</strong>
        </h2>
        <p class="text-gray-600">
          Place <strong>&lt;app-toast /&gt;</strong> once at the root, then call the service from
          anywhere.
        </p>
        <div class="flex flex-wrap gap-3">
          <app-button class="w-48" (clicked)="toast.success('Success toast')">Success</app-button>
          <app-button class="w-48" (clicked)="toast.error('Error toast')">Error</app-button>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          snippets.toast
        }}</pre>
      </section>

      <section
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="flex items-center gap-3 border-b border-gray-200 pb-3 text-2xl font-semibold">
          Pop-ups
        </h2>
        <p class="text-gray-600">
          Full transaction flow: input, loading, confirm and success dialogs (with error handling).
          The final transaction is shown below.
        </p>

        <app-button class="w-48" [cdkMenuTriggerFor]="transactionMenu">Make Transaction</app-button>
        <ng-template #transactionMenu>
          <div cdkMenu class="flex min-w-40 flex-col rounded-xl bg-white p-1.5 shadow-lg">
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.Deposit)"
            >
              Deposit
            </button>
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.Withdraw)"
            >
              Withdraw
            </button>
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.TransferOut)"
            >
              Transfer
            </button>
          </div>
        </ng-template>
        <pre class="overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">{{
          result()
        }}</pre>
      </section>
    </main>
  `,
})
export class Docs {
  protected toast = inject(ToastService);
  protected snippets = snippets;
  protected fruits = ['Apple', 'Banana', 'Orange'];
  protected fruit = signal('');
  protected cardLoading = signal(true);
  protected text = signal('');
  protected password = signal('');
  protected search = signal('');

  private readonly flow = inject(TransactionFlow);
  protected readonly types = TransactionType;
  protected readonly result = signal('No transaction yet.');

  protected async processTransaction(type: TransactionType): Promise<void> {
    const tx = await this.flow.run(type);
    if (tx) this.result.set(JSON.stringify(tx, null, 2));
  }
}
