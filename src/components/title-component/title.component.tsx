import type {TitleComponentProps} from "./title-component.props";

export function TitleComponent(props: TitleComponentProps): JSX.Element {

    const {title} = props;

    return (<div className='title-component__container' data-testid='title-component__container'>
        <h1 className='title-component__title' data-testid='title-component__title'
        >{
            !title
                ? (<span className='title-component__title__text' data-testid='title-component__title__text'></span>)
                : (<span className='title-component__title__text' data-testid='title-component__title__text'>{title}</span>)
        }</h1>
    </div>);
}
