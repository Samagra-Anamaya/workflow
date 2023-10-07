"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';

const GovtBanner = (props) => {

    return (
        <div className={styles.container} style={{ ...props?.sx }}>
            <div className={styles.imgContainer}>
                <img src="/assets/govtLogo.png" />
            </div>
            <div className={styles.textContainer}>
                <p>Department Of</p>
                <p><b>ST & SC Development, Minorities & Backward Classes Wellfare</b></p>
                <p><b>Government of Odisha</b></p>
            </div>
        </div >
    );
};


export default GovtBanner;

