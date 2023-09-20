"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';


const CommonHeader = (props) => {
    const { onBack, showBack = true, text } = props;
    return (
        <div className={styles.header}>
            {showBack && <div onClick={onBack}><img src="/assets/arrow-left.png" /></div>}
            <div>{text}</div>
            {showBack && <div></div>}
        </div>
    );
};

export default CommonHeader;

