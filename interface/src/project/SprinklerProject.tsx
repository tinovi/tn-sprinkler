import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../api';
import { MenuAppBar } from '../components';
import { AuthenticatedRoute } from '../authentication';

import DeviceInfoController from './DeviceInfoController';
import TriggerController from './TriggerController';
import SwitchController from './SwitchController';

class SprinklerProject extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Sprinkler controller">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/devices`} label="Devices" />
          <Tab value={`/${PROJECT_PATH}/triggers`} label="Triggers" />
          <Tab value={`/${PROJECT_PATH}/switches`} label="Switches" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/devices`} component={DeviceInfoController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/triggers`} component={TriggerController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/switches`} component={SwitchController} />
          <Redirect to={`/${PROJECT_PATH}/devices`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default SprinklerProject;
