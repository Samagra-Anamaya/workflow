"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "src/app/redux/store";
import styles from './index.module.scss';

const LocationItem = (props) => {
    const { location, deadline, assignedBy, iconUrl, sx } = props;
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <div className={styles.container} onClick={() => { dispatch(setCurrentLocation(props)); router.push(`/pages/survey/${location}`) }} style={{ ...sx }}>
            <div>
                <img src={iconUrl} />
            </div>
            <div>
                <p>{location}</p>
                <p>Deadline: {deadline}</p>
                <p>Assigned By: {assignedBy}</p>
            </div>
        </div>
    );
};

export default LocationItem;
