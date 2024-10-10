import { NgModule } from '@angular/core';
import { DndDraggableDirective, DndDragImageRefDirective, } from './dnd-draggable.directive';
import { DndDropzoneDirective, DndPlaceholderRefDirective, } from './dnd-dropzone.directive';
import { DndHandleDirective } from './dnd-handle.directive';
import * as i0 from "@angular/core";
export class DndModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: DndModule, imports: [DndDragImageRefDirective,
            DndDropzoneDirective,
            DndHandleDirective,
            DndPlaceholderRefDirective,
            DndDraggableDirective], exports: [DndDraggableDirective,
            DndDropzoneDirective,
            DndHandleDirective,
            DndPlaceholderRefDirective,
            DndDragImageRefDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndModule, decorators: [{
            type: NgModule,
            args: [{
                    exports: [
                        DndDraggableDirective,
                        DndDropzoneDirective,
                        DndHandleDirective,
                        DndPlaceholderRefDirective,
                        DndDragImageRefDirective,
                    ],
                    imports: [
                        DndDragImageRefDirective,
                        DndDropzoneDirective,
                        DndHandleDirective,
                        DndPlaceholderRefDirective,
                        DndDraggableDirective,
                    ],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2RuZC9zcmMvbGliL2RuZC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQ0wscUJBQXFCLEVBQ3JCLHdCQUF3QixHQUN6QixNQUFNLDJCQUEyQixDQUFDO0FBQ25DLE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsMEJBQTBCLEdBQzNCLE1BQU0sMEJBQTBCLENBQUM7QUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBa0I1RCxNQUFNLE9BQU8sU0FBUzt1R0FBVCxTQUFTO3dHQUFULFNBQVMsWUFQbEIsd0JBQXdCO1lBQ3hCLG9CQUFvQjtZQUNwQixrQkFBa0I7WUFDbEIsMEJBQTBCO1lBQzFCLHFCQUFxQixhQVhyQixxQkFBcUI7WUFDckIsb0JBQW9CO1lBQ3BCLGtCQUFrQjtZQUNsQiwwQkFBMEI7WUFDMUIsd0JBQXdCO3dHQVVmLFNBQVM7OzJGQUFULFNBQVM7a0JBaEJyQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxxQkFBcUI7d0JBQ3JCLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQiwwQkFBMEI7d0JBQzFCLHdCQUF3QjtxQkFDekI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLHdCQUF3Qjt3QkFDeEIsb0JBQW9CO3dCQUNwQixrQkFBa0I7d0JBQ2xCLDBCQUEwQjt3QkFDMUIscUJBQXFCO3FCQUN0QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBEbmREcmFnZ2FibGVEaXJlY3RpdmUsXG4gIERuZERyYWdJbWFnZVJlZkRpcmVjdGl2ZSxcbn0gZnJvbSAnLi9kbmQtZHJhZ2dhYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1xuICBEbmREcm9wem9uZURpcmVjdGl2ZSxcbiAgRG5kUGxhY2Vob2xkZXJSZWZEaXJlY3RpdmUsXG59IGZyb20gJy4vZG5kLWRyb3B6b25lLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEbmRIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL2RuZC1oYW5kbGUuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW1xuICAgIERuZERyYWdnYWJsZURpcmVjdGl2ZSxcbiAgICBEbmREcm9wem9uZURpcmVjdGl2ZSxcbiAgICBEbmRIYW5kbGVEaXJlY3RpdmUsXG4gICAgRG5kUGxhY2Vob2xkZXJSZWZEaXJlY3RpdmUsXG4gICAgRG5kRHJhZ0ltYWdlUmVmRGlyZWN0aXZlLFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgRG5kRHJhZ0ltYWdlUmVmRGlyZWN0aXZlLFxuICAgIERuZERyb3B6b25lRGlyZWN0aXZlLFxuICAgIERuZEhhbmRsZURpcmVjdGl2ZSxcbiAgICBEbmRQbGFjZWhvbGRlclJlZkRpcmVjdGl2ZSxcbiAgICBEbmREcmFnZ2FibGVEaXJlY3RpdmUsXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIERuZE1vZHVsZSB7fVxuIl19