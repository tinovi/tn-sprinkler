import React, { Fragment } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { RestFormProps, FormActions, FormButton } from '../components';
import { DerviceInfoList } from './types';
import { DerviceInfo } from './types';
import { withAuthenticatedContext, AuthenticatedContextProps } from '../authentication';

type DerviceInfoListProps = RestFormProps<DerviceInfoList> & AuthenticatedContextProps;

function compareDevs(a: DerviceInfo, b: DerviceInfo) {
  if (a.time < b.time) {
    return -1;
  }
  if (a.time > b.time) {
    return 1;
  }
  return 0;
}


class DeviceInfoForm extends React.Component<DerviceInfoListProps> {



  componentDidMount() {
    // this.props.loadData();
    this.props.connectSocket(this.onMessage,this.onOpen, this.onClose);

  }

  onMessage = (msg:any) => {
    console.log(msg);
    const parsedData = JSON.parse(msg);
    var found = this.props.data.devices.find(obj => {
      return obj.devid === parsedData["devid"];
    });
    if(found){
      found.data = parsedData;
    }
  }
  onOpen = () => {
    console.log("open"); 
  }

  onClose = (msg:any) => {
    console.log(msg);
    this.props.connectSocket(this.onMessage,this.onOpen, this.onClose);
  }

  onSubmit = () => {
    //this.props.saveData();
    // this.props.authenticatedContext.refresh();
  }

  render() {
    const { data, loadData } = this.props;
    return (
      <Fragment>
        <ValidatorForm onSubmit={this.onSubmit}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>devid</TableCell>
                <TableCell>time</TableCell>
                <TableCell>bat</TableCell>
                <TableCell>rssi</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.devices.sort(compareDevs).map(device => (
                <TableRow key={device.devid}>
                  <TableCell component="th" scope="row">
                    {device.devid}
                  </TableCell>
                  <TableCell align="center">
                    {device.time / 1000} sec
                  </TableCell>
                  <TableCell align="center">
                    {device.bat}
                  </TableCell>
                  <TableCell align="center">
                    {device.rssi}
                  </TableCell>
                  <TableCell align="center">
                    {/* {
                      device.data? device.data.map((item, i) => <Pludetails key={i} {...item}/>)}
                    } */}
                 </TableCell>
                </TableRow>
                   
              ))}
            </TableBody>
          </Table>
          
          <FormActions>
            <FormButton variant="contained" color="secondary" onClick={loadData}>
              Relad
            </FormButton>
          </FormActions>
        </ValidatorForm>
       
      </Fragment>
    );
  }

}

export default withAuthenticatedContext(DeviceInfoForm);
