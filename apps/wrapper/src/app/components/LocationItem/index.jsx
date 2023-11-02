"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "src/app/redux/store";
import styles from './index.module.scss';
import Link from 'next/link'

const LocationItem = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    return (
        <Link href={'/pages/survey'}>
            <div className={styles.container} onClick={() => { dispatch(setCurrentLocation(props)) }} style={{ ...props.sx }}>
                <div>
                    <img src={"/assets/uplogo.png"} />
                </div>
                <div>
                    <p>{props?.villageName} - {props?.villageCode}</p>
                </div>
            </div>
        </Link>
    );
};

export default LocationItem;
