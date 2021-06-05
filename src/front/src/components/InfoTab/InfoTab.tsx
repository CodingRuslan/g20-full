import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {getHeaderLinks} from '../../actions/game';
import moment from 'moment';
import {
    Typography,
    TextField,
    Select,
    MenuItem,
    Paper,
    FormControl,
    InputLabel,
    Button,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableContainer,
    Modal
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import {
    getAllResources,
    getAllCountries,
    createTrade,
    getAllTrades,
    getAllAds,
    getAllClosedTrades,
    deleteTrade,
    getGameStatus,
    setGameStatus
} from '../../actions/game';
import { compose } from 'redux';
import { connect } from 'react-redux';

const InfoTab = ({ trades }) => {

    const [tab, setTab] = useState(0);

    // useEffect(() => {
    //     (async function asyncFunc() {
    //         if(tab === 0) {
    //             await getAllTrades();
    //         }
    //         if(tab === 1) {
    //             await getAllClosedTrades();
    //         }
    //         if(tab === 2) {
    //             await getAllAds();
    //         }
    //     })();
    // }, [tab])

    const filteredTrades = () => {
        console.log(trades)
        return trades.filter((trade) => {
            if (tab === 2 && !trade.seller && !trade.buyer) {
                return trade
            } else if (tab === 1 && trade.status === 'closed') {
                return trade
            } else if (tab === 0 && trade.status === 'active') {
                return trade
            }
        })
    }

    return <section>
        <Tabs
            value={ tab }
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, newValue) => setTab(newValue)}
            aria-label="disabled tabs example"
        >
            <Tab label="Открытые" />
            <Tab label="Закрытые" />
            <Tab label="Объявления" />
        </Tabs>
        <TableContainer>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Время</TableCell>
                        <TableCell>Оформитель</TableCell>
                        <TableCell>Покупатель</TableCell>
                        <TableCell>Продавец</TableCell>
                        <TableCell>Товар</TableCell>
                        <TableCell>Цена</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Стоимость</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredTrades().map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {moment(row.time).utc().format('HH:mm:ss')}
                            </TableCell>
                            <TableCell>{row.owner.name}</TableCell>
                            <TableCell>{row?.buyer?.name}</TableCell>
                            <TableCell>{row?.seller?.name}</TableCell>
                            <TableCell>{row.resource.name}</TableCell>
                            <TableCell>{row.cost}</TableCell>
                            <TableCell>{row.count}</TableCell>
                            <TableCell>{row.sum}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </section>
}

const mapToStateToProps = () => {};

  export default compose(
    connect(mapToStateToProps, {
        getHeaderLinks
    }))(InfoTab);
