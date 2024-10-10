import { Directive, HostBinding, HostListener, inject, } from '@angular/core';
import { DndDraggableDirective } from './dnd-draggable.directive';
import * as i0 from "@angular/core";
export class DndHandleDirective {
    draggable = true;
    dndDraggableDirective = inject(DndDraggableDirective);
    ngOnInit() {
        this.dndDraggableDirective.registerDragHandle(this);
    }
    ngOnDestroy() {
        this.dndDraggableDirective.registerDragHandle(undefined);
    }
    onDragEvent(event) {
        event._dndUsingHandle = true;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndHandleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.7", type: DndHandleDirective, isStandalone: true, selector: "[dndHandle]", host: { listeners: { "dragstart": "onDragEvent($event)", "dragend": "onDragEvent($event)" }, properties: { "attr.draggable": "this.draggable" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndHandleDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndHandle]', standalone: true }]
        }], propDecorators: { draggable: [{
                type: HostBinding,
                args: ['attr.draggable']
            }], onDragEvent: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }, {
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWhhbmRsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9kbmQvc3JjL2xpYi9kbmQtaGFuZGxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxHQUdQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUlsRSxNQUFNLE9BQU8sa0JBQWtCO0lBQ0UsU0FBUyxHQUFHLElBQUksQ0FBQztJQUVoRCxxQkFBcUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUV0RCxRQUFRO1FBQ04sSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFJRCxXQUFXLENBQUMsS0FBZTtRQUN6QixLQUFLLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO3VHQWpCVSxrQkFBa0I7MkZBQWxCLGtCQUFrQjs7MkZBQWxCLGtCQUFrQjtrQkFEOUIsU0FBUzttQkFBQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTs4QkFFdkIsU0FBUztzQkFBdkMsV0FBVzt1QkFBQyxnQkFBZ0I7Z0JBYzdCLFdBQVc7c0JBRlYsWUFBWTt1QkFBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7O3NCQUNwQyxZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSG9zdEJpbmRpbmcsXG4gIEhvc3RMaXN0ZW5lcixcbiAgaW5qZWN0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEbmREcmFnZ2FibGVEaXJlY3RpdmUgfSBmcm9tICcuL2RuZC1kcmFnZ2FibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IERuZEV2ZW50IH0gZnJvbSAnLi9kbmQtdXRpbHMnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbZG5kSGFuZGxlXScsIHN0YW5kYWxvbmU6IHRydWUgfSlcbmV4cG9ydCBjbGFzcyBEbmRIYW5kbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBIb3N0QmluZGluZygnYXR0ci5kcmFnZ2FibGUnKSBkcmFnZ2FibGUgPSB0cnVlO1xuXG4gIGRuZERyYWdnYWJsZURpcmVjdGl2ZSA9IGluamVjdChEbmREcmFnZ2FibGVEaXJlY3RpdmUpO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZG5kRHJhZ2dhYmxlRGlyZWN0aXZlLnJlZ2lzdGVyRHJhZ0hhbmRsZSh0aGlzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZG5kRHJhZ2dhYmxlRGlyZWN0aXZlLnJlZ2lzdGVyRHJhZ0hhbmRsZSh1bmRlZmluZWQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VuZCcsIFsnJGV2ZW50J10pXG4gIG9uRHJhZ0V2ZW50KGV2ZW50OiBEbmRFdmVudCkge1xuICAgIGV2ZW50Ll9kbmRVc2luZ0hhbmRsZSA9IHRydWU7XG4gIH1cbn1cbiJdfQ==