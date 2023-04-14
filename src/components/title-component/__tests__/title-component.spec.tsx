import {afterAll, afterEach, beforeAll, describe, expect, it} from "vitest";
import {cleanup, render, RenderResult} from "@testing-library/react";
import { TitleComponent } from '../title-component';
import {faker} from "@faker-js/faker";

describe('Title component tests', () => {

    let component: RenderResult;

    beforeAll(() => {
        component = render(<TitleComponent />);
    });

    it('Should render the UI element without title text', () => {

        const container = component.getByTestId('title-component__container');
        const title = component.getByTestId('title-component__title');
        const titleText = component.getByTestId('title-component__title__text');

        expect(container).toBeTruthy();
        expect(title).toBeTruthy();
        expect(titleText).toBeTruthy();
        expect(titleText.textContent).toBeFalsy();

    });

    it('Should render the UI element with title text if text is provided', () => {

        const fakeTitle = faker.random.words(2);
        component.rerender(<TitleComponent  title={fakeTitle}/>);

        const container = component.getByTestId('title-component__container');
        const title = component.getByTestId('title-component__title');
        const titleText = component.getByTestId('title-component__title__text');

        expect(container).toBeTruthy();
        expect(title).toBeTruthy();
        expect(titleText).toBeTruthy();
        expect(titleText.textContent).toBeTruthy();
        expect(titleText.textContent).toEqual(fakeTitle);

    });

    afterAll(() => {
        component.unmount();
        cleanup();
    });

});
