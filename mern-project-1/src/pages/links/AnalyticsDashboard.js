import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { serverEndpoint } from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";

const formatDate = (isoDateString) => {
    if (!isoDateString) return '';

    try{
        const date = new Date(isoDateString);

        //july 10, 2025
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }catch(error){
        console.log(error);
        return '';
    }
};

function AnalyticsDashboard(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const fetchAnalytics = async () => {
        try{
            const response = await axios.get(`${serverEndpoint}/links/analytics`,{
                params:{
                    linkId: id,
                    from: fromDate,
                    to:toDate
                },
                withCredentials:true
            });
            setAnalyticsData(response.data);
        }catch(error){
            console.log(error);
            navigate('/error');
        }
    };

    const columns = [
        { field: 'ip', headerName: "IP Address", flex:1},
        { field: 'city', headerName: 'City', flex: 1},
        { field: 'country', headerName: 'Country', flex: 1},
        { field: 'region', headerName: 'Region', flex: 1},
        { field: 'isp', headerName: 'ISP', flex: 1},
        { field: 'deviceType', headerName: 'Device', flex: 1},
        { field: 'browser', headerName: 'Browser', flex: 1},
        { 
            field: 'clickedAt', headerName: 'Clicked At', flex: 1, renderCell: (params) => (
            <>{formatDate(params.row.clickedAt)}</>
            )
        },
    ];

    useEffect(()=>{
        fetchAnalytics();
    }, []);

    return(
        <div className="container py-5">
            <h1>Analytics for LinkID: {id}</h1>

            <DataGrid
                getRowId={(row) => row._id}
                rows={analyticsData}
                columns={columns}
                initialState={{
                    pagination:{
                        paginationModel: { pageSize: 20, page: 0}
                    }
                }}
                pageSizeOptions={[20, 50, 100]}
                disableRowSelectionOnClick
                showToolbar
                sx={{
                    fontFamily:'inherit'
                }}
            />
        </div>
    )
}

export default AnalyticsDashboard;