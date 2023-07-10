import React, { RefObject } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Button } from '@material-ui/core';

import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';

import { FormButton } from '../components';

import { Trigger, TriggerCondition } from './types';

interface TriggerFormProps {
  creating: boolean;
  trigger: Trigger;
  uniqueTriggerName: (value: any) => boolean;
  handleValueChange: (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeekCheckboxChange:  (index:number) => (event:React.ChangeEvent<HTMLInputElement>) => void;
  handleHourCheckboxChange:  (index:number) => (event:React.ChangeEvent<HTMLInputElement>) => void;
  onDoneEditing: () => void;
  onCancelEditing: () => void;
  addTriggerCond: () => void;
  removeTriggerCond: (index:number) => void;
  doneTriggerCond: (index:number, name: keyof TriggerCondition) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}


class TriggerForm extends React.Component<TriggerFormProps> {

  formRef: RefObject<any> = React.createRef();

  componentDidMount() {
    ValidatorForm.addValidationRule('uniqueTriggerName', this.props.uniqueTriggerName);
  }

  submit = () => {
    this.formRef.current.submit();
  }
    
  render() {
    const { trigger, creating, handleValueChange, onDoneEditing, onCancelEditing, handleWeekCheckboxChange, handleHourCheckboxChange, addTriggerCond, removeTriggerCond, doneTriggerCond } = this.props;
    return (
      <ValidatorForm onSubmit={onDoneEditing} ref={this.formRef}>
        <Dialog onClose={onCancelEditing} aria-labelledby="trigger-form-dialog-title" open={true}>
          <DialogTitle id="trigger-form-dialog-title">{creating ? 'Add' : 'Modify'} Trigger</DialogTitle>
          <DialogContent dividers={true}>
            <TextValidator
              validators={creating ? ['required', 'uniqueTriggerName', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$'] : []}
              errorMessages={creating ? ['Triggername is required', "Triggername already exists", "Must be 1-24 characters: alpha numeric, '_' or '.'"] : []}
              name="name"
              label="Triggername"
              fullWidth
              variant="outlined"
              value={trigger.name}
              disabled={!creating}
              onChange={handleValueChange('name')}
              margin="normal"
            />
             <TextValidator
              validators={['required']}
              errorMessages={['Switch Name is required']}
              name="tr_switch"
              label="Switch Name"
              fullWidth
              variant="outlined"
              value={trigger.switchName}
              onChange={handleValueChange('switchName')}
              margin="normal"
            />
             <TextValidator
              validators={['required']}
              errorMessages={['Coil is required']}
              name="tr_coil"
              label="Coil"
              fullWidth
              variant="outlined"
              value={trigger.coil}
              onChange={handleValueChange('coil')}
              margin="normal"
            />
             <div>
         Week day : 
              </div>
            <span >
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[0]} onChange={handleWeekCheckboxChange(0)}/>}   label="Mon"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[1]} onChange={handleWeekCheckboxChange(1)}/>}   label="Tue"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[2]} onChange={handleWeekCheckboxChange(2)}/>}   label="Wen"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[3]} onChange={handleWeekCheckboxChange(3)}/>}   label="Thu"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[4]} onChange={handleWeekCheckboxChange(4)}/>}   label="Fri"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[5]} onChange={handleWeekCheckboxChange(5)}/>}   label="Sat"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[6]} onChange={handleWeekCheckboxChange(6)}/>}   label="Sun"  labelPlacement="top"/>
            </span>
            <div>
         Hour : 
              </div>
              <span >
              <FormControlLabel  control={<Checkbox checked={trigger.hours[0]} onChange={handleHourCheckboxChange(0)}/>}   label="0"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[1]} onChange={handleHourCheckboxChange(1)}/>}   label="1"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[2]} onChange={handleHourCheckboxChange(2)}/>}   label="2"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[3]} onChange={handleHourCheckboxChange(3)}/>}   label="3"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[4]} onChange={handleHourCheckboxChange(4)}/>}   label="4"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[5]} onChange={handleHourCheckboxChange(5)}/>}   label="5"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[6]} onChange={handleHourCheckboxChange(6)}/>}   label="6"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[7]} onChange={handleHourCheckboxChange(7)}/>}   label="7"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[8]} onChange={handleHourCheckboxChange(8)}/>}   label="8"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[9]} onChange={handleHourCheckboxChange(9)}/>}   label="9"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[10]} onChange={handleHourCheckboxChange(10)}/>}   label="10"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[11]} onChange={handleHourCheckboxChange(11)}/>}   label="11"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[12]} onChange={handleHourCheckboxChange(12)}/>}   label="12"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[13]} onChange={handleHourCheckboxChange(13)}/>}   label="13"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[14]} onChange={handleHourCheckboxChange(14)}/>}   label="14"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[15]} onChange={handleHourCheckboxChange(15)}/>}   label="15"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[16]} onChange={handleHourCheckboxChange(16)}/>}   label="16"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[17]} onChange={handleHourCheckboxChange(17)}/>}   label="17"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[18]} onChange={handleHourCheckboxChange(18)}/>}   label="18"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[19]} onChange={handleHourCheckboxChange(19)}/>}   label="19"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[20]} onChange={handleHourCheckboxChange(20)}/>}   label="20"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[21]} onChange={handleHourCheckboxChange(21)}/>}   label="21"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[22]} onChange={handleHourCheckboxChange(22)}/>}   label="22"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[23]} onChange={handleHourCheckboxChange(23)}/>}   label="23"  labelPlacement="top"/>
              </span>
              <TextValidator
              name="tr_onMinute"
              label="On minute"
              fullWidth
              variant="outlined"
              value={trigger.onTimeMinute}
              onChange={handleValueChange('onTimeMinute')}
              margin="normal"
            />

              <ul>
              {trigger.conditions.map((cond, index) => (<li>
                    <TextValidator
                  name="tr_devId"
                  label="devid"
                  variant="outlined"
                  value={cond.devid}
                  onChange={doneTriggerCond(index, 'devid')}
                  margin="normal"
                />
                    <TextValidator
                  name="tr_onVal"
                  label="sensor"
                  variant="outlined"
                  value={cond.sensor}
                  onChange={doneTriggerCond(index, 'sensor')}
                  margin="normal"
                />
                    
                    <TextValidator
                  name="tr_onVal"
                  label="On val"
                  variant="outlined"
                  value={cond.onVal}
                  onChange={doneTriggerCond(index, 'onVal')}
                  margin="normal"
                />
                <TextValidator
                  name="tr_offVal"
                  label="Off val"
                  variant="outlined"
                  value={cond.offVal}
                  onChange={doneTriggerCond(index, 'offVal')}
                  margin="normal"
                />
                 <Button startIcon={<DeleteIcon />} variant="contained" color="secondary" onClick={() =>removeTriggerCond(index)}>
                    Delete
                  </Button>                 
                 </li>))} 
                <li>
                <Button startIcon={<PersonAddIcon />} variant="contained" color="secondary" onClick={addTriggerCond}>
                    Add Conditon
                  </Button>
                </li>
             </ul>
             

             
             <TextValidator
              name="tr_maxTimeSec"
              label="Max time sec"
              fullWidth
              variant="outlined"
              value={trigger.maxTimeSec}
              onChange={handleValueChange('maxTimeSec')}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <FormButton variant="contained" color="primary" type="submit" onClick={this.submit}>
              Done
            </FormButton>
            <FormButton variant="contained" color="secondary" onClick={onCancelEditing}>
              Cancel
            </FormButton>
          </DialogActions>
        </Dialog>
      </ValidatorForm>
    );
  }
}

export default TriggerForm;
