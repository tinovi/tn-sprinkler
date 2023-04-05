import React, { Component } from 'react';

import {restController, RestControllerProps, RestFormLoader, SectionContent } from '../components';
import { LIST_DEVICES_ENDPOINT } from '../api';

import DeviceInfoForm from './DeviceInfoForm';
import { DerviceInfoList } from './types';

type DeviceInfoControllerProps = RestControllerProps<DerviceInfoList>;

class DeviceInfoController extends Component<DeviceInfoControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Device list" titleGutter>
        <RestFormLoader
          {...this.props}
          render={formProps => <DeviceInfoForm {...formProps} />}
        />
      </SectionContent>
    )
  }

}

export default restController(LIST_DEVICES_ENDPOINT, DeviceInfoController);
