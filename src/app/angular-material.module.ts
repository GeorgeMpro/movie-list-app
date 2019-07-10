import {NgModule} from '@angular/core';
import {
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatDialogModule
} from '@angular/material';


@NgModule({
    exports: [
        MatToolbarModule,
        MatExpansionModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressBarModule,
        MatDialogModule
    ]
})
export class AngularMaterialModule {
}
