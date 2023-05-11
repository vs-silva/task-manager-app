import {Router} from "./router";
import {MainLayout} from "./layout/main-layout";
import {LoaderComponent} from "./components/loarder-component/loader.component";
import {useEffect, useState} from "react";
import Eventbus from "./eventbus";
import {ApiEngineEventTypeConstants} from "./api-engine/constants/api-engine-event-type.constants";

export  default function App(): JSX.Element {

  const [initialLoad, setInitialLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {

        if(initialLoad) {
            setInitialLoad(false);
            return;
        }

        Eventbus.on(ApiEngineEventTypeConstants.SERVICE_REQUEST_STARTED, () => {
            setShowLoader(true);
        });

        Eventbus.on(ApiEngineEventTypeConstants.SERVICE_REQUEST_ENDED, () => {
            setShowLoader(false);
        });

    }, [initialLoad]);

  return (
    <div className="App">
        <LoaderComponent show={showLoader}/>
        <MainLayout>
            <Router />
        </MainLayout>
    </div>
  );
}

