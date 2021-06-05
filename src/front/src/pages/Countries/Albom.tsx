import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {getInfoAboutCountries, getAllBuilds, createBuild,
  getTimerResourceUpdating, getAllTrades, getAllClosedTrades} from '../../actions/game';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Popover,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Modal,
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Avatar, Tabs, Tab, Paper
} from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/ru'  // without this line it didn't work
import './Albom.scss';
import InfoTab from '../../components/InfoTab/InfoTab';

moment.locale('ru')

const Album = ({getInfoAboutCountries, countries, getAllBuilds, createBuild,
                 timerDeadline, getTimerResourceUpdating,
                 getAllTrades, getAllClosedTrades}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [countryOpenModal, setCountryOpenModal] = useState('');
  const [allBuilds, setAllBuilds] = useState([] as any[]);
  const [tab, setTab] = useState(0);
  const [buildForm, setBuildForm] = useState<any>({
    build: null,
    uniqTradeKey: null
  });
  const [countdownTimerValues, setCountdownTimerValues] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const sortedCountries = countries.sort((country, nextCountry) => country.name - nextCountry.name);

  useEffect(() => {
    (async function() {
     const [builds] = await Promise.all([getAllBuilds(), getInfoAboutCountries()]);
     setAllBuilds(builds);
     await getTimerResourceUpdating()
     calcCountdownTimer(timerDeadline)
    }());
  }, []);

  useEffect(() => {
    (async function asyncFunc() {
      if(tab === 0) {
        await getAllTrades();
      }
      if(tab === 1) {
        await getAllClosedTrades();
      }
    })();
  }, [tab])

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const calcCountdownTimer = (deadline) => {
    const countDownDate = +deadline;

    const interval = setInterval( async function() {

      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      seconds >= 0 && setCountdownTimerValues({days, hours, minutes, seconds});

      // If the count down is finished, write some text
      if (distance <= 0 || !distance) {
        clearInterval(interval);
        const newDeadline = await getTimerResourceUpdating()
        const now = new Date().getTime();
        if (newDeadline - now > 0) {
          // await setTimerDeadline(newDeadline)
          calcCountdownTimer(newDeadline)
        }
      }
    }, 1000);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <React.Fragment>
        {/* Hero unit */}
        <div className="heroContent">
          <Container maxWidth="sm">
            <Typography component="h1" className="page-title" variant="h2" align="center" gutterBottom>
              Страны
            </Typography>
            {!!timerDeadline && <Typography className="mb-30" align="center" style={{color: "white"}}>
              Время до производстава ресурсов:{' '}
              {countdownTimerValues.days} дней{' '}
              {countdownTimerValues.hours} часов{' '}
              {countdownTimerValues.minutes} минут{' '}
              {countdownTimerValues.seconds} секунд
            </Typography>}
          </Container>
        </div>
        <Container className="cardGrid" maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {sortedCountries.map((country) => (
              <Grid item key={country.id} xs={12} sm={6} md={4}>
                <Card className="card">
                  <CardMedia
                    className="cardMedia"
                    image={country.img || 'https://i.pinimg.com/originals/8a/eb/d8/8aebd875fbddd22bf3971c3a7159bdc7.png'}
                    title="Image title"
                  />
                  <CardContent className="cardContent">
                    <Typography gutterBottom variant="h5" component="h2">
                      {country.name}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="h4">
                      Бюджет: {country.money}
                    </Typography>
                    <div className="resources-list">
                      {country.resources.map((resource, index) => {
                        return <Typography key={`Resource${index}`}>
                          {resource.resource.name} - {resource.count}&nbsp;
                          <span className={country?.increases[resource.resource.name] > 0 ? 'increases-green' : 'increases-red'}>
                            ({country?.increases[resource?.resource?.name]})
                          </span>
                        </Typography>
                      })}
                    </div>
                    <details>
                      <summary>Развитые сферы</summary>
                      {Object.keys(country.builds).length ?
                      <div>
                        {Object.keys(country.builds).map((build, index) => {
                          return <p style={{margin: 0}} key={`Build${index}`}>{build}: {country.builds[build]}</p>
                        })}
                      </div> :
                      <div>Данная страна не развивала ни одну сферу</div>}
                    </details>
                    <details>
                      <summary>Уровень жизни</summary>
                      {
                        !!country?.lifeLevel ?
                          <div>{country?.lifeLevel?.name},{' '}
                            {moment(country?.lifeLevelUpdate).utc().format('LLL')}</div> :
                          <div>Страна еще не получила никакого уровня жизни</div>
                      }
                    </details>
                  </CardContent>
                  <Modal
                  className="modal"
                  open={openModal && countryOpenModal === country.name}
                  onClose={() => setOpenModal(false)}
                  >
                      <div className="modal-template">
                          <Typography component="h1" variant="h5" className="mb-30">Развитие инфраструктуры. {country.name}</Typography>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Сфера</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="country"
                                onChange={(e:any) => setBuildForm({ ...buildForm, build: e.target.value})}
                                value={buildForm.build}
                            >
                                {allBuilds.map((build) => <MenuItem key={build.id} value={build.id}>
                                  <div style={{display: 'flex', alignItems: 'center'}}>
                                    <div style={{marginRight: '10px'}}>
                                      <Avatar src={build.icon}/>
                                    </div>
                                    <div>
                                      <div><b>{build.name}</b></div>
                                      <div>
                                        <p className="build-green-text">Дополнительный прирост ресурсов:</p>
                                          {build.changes.map((change) =>
                                            <p className="build-little-text">{change.resource.name}: <b>{change.count}</b></p>)
                                          }
                                      </div>
                                      <div>
                                        <p className="build-red-text">Необходимые для развития ресурсы:</p>
                                        <p className="build-little-text">Бюджет: {build.moneyCost}</p>
                                          {build.buildConditions.map((change) =>
                                            <p className="build-little-text">{change.resource.name}: <b>{change.count}</b></p>)
                                          }
                                      </div>
                                    </div>
                                  </div>
                                </MenuItem>)}
                            </Select>
                          </FormControl>
                          <TextField
                              required
                              id="uniqTradeKey"
                              name="uniqTradeKey"
                              label="Уникальный торговый ключ"
                              fullWidth
                              onChange={e => setBuildForm({ ...buildForm, uniqTradeKey: e.target.value})}
                              value={buildForm.uniqTradeKey}
                              style={{marginBottom: '30px'}}
                          />
                          <Button
                              className="mb-30"
                              type="submit"
                              fullWidth
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                createBuild({country: country.id, ...buildForm});
                                setOpenModal(false);
                              }}
                          >
                              Развить
                          </Button>
                      </div>
                  </Modal>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => {
                      setCountryOpenModal(country.name);
                      setOpenModal(true)}
                    }
                    fullWidth>
                      Развить инфраструктуру
                    </Button>
                  </CardActions>
                  <CardActions>
                  <Button size="small" color="primary"
                    onClick={(e) => {
                      handlePopoverOpen(e);
                      setCountryOpenModal(country.name);
                    }}
                    fullWidth>
                      Информация о сделках
                  </Button>
                  <Popover
                    id={id}
                    open={open && countryOpenModal === country.name}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <InfoTab trades={country.trades} />
                  </Popover>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
    </React.Fragment>
  );
}

const mapToStateToProps = ({ game }) => ({
  countries: game.countries,
  timerDeadline: game.timerDeadline
});

export default compose(
  connect(mapToStateToProps, {
    getInfoAboutCountries,
    getAllBuilds,
    createBuild,
    getTimerResourceUpdating,
    getAllTrades,
    getAllClosedTrades
  }))(Album);
