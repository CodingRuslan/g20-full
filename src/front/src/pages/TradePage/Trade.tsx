import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { 
  Grid,
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
import { Link } from 'react-router-dom';
import './Trade.scss';
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


const Trade = ({ 
  getAllResources, deleteTrade,
  getAllCountries, getGameStatus,
  setGameStatus,
  createTrade, getAllTrades, trades, getAllAds, getAllClosedTrades }) => {

  const [tab, setTab] = useState(0);
  const [countries, setCountries] = useState([] as any[]);
  const [resources, setResources] = useState([] as any[]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCountry, setOpenModalCountry] = useState('');
  const [modalUniqKey, setModalUniqKey] = useState('');
  const [isRunGame, setIsRunGame] = useState(true);
  const [newTrade, setNewTrade] = useState<any>({ 
    buyer: null,
    seller: null,
    owner: null,
    resource: null,
    sum: '',
    count: '',
    cost: '',
    uniqTradeKey: null
  });

  useEffect(() => {
    (async function asyncFunc() {
      if(tab === 0) {
        await getAllTrades();
      }
      if(tab === 1) {
        await getAllClosedTrades();
      }
      if(tab === 2) {
        await getAllAds();
      }
    })();
  }, [tab])

  useEffect(() => {
    (async function asyncFunc() {
      const [resources, countries, gameStatus] = await Promise.all([getAllResources(), getAllCountries(), getGameStatus()]);
        setCountries(countries);
        setResources(resources);
        setIsRunGame(gameStatus);
    })();
  }, [])

  useEffect(() => {
    if(newTrade.cost && newTrade.count) {
      setNewTrade({ ...newTrade, sum: newTrade.cost * newTrade.count });
    }
  }, [newTrade.cost, newTrade.count])

  const onChangeState = (value, name) => {
    setNewTrade({ ...newTrade, [name]: value });
  }

  const isFullFormWasInsert = () => {
    const { 
      buyer,
      seller,
      owner,
      resource,
      sum,
      count,
      cost,
      uniqTradeKey
    } =  newTrade;
    return !((buyer || seller) && owner && resource && sum && count && cost && uniqTradeKey);
  }

  return (
    <div className="trade-container">
      {isRunGame && <Paper classes={{ root: 'paper' }}>
        <Typography variant="h6" gutterBottom>
          Оформление сделки
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Оформитель сделки</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="owner"
                value={newTrade.owner}
                onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              >
                {countries.map((country) => <MenuItem value={country.id}>{country.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Страна покупатель</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="buyer"
                value={newTrade.buyer}
                onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              >
                <MenuItem value=''>Не выбрано</MenuItem>
                {countries.map((country) => <MenuItem value={country.id}>{country.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Страна продавец</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="seller"
                value={newTrade.seller}
                onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              >
                <MenuItem value=''>Не выбрано</MenuItem>
                {countries.map((country) => <MenuItem value={country.id}>{country.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Ресурс</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="resource"
                value={newTrade.resource}
                onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              >
                {resources.map((resource) => <MenuItem value={resource.id}>{resource.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="address1"
              name="count"
              value={newTrade.count}
              type="number"
              onKeyPress={(evt) => {
                  if (
                    evt.key === 'e' ||
                    evt.key === '+' ||
                    evt.key === '-' ||
                    evt.key === '.'
                  ) {
                    evt.preventDefault();
                  }
              }}  
              onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              label="Количество ресурса"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              name="cost"
              value={newTrade.cost}
              type="number"
              onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              label="Стоимость единицы"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField id="state" name="state" value={newTrade.sum} disabled={true} label="Сумма сделки" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="uniqTradeKey"
              value={newTrade.uniqTradeKey}
              onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
              label="Уникальный торговый ключ (УТК)"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
            onClick={() => createTrade(newTrade)}
            disabled={isFullFormWasInsert()}
            variant="contained" color="primary">
                Создать сделку
            </Button>
          </Grid>
        </Grid>
      </Paper>}
      <Paper classes={{ root: 'paper' }}>
      <Typography variant="h6" gutterBottom>
              Список сделок
            </Typography>
        <Tabs
          value={tab}
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
            {trades.map((row) => (
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
                {row.status === 'active' && isRunGame && <TableCell><Delete onClick={() => { 
                  setOpenModal(true);
                  setOpenModalCountry(row.id);
                  }}/>
                </TableCell>}
                <Modal
                  className="modal"
                  open={openModal && openModalCountry === row.id}
                  onClose={() => setOpenModal(false)}
              >
                  <div className="modal-template">
                      <Typography component="h1" variant="h5" className="mb-30">Удаление сделки</Typography>
                      <TextField
                          required
                          id="uniqTradeKey"
                          name="uniqTradeKey"
                          label="Уникальный торговый ключ"
                          fullWidth
                          onChange={e => setModalUniqKey(e.target.value)}
                          value={modalUniqKey}
                          style={{marginBottom: '30px'}}
                      />
                      <Button
                          className="mb-30"
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            deleteTrade(row.id, modalUniqKey);
                            setModalUniqKey('');
                            setOpenModal(false);
                          }}
                      >
                          Принять
                      </Button>
                  </div>
              </Modal>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

const mapToStateToProps = ({ game }) => ({
  trades: game.trades
});

export default compose(
  connect(mapToStateToProps, {
    getGameStatus,
    setGameStatus,
    getAllResources, getAllCountries, createTrade, getAllTrades, getAllAds, getAllClosedTrades, deleteTrade
  }))(Trade);