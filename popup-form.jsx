const {Formik, Field, Form} = window.Formik;
const {createSlice, configureStore} = window.RTK;
const {combineReducers} = window.Redux;
const {Provider, connect} = window.ReactRedux;

const callFormSlice = createSlice({
    name: 'callForm',
    initialState: "",
    reducers: {
        requestOpen: (state, action) => {
            if (state === "") {
                return action.payload;
            }
            return state;
        },
        requestFulfilled: state => ""
    }
});

const mainReducer = combineReducers({
    callForm: callFormSlice.reducer
});
const store = configureStore({reducer: mainReducer});

class MainForm extends React.Component {
    render() {
        return (
            <div>
              <Formik
                initialValues={{ yourName: '', email: '', phone: '', message: '', policy: false }}
                validate={values => {
                  return {};
                }}
                
                onSubmit={(values, { setSubmitting }) => {
                    console.log(JSON.stringify(values));
                    const prom = fetch(
                        'https://formcarry.com/s/KkqfQ3I23z',
                        {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: JSON.stringify(values)
                        }
                    );
                    prom.then((response) => {
                        alert("Форма отправлена");
                        console.log(response);
                        setSubmitting(false);
                    })
                }}
              >
                {({ isSubmitting, handleChange, handleBlur, values}) => (
                  <Form>
                    <Field type="text" name="yourName" placeholder="Ваше имя"/>
                    <Field type="text" name="phone" placeholder="Телефон" />
                    <Field type="email" name="email" placeholder="E-mail" />
                    <textarea
                        name="message"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.message}
                        placeholder="Ваш комментарий"
                    />
                    <label htmlFor="policy" className="chb-block">
                        <Field type="checkbox" className="chb" id="policy" name="policy" />
                        <span className="chb-place"></span>
                        <div>
                            <span className="checkbox-text">
                                Отправляя заявку, я даю согласие на <a href="">обработку своих персональных данных</a>.
                            </span>
                        </div>
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                      ОТПРАВИТЬ
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          );
    }
}

class ModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            finallyOpen: false,
            finallyClosed: true,
        }

        this.stepOpen = this.stepOpen.bind(this);
        this.playOpen = this.playOpen.bind(this);
        this.stepClose = this.stepClose.bind(this);
        this.playClose = this.playClose.bind(this);
        this.handleOffClick = this.handleOffClick.bind(this);
    }

    stepOpen(timestamp) {
        if (this.startOpen === undefined) this.startOpen = timestamp;
        let elapsed = timestamp - this.startOpen;
        const time = 2000;
        document.getElementById('moving-overlay').style.transform = 
            'scale(' + Math.min(elapsed / time, 1) + ')';
        if (this.centerString) {
            document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
        }
        document.getElementById('captured-overlay').style.backgroundColor =
            'rgba(20, 20, 20, ' +  Math.min(elapsed / time * 0.8, 0.8) + ')'
        if (elapsed < time) {
            window.requestAnimationFrame(this.stepOpen);
        } else {
            this.setState({finallyOpen: true});
        }
    }

    playOpen(id) {
        if (!this.state.finallyClosed) return;
        this.setState({finallyClosed: false});
        this.startOpen = undefined;

        let element = document.getElementById(id);
        if (element) {
            this.id = id;
            let rect = element.getBoundingClientRect();
            let centerX = (rect.left + rect.right) / 2;
            let centerY = (rect.top + rect.bottom) / 2;
            this.centerString = centerX + "px " + centerY + "px";
        }
        window.requestAnimationFrame(this.stepOpen);
    }

    stepClose(timestamp) {
        if (this.startClose === undefined) this.startClose = timestamp;
        let elapsed = timestamp - this.startClose;
        const time = 2000;
        document.getElementById('moving-overlay').style.transform = 
            'scale(' + (1 - Math.min(elapsed / time, 1)) + ')';
        if (this.centerString) {
            document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
        }
        document.getElementById('captured-overlay').style.backgroundColor =
            'rgba(20, 20, 20, ' + (0.8 - Math.min(elapsed / time * 0.8, 0.8)) + ')'
        if (elapsed < time) {
            window.requestAnimationFrame(this.stepClose);
        } else {
            this.setState({finallyClosed: true});
        }
    }

    playClose() {
        if (!this.state.finallyOpen) return;
        this.setState({finallyOpen: false});
        this.startClose = undefined;
        if (this.id) {
            let element = document.getElementById(this.id);
            let rect = element.getBoundingClientRect();
            let centerX = (rect.left + rect.right) / 2;
            let centerY = (rect.top + rect.bottom) / 2;
            this.centerString = centerX + "px " + centerY + "px";
        }
        window.requestAnimationFrame(this.stepClose);
    }

    componentDidUpdate() {
        if (this.props.openRequest !== "") {
            this.playOpen(this.props.openRequest);
            this.props.requestFulfilled();
        }
    }

    handleOffClick(e) {
        if (document.getElementById('my-modal').contains(e.target)) return;
        this.playClose();
    }

    render() {
        if (this.state.finallyClosed) {
            return null;
        }
        return (
            <div id="my-fixed-overlay">
                <div id="moving-overlay" onClick={this.handleOffClick}> 
                    <div id="my-modal">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const {callForm} = state;
    return {openRequest: callForm}
}

const mapDispatch = {requestFulfilled: callFormSlice.actions.requestFulfilled};

const WrappedModalWindow = connect(mapState, mapDispatch)(ModalWindow);

ReactDOM.render(
    (
    <Provider store={store}>
        <WrappedModalWindow> 
            <MainForm /> 
        </WrappedModalWindow>
    </Provider>
    ),
    document.getElementById('react-block')
);

function clickHandler(e) {
    e.preventDefault();
    store.dispatch(callFormSlice.actions.requestOpen(e.target.id));
}

document.querySelectorAll(".call-form")
    .forEach((elem) => elem.addEventListener("click", clickHandler));
