import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Recent Sales</div>
        <p-table [value]="products" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Image</th>
                    <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
                    <th pSortableColumn="price">Price <p-sortIcon field="price"></p-sortIcon></th>
                    <th>View</th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <img src="https://primefaces.org/cdn/primevue/images/product/{{ product.image }}" class="shadow-lg" alt="{{ product.name }}" width="50" />
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ product.name }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ product.price | currency: 'USD' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: []
})
export class RecentSalesWidget {
    products!: any[];

    constructor() {}

    ngOnInit() {
        this.products = [
            { name: 'Bamboo Watch', price: 65, image: 'bamboo-watch.jpg' },
            { name: 'Black Watch', price: 72, image: 'black-watch.jpg' },
            { name: 'Blue Band', price: 79, image: 'blue-band.jpg' },
            { name: 'Bracelet', price: 95, image: 'bracelet.jpg' },
            { name: 'Brown Purse', price: 120, image: 'brown-purse.jpg' },
            { name: 'Chakra Bracelet', price: 32, image: 'chakra-bracelet.jpg' },
            { name: 'Galaxy Earrings', price: 34, image: 'galaxy-earrings.jpg' },
            { name: 'Game Controller', price: 99, image: 'game-controller.jpg' },
            { name: 'Gold Phone Case', price: 24, image: 'gold-phone-case.jpg' },
            { name: 'Green Earbuds', price: 89, image: 'green-earbuds.jpg' }
        ];
    }
}
