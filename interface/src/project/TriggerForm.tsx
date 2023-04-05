import React, { RefObject } from 'react';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';

import { Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@material-ui/core';

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
    const { trigger, creating, handleValueChange, handleCheckboxChange, onDoneEditing, onCancelEditing } = this.props;
    return (
      <ValidatorForm onSubmit={onDoneEditing} ref={this.formRef}>
        <Dialog onClose={onCancelEditing} aria-labelledby="user-form-dialog-title" open={true}>
          <DialogTitle id="user-form-dialog-title">{creating ? 'Add' : 'Modify'} Trigger</DialogTitle>
          <DialogContent dividers={true}>
            <TextValidator
              validators={creating ? ['required', 'uniqueTriggername', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$'] : []}
              errorMessages={creating ? ['Triggername is required', "Triggername already exists", "Must be 1-24 characters: alpha numeric, '_' or '.'"] : []}
              name="username"
              label="Triggername"
              fullWidth
              variant="outlined"
              value={trigger.name}
              disabled={!creating}
              onChange={handleValueChange('name')}
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
