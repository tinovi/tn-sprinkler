import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { SPRINKLER_SETTINGS_ENDPOINT } from '../api';

import ManageTriggersForm from './ManageTriggersForm';
import { SprinklerSettings } from './types';

type TriggerControllerProps = RestControllerProps<SprinklerSettings>;

class TriggerController extends Component<TriggerControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Trigger list" titleGutter>
        <RestFormLoader
          {...this.props}
          render={formProps => <ManageTriggersForm {...formProps} />}
        />
      </SectionContent>
    )
  }

}

export default restController(SPRINKLER_SETTINGS_ENDPOINT, TriggerController);
