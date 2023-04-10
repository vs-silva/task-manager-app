import { useTranslation } from 'react-i18next';
export function HomePage(): JSX.Element {
    const { t } = useTranslation();


    return (<div>
        <p>{t('hello_world')}</p>
        <p>{t('inner.msg')}</p>
    </div>);
}
