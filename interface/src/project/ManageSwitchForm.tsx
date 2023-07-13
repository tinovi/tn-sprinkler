import React, { Fragment } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { Table, TableBody, TableCell, TableHead, TableFooter, TableRow } from '@material-ui/core';
import { Button } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { withAuthenticatedContext, AuthenticatedContextProps } from '../authentication';
import { RestFormProps, FormActions, FormButton } from '../components';

import SwitchForm from './SwitchForm';
import { SprinklerSettings, Switch } from './types';


type ManageSwitchFormProps = RestFormProps<SprinklerSettings> & AuthenticatedContextProps;

type ManageSwitchFormState = {
  creating: boolean;
  switch_?: Switch;
}

class ManageSwitchForm extends React.Component<ManageSwitchFormProps, ManageSwitchFormState> {

  state: ManageSwitchFormState = {
    creating: false
  };

  
  componentDidMount() {
    this.props.connectSocket(undefined, undefined, undefined);
  }

  createSwitch = () => {
    this.setState({
      creating: true,
      switch_: {
        name: "I2Cdefault",
        coils: [false,false,false,false,false,false],
        type: 1,
        seconds: 30,
        coilsCount: 6,
        address: 85,
        lastReadTime: 0,
        allowMulti: false
      }
    });
  };

  uniqueSwitchName = (name: string) => {
    return !this.props.data.switches.find(u => u.name === name);
  }


  removeSwitch = (switch_: Switch) => {
    const { data } = this.props;
    const switches = data.switches.filter(u => u.name !== switch_.name);
    this.props.setData({ ...data, switches });
  }

  startEditingSwitch = (switch_: Switch) => {
    this.setState({
      creating: false,
      switch_
    });
  };

  cancelEditingSwitch = () => {
    this.setState({
      switch_: undefined
    });
  }

  doneEditingSwitch = () => {
    const { switch_ } = this.state;
    if (switch_) {
      const { data } = this.props;
      const switches = data.switches.filter(u => u.name !== switch_.name);
      switches.push(switch_);
      this.props.setData({ ...data, switches });
      this.setState({
        switch_: undefined
      });
    }
  };

  handleSwitchCheckboxChange = (name: keyof Switch) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({switch_: { ...this.state.switch_!, [name]: event.target.checked } });
  }

  handleSwitchValueChange = (name: keyof Switch) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({switch_: { ...this.state.switch_!, [name]: event.target.value } });
  };

  onSubmit = () => {
    this.props.saveData();
  }

  
  handleSwitchCheck =  (index:number) => (event:React.ChangeEvent<HTMLInputElement>) =>{
    this.props.socketMessage('switch', event.target.id +':'+ index +'='+(event.target.checked? '1':'0'));
    const { switch_ } = this.state;
    if(switch_){
      switch_.coils[index] = event.target.checked;
      this.setState({creating: this.state.creating, switch_: switch_ });
    }
  }

  render() {
    const { data, loadData } = this.props;
    const { switch_, creating } = this.state;
    return (
      <Fragment>
        <ValidatorForm onSubmit={this.onSubmit}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Address</TableCell>
                <TableCell align="center">Coils Count</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.switches.map(switch_ => (
                <TableRow key={switch_.name}>
                  <TableCell component="th" scope="row">
                    {switch_.name}
                  </TableCell>
                  <TableCell align="center">
                    {
                     switch_.type
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                     switch_.address
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                     switch_.coilsCount
                    }
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="Delete" onClick={() => this.removeSwitch(switch_)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="Edit" onClick={() => this.startEditingSwitch(switch_)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell align="center">
                  <Button startIcon={<PersonAddIcon />} variant="contained" color="secondary" onClick={this.createSwitch}>
                    Add Switch
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <FormActions>
            <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
              Save
            </FormButton>
            <FormButton variant="contained" color="secondary" onClick={loadData}>
              Reset
            </FormButton>
          </FormActions>
        </ValidatorForm>
        {
          switch_ &&
          <SwitchForm
          switch_={switch_}
            creating={creating}
            onDoneEditing={this.doneEditingSwitch}
            onCancelEditing={this.cancelEditingSwitch}
            handleValueChange={this.handleSwitchValueChange}
            handleCheckboxChange={this.handleSwitchCheckboxChange}
            handleSwitchCheck={this.handleSwitchCheck}
            uniqueSwitchName={this.uniqueSwitchName}
          />
        }
      </Fragment>
    );
  }

}

export default withAuthenticatedContext(ManageSwitchForm);
