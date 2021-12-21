"use strict";

const {
  Formik,
  Field,
  Form
} = window.Formik;
const {
  createSlice,
  configureStore
} = window.RTK;
const {
  combineReducers
} = window.Redux;
const {
  Provider,
  connect
} = window.ReactRedux;
const callFormSlice = createSlice({
  name: 'callForm',
  initialState: "",
  reducers: {
    requestOpen: (state, action) => {
      if (state === "") return action.payload;
      return state;
    },
    requestFulfilled: state => ""
  }
});
const mainReducer = combineReducers({
  callForm: callFormSlice.reducer
});
const store = configureStore({
  reducer: mainReducer
});

class MainForm extends React.Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Formik, {
      initialValues: {
        yourName: '',
        email: '',
        phone: '',
        message: '',
        policy: false
      },
      validate: values => {
        return {};
      },
      onSubmit: (values, {
        setSubmitting
      }) => {
        console.log(JSON.stringify(values));
        const prom = fetch('https://formcarry.com/s/Ger4-7rnaWH', {
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
        });
        prom.then(response => {
          alert("Форма отправлена");
          console.log(response);
          setSubmitting(false);
        });
      }
    }, ({
      isSubmitting,
      handleChange,
      handleBlur,
      values
    }) => /*#__PURE__*/React.createElement(Form, null, /*#__PURE__*/React.createElement(Field, {
      type: "text",
      name: "yourName",
      placeholder: "\u0412\u0430\u0448\u0435 \u0438\u043C\u044F",
      required: true
    }), /*#__PURE__*/React.createElement(Field, {
      type: "text",
      name: "phone",
      placeholder: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D",
      required: true
    }), /*#__PURE__*/React.createElement(Field, {
      type: "email",
      name: "email",
      placeholder: "E-mail",
      required: true
    }), /*#__PURE__*/React.createElement("textarea", {
      name: "message",
      onChange: handleChange,
      onBlur: handleBlur,
      value: values.message,
      placeholder: "\u0412\u0430\u0448 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "policy",
      className: "chb-block"
    }, /*#__PURE__*/React.createElement(Field, {
      type: "checkbox",
      className: "chb",
      id: "policy",
      name: "policy"
    }), /*#__PURE__*/React.createElement("span", {
      className: "chb-place"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "checkbox-text"
    }, "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u044F \u0437\u0430\u044F\u0432\u043A\u0443, \u044F \u0434\u0430\u044E \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 ", /*#__PURE__*/React.createElement("a", {
      href: ""
    }, "\u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0441\u0432\u043E\u0438\u0445 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445"), "."))), /*#__PURE__*/React.createElement("div", {
      id: "recaptcha-store"
    }, /*#__PURE__*/React.createElement("div", {
      id: "recaptcha",
      className: "g-recaptcha",
      "data-sitekey": "6LesZTAaAAAAAENvkVmnCuOhPbCmr8wyVcery-wM",
      "data-theme": "dark",
      "data-callback": "captchaCallback",
      "data-expired-callback": "captchaCallback"
    })), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      disabled: isSubmitting
    }, "\u041E\u0422\u041F\u0420\u0410\u0412\u0418\u0422\u042C"))));
  }

}

class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      finallyOpen: false,
      finallyClosed: true
    };

    this.stepOpen = this.stepOpen.bind(this);
    this.playOpen = this.playOpen.bind(this);
    this.stepClose = this.stepClose.bind(this);
    this.playClose = this.playClose.bind(this);
    this.handleOffClick = this.handleOffClick.bind(this);
  }

  stepOpen(timestamp) {
    if (this.startOpen === undefined) this.startOpen = timestamp;
    let elapsed = timestamp - this.startOpen;
    const time = 700;
    document.getElementById('moving-overlay').style.transform = 'scale(' + Math.min(elapsed / time, 1) + ')';
    if (this.centerString) document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
    document.getElementById('captured-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + Math.min(elapsed / time * 0.8, 0.8) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepOpen);
    } else {
      this.setState({
        finallyOpen: true
      });
    }
  }

  playOpen(id) {
    if (!this.state.finallyClosed) return;
    this.setState({
      finallyClosed: false
    });
    this.startOpen = undefined;
    let elem = document.getElementById(id);

    if (elem) {
      this.id = id;
      let rect = elem.getBoundingClientRect();
      let centerX = (rect.left + rect.right) / 2;
      let centerY = (rect.top + rect.bottom) / 2;
      this.centerString = centerX + "px " + centerY + "px";
    }

    window.requestAnimationFrame(this.stepOpen);
  }

  stepClose(timestamp) {
    if (this.startClose === undefined) this.startClose = timestamp;
    let elapsed = timestamp - this.startClose;
    const time = 700;
    document.getElementById('moving-overlay').style.transform = 'scale(' + (1 - Math.min(elapsed / time, 1)) + ')';
    if (this.centerString) document.getElementById('moving-overlay').style.transformOrigin = this.centerString;
    document.getElementById('captured-overlay').style.backgroundColor = 'rgba(20, 20, 20, ' + (0.8 - Math.min(elapsed / time * 0.8, 0.8)) + ')';

    if (elapsed < time) {
      window.requestAnimationFrame(this.stepClose);
    } else {
      this.setState({
        finallyClosed: true
      });
    }
  }

  playClose() {
    if (!this.state.finallyOpen) return;
    this.setState({
      finallyOpen: false
    });
    this.startClose = undefined;

    if (this.id) {
      let elem = document.getElementById(this.id);
      let rect = elem.getBoundingClientRect();
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
    if (document.getElementById('popup-form').contains(e.target)) return;
    this.playClose();
  }

  render() {
    if (this.state.finallyClosed) {
      return null;
    }

    return /*#__PURE__*/React.createElement("div", {
      id: "captured-overlay"
    }, /*#__PURE__*/React.createElement("div", {
      id: "moving-overlay",
      onClick: this.handleOffClick
    }, /*#__PURE__*/React.createElement("div", {
      id: "popup-form"
    }, this.props.children)));
  }

}

function mapState(state) {
  const {
    callForm
  } = state;
  return {
    openRequest: callForm
  };
}

const mapDispatch = {
  requestFulfilled: callFormSlice.actions.requestFulfilled
};
const WrappedModalWindow = connect(mapState, mapDispatch)(ModalWindow);
ReactDOM.render( /*#__PURE__*/React.createElement(Provider, {
  store: store
}, /*#__PURE__*/React.createElement(WrappedModalWindow, null, /*#__PURE__*/React.createElement(MainForm, null))), document.getElementById('react-block'));

function clickHandler(e) {
  e.preventDefault();
  store.dispatch(callFormSlice.actions.requestOpen(e.target.id));
}

document.querySelectorAll(".call-form").forEach(elem => elem.addEventListener("click", clickHandler));
