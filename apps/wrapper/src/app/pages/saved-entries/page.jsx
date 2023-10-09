"use client"
import React, { useEffect, useRef, useState } from "react";
import styles from './index.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CommonHeader from "src/app/components/Commonheader";
import { v4 as uuidv4 } from 'uuid';
import { addCitizen, setCurrentCitizen, updateSearchQuery } from "../../redux/store";
import { getVillageDetails, getVillageSubmissions, searchCitizen } from "../../services/api";
import Pagination from '@mui/material/Pagination';
import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import { debounce } from "debounce";
import GovtBanner from "../../components/GovtBanner";
import SelectionItem from '../../components/SelectionItem';
import SearchIcon from "@mui/icons-material/Search";

const SavedEntries = ({ params }) => {
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
    const [fetching, setFetching] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const containerRef = useRef();

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

    useEffect(() => {
        
    }, [currPage])

    useEffect(() => {
        async function searchCitizens() {
            if (searchQuery?.length) {
                let res = await searchCitizen(_currLocation.villageCode, searchQuery)
                setPrevSubmissions(res?.result?.submissions || []);
            } else setPrevSubmissions(prevTempSubmissions)
        }
        searchCitizens();
    }, [searchQuery])


    const searchCitizenSubmission = async (e) => {
        setSearchQuery(e.target.value);
        dispatch(updateSearchQuery({ villageId: _currLocation.villageCode, query: e.target.value }))
    }

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollIntoView();
        }
    })

    return !hydrated ? null : (
        <div className={styles.container} ref={containerRef}>
            <GovtBanner sx={{ paddingTop: '2rem' }} />
            <CommonHeader
                onBack={() => router.back()}
                text={`${_currLocation.villageName}`}
                subText={`Saved Entries`}
                showLogout={false}
                sx={{ justifyContent: 'space-between !important', padding: '2rem 1rem' }} />

            <div className={styles.citizenContainer + ` animate__animated animate__fadeInUp`}>
                <div className={styles.submissionContainer}>
                    <TextField
                        id="search"
                        color="success"
                        type="search"
                        label={searchQuery ? "" : "Search entries here ..."}
                        value={searchQuery}
                        onChange={searchCitizenSubmission}
                        sx={{ marginBottom: '2rem', border: 'none', border: '2px solid #007922', borderRadius: '1rem' }}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {fetching && <CircularProgress color="success" />}
                    {!fetching && userData?.submissions?.[_currLocation.villageCode]?.length > 0 && userData?.submissions?.[_currLocation.villageCode]?.map(el =>
                        <SelectionItem
                            key={el.citizenId}
                            leftImage={'/assets/citizen.png'}
                            rightImage={'/assets/verified.png'}
                            mainText={el?.submissionData?.beneficiaryName}
                            sx={{ background: '#fff', marginBottom: '1rem' }}
                            mode={1}
                            onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}
                        />)}
                </div>
                {!searchQuery && !fetching && <Pagination count={totalPages} color="success" onChange={(event, page) => setCurrPage(page)} className={styles.paginationContainer} />}

            </div>


        </div >
    );
};


export default SavedEntries;

{/* <div key={el.citizenId} className={styles.submittedCitizen}
onClick={() => { dispatch(setCurrentCitizen(el)); router.push(`/pages/citizen-survey`) }}>
{el?.submissionData?.beneficiaryName}
</div> */}