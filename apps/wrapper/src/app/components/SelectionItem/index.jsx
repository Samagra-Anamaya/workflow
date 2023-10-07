"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { setCurrentLocation } from "src/app/redux/store";
import styles from './index.module.scss';
import Link from 'next/link'

const SelectionItem = (props) => {
    const {
        mode = 0,
        leftImage,
        rightImage,
        mainText,
        mainSubtext,
        onClick,
        href
    } = props
    const router = useRouter();

    return href?.length ?
        (
            <Link href={href} className={styles.container} onClick={onClick} style={{ ...props.sx }}>
                <div >
                    <img src={leftImage} />
                </div>
                <div>
                    <p className={styles.mainText}>{mainText}</p>
                    {mainSubtext && <p className={styles.mainSubText}>{mainSubtext}</p>}
                </div>
                {rightImage && <div>
                    <img src={rightImage} />
                </div>}
            </Link>
        ) : (
            <div className={styles.container} onClick={onClick} style={{ ...props.sx }} >
                <div style={{ width: rightImage ? '' : '40%', margin: rightImage ? '' : '1.5rem' }}>
                    <img src={leftImage} />
                </div>
                <div>
                    <p className={styles.mainText} style={{ color: mode == 1 ? '#017922' : '#fff' }}>{mainText}</p>
                    {mainSubtext && <p className={styles.mainSubText} style={{ color: mode == 1 ? '#017922' : '#fff' }}>{mainSubtext}</p>}
                </div>
                <div>
                    <img src={rightImage} />
                </div>
            </div>
        )
};

export default SelectionItem;
