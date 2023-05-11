export function LoaderComponent(props: {show: boolean}): JSX.Element {

    const {show} = props;

    if(!show) {
        return (<></>);
    }

    return (<div className='loader-component__container' data-testid='loader-component__container'>
        <div className='loader-component__item' data-testid='loader-component__item'></div>
    </div>);

}
