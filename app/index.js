import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import { getGlobalStats } from '../api/pandemic';
import LandingPage from './LandingPage';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import './index.css';

//Lazy loading country page for code splitting 
const CountryPage = React.lazy(() => import('./CountryPage'));

//Main component for landing page that shows stats for all countries
class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            countryStats : [],
            statDate: undefined,
            globalStats: {}
        }
    }
    componentDidMount() {
        getGlobalStats().then(
            data => {        
                this.setState({
                        countryStats: data
                    });
            }
        )
    }

    render(){
        return(
            <div className="container">
                <LandingPage stats = {this.state.countryStats} />
            </div>
        )
    }
}

//Primary app component that includes Error boundary and suspense for lazy loaded components
const App = () => {
    return (
        <main>
            <ErrorBoundary>
                <Suspense fallback={<Loading />}>
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/country/:name" component={CountryPage} />
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        </main>
    )
}

ReactDOM.render(<Router><App /></Router>, document.getElementById('ctrack'))