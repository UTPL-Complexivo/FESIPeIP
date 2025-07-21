import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummaryComponent } from './components/dashboard-summary.component';

@Component({
    selector: 'app-dashboard',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DashboardSummaryComponent],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-dashboard-summary class="contents" />
        </div>
    `
})
export class Dashboard {
}
