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
  //   weekDays: number;
  //   onVal: number;
  //   offVal: number;
  //   onTimeHour: number;
  //   onTimeMinute: number;
  //   onTimeWkDay: number;
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
