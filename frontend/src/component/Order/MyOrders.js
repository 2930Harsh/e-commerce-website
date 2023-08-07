import React, { Fragment, useEffect } from 'react'
import {DataGrid} from '@material-ui/data-grid'
import './MyOrders.css'
import LauchIcon from '@material-ui/icons/Launch'
import MetaData from '../layout/MetaData'
import { Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { clearErrors, myOrders } from '../../actions/orderAction'
import { Link } from 'react-router-dom'

const MyOrders = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { error , orders} = useSelector((state)=> state.myOrders);
    // const {user} = useSelector((state)=>state.user);

    const columns = [
        {
            field: "id",
            headerName: "Order Id", 
            minWidth: 200, 
            flex: 1
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 100,
            flex: 0.5,
            cellClassName: (params) => {
              return params.getValue(params.id,"status") === "Delievered" ? "greenColor" : "redColor";
            }
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 100,
            flex: 0.5,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 210,
            flex: 0.5,
        },
        {
            field: "actions",
            flex: 0.3,
            headerName: "Actions",
            minWidth: 100,
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                  <Link to={`/order/${params.getValue(params.id, "id")}`}>
                    <LauchIcon />
                  </Link>
                );
              },
        }
    ];
    const rows = [];

    // console.log(orders+ " asf");

    orders &&
    orders.forEach((item, index) => {
      // console.log(item);
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(myOrders());
    },[dispatch,alert,error])

  return (
    <Fragment>
        {/* <MetaData title={`${user.name} -- Orders`} /> */}
        <MetaData title="Harsh's Orders" />
        {/* {loading ? <Loading /> : */}
                <div className='myOrdersPage'>
                    <DataGrid 
                        rows = {rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='myOrdersTable'
                        autoHeight
                    />
                    <Typography id="myOrdersHeading">Harsh's Orders</Typography>
                </div>
        {/* } */}
    </Fragment>
  )
}

export default MyOrders