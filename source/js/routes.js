import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import { routeCodes } from 'constants/routes';

import Home from 'components/Home';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route
        component={ Home }
        exact
        path={ routeCodes.HOME }
      />
    </Switch>
  </BrowserRouter>
);

export default Routes;
