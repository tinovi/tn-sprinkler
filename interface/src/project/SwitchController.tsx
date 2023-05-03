import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { SPRINKLER_SETTINGS_ENDPOINT } from '../api';

import ManageSwitchForm from './ManageSwitchForm';
import { SprinklerSettings } from './types';

type SwitchControllerProps = RestControllerProps<SprinklerSettings>;

class SwitchController extends Component<SwitchControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Switch list" titleGutter>
        <RestFormLoader
          {...this.props}
          render={formProps => <ManageSwitchForm {...formProps} />}
        />
      </SectionContent>
    )
  }

}

export default restController(SPRINKLER_SETTINGS_ENDPOINT, SwitchController);
