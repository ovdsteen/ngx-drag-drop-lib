import * as i0 from '@angular/core';
import { OnInit, OnDestroy, ElementRef, AfterViewInit, EventEmitter, NgZone, Renderer2 } from '@angular/core';

type DropEffect = 'move' | 'copy' | 'link' | 'none';
type EffectAllowed = DropEffect | 'copyMove' | 'copyLink' | 'linkMove' | 'all' | 'uninitialized';

interface DndEvent extends DragEvent {
    _dndUsingHandle?: boolean;
    _dndDropzoneActive?: true;
}
type DndDragImageOffsetFunction = (event: DragEvent, dragImage: Element) => {
    x: number;
    y: number;
};

declare class DndHandleDirective implements OnInit, OnDestroy {
    draggable: boolean;
    dndDraggableDirective: DndDraggableDirective;
    ngOnInit(): void;
    ngOnDestroy(): void;
    onDragEvent(event: DndEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndHandleDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndHandleDirective, "[dndHandle]", never, {}, {}, never, never, true, never>;
}

declare class DndDragImageRefDirective implements OnInit {
    dndDraggableDirective: any;
    elementRef: ElementRef<HTMLElement>;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndDragImageRefDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndDragImageRefDirective, "[dndDragImageRef]", never, {}, {}, never, never, true, never>;
}
declare class DndDraggableDirective implements AfterViewInit, OnDestroy {
    dndDraggable: any;
    dndEffectAllowed: EffectAllowed;
    dndType?: string;
    dndDraggingClass: string;
    dndDraggingSourceClass: string;
    dndDraggableDisabledClass: string;
    dndDragImageOffsetFunction: DndDragImageOffsetFunction;
    readonly dndStart: EventEmitter<DragEvent>;
    readonly dndDrag: EventEmitter<DragEvent>;
    readonly dndEnd: EventEmitter<DragEvent>;
    readonly dndMoved: EventEmitter<DragEvent>;
    readonly dndCopied: EventEmitter<DragEvent>;
    readonly dndLinked: EventEmitter<DragEvent>;
    readonly dndCanceled: EventEmitter<DragEvent>;
    draggable: boolean;
    private dndHandle?;
    private dndDragImageElementRef?;
    private dragImage;
    private isDragStarted;
    private elementRef;
    private renderer;
    private ngZone;
    set dndDisableIf(value: boolean);
    set dndDisableDragIf(value: boolean);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onDragStart(event: DndEvent): boolean;
    onDrag(event: DragEvent): void;
    onDragEnd(event: DragEvent): void;
    registerDragHandle(handle: DndHandleDirective | undefined): void;
    registerDragImage(elementRef: ElementRef | undefined): void;
    private readonly dragEventHandler;
    private determineDragImage;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndDraggableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndDraggableDirective, "[dndDraggable]", never, { "dndDraggable": { "alias": "dndDraggable"; "required": false; }; "dndEffectAllowed": { "alias": "dndEffectAllowed"; "required": false; }; "dndType": { "alias": "dndType"; "required": false; }; "dndDraggingClass": { "alias": "dndDraggingClass"; "required": false; }; "dndDraggingSourceClass": { "alias": "dndDraggingSourceClass"; "required": false; }; "dndDraggableDisabledClass": { "alias": "dndDraggableDisabledClass"; "required": false; }; "dndDragImageOffsetFunction": { "alias": "dndDragImageOffsetFunction"; "required": false; }; "dndDisableIf": { "alias": "dndDisableIf"; "required": false; }; "dndDisableDragIf": { "alias": "dndDisableDragIf"; "required": false; }; }, { "dndStart": "dndStart"; "dndDrag": "dndDrag"; "dndEnd": "dndEnd"; "dndMoved": "dndMoved"; "dndCopied": "dndCopied"; "dndLinked": "dndLinked"; "dndCanceled": "dndCanceled"; }, never, never, true, never>;
}

interface DndDropEvent {
    event: DragEvent;
    dropEffect: DropEffect;
    isExternal: boolean;
    data?: any;
    index?: number;
    type?: any;
}
declare class DndPlaceholderRefDirective implements OnInit {
    readonly elementRef: ElementRef<HTMLElement>;
    constructor(elementRef: ElementRef<HTMLElement>);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndPlaceholderRefDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndPlaceholderRefDirective, "[dndPlaceholderRef]", never, {}, {}, never, never, true, never>;
}
declare class DndDropzoneDirective implements AfterViewInit, OnDestroy {
    private ngZone;
    private elementRef;
    private renderer;
    dndDropzone?: string[] | '';
    dndEffectAllowed: EffectAllowed;
    dndAllowExternal: boolean;
    dndHorizontal: boolean;
    dndDragoverClass: string;
    dndDropzoneDisabledClass: string;
    readonly dndDragover: EventEmitter<DragEvent>;
    readonly dndDrop: EventEmitter<DndDropEvent>;
    private readonly dndPlaceholderRef?;
    private placeholder;
    private disabled;
    private enterCount;
    constructor(ngZone: NgZone, elementRef: ElementRef, renderer: Renderer2);
    set dndDisableIf(value: boolean);
    set dndDisableDropIf(value: boolean);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onDragEnter(event: DndEvent): void;
    onDragOver(event: DragEvent): void;
    onDrop(event: DragEvent): void;
    onDragLeave(event: DndEvent): void;
    private readonly dragEnterEventHandler;
    private readonly dragOverEventHandler;
    private readonly dragLeaveEventHandler;
    private isDropAllowed;
    private tryGetPlaceholder;
    private removePlaceholderFromDOM;
    private checkAndUpdatePlaceholderPosition;
    private getPlaceholderIndex;
    private cleanupDragoverState;
    static ɵfac: i0.ɵɵFactoryDeclaration<DndDropzoneDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DndDropzoneDirective, "[dndDropzone]", never, { "dndDropzone": { "alias": "dndDropzone"; "required": false; }; "dndEffectAllowed": { "alias": "dndEffectAllowed"; "required": false; }; "dndAllowExternal": { "alias": "dndAllowExternal"; "required": false; }; "dndHorizontal": { "alias": "dndHorizontal"; "required": false; }; "dndDragoverClass": { "alias": "dndDragoverClass"; "required": false; }; "dndDropzoneDisabledClass": { "alias": "dndDropzoneDisabledClass"; "required": false; }; "dndDisableIf": { "alias": "dndDisableIf"; "required": false; }; "dndDisableDropIf": { "alias": "dndDisableDropIf"; "required": false; }; }, { "dndDragover": "dndDragover"; "dndDrop": "dndDrop"; }, ["dndPlaceholderRef"], never, true, never>;
}

declare class DndModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<DndModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DndModule, never, [typeof DndDragImageRefDirective, typeof DndDropzoneDirective, typeof DndHandleDirective, typeof DndPlaceholderRefDirective, typeof DndDraggableDirective], [typeof DndDraggableDirective, typeof DndDropzoneDirective, typeof DndHandleDirective, typeof DndPlaceholderRefDirective, typeof DndDragImageRefDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DndModule>;
}

export { DndDragImageRefDirective, DndDraggableDirective, DndDropzoneDirective, DndHandleDirective, DndModule, DndPlaceholderRefDirective };
export type { DndDragImageOffsetFunction, DndDropEvent, DropEffect, EffectAllowed };
