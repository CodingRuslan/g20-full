import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {Link} from 'react-router-dom';
import {getInfoAboutCountries, getAllBuilds, createBuild} from '../../actions/game';
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
  Avatar
} from '@material-ui/core';
import moment from 'moment';
import './Albom.scss';

const Album = ({getInfoAboutCountries, countries, getAllBuilds, createBuild}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [countryOpenModal, setCountryOpenModal] = useState('');
  const [allBuilds, setAllBuilds] = useState([] as any[]);
  const [buildForm, setBuildForm] = useState<any>({ 
    build: null,
    uniqTradeKey: null
  });

  useEffect(() => {
    (async function() {
     const [builds] = await Promise.all([getAllBuilds(), getInfoAboutCountries()]);
     setAllBuilds(builds);
    }());
  }, []);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

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
          </Container>
        </div>
        <Container className="cardGrid" maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {countries.map((country) => (
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
                      {country.resources.map((resource) => {
                        return <Typography>
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
                        {Object.keys(country.builds).map(build => {
                          return <p style={{margin: 0}}>{build}: {country.builds[build]}</p>
                        })}
                      </div> :
                      <div>Данная страна не развивала ни одну сферу</div>}
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
                                {allBuilds.map((build) => <MenuItem value={build.id}>
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
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {country.trades.map(row => {
                            return <TableRow key={row.name}>
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
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
  countries: game.countries
});

export default compose(
  connect(mapToStateToProps, {
    getInfoAboutCountries,
    getAllBuilds,
    createBuild
  }))(Album);