import {Router} from "./router";
import {MainLayout} from "./layout/main-layout";

export  default function App(): JSX.Element {
  return (
    <div className="App">
        <MainLayout>
            <Router />
        </MainLayout>
    </div>
  );
}

