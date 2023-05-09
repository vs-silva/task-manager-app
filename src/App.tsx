import {Router} from "./router";
import {MainLayout} from "./layout/main-layout";
import {LoaderComponent} from "./components/loarder-component/loader.component";
import {useState} from "react";

export  default function App(): JSX.Element {

    const [showLoader, setShowLoader] = useState(false);

  return (
    <div className="App">
        <LoaderComponent show={showLoader}/>
        <MainLayout>
            <Router />
        </MainLayout>
    </div>
  );
}

