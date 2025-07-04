import * as i0 from '@angular/core';
import { inject, forwardRef, ElementRef, Directive, EventEmitter, Renderer2, NgZone, Input, Output, HostBinding, HostListener, ContentChild, NgModule } from '@angular/core';

const DROP_EFFECTS = ['move', 'copy', 'link'];
const CUSTOM_MIME_TYPE = 'application/x-dnd';
const JSON_MIME_TYPE = 'application/json';
const MSIE_MIME_TYPE = 'Text';
function mimeTypeIsCustom(mimeType) {
    return mimeType.substr(0, CUSTOM_MIME_TYPE.length) === CUSTOM_MIME_TYPE;
}
function getWellKnownMimeType(event) {
    if (event.dataTransfer) {
        const types = event.dataTransfer.types;
        // IE 9 workaround.
        if (!types) {
            return MSIE_MIME_TYPE;
        }
        for (let i = 0; i < types.length; i++) {
            if (types[i] === MSIE_MIME_TYPE ||
                types[i] === JSON_MIME_TYPE ||
                mimeTypeIsCustom(types[i])) {
                return types[i];
            }
        }
    }
    return null;
}
function setDragData(event, data, effectAllowed) {
    // Internet Explorer and Microsoft Edge don't support custom mime types, see design doc:
    // https://github.com/marceljuenemann/angular-drag-and-drop-lists/wiki/Data-Transfer-Design
    const mimeType = CUSTOM_MIME_TYPE + (data.type ? '-' + data.type : '');
    const dataString = JSON.stringify(data);
    try {
        event.dataTransfer?.setData(mimeType, dataString);
    }
    catch (e) {
        //   Setting a custom MIME type did not work, we are probably in IE or Edge.
        try {
            event.dataTransfer?.setData(JSON_MIME_TYPE, dataString);
        }
        catch (e) {
            //   We are in Internet Explorer and can only use the Text MIME type. Also note that IE
            //   does not allow changing the cursor in the dragover event, therefore we have to choose
            //   the one we want to display now by setting effectAllowed.
            const effectsAllowed = filterEffects(DROP_EFFECTS, effectAllowed);
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = effectsAllowed[0];
            }
            event.dataTransfer?.setData(MSIE_MIME_TYPE, dataString);
        }
    }
}
function getDropData(event, dragIsExternal) {
    // check if the mime type is well known
    const mimeType = getWellKnownMimeType(event);
    // drag did not originate from [dndDraggable]
    if (dragIsExternal === true) {
        if (mimeType !== null && mimeTypeIsCustom(mimeType)) {
            // the type of content is well known and safe to handle
            return JSON.parse(event.dataTransfer?.getData(mimeType) ?? '{}');
        }
        // the contained data is unknown, let user handle it
        return {};
    }
    if (mimeType !== null) {
        // the type of content is well known and safe to handle
        return JSON.parse(event.dataTransfer?.getData(mimeType) ?? '{}');
    }
    // the contained data is unknown, let user handle it
    return {};
}
function filterEffects(effects, allowed) {
    if (allowed === 'all' || allowed === 'uninitialized') {
        return effects;
    }
    return effects.filter(function (effect) {
        return allowed.toLowerCase().indexOf(effect) !== -1;
    });
}
function getDirectChildElement(parentElement, childElement) {
    let directChild = childElement;
    while (directChild.parentNode !== parentElement) {
        // reached root node without finding given parent
        if (!directChild.parentNode) {
            return null;
        }
        directChild = directChild.parentNode;
    }
    return directChild;
}
function shouldPositionPlaceholderBeforeElement(event, element, horizontal) {
    const bounds = element.getBoundingClientRect();
    // If the pointer is in the upper half of the list item element,
    // we position the placeholder before the list item, otherwise after it.
    if (horizontal) {
        return event.clientX < bounds.left + bounds.width / 2;
    }
    return event.clientY < bounds.top + bounds.height / 2;
}
function calculateDragImageOffset(event, dragImage) {
    const dragImageComputedStyle = window.getComputedStyle(dragImage);
    const paddingTop = parseFloat(dragImageComputedStyle.paddingTop) || 0;
    const paddingLeft = parseFloat(dragImageComputedStyle.paddingLeft) || 0;
    const borderTop = parseFloat(dragImageComputedStyle.borderTopWidth) || 0;
    const borderLeft = parseFloat(dragImageComputedStyle.borderLeftWidth) || 0;
    return {
        x: event.offsetX + paddingLeft + borderLeft,
        y: event.offsetY + paddingTop + borderTop,
    };
}
function setDragImage(event, dragImage, offsetFunction) {
    const offset = offsetFunction(event, dragImage) || { x: 0, y: 0 };
    event.dataTransfer.setDragImage(dragImage, offset.x, offset.y);
}

