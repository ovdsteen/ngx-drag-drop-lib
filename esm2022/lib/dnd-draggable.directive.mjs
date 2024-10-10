import { Directive, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, inject, Input, NgZone, Output, Renderer2, } from '@angular/core';
import { dndState, endDrag, startDrag } from './dnd-state';
import { calculateDragImageOffset, setDragData, setDragImage, } from './dnd-utils';
import * as i0 from "@angular/core";
export class DndDragImageRefDirective {
    dndDraggableDirective = inject(forwardRef(() => DndDraggableDirective));
    elementRef = inject(ElementRef);
    ngOnInit() {
        this.dndDraggableDirective.registerDragImage(this.elementRef);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndDragImageRefDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.7", type: DndDragImageRefDirective, isStandalone: true, selector: "[dndDragImageRef]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndDragImageRefDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndDragImageRef]', standalone: true }]
        }] });
export class DndDraggableDirective {
    dndDraggable;
    dndEffectAllowed = 'copy';
    dndType;
    dndDraggingClass = 'dndDragging';
    dndDraggingSourceClass = 'dndDraggingSource';
    dndDraggableDisabledClass = 'dndDraggableDisabled';
    dndDragImageOffsetFunction = calculateDragImageOffset;
    dndStart = new EventEmitter();
    dndDrag = new EventEmitter();
    dndEnd = new EventEmitter();
    dndMoved = new EventEmitter();
    dndCopied = new EventEmitter();
    dndLinked = new EventEmitter();
    dndCanceled = new EventEmitter();
    draggable = true;
    dndHandle;
    dndDragImageElementRef;
    dragImage;
    isDragStarted = false;
    elementRef = inject(ElementRef);
    renderer = inject(Renderer2);
    ngZone = inject(NgZone);
    set dndDisableIf(value) {
        this.draggable = !value;
        if (this.draggable) {
            this.renderer.removeClass(this.elementRef.nativeElement, this.dndDraggableDisabledClass);
        }
        else {
            this.renderer.addClass(this.elementRef.nativeElement, this.dndDraggableDisabledClass);
        }
    }
    set dndDisableDragIf(value) {
        this.dndDisableIf = value;
    }
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener('drag', this.dragEventHandler);
        });
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener('drag', this.dragEventHandler);
        if (this.isDragStarted) {
            endDrag();
        }
    }
    onDragStart(event) {
        if (!this.draggable) {
            return false;
        }
        // check if there is dnd handle and if the dnd handle was used to start the drag
        if (this.dndHandle != null && event._dndUsingHandle == null) {
            event.stopPropagation();
            return false;
        }
        // initialize global state
        startDrag(event, this.dndEffectAllowed, this.dndType);
        this.isDragStarted = true;
        setDragData(event, { data: this.dndDraggable, type: this.dndType }, dndState.effectAllowed);
        this.dragImage = this.determineDragImage();
        // set dragging css class prior to setDragImage so styles are applied before
        // TODO breaking change: add class to elementRef rather than drag image which could be another element
        this.renderer.addClass(this.dragImage, this.dndDraggingClass);
        // set custom dragimage if present
        // set dragimage if drag is started from dndHandle
        if (this.dndDragImageElementRef != null || event._dndUsingHandle != null) {
            setDragImage(event, this.dragImage, this.dndDragImageOffsetFunction);
        }
        // add dragging source css class on first drag event
        const unregister = this.renderer.listen(this.elementRef.nativeElement, 'drag', () => {
            this.renderer.addClass(this.elementRef.nativeElement, this.dndDraggingSourceClass);
            unregister();
        });
        this.dndStart.emit(event);
        event.stopPropagation();
        setTimeout(() => {
            if (this.isDragStarted) {
                this.renderer.setStyle(this.dragImage, 'pointer-events', 'none');
            }
        }, 100);
        return true;
    }
    onDrag(event) {
        this.dndDrag.emit(event);
    }
    onDragEnd(event) {
        if (!this.draggable || !this.isDragStarted) {
            return;
        }
        // get drop effect from custom stored state as its not reliable across browsers
        const dropEffect = dndState.dropEffect;
        this.renderer.setStyle(this.dragImage, 'pointer-events', 'unset');
        let dropEffectEmitter;
        switch (dropEffect) {
            case 'copy':
                dropEffectEmitter = this.dndCopied;
                break;
            case 'link':
                dropEffectEmitter = this.dndLinked;
                break;
            case 'move':
                dropEffectEmitter = this.dndMoved;
                break;
            default:
                dropEffectEmitter = this.dndCanceled;
                break;
        }
        dropEffectEmitter.emit(event);
        this.dndEnd.emit(event);
        // reset global state
        endDrag();
        this.isDragStarted = false;
        this.renderer.removeClass(this.dragImage, this.dndDraggingClass);
        // IE9 special hammering
        window.setTimeout(() => {
            this.renderer.removeClass(this.elementRef.nativeElement, this.dndDraggingSourceClass);
        }, 0);
        event.stopPropagation();
    }
    registerDragHandle(handle) {
        this.dndHandle = handle;
    }
    registerDragImage(elementRef) {
        this.dndDragImageElementRef = elementRef;
    }
    dragEventHandler = (event) => this.onDrag(event);
    determineDragImage() {
        // evaluate custom drag image existence
        if (typeof this.dndDragImageElementRef !== 'undefined') {
            return this.dndDragImageElementRef.nativeElement;
        }
        else {
            return this.elementRef.nativeElement;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndDraggableDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.7", type: DndDraggableDirective, isStandalone: true, selector: "[dndDraggable]", inputs: { dndDraggable: "dndDraggable", dndEffectAllowed: "dndEffectAllowed", dndType: "dndType", dndDraggingClass: "dndDraggingClass", dndDraggingSourceClass: "dndDraggingSourceClass", dndDraggableDisabledClass: "dndDraggableDisabledClass", dndDragImageOffsetFunction: "dndDragImageOffsetFunction", dndDisableIf: "dndDisableIf", dndDisableDragIf: "dndDisableDragIf" }, outputs: { dndStart: "dndStart", dndDrag: "dndDrag", dndEnd: "dndEnd", dndMoved: "dndMoved", dndCopied: "dndCopied", dndLinked: "dndLinked", dndCanceled: "dndCanceled" }, host: { listeners: { "dragstart": "onDragStart($event)", "dragend": "onDragEnd($event)" }, properties: { "attr.draggable": "this.draggable" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: DndDraggableDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndDraggable]', standalone: true }]
        }], propDecorators: { dndDraggable: [{
                type: Input
            }], dndEffectAllowed: [{
                type: Input
            }], dndType: [{
                type: Input
            }], dndDraggingClass: [{
                type: Input
            }], dndDraggingSourceClass: [{
                type: Input
            }], dndDraggableDisabledClass: [{
                type: Input
            }], dndDragImageOffsetFunction: [{
                type: Input
            }], dndStart: [{
                type: Output
            }], dndDrag: [{
                type: Output
            }], dndEnd: [{
                type: Output
            }], dndMoved: [{
                type: Output
            }], dndCopied: [{
                type: Output
            }], dndLinked: [{
                type: Output
            }], dndCanceled: [{
                type: Output
            }], draggable: [{
                type: HostBinding,
                args: ['attr.draggable']
            }], dndDisableIf: [{
                type: Input
            }], dndDisableDragIf: [{
                type: Input
            }], onDragStart: [{
                type: HostListener,
                args: ['dragstart', ['$event']]
            }], onDragEnd: [{
                type: HostListener,
                args: ['dragend', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5kLWRyYWdnYWJsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9kbmQvc3JjL2xpYi9kbmQtZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLFdBQVcsRUFDWCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFM0QsT0FBTyxFQUNMLHdCQUF3QixFQUd4QixXQUFXLEVBQ1gsWUFBWSxHQUNiLE1BQU0sYUFBYSxDQUFDOztBQUdyQixNQUFNLE9BQU8sd0JBQXdCO0lBQ25DLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLFVBQVUsR0FBNEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXpELFFBQVE7UUFDTixJQUFJLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7dUdBTlUsd0JBQXdCOzJGQUF4Qix3QkFBd0I7OzJGQUF4Qix3QkFBd0I7a0JBRHBDLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTs7QUFXOUQsTUFBTSxPQUFPLHFCQUFxQjtJQUN2QixZQUFZLENBQU07SUFDbEIsZ0JBQWdCLEdBQWtCLE1BQU0sQ0FBQztJQUN6QyxPQUFPLENBQVU7SUFDakIsZ0JBQWdCLEdBQUcsYUFBYSxDQUFDO0lBQ2pDLHNCQUFzQixHQUFHLG1CQUFtQixD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QkFBMUIsTUFBTTtnQkFFWSxPQUFPO3NCQUF6QixNQUFNO2dCQUVZLE1BQU07c0JBQXhCLE1BQU07Z0JBRVksUUFBUTtzQkFBMUIsTUFBTTtnQkFFWSxTQUFTO3NCQUEzQixNQUFNO2dCQUVZLFNBQVM7c0JBQTNCLE1BQU07Z0JBRVksV0FBVztzQkFBN0IsTUFBTTtnQkFHd0IsU0FBUztzQkFBdkMsV0FBVzt1QkFBQyxnQkFBZ0I7Z0JBV2hCLFlBQVk7c0JBQXhCLEtBQUs7Z0JBZ0JPLGdCQUFnQjtzQkFBNUIsS0FBSztnQkF1QmlDLFdBQVc7c0JBQWpELFlBQVk7dUJBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDO2dCQWdFQSxTQUFTO3NCQUE3QyxZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0QmluZGluZyxcbiAgSG9zdExpc3RlbmVyLFxuICBpbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEbmRIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL2RuZC1oYW5kbGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IGRuZFN0YXRlLCBlbmREcmFnLCBzdGFydERyYWcgfSBmcm9tICcuL2RuZC1zdGF0ZSc7XG5pbXBvcnQgeyBFZmZlY3RBbGxvd2VkIH0gZnJvbSAnLi9kbmQtdHlwZXMnO1xuaW1wb3J0IHtcbiAgY2FsY3VsYXRlRHJhZ0ltYWdlT2Zmc2V0LFxuICBEbmREcmFnSW1hZ2VPZmZzZXRGdW5jdGlvbixcbiAgRG5kRXZlbnQsXG4gIHNldERyYWdEYXRhLFxuICBzZXREcmFnSW1hZ2UsXG59IGZyb20gJy4vZG5kLXV0aWxzJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2RuZERyYWdJbWFnZVJlZl0nLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgRG5kRHJhZ0ltYWdlUmVmRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgZG5kRHJhZ2dhYmxlRGlyZWN0aXZlID0gaW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gRG5kRHJhZ2dhYmxlRGlyZWN0aXZlKSk7XG4gIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+ID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZG5kRHJhZ2dhYmxlRGlyZWN0aXZlLnJlZ2lzdGVyRHJhZ0ltYWdlKHRoaXMuZWxlbWVudFJlZik7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2RuZERyYWdnYWJsZV0nLCBzdGFuZGFsb25lOiB0cnVlIH0pXG5leHBvcnQgY2xhc3MgRG5kRHJhZ2dhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZG5kRHJhZ2dhYmxlOiBhbnk7XG4gIEBJbnB1dCgpIGRuZEVmZmVjdEFsbG93ZWQ6IEVmZmVjdEFsbG93ZWQgPSAnY29weSc7XG4gIEBJbnB1dCgpIGRuZFR5cGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGRuZERyYWdnaW5nQ2xhc3MgPSAnZG5kRHJhZ2dpbmcnO1xuICBASW5wdXQoKSBkbmREcmFnZ2luZ1NvdXJjZUNsYXNzID0gJ2RuZERyYWdnaW5nU291cmNlJztcbiAgQElucHV0KCkgZG5kRHJhZ2dhYmxlRGlzYWJsZWRDbGFzcyA9ICdkbmREcmFnZ2FibGVEaXNhYmxlZCc7XG4gIEBJbnB1dCgpIGRuZERyYWdJbWFnZU9mZnNldEZ1bmN0aW9uOiBEbmREcmFnSW1hZ2VPZmZzZXRGdW5jdGlvbiA9XG4gICAgY2FsY3VsYXRlRHJhZ0ltYWdlT2Zmc2V0O1xuXG4gIEBPdXRwdXQoKSByZWFkb25seSBkbmRTdGFydDogRXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZG5kRHJhZzogRXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZG5kRW5kOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBkbmRNb3ZlZDogRXZlbnRFbWl0dGVyPERyYWdFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZG5kQ29waWVkOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBkbmRMaW5rZWQ6IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPERyYWdFdmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IGRuZENhbmNlbGVkOiBFdmVudEVtaXR0ZXI8RHJhZ0V2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+KCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmRyYWdnYWJsZScpIGRyYWdnYWJsZSA9IHRydWU7XG5cbiAgcHJpdmF0ZSBkbmRIYW5kbGU/OiBEbmRIYW5kbGVEaXJlY3RpdmU7XG4gIHByaXZhdGUgZG5kRHJhZ0ltYWdlRWxlbWVudFJlZj86IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgZHJhZ0ltYWdlOiBFbGVtZW50IHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGlzRHJhZ1N0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+ID0gaW5qZWN0KEVsZW1lbnRSZWYpO1xuICBwcml2YXRlIHJlbmRlcmVyID0gaW5qZWN0KFJlbmRlcmVyMik7XG4gIHByaXZhdGUgbmdab25lID0gaW5qZWN0KE5nWm9uZSk7XG5cbiAgQElucHV0KCkgc2V0IGRuZERpc2FibGVJZih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuZHJhZ2dhYmxlID0gIXZhbHVlO1xuXG4gICAgaWYgKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy5kbmREcmFnZ2FibGVEaXNhYmxlZENsYXNzXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy5kbmREcmFnZ2FibGVEaXNhYmxlZENsYXNzXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgpIHNldCBkbmREaXNhYmxlRHJhZ0lmKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5kbmREaXNhYmxlSWYgPSB2YWx1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnZHJhZycsXG4gICAgICAgIHRoaXMuZHJhZ0V2ZW50SGFuZGxlclxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAnZHJhZycsXG4gICAgICB0aGlzLmRyYWdFdmVudEhhbmRsZXJcbiAgICApO1xuICAgIGlmICh0aGlzLmlzRHJhZ1N0YXJ0ZWQpIHtcbiAgICAgIGVuZERyYWcoKTtcbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkcmFnc3RhcnQnLCBbJyRldmVudCddKSBvbkRyYWdTdGFydChldmVudDogRG5kRXZlbnQpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlcmUgaXMgZG5kIGhhbmRsZSBhbmQgaWYgdGhlIGRuZCBoYW5kbGUgd2FzIHVzZWQgdG8gc3RhcnQgdGhlIGRyYWdcbiAgICBpZiAodGhpcy5kbmRIYW5kbGUgIT0gbnVsbCAmJiBldmVudC5fZG5kVXNpbmdIYW5kbGUgPT0gbnVsbCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaW5pdGlhbGl6ZSBnbG9iYWwgc3RhdGVcbiAgICBzdGFydERyYWcoZXZlbnQsIHRoaXMuZG5kRWZmZWN0QWxsb3dlZCwgdGhpcy5kbmRUeXBlKTtcblxuICAgIHRoaXMuaXNEcmFnU3RhcnRlZCA9IHRydWU7XG5cbiAgICBzZXREcmFnRGF0YShcbiAgICAgIGV2ZW50LFxuICAgICAgeyBkYXRhOiB0aGlzLmRuZERyYWdnYWJsZSwgdHlwZTogdGhpcy5kbmRUeXBlIH0sXG4gICAgICBkbmRTdGF0ZS5lZmZlY3RBbGxvd2VkIVxuICAgICk7XG5cbiAgICB0aGlzLmRyYWdJbWFnZSA9IHRoaXMuZGV0ZXJtaW5lRHJhZ0ltYWdlKCk7XG5cbiAgICAvLyBzZXQgZHJhZ2dpbmcgY3NzIGNsYXNzIHByaW9yIHRvIHNldERyYWdJbWFnZSBzbyBzdHlsZXMgYXJlIGFwcGxpZWQgYmVmb3JlXG4gICAgLy8gVE9ETyBicmVha2luZyBjaGFuZ2U6IGFkZCBjbGFzcyB0byBlbGVtZW50UmVmIHJhdGhlciB0aGFuIGRyYWcgaW1hZ2Ugd2hpY2ggY291bGQgYmUgYW5vdGhlciBlbGVtZW50XG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmRyYWdJbWFnZSwgdGhpcy5kbmREcmFnZ2luZ0NsYXNzKTtcblxuICAgIC8vIHNldCBjdXN0b20gZHJhZ2ltYWdlIGlmIHByZXNlbnRcbiAgICAvLyBzZXQgZHJhZ2ltYWdlIGlmIGRyYWcgaXMgc3RhcnRlZCBmcm9tIGRuZEhhbmRsZVxuICAgIGlmICh0aGlzLmRuZERyYWdJbWFnZUVsZW1lbnRSZWYgIT0gbnVsbCB8fCBldmVudC5fZG5kVXNpbmdIYW5kbGUgIT0gbnVsbCkge1xuICAgICAgc2V0RHJhZ0ltYWdlKGV2ZW50LCB0aGlzLmRyYWdJbWFnZSwgdGhpcy5kbmREcmFnSW1hZ2VPZmZzZXRGdW5jdGlvbik7XG4gICAgfVxuXG4gICAgLy8gYWRkIGRyYWdnaW5nIHNvdXJjZSBjc3MgY2xhc3Mgb24gZmlyc3QgZHJhZyBldmVudFxuICAgIGNvbnN0IHVucmVnaXN0ZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2RyYWcnLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgIHRoaXMuZG5kRHJhZ2dpbmdTb3VyY2VDbGFzc1xuICAgICAgICApO1xuICAgICAgICB1bnJlZ2lzdGVyKCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHRoaXMuZG5kU3RhcnQuZW1pdChldmVudCk7XG5cbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc0RyYWdTdGFydGVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5kcmFnSW1hZ2UsICdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG4gICAgICB9XG4gICAgfSwgMTAwKTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgb25EcmFnKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICB0aGlzLmRuZERyYWcuZW1pdChldmVudCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSkgb25EcmFnRW5kKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZHJhZ2dhYmxlIHx8ICF0aGlzLmlzRHJhZ1N0YXJ0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZ2V0IGRyb3AgZWZmZWN0IGZyb20gY3VzdG9tIHN0b3JlZCBzdGF0ZSBhcyBpdHMgbm90IHJlbGlhYmxlIGFjcm9zcyBicm93c2Vyc1xuICAgIGNvbnN0IGRyb3BFZmZlY3QgPSBkbmRTdGF0ZS5kcm9wRWZmZWN0O1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmRyYWdJbWFnZSwgJ3BvaW50ZXItZXZlbnRzJywgJ3Vuc2V0Jyk7XG5cbiAgICBsZXQgZHJvcEVmZmVjdEVtaXR0ZXI6IEV2ZW50RW1pdHRlcjxEcmFnRXZlbnQ+O1xuXG4gICAgc3dpdGNoIChkcm9wRWZmZWN0KSB7XG4gICAgICBjYXNlICdjb3B5JzpcbiAgICAgICAgZHJvcEVmZmVjdEVtaXR0ZXIgPSB0aGlzLmRuZENvcGllZDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2xpbmsnOlxuICAgICAgICBkcm9wRWZmZWN0RW1pdHRlciA9IHRoaXMuZG5kTGlua2VkO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbW92ZSc6XG4gICAgICAgIGRyb3BFZmZlY3RFbWl0dGVyID0gdGhpcy5kbmRNb3ZlZDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRyb3BFZmZlY3RFbWl0dGVyID0gdGhpcy5kbmRDYW5jZWxlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgZHJvcEVmZmVjdEVtaXR0ZXIuZW1pdChldmVudCk7XG4gICAgdGhpcy5kbmRFbmQuZW1pdChldmVudCk7XG5cbiAgICAvLyByZXNldCBnbG9iYWwgc3RhdGVcbiAgICBlbmREcmFnKCk7XG5cbiAgICB0aGlzLmlzRHJhZ1N0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5kcmFnSW1hZ2UsIHRoaXMuZG5kRHJhZ2dpbmdDbGFzcyk7XG5cbiAgICAvLyBJRTkgc3BlY2lhbCBoYW1tZXJpbmdcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxuICAgICAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgICAgdGhpcy5kbmREcmFnZ2luZ1NvdXJjZUNsYXNzXG4gICAgICApO1xuICAgIH0sIDApO1xuXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICByZWdpc3RlckRyYWdIYW5kbGUoaGFuZGxlOiBEbmRIYW5kbGVEaXJlY3RpdmUgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmRuZEhhbmRsZSA9IGhhbmRsZTtcbiAgfVxuXG4gIHJlZ2lzdGVyRHJhZ0ltYWdlKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmRuZERyYWdJbWFnZUVsZW1lbnRSZWYgPSBlbGVtZW50UmVmO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkcmFnRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IERyYWdFdmVudCkgPT4gdm9pZCA9IChcbiAgICBldmVudDogRHJhZ0V2ZW50XG4gICkgPT4gdGhpcy5vbkRyYWcoZXZlbnQpO1xuXG4gIHByaXZhdGUgZGV0ZXJtaW5lRHJhZ0ltYWdlKCk6IEVsZW1lbnQge1xuICAgIC8vIGV2YWx1YXRlIGN1c3RvbSBkcmFnIGltYWdlIGV4aXN0ZW5jZVxuICAgIGlmICh0eXBlb2YgdGhpcy5kbmREcmFnSW1hZ2VFbGVtZW50UmVmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHRoaXMuZG5kRHJhZ0ltYWdlRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IGFzIEVsZW1lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==