import React, { RefObject } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@material-ui/core';

import { FormButton } from '../components';

import { Trigger } from './types';

interface TriggerFormProps {
  creating: boolean;
  trigger: Trigger;
  uniqueName: (value: any) => boolean;
  handleValueChange: (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (name: keyof Trigger) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onDoneEditing: () => void;
  onCancelEditing: () => void;
}

class TriggerForm extends React.Component<TriggerFormProps> {

  formRef: RefObject<any> = React.createRef();

  componentDidMount() {
    ValidatorForm.addValidationRule('uniqueTriggername', this.props.uniqueName);
  }

  submit = () => {
    this.formRef.current.submit();
  }
    
  render() {
    const { trigger, creating, handleValueChange, onDoneEditing, onCancelEditing } = this.props;
    return (
      <ValidatorForm onSubmit={onDoneEditing} ref={this.formRef}>
        <Dialog onClose={onCancelEditing} aria-labelledby="user-form-dialog-title" open={true}>
          <DialogTitle id="user-form-dialog-title">{creating ? 'Add' : 'Modify'} Trigger</DialogTitle>
          <DialogContent dividers={true}>
            <TextValidator
              validators={creating ? ['required', 'uniqueTriggername', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$'] : []}
              errorMessages={creating ? ['Triggername is required', "Triggername already exists", "Must be 1-24 characters: alpha numeric, '_' or '.'"] : []}
              name="  "
              label="Triggername"
              fullWidth
              variant="outlined"
              value={trigger.name}
              disabled={!creating}
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
              margin="normal"
            />
             <div>
         Week day : 
              </div>
            <span >
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[0]} />}   label="Mon"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[1]} />}   label="Tue"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[2]} />}   label="Wen"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[3]} />}   label="Thu"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[4]} />}   label="Fri"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[5]} />}   label="Sat"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.weekDays[6]} />}   label="Sun"  labelPlacement="top"/>
            </span>
            <div>
         Hour : 
              </div>
              <span >
              <FormControlLabel  control={<Checkbox checked={trigger.hours[0]} />}   label="0"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[1]} />}   label="1"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[2]} />}   label="2"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[3]} />}   label="3"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[4]} />}   label="4"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[5]} />}   label="5"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[6]} />}   label="6"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[7]} />}   label="7"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[8]} />}   label="8"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[9]} />}   label="9"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[10]} />}   label="10"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[11]} />}   label="11"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[12]} />}   label="12"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[13]} />}   label="13"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[14]} />}   label="14"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[15]} />}   label="15"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[16]} />}   label="16"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[17]} />}   label="17"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[18]} />}   label="18"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[19]} />}   label="19"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[20]} />}   label="20"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[21]} />}   label="21"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[22]} />}   label="22"  labelPlacement="top"/>
              <FormControlLabel  control={<Checkbox checked={trigger.hours[23]} />}   label="23"  labelPlacement="top"/>
              </span>
              <TextValidator
              name="tr_onMinute"
              label="On minute"
              fullWidth
              variant="outlined"
              value={trigger.onTimeMinute}
              margin="normal"
            />
             <TextValidator
              name="tr_onVal"
              label="On val"
              fullWidth
              variant="outlined"
              value={trigger.onVal}
              margin="normal"
            />
             <TextValidator
              name="tr_offVal"
              label="Off val"
              fullWidth
              variant="outlined"
              value={trigger.offVal}
              margin="normal"
            />
             <TextValidator
              name="tr_maxTimeSec"
              label="Max time sec"
              fullWidth
              variant="outlined"
              value={trigger.maxTimeSec}
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