const _dndState = {
    isDragging: false,
    dropEffect: 'none',
    effectAllowed: 'all',
    type: undefined,
};
function startDrag(event, effectAllowed, type) {
    _dndState.isDragging = true;
    _dndState.dropEffect = 'none';
    _dndState.effectAllowed = effectAllowed;
    _dndState.type = type;
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = effectAllowed;
    }
}
function endDrag() {
    _dndState.isDragging = false;
    _dndState.dropEffect = undefined;
    _dndState.effectAllowed = undefined;
    _dndState.type = undefined;
}
function setDropEffect(event, dropEffect) {
    if (_dndState.isDragging === true) {
        _dndState.dropEffect = dropEffect;
    }
    if (event.dataTransfer) {
        event.dataTransfer.dropEffect = dropEffect;
    }
}
function getDropEffect(event, effectAllowed) {
    const dataTransferEffectAllowed = event.dataTransfer
        ? event.dataTransfer.effectAllowed
        : 'uninitialized';
    let effects = filterEffects(DROP_EFFECTS, dataTransferEffectAllowed);
    if (_dndState.isDragging === true) {
        effects = filterEffects(effects, _dndState.effectAllowed);
    }
    if (effectAllowed) {
        effects = filterEffects(effects, effectAllowed);
    }
    // MacOS automatically filters dataTransfer.effectAllowed depending on the modifier keys,
    // therefore the following modifier keys will only affect other operating systems.
    if (effects.length === 0) {
        return 'none';
    }
    if (event.ctrlKey && effects.indexOf('copy') !== -1) {
        return 'copy';
    }
    if (event.altKey && effects.indexOf('link') !== -1) {
        return 'link';
    }
    return effects[0];
}
function getDndType(event) {
    if (_dndState.isDragging === true) {
        return _dndState.type;
    }
    const mimeType = getWellKnownMimeType(event);
    if (mimeType === null) {
        return undefined;
    }
    if (mimeType === MSIE_MIME_TYPE || mimeType === JSON_MIME_TYPE) {
        return undefined;
    }
    return mimeType.substr(CUSTOM_MIME_TYPE.length + 1) || undefined;
}
function isExternalDrag() {
    return _dndState.isDragging === false;
}
const dndState = _dndState;

class DndDragImageRefDirective {
    dndDraggableDirective = inject(forwardRef(() => DndDraggableDirective));
    elementRef = inject(ElementRef);
    ngOnInit() {
        this.dndDraggableDirective.registerDragImage(this.elementRef);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDragImageRefDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.6", type: DndDragImageRefDirective, isStandalone: true, selector: "[dndDragImageRef]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDragImageRefDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndDragImageRef]', standalone: true }]
        }] });
