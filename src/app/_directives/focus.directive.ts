import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[onFocus]',
})
export class OnFocusDirective implements AfterViewInit
{
    private sub: Subscription;
    private el: ElementRef;

    constructor(
        private _el: ElementRef,
        public renderer: Renderer2
    )
    {
        this.el = this._el;
    }

    ngAfterViewInit()
    {
        this.tryFocusFirstButton();
    }

    tryFocusFirstButton()
    {
        setTimeout(() => {
            const selected_button = $(".select-button");
            if (!selected_button?.length)
            {
                $(`button[tabindex=0]`)?.trigger('focus');
            }
        }, 100)
    }

    @HostListener('focus', ['$event']) onFocus()
    {
        this.renderer.addClass(this._el.nativeElement, 'select-button');
    }
    @HostListener('blur', ['$event']) onblur()
    {
        this.renderer.removeClass(this._el.nativeElement, 'select-button');
        this.tryFocusFirstButton();
    }
}
