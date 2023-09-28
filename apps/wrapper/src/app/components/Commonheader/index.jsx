"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../redux/store';
import { useRouter } from "next/navigation";

const CommonHeader = (props) => {
    const { onBack, showBack = true, text, sx } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(logoutUser());
        window.location.href = "/";
    }

    return (
        <div className={styles.header} style={{ ...sx }}>
            {showBack && <div onClick={onBack}><img src="/assets/arrow-left.png" /></div>}
            <div>{text}</div>
            <div><img src="/assets/logout.png" style={{ height: 30, opacity: 0.6 }} onClick={logout} /></div>
        </div>
    );
};

export default CommonHeader;

