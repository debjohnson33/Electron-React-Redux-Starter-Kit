import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// layouts
import MainLayout from './layouts/mainLayout';

// routes/screens
import Blades from './screens/blades';

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" render={props => (
                        <MainLayout>
                            <Blades {...props} />
                        </MainLayout>
                    )} />
                </Switch>
            </Router>
        )
    }
}

export default App;