import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {cleanup, render, RenderResult} from "@testing-library/react";
import {LoaderComponent} from "../loader.component";

describe('Loader component tests', () => {

    let component: RenderResult;

    beforeAll(() => {
        component = render(<LoaderComponent show={false}/>);
    });

    it('Should not render any element is show is set to false', () => {
        expect(component.container.children.length).toEqual(0);
    });

    it('Should render any element is show is set to true', () => {

        component.rerender(<LoaderComponent show={true}/>);

        const container = component.getByTestId('loader-component__container');
        const loaderItem = component.getByTestId('loader-component__item');

        expect(container).toBeTruthy();
        expect(loaderItem).toBeTruthy();

    });

    afterAll(() => {
        component.unmount();
        cleanup();
    });
});
