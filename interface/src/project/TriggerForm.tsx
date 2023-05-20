import React, { RefObject } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

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
  // export interface Trigger {
  //   name: string;
  //   sensEui: number;
  //   switchName: string;
  //   coil: number;
  //   weekDays: boolean[];
  //   hours: boolean[];
  //   onVal: number;
  //   offVal: number;
  //   onTimeHour: number;
  //   onTimeMinute: number;
  //   maxTimeSec: number;
  //   onTime: number;
  // }
  
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
            <span >
                        <input
                            id="mon"
                            name="Mon"
                            type="checkbox"
                            checked={trigger.weekDays[0]}/>
                        <label for="mon"></label>
                        <input
                            id="mon"
                            name="Mon"
                            type="checkbox"
                            checked={trigger.weekDays[0]}/>
                        <label for="mon"></label>
                        <input
                            id="mon"
                            name="Mon"
                            type="checkbox"
                            checked={trigger.weekDays[0]}/>
                        <label for="mon"></label>
                        <input
                            id="tue"
                            name="Tue"
                            type="checkbox"
                            checked={trigger.weekDays[1]}/>
                        <label for="tue"></label>
                        <input
                            id="wen"
                            name="Wen"
                            type="checkbox"
                            checked={trigger.weekDays[2]}/>
                        <label for="wen"></label>
                        <input
                            id="thu"
                            name="Thu"
                            type="checkbox"
                            checked={trigger.weekDays[3]}/>
                        <label for="thu"></label>
                        <input
                            id="fri"
                            name="Fri"
                            type="checkbox"
                            checked={trigger.weekDays[4]}/>
                        <label for="fri"></label>
                        <input
                            id="sat"
                            name="Sat"
                            type="checkbox"
                            checked={trigger.weekDays[5]}/>
                        <label for="sat"></label>
                        <input
                            id="sun"
                            name="Sun"
                            type="checkbox"
                            checked={trigger.weekDays[6]}/>
                        <label for="sun"></label>
                    </span>
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
