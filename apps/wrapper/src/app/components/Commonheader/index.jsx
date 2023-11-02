"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch } from "react-redux";
import { logoutUser } from '../../redux/store';
import { useRouter } from "next/navigation";
import CommonModal from '../../components/Modal';

const CommonHeader = (props) => {
    const { onBack, showBack = true, text, sx, showLogout = true } = props;
    const [logoutModal, showLogoutModal] = useState(false);
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(logoutUser());
        showLogoutModal(false);
        window.location.href = "/";
    }

    return (
        <div className={styles.header} style={{ ...sx }}>
            {showBack ? <div onClick={onBack}><img src="/assets/arrow-left.png" /></div> : <div></div>}
            <div>{text}</div>
            {showLogout ? <div><img src="/assets/logout.png" style={{ height: 30, opacity: 0.6 }} onClick={() => showLogoutModal(true)} /></div> : <div></div>}
            {logoutModal && <CommonModal sx={{ height: '40vh' }}>
                <div style={modalStyles.container}>
                    <img src="/assets/errorIcon.png" style={modalStyles.image} />
                    <div style={modalStyles.warningText}>Logging out will delete any unsaved data or any forms which are still pending to be submitted</div>
                    <div style={modalStyles.confirmationText}>Are you sure you want to logut?</div>
                    <div style={modalStyles.btnContainer}>
                        <div style={modalStyles.confirmBtn} onClick={() => {
                            logout();
                        }}>Yes</div>
                        <div style={modalStyles.exitBtn} onClick={() => showLogoutModal(false)}>No</div>
                    </div>
                </div>
            </CommonModal>}
        </div >
    );
};

const modalStyles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    warningText: { fontSize: '1.4rem', color: 'red', textAlign: 'center', marginTop: 20 },
    confirmationText: { fontSize: '1.3rem', textAlign: 'center', marginTop: 20 },
    image: { height: '100%', width: '30%' },
    btnContainer: { width: '100%', display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'space-evenly', marginTop: 30 },
    confirmBtn: { width: '50%', height: '3rem', background: '#1e2061', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    exitBtn: { width: '50%', height: '3rem', border: '1px solid #1e2061', color: '#1e2061', display: 'flex', alignItems: 'center', justifyContent: 'center' },

}

export default CommonHeader;

