import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../api';
import { MenuAppBar } from '../components';
import { AuthenticatedRoute } from '../authentication';

import DeviceInfoController from './DeviceInfoController';
import TriggerController from './TriggerController';

class SprinklerProject extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Sprinkler controller">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/sprinkler/devices`} label="Device List" />
          <Tab value={`/${PROJECT_PATH}/sprinkler/controller`} label="Demo Controller" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/sprinkler/devices`} component={DeviceInfoController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/sprinkler/controller`} component={TriggerController} />
          <Redirect to={`/${PROJECT_PATH}/sprinkler/information`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default SprinklerProject;
