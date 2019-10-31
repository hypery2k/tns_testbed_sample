import { Component, ElementRef, NgZone, Renderer2 } from '@angular/core';
import { ComponentFixture, async } from '@angular/core/testing';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender
} from 'nativescript-angular/testing';

@Component({
    template: `
        <StackLayout><Label text="Layout"></Label></StackLayout>
    `
})
export class ZonedRenderer {
    constructor(public elementRef: ElementRef, public renderer: Renderer2) {}
}

describe('Renderer E2E', () => {
    beforeEach(nsTestBedBeforeEach([ZonedRenderer]));
    afterEach(nsTestBedAfterEach(false));

    it('executes events inside NgZone when listen is called outside NgZone', async(() => {
        const eventName = 'someEvent';
        const view = new StackLayout();
        const eventArg = { eventName, object: view };
        const callback = arg => {
            expect(arg).toEqual(eventArg);
            expect(NgZone.isInAngularZone()).toBeTruthy();
        };
        nsTestBedRender(ZonedRenderer).then(
            (fixture: ComponentFixture<ZonedRenderer>) => {
                fixture.ngZone.runOutsideAngular(() => {
                    fixture.componentInstance.renderer.listen(
                        view,
                        eventName,
                        callback
                    );

                    view.notify(eventArg);
                });
            }
        );
    }));
});
