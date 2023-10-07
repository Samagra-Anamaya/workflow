"use client"
import React, { useEffect, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { addCitizen, setCurrentCitizen, updateSearchQuery } from "../../redux/store";
import { getVillageDetails, getVillageSubmissions, searchCitizen } from "../../services/api";
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField, InputAdornment } from "@mui/material";
import { debounce } from "debounce";
import GovtBanner from "../../components/GovtBanner";
import SelectionItem from '../../components/SelectionItem';
import SearchIcon from "@mui/icons-material/Search";

const UnresolvedFlags = ({ params }) => {
    /* Component States and Refs*/
    const userData = useSelector((state) => state?.userData);
    const _currLocation = useSelector((state) => state?.userData?.currentLocation);
    const [hydrated, setHydrated] = React.useState(false);
    const [citizens, setCitizens] = useState(_currLocation?.citizens || []);
    const [villageData, setVillageData] = useState({});
    const [currTab, setCurrTab] = React.useState(0);
    const [currPage, setCurrPage] = React.useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [prevSubmissions, setPrevSubmissions] = useState([]);
    const [prevTempSubmissions, setPrevTempSubmissions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();

    /* Use Effects */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setHydrated(true);
        console.log(_currLocation)
        setSearchQuery(userData?.searchQuery?.[_currLocation.villageCode] || "")
    }, [])

    useEffect(() => {
        setCitizens(_currLocation?.citizens || [])
    }, [_currLocation])

    return !hydrated ? null : (
        <div className={styles.container}>
            <GovtBanner sx={{ paddingTop: '2rem' }} />
            <CommonHeader
                onBack={() => router.back()}
                text={`${_currLocation.villageName}`}
                subText={`Unresolved Flags`}
                showLogout={false}
                sx={{ justifyContent: 'space-between !important', padding: '2rem 1rem' }} />

        </div >
    );
};


export default UnresolvedFlags;

{/* <div key={el.citizenId} className={styles.submittedCitizen}
onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
{el?.submissionData?.beneficiaryName}
</div> */}