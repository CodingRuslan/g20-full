import React, { useEffect, useState } from 'react';
import {
    Typography,
    Button,
    Modal,
    TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  } from '@material-ui/core';
  import {
    getAllResources,
    getAllCountries,
    addResourceToCountry,
    addResourceToAll,
    importDatabase,
    downloadTradeDatabase,
    getGameStatus,
    setGameStatus,
    addResources,
    addMoney,
    setTimerResourceUpdating,
    getTimerResourceUpdating,
    deleteTimerResourceUpdating
  } from '../../actions/game';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './AdminPanel.scss';

const AdminPanel = ({
  getAllResources,
  getAllCountries,
  addResourceToCountry,
  addResourceToAll,
  importDatabase,
  downloadTradeDatabase,
  getGameStatus,
  setGameStatus,
  addResources,
  addMoney,
  setTimerResourceUpdating,
  getTimerResourceUpdating,
  deleteTimerResourceUpdating,
  timerDeadline
}) => {

    const [isRunGame, setIsRunGame] = useState(true);
    const [isValidPass, setIsValidPass] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openMoneyModal, setOpenMoneyModal] = useState(false);
    const [openTimerModal, setOpenTimerModal] = useState(false)
    const [typeOfModal, setTypeOfModal] = useState('');
    const [countries, setCountries] = useState([] as any[]);
    const [resources, setResources] = useState([] as any[]);
    const [resourceForm, setResourceForm] = useState<any>({
      country: '',
      resource: '',
      count: '',
      money: 0,
      timer: 0
    });
    const [countdownTimerValues, setCountdownTimerValues] = useState<any>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });


    let selectXLSref = React.createRef();

    useEffect(() => {
        const pass = prompt('Пожалуйста введите пароль');
        if(pass === '') { // cgschoolg20
            setIsValidPass(true);
        }
    }, []);

    useEffect(() => {
      (async function asyncFunc() {
        const [resources, countries, gameStatus] = await Promise.all([getAllResources(), getAllCountries(), getGameStatus()]);
        setCountries(countries);
        setResources(resources);
        setIsRunGame(gameStatus);
        await getTimerResourceUpdating()
        calcCountdownTimer(timerDeadline)
      })();
    }, []);

    const onChangeState = (value, name) => {
      setResourceForm({ ...resourceForm, [name]: value });
    }

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

    return (
        isValidPass ? <div className="admin-container">
          <Modal
            className="modal"
            open={openMoneyModal}
            onClose={() => setOpenMoneyModal(false)}
        >
            <div className="modal-template">
                <Typography component="h1" variant="h5" className="mb-30">Пополнение ресурса</Typography>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Страна</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="country"
                      onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
                      value={resourceForm.country}
                  >
                      {countries.map((country) => <MenuItem value={country.id}>{country.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                    required
                    id="address1"
                    name="money"
                    label="Количество денег"
                    fullWidth
                    style={{marginBottom: '30px'}}
                    type="number"
                    value={resourceForm.money}
                    onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
                />
                <Button
                    className="mb-30"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      addMoney({money: resourceForm.money, country: resourceForm.country})
                      setOpenMoneyModal(false);
                    }}
                >
                    Принять
                </Button>
            </div>
        </Modal>
        <Modal
            className="modal"
            open={openModal}
            onClose={() => setOpenModal(false)}
        >
            <div className="modal-template">
                <Typography component="h1" variant="h5" className="mb-30">Пополнение ресурса</Typography>
                {typeOfModal === 'country' && <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Страна</InputLabel>
                  <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="country"
                      onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
                      value={resourceForm.country}
                  >
                      {countries.map((country) => <MenuItem value={country.id}>{country.name}</MenuItem>)}
                  </Select>
                </FormControl>}
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Ресурс</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="resource"
                    onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
                    value={resourceForm.resource}
                >
                    {resources.map((resource) => <MenuItem value={resource.id}>{resource.name}</MenuItem>)}
                </Select>
                </FormControl>
                <TextField
                    required
                    id="address1"
                    name="count"
                    label="Количество ресурса"
                    fullWidth
                    style={{marginBottom: '30px'}}
                    type="number"
                    value={resourceForm.count}
                    onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
                    onKeyPress={(evt) => {
                        if (
                          evt.key === 'e' ||
                          evt.key === '+' ||
                          evt.key === '.'
                        ) {
                          evt.preventDefault();
                        }
                    }}
                />
                <Button
                    className="mb-30"
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      typeOfModal === 'country' ?
                        addResourceToCountry(resourceForm) :
                        addResourceToAll(resourceForm);
                      setOpenModal(false);
                    }}
                >
                    Принять
                </Button>
            </div>
        </Modal>
        <Modal
          className="modal"
          open={openTimerModal}
          onClose={() => setOpenTimerModal(false)}
        >
          <div className="modal-template">
            <Typography component="h1" variant="h5" className="mb-30">Установка таймера на пополнение ресурсов</Typography>
            <TextField
              required
              id="address1"
              name="timer"
              label="Интервал срабатывания таймера (в секнудах)"
              fullWidth
              style={{marginBottom: '30px'}}
              type="number"
              value={resourceForm.timer}
              onChange={(e:any) => onChangeState(e.target.value, e.target.name)}
            />
            <Button
              className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={async () => {
                await setTimerResourceUpdating({seconds: resourceForm.timer})
                calcCountdownTimer(timerDeadline)
                setOpenTimerModal(false);
              }}
            >
              Установить
            </Button>
          </div>
        </Modal>

          <Typography component="h1" variant="h5" className="mb-30">
              Панель администратора
          </Typography>
          { !!timerDeadline &&
            <p className="mb-30">
              Время до производстава ресурсов:{' '}
              {countdownTimerValues.days} дней{' '}
              {countdownTimerValues.hours} часов{' '}
              {countdownTimerValues.minutes} минут{' '}
              {countdownTimerValues.seconds} секунд
            </p>
          }
              <Button
                  className="mb-30"
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => (selectXLSref as any).click()}
              >
                Загрузить базу
              </Button>
            <input
             id="file-upload"
              type="file"
              onChange={(e: any) => importDatabase(e.target.files[0])}
              onClick={(event) => {
                (event.target as any).value = null
              }}
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              ref={(input: any) => selectXLSref = input}/>
            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => addResources()}
            >
              Закончить производство ресурсов
            </Button>
          {!timerDeadline ? <Button
            className="mb-30"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setOpenTimerModal(true)}
          >
            Установить таймер на производство ресурсов
          </Button> :
            <Button
              className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                deleteTimerResourceUpdating()
                // setTimerDeadline(0)
              }
              }
            >
              Остановить таймер на производство ресурсов
            </Button>
          }
            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                setTypeOfModal('country')
                setOpenModal(true)
              }}
            >
              Добавить ресурс стране
            </Button>

            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setOpenMoneyModal(true)}
            >
              Добавить деньги стране
            </Button>

            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                setTypeOfModal('all')
                setOpenModal(true)
              }}
            >
              Добавить ресурс всем
            </Button>
            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => downloadTradeDatabase()}
            >
              Выгрузить базу игры
            </Button>
            <Button
                className="mb-30"
              type="submit"
              fullWidth
              variant="contained"
              onClick={() => {
                setGameStatus();
                setIsRunGame(!isRunGame);
              }}
              color={isRunGame ? "secondary" : 'primary'}
            >
              {isRunGame}
              {isRunGame ? 'Остановить игру' : 'Запустить игру'}
            </Button>
      </div> : <div />
    );
  }

const mapToStateToProps = ({ game }) => ({
  timerDeadline: game.timerDeadline
  });

export default compose(
    connect(mapToStateToProps, {
      getAllResources, setGameStatus,
      getAllCountries, addResourceToCountry,
      addResourceToAll, importDatabase,
      downloadTradeDatabase, getGameStatus,
      addResources, addMoney,
      setTimerResourceUpdating,
      getTimerResourceUpdating,
      deleteTimerResourceUpdating
}))(AdminPanel);
