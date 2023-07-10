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
import { SprinklerSettings, Trigger, TriggerCondition } from './types';


type ManageTriggersFormProps = RestFormProps<SprinklerSettings> & AuthenticatedContextProps;

type ManageTriggersFormState = {
  creating: boolean;
  trigger?: Trigger;
}

class ManageTriggersForm extends React.Component<ManageTriggersFormProps, ManageTriggersFormState> {

  state: ManageTriggersFormState = {
    creating: false
  };
  
  createTrigger = () => {
    this.setState({
      creating: true,
      trigger: {
        name: "",
        switchName:"",
        coil: 0,
        weekDays: [false, false, false, false, false, false, false],
        hours:  [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        conditions:[],
        onTimeMinute: 0,
        maxTimeSec: 0,
        lastOnTime: 0
      }
    });
  };

  uniqueTriggerName = (name: string) => {
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


  addTriggerCond = () =>{
    const { trigger } = this.state;
    if(trigger){
      trigger.conditions.push({
        devid: "",
        sensor: "",
        onVal: 0,
        offVal: 0});
    }
    this.setState({creating: this.state.creating, trigger: trigger });
  }; 
  
  removeTriggerCond = (index:number) =>{
    const { trigger } = this.state;
    if(trigger){
      trigger.conditions.splice(index,1);
      this.setState({creating: this.state.creating, trigger: trigger });
    }

  }; 
  
  doneTriggerCond  =  (index:number, name: keyof TriggerCondition) => (event: React.ChangeEvent<HTMLInputElement>) =>{
    const { trigger } = this.state;
    if(trigger){
      trigger.conditions[index] = { ...trigger.conditions[index], [name]: event.target.value };
      this.setState({creating: this.state.creating, trigger: trigger });
    }
  }

  handleTriggerValueChange = (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({trigger: { ...this.state.trigger!, [name]: event.target.value } });
  };

  handleTriggerCheckboxChange = (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({trigger: { ...this.state.trigger!, [name]: event.target.checked } });
  }

  
  handleWeekCheckboxChange  =  (index:number) => (event:React.ChangeEvent<HTMLInputElement>) =>{
    const { trigger } = this.state;
    if(trigger){
      trigger.weekDays[index] = event.target.checked;
      this.setState({creating: this.state.creating, trigger: trigger });
    }
  }

  handleHourCheckboxChange  =  (index:number) => (event:React.ChangeEvent<HTMLInputElement>) =>{
    const { trigger } = this.state;
    if(trigger){
      trigger.hours[index] = event.target.checked;
      this.setState({creating: this.state.creating, trigger: trigger });
    }
  }

  onSubmit = () => {
    this.props.saveData();
    // this.props.authenticatedContext.refresh(); onTime
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
                <TableCell align="center">Coil</TableCell>
                <TableCell align="center">OnTimeMinute</TableCell>
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
                     trigger.switchName
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                     trigger.coil
                    }
                  </TableCell>
                  <TableCell align="center">
                    {
                     trigger.onTimeMinute > 0 ? new Date(trigger.onTimeMinute * 1000).toISOString() : '' 
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
                    Add Trigger
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
            handleValueChange={this.handleTriggerValueChange}
            handleWeekCheckboxChange={this.handleWeekCheckboxChange}
            handleHourCheckboxChange={this.handleHourCheckboxChange}
            uniqueTriggerName={this.uniqueTriggerName}
            addTriggerCond={this.addTriggerCond}
            removeTriggerCond={this.removeTriggerCond}
            doneTriggerCond={this.doneTriggerCond}
          />
        }
      </Fragment>
    );
  }

}

export default withAuthenticatedContext(ManageTriggersForm);
