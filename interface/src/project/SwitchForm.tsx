import React, { RefObject } from 'react';
import { TextValidator, ValidatorForm, SelectValidator } from 'react-material-ui-form-validator';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import { FormButton } from '../components';

import { Switch } from './types';

import MenuItem from '@material-ui/core/MenuItem';

interface SwitchFormProps {
  creating: boolean;
  switch_: Switch;
  uniqueSwitchName: (value: any) => boolean;
  handleValueChange: (name: keyof Switch) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDoneEditing: () => void;
  onCancelEditing: () => void;
  handleSwitchCheck: (index:number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

class SwitchForm extends React.Component<SwitchFormProps> {

  formRef: RefObject<any> = React.createRef();

  componentDidMount() {
    ValidatorForm.addValidationRule('uniqueSwitchName', this.props.uniqueSwitchName);
  }

  submit = () => {
    this.formRef.current.submit();
  }

  render() {
    const { switch_, creating, onDoneEditing, onCancelEditing, handleSwitchCheck, handleValueChange } = this.props;
    return (
      <ValidatorForm onSubmit={onDoneEditing} ref={this.formRef}>
        <Dialog onClose={onCancelEditing} aria-labelledby="user-form-dialog-title" open={true}>
          <DialogTitle id="user-form-dialog-title">{creating ? 'Add' : 'Modify'} Switch</DialogTitle>
          <DialogContent dividers={true}>
            <TextValidator
              validators={creating ? ['required', 'uniqueSwitchName', 'matchRegexp:^[a-zA-Z0-9_\\.]{1,24}$'] : []}
              errorMessages={creating ? ['Name is required', "Name already exists", "Must be 1-24 characters: alpha numeric, '_' or '.'"] : []}
              name="name"
              label="Name"
              fullWidth
              variant="outlined"
              value={switch_.name}
              disabled={!creating}
              onChange={handleValueChange('name')}
              margin="normal"
            />
            <TextValidator
              validators={['required']}
              errorMessages={['Coils count is required']}
              name="tr_coil"
              label="Coils count"
              fullWidth
              variant="outlined"
              value={switch_.coilsCount}
              onChange={handleValueChange('coilsCount')}
              margin="normal"
            />
              {switch_.coils.map((coilFlag, index) => (  
                <label>
                  <input type="checkbox" id={switch_.name} checked={switch_.coils[index]} onChange={handleSwitchCheck(index)} />
                  {index}
                </label>    
              ))}  
            <TextValidator
              validators={['required']}
              errorMessages={['Address mask is required']}
              name="sw_address"
              label="I2C/RS address"
              fullWidth
              variant="outlined"
              value={switch_.address}
              onChange={handleValueChange('address')}
              margin="normal"
            />
         <SelectValidator name="sw_type"
          validators={['required']}
          errorMessages={['Type is required']}
          label="Switch type"
          value={switch_.type}
          fullWidth
          variant="outlined"
          onChange={handleValueChange('type')}
          margin="normal">
         <MenuItem value='1'>I2C PLC</MenuItem>
          <MenuItem value='2'>Sample</MenuItem>
        </SelectValidator>
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

export default SwitchForm;
