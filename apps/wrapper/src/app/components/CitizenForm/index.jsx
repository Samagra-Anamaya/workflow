"use client"
import React from "react";
import styles from './index.module.scss';
import { TextField, Button, InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const CitizenForm = (props) => {
    const { handleSubmit, setFormState, formState, currCitizen, submittedModal, loading } = props;
    return (
        <form onSubmit={handleSubmit} className={styles.userForm}>
            <TextField
                variant='standard'
                label={currCitizen?.status == 'SUBMITTED' ? "" : "Beneficiary Name"}
                onChange={e => setFormState((prevState) => ({ ...prevState, beneficiaryName: e.target.value }))}
                value={formState?.beneficiaryName}
                required
                sx={{ mb: 4, width: '80%' }}
                disabled={currCitizen?.status == 'SUBMITTED' ? true : false}

            />
            <TextField
                type={"text"}
                variant='standard'
                label={currCitizen?.status == 'SUBMITTED' ? "" : "Aadhar Number"}
                onChange={e => {
                    if (/^[0-9]*$/.test(e.target.value))
                        setFormState((prevState) => ({ ...prevState, aadharNumber: e.target.value })
                        )
                }}
                value={formState?.aadharNumber}
                required
                inputProps={{ maxLength: 12, minLength: 12 }}
                disabled={currCitizen?.status == 'SUBMITTED' ? true : false}
                sx={{ mb: 4, width: '80%' }}
            />
            <TextField
                type="date"
                variant='standard'
                label={currCitizen?.status == 'SUBMITTED' ? "" : formState?.dateOfBirth ? 'Date Of Birth' : ''}
                onChange={e => setFormState((prevState) => ({ ...prevState, dateOfBirth: e.target.value }))}
                value={formState?.dateOfBirth}
                required
                disabled={currCitizen?.status == 'SUBMITTED' ? true : false}
                sx={{ mb: 4, width: '80%' }}

            />
            {currCitizen?.status == 'SUBMITTED'
                ?
                <TextField
                    type="text"
                    variant='standard'
                    value={formState?.gender}
                    required
                    disabled={true}
                    sx={{ mb: 4, width: '80%' }}
                />
                :
                <FormControl sx={{ mb: 4, width: '80%' }}>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formState?.gender}
                        variant="standard"
                        label="Gender"
                        required
                        onChange={e => setFormState((prevState) => ({ ...prevState, gender: e.target.value }))}
                    >
                        <MenuItem value={'female'}>Female</MenuItem>
                        <MenuItem value={'male'}>Male</MenuItem>
                        <MenuItem value={'other'}>Other</MenuItem>
                    </Select>
                </FormControl>}
            {!(currCitizen?.status == 'SUBMITTED') && !submittedModal && <Button variant="contained" size="large" type="submit" sx={{ mb: 4, width: '80%' }} className={styles.submitBtn}>{loading ? <CircularProgress color="inherit" /> : 'Submit'} </Button>}
        </form>
    )
};

export default CitizenForm;
