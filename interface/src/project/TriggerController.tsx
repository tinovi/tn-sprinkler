import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { LIST_DEVICES_ENDPOINT } from '../api';

import ManageTriggersForm from './ManageTriggersForm';
import { TriggerSettings } from './types';

type TriggerControllerProps = RestControllerProps<TriggerSettings>;

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

export default restController(LIST_DEVICES_ENDPOINT, TriggerController);