class DndDraggableDirective {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDraggableDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.6", type: DndDraggableDirective, isStandalone: true, selector: "[dndDraggable]", inputs: { dndDraggable: "dndDraggable", dndEffectAllowed: "dndEffectAllowed", dndType: "dndType", dndDraggingClass: "dndDraggingClass", dndDraggingSourceClass: "dndDraggingSourceClass", dndDraggableDisabledClass: "dndDraggableDisabledClass", dndDragImageOffsetFunction: "dndDragImageOffsetFunction", dndDisableIf: "dndDisableIf", dndDisableDragIf: "dndDisableDragIf" }, outputs: { dndStart: "dndStart", dndDrag: "dndDrag", dndEnd: "dndEnd", dndMoved: "dndMoved", dndCopied: "dndCopied", dndLinked: "dndLinked", dndCanceled: "dndCanceled" }, host: { listeners: { "dragstart": "onDragStart($event)", "dragend": "onDragEnd($event)" }, properties: { "attr.draggable": "this.draggable" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDraggableDirective, decorators: [{
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

class DndPlaceholderRefDirective {
    elementRef;
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnInit() {
        // placeholder has to be "invisible" to the cursor, or it would interfere with the dragover detection for the same dropzone
        this.elementRef.nativeElement.style.pointerEvents = 'none';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndPlaceholderRefDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.6", type: DndPlaceholderRefDirective, isStandalone: true, selector: "[dndPlaceholderRef]", ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndPlaceholderRefDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndPlaceholderRef]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });
class DndDropzoneDirective {
    ngZone;
    elementRef;
    renderer;
    dndDropzone = '';
    dndEffectAllowed = 'uninitialized';
    dndAllowExternal = false;
    dndHorizontal = false;
    dndDragoverClass = 'dndDragover';
    dndDropzoneDisabledClass = 'dndDropzoneDisabled';
    dndDragover = new EventEmitter();
    dndDrop = new EventEmitter();
    dndPlaceholderRef;
    placeholder = null;
    disabled = false;
    enterCount = 0;
    constructor(ngZone, elementRef, renderer) {
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.renderer = renderer;
    }
    set dndDisableIf(value) {
        this.disabled = value;
        if (this.disabled) {
            this.renderer.addClass(this.elementRef.nativeElement, this.dndDropzoneDisabledClass);
        }
        else {
            this.renderer.removeClass(this.elementRef.nativeElement, this.dndDropzoneDisabledClass);
        }
    }
    set dndDisableDropIf(value) {
        this.dndDisableIf = value;
    }
    ngAfterViewInit() {
        this.placeholder = this.tryGetPlaceholder();
        this.removePlaceholderFromDOM();
        this.ngZone.runOutsideAngular(() => {
            this.elementRef.nativeElement.addEventListener('dragenter', this.dragEnterEventHandler);
            this.elementRef.nativeElement.addEventListener('dragover', this.dragOverEventHandler);
            this.elementRef.nativeElement.addEventListener('dragleave', this.dragLeaveEventHandler);
        });
    }
    ngOnDestroy() {
        this.elementRef.nativeElement.removeEventListener('dragenter', this.dragEnterEventHandler);
        this.elementRef.nativeElement.removeEventListener('dragover', this.dragOverEventHandler);
        this.elementRef.nativeElement.removeEventListener('dragleave', this.dragLeaveEventHandler);
    }
    onDragEnter(event) {
        this.enterCount++;
        // check if another dropzone is activated
        if (event._dndDropzoneActive === true) {
            this.cleanupDragoverState();
            return;
        }
        // set as active if the target element is inside this dropzone
        if (event._dndDropzoneActive == null) {
            const newTarget = document.elementFromPoint(event.clientX, event.clientY);
            if (this.elementRef.nativeElement.contains(newTarget)) {
                event._dndDropzoneActive = true;
            }
        }
        // check if this drag event is allowed to drop on this dropzone
        const type = getDndType(event);
        if (!this.isDropAllowed(type)) {
            return;
        }
        // allow the dragenter
        event.preventDefault();
    }
    onDragOver(event) {
        // With nested dropzones, we want to ignore this event if a child dropzone
        // has already handled a dragover.  Historically, event.stopPropagation() was
        // used to prevent this bubbling, but that prevents any dragovers outside the
        // ngx-drag-drop component, and stops other use cases such as scrolling on drag.
        // Instead, we can check if the event was already prevented by a child and bail early.
        if (event.defaultPrevented) {
            return;
        }
        // check if this drag event is allowed to drop on this dropzone
        const type = getDndType(event);
        if (!this.isDropAllowed(type)) {
            return;
        }
        this.checkAndUpdatePlaceholderPosition(event);
        const dropEffect = getDropEffect(event, this.dndEffectAllowed);
        if (dropEffect === 'none') {
            this.cleanupDragoverState();
            return;
        }
        // allow the dragover
        event.preventDefault();
        // set the drop effect
        setDropEffect(event, dropEffect);
        this.dndDragover.emit(event);
        this.renderer.addClass(this.elementRef.nativeElement, this.dndDragoverClass);
    }
    onDrop(event) {
        try {
            // check if this drag event is allowed to drop on this dropzone
            const type = getDndType(event);
            if (!this.isDropAllowed(type)) {
                return;
            }
            const data = getDropData(event, isExternalDrag());
            if (!this.isDropAllowed(data.type)) {
                return;
            }
            // signal custom drop handling
            event.preventDefault();
            const dropEffect = getDropEffect(event);
            setDropEffect(event, dropEffect);
            if (dropEffect === 'none') {
                return;
            }
            const dropIndex = this.getPlaceholderIndex();
            // if for whatever reason the placeholder is not present in the DOM but it should be there
            // we don't allow/emit the drop event since it breaks the contract
            // seems to only happen if drag and drop is executed faster than the DOM updates
            if (dropIndex === -1) {
                return;
            }
            this.dndDrop.emit({
                event: event,
                dropEffect: dropEffect,
                isExternal: isExternalDrag(),
                data: data.data,
                index: dropIndex,
                type: type,
            });
            event.stopPropagation();
        }
        finally {
            this.cleanupDragoverState();
        }
    }
    onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.enterCount--;
        // check if still inside this dropzone and not yet handled by another dropzone
        if (event._dndDropzoneActive == null) {
            if (this.enterCount !== 0) {
                event._dndDropzoneActive = true;
                return;
            }
        }
        this.cleanupDragoverState();
        // cleanup drop effect when leaving dropzone
        setDropEffect(event, 'none');
    }
    dragEnterEventHandler = (event) => this.onDragEnter(event);
    dragOverEventHandler = (event) => this.onDragOver(event);
    dragLeaveEventHandler = (event) => this.onDragLeave(event);
    isDropAllowed(type) {
        // dropzone is disabled -> deny it
        if (this.disabled) {
            return false;
        }
        // if drag did not start from our directive
        // and external drag sources are not allowed -> deny it
        if (isExternalDrag() && !this.dndAllowExternal) {
            return false;
        }
        // no filtering by types -> allow it
        if (!this.dndDropzone) {
            return true;
        }
        // no type set -> allow it
        if (!type) {
            return true;
        }
        if (!Array.isArray(this.dndDropzone)) {
            throw new Error('dndDropzone: bound value to [dndDropzone] must be an array!');
        }
        // if dropzone contains type -> allow it
        return this.dndDropzone.indexOf(type) !== -1;
    }
    tryGetPlaceholder() {
        if (typeof this.dndPlaceholderRef !== 'undefined') {
            return this.dndPlaceholderRef.elementRef.nativeElement;
        }
        // TODO nasty workaround needed because if ng-container / template is used @ContentChild() or DI will fail because
        // of wrong context see angular bug https://github.com/angular/angular/issues/13517
        return this.elementRef.nativeElement.querySelector('[dndPlaceholderRef]');
    }
    removePlaceholderFromDOM() {
        if (this.placeholder !== null && this.placeholder.parentNode !== null) {
            this.placeholder.parentNode.removeChild(this.placeholder);
        }
    }
    checkAndUpdatePlaceholderPosition(event) {
        if (this.placeholder === null) {
            return;
        }
        // make sure the placeholder is in the DOM
        if (this.placeholder.parentNode !== this.elementRef.nativeElement) {
            this.renderer.appendChild(this.elementRef.nativeElement, this.placeholder);
        }
        // update the position if the event originates from a child element of the dropzone
        const directChild = getDirectChildElement(this.elementRef.nativeElement, event.target);
        // early exit if no direct child or direct child is placeholder
        if (directChild === null || directChild === this.placeholder) {
            return;
        }
        const positionPlaceholderBeforeDirectChild = shouldPositionPlaceholderBeforeElement(event, directChild, this.dndHorizontal);
        if (positionPlaceholderBeforeDirectChild) {
            // do insert before only if necessary
            if (directChild.previousSibling !== this.placeholder) {
                this.renderer.insertBefore(this.elementRef.nativeElement, this.placeholder, directChild);
            }
        }
        else {
            // do insert after only if necessary
            if (directChild.nextSibling !== this.placeholder) {
                this.renderer.insertBefore(this.elementRef.nativeElement, this.placeholder, directChild.nextSibling);
            }
        }
    }
    getPlaceholderIndex() {
        if (this.placeholder === null) {
            return undefined;
        }
        const element = this.elementRef.nativeElement;
        return Array.prototype.indexOf.call(element.children, this.placeholder);
    }
    cleanupDragoverState() {
        this.renderer.removeClass(this.elementRef.nativeElement, this.dndDragoverClass);
        this.enterCount = 0;
        this.removePlaceholderFromDOM();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDropzoneDirective, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.6", type: DndDropzoneDirective, isStandalone: true, selector: "[dndDropzone]", inputs: { dndDropzone: "dndDropzone", dndEffectAllowed: "dndEffectAllowed", dndAllowExternal: "dndAllowExternal", dndHorizontal: "dndHorizontal", dndDragoverClass: "dndDragoverClass", dndDropzoneDisabledClass: "dndDropzoneDisabledClass", dndDisableIf: "dndDisableIf", dndDisableDropIf: "dndDisableDropIf" }, outputs: { dndDragover: "dndDragover", dndDrop: "dndDrop" }, host: { listeners: { "drop": "onDrop($event)" } }, queries: [{ propertyName: "dndPlaceholderRef", first: true, predicate: DndPlaceholderRefDirective, descendants: true }], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndDropzoneDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[dndDropzone]', standalone: true }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.Renderer2 }], propDecorators: { dndDropzone: [{
                type: Input
            }], dndEffectAllowed: [{
                type: Input
            }], dndAllowExternal: [{
                type: Input
            }], dndHorizontal: [{
                type: Input
            }], dndDragoverClass: [{
                type: Input
            }], dndDropzoneDisabledClass: [{
                type: Input
            }], dndDragover: [{
                type: Output
            }], dndDrop: [{
                type: Output
            }], dndPlaceholderRef: [{
                type: ContentChild,
                args: [DndPlaceholderRefDirective]
            }], dndDisableIf: [{
                type: Input
            }], dndDisableDropIf: [{
                type: Input
            }], onDrop: [{
                type: HostListener,
                args: ['drop', ['$event']]
            }] } });

class DndHandleDirective {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndHandleDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.6", type: DndHandleDirective, isStandalone: true, selector: "[dndHandle]", host: { listeners: { "dragstart": "onDragEvent($event)", "dragend": "onDragEvent($event)" }, properties: { "attr.draggable": "this.draggable" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndHandleDirective, decorators: [{
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

class DndModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.0.6", ngImport: i0, type: DndModule, imports: [DndDragImageRefDirective,
            DndDropzoneDirective,
            DndHandleDirective,
            DndPlaceholderRefDirective,
            DndDraggableDirective], exports: [DndDraggableDirective,
            DndDropzoneDirective,
            DndHandleDirective,
            DndPlaceholderRefDirective,
            DndDragImageRefDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.6", ngImport: i0, type: DndModule, decorators: [{
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

/*
 * Public API Surface of dnd
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DndDragImageRefDirective, DndDraggableDirective, DndDropzoneDirective, DndHandleDirective, DndModule, DndPlaceholderRefDirective };
//# sourceMappingURL=ngx-drag-drop.mjs.map
