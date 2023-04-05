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

import TriggerForm from './TriggerForm';
import { TriggerSettings, Trigger } from './types';


type ManageUsersFormProps = RestFormProps<TriggerSettings> & AuthenticatedContextProps;

type ManageUsersFormState = {
  creating: boolean;
  trigger?: Trigger;
}

class ManageUsersForm extends React.Component<ManageUsersFormProps, ManageUsersFormState> {

  state: ManageUsersFormState = {
    creating: false
  };

  createTrigger = () => {
    this.setState({
      creating: true,
      trigger: {
        name: "",
        sensEui: 0,
        switchNum: 0,
        weekDays: 0,
        onVal: 0,
        offVal: 0,
        onTimeHour: 0,
        onTimeMinute: 0,
        onTimeWkDay: 0,
        maxTimeSec: 0,
        onTime: 0,
      }
    });
  };

  uniqueName = (name: string) => {
    return !this.props.data.triggers.find(u => u.name === name);
  }


  removeTrigger = (trigger: Trigger) => {
    const { data } = this.props;
    const triggers = data.triggers.filter(u => u.name !== trigger.name);
    this.props.setData({ ...data, triggers });
  }

  startEditingTrigger = (trigger: Trigger) => {
    this.setState({
      creating: false,
      trigger
    });
  };

  cancelEditingTrigger = () => {
    this.setState({
      trigger: undefined
    });
  }

  doneEditingTrigger = () => {
    const { trigger } = this.state;
    if (trigger) {
      const { data } = this.props;
      const triggers = data.triggers.filter(u => u.name !== trigger.name);
      triggers.push(trigger);
      this.props.setData({ ...data, triggers });
      this.setState({
        trigger: undefined
      });
    }
  };

  handleUserValueChange = (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ trigger: { ...this.state.trigger!, [name]: event.target.value } });
  };

  handleUserCheckboxChange = (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ trigger: { ...this.state.trigger!, [name]: event.target.checked } });
  }

  onSubmit = () => {
    this.props.saveData();
    // this.props.authenticatedContext.refresh();
  }

  render() {
    const { data, loadData } = this.props;
    const { trigger, creating } = this.state;
    return (
      <Fragment>
        <ValidatorForm onSubmit={this.onSubmit}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Switch</TableCell>
                <TableCell align="center">Sensor EUI</TableCell>
                <TableCell align="center">Conditions</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data.triggers.map(trigger => (
                <TableRow key={trigger.name}>
                  <TableCell component="th" scope="row">
                    {trigger.name}
                  </TableCell>
                  <TableCell align="center">
                    {
                     trigger.sensEui
                    }
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="Delete" onClick={() => this.removeTrigger(trigger)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="Edit" onClick={() => this.startEditingTrigger(trigger)}>
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
                  <Button startIcon={<PersonAddIcon />} variant="contained" color="secondary" onClick={this.createTrigger}>
                    Add User
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
          trigger &&
          <TriggerForm
          trigger={trigger}
            creating={creating}
            onDoneEditing={this.doneEditingTrigger}
            onCancelEditing={this.cancelEditingTrigger}
            handleValueChange={this.handleUserValueChange}
            handleCheckboxChange={this.handleUserCheckboxChange}
            uniqueName={this.uniqueName}
          />
        }
      </Fragment>
    );
  }

}

export default withAuthenticatedContext(ManageUsersForm);
