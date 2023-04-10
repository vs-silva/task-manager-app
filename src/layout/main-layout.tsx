export function MainLayout(props: {children: JSX.Element}): JSX.Element {

    const {children} = props;

    return (<div className="layout-container" data-testid="layout-container">
        {children}
    </div>);
}
