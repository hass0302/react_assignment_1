// single item 
var ListItem = React.createClass({
    propTypes: {
        "id": React.PropTypes.number,
        "name": React.PropTypes.string,
        "email": React.PropTypes.string,
        "onDeleteButtonClicked": React.PropTypes.func
    },

    render: function () {
        return (
            React.createElement("a", {
                    href: "#item/" + this.props.id
                },
                React.createElement("li", {},
                    React.createElement("p", {}, this.props.name)
                )
            )
        );
    }
});

// the list array of item
var List = React.createClass({
    propTypes: {
        "items:": React.PropTypes.array,
        "deleteElement": React.PropTypes.func
    },

    render: function () {
        var deleteElementCallBack = this.props.deleteElement;
        var listofListItems = this.props.items.map(function (item) {
            item.onDeleteButtonClicked = deleteElementCallBack;
            return React.createElement(ListItem, item);
        });
        return (
            React.createElement("ul", {
                    id: "main_page",
                    className: "panel panel-default"
                },
                listofListItems
            )
        );
    }
});

// Add new item form
var AddNewForm = React.createClass({
    propTypes: {
        contactItem: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired
    },
    onNameChange: function (e) {
        this.props.onChange(Object.assign({}, this.props.contactItem, {
            name: e.target.value
        }));
    },
    onEmailChange: function (e) {
        this.props.onChange(Object.assign({}, this.props.contactItem, {
            email: e.target.value
        }));
    },

    onSubmit: function (e) {
        this.props.onSubmit(this.props.contactItem);
    },
    render: function () {
        return (
            React.createElement("form", {
                    className: "panel panel-default"
                },
                React.createElement("label", {
                    name: "name"
                }, "full name"),
                React.createElement("input", {
                    type: "text",
                    name: "name",
                    value: this.props.contactItem.name,
                    onChange: this.onNameChange
                }),
                React.createElement("label", {
                    name: "email"
                }, "email address"),
                React.createElement("input", {
                    type: "text",
                    name: "email",
                    value: this.props.contactItem.email,
                    onChange: this.onEmailChange
                }),
                React.createElement("button", {
                    type: "button",
                    className: "btn btn-primary submit",
                    onClick: this.onSubmit
                }, "submit"))
        );
    }
});

// how to display the form
var FormView = React.createClass({
    propTypes: {
        contactItem: React.PropTypes.object.isRequired,
        items: React.PropTypes.array.isRequired,
        onNewcontactItemChange: React.PropTypes.func.isRequired,
        onSubmitNewItem: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            React.createElement("div", {},
                React.createElement("div", {}),
                React.createElement(AddNewForm, {
                    contactItem: this.props.contactItem,
                    onChange: this.props.onNewcontactItemChange,
                    onSubmit: this.props.onSubmitNewItem
                })
            )
        );
    }
});

function updateNewcontactItem(item) {
    setState({
        contactItem: item
    });
}


function addNewItem(item) {
    var itemList = state.items;
    itemList.push(Object.assign({}, {
        key: itemList.length + 1,
        id: itemList.length + 1
    }, item));
    setState({
        items: itemList
    });
}

var NavMenu = React.createClass({
    render: function () {
        return (
            React.createElement("ul", {
                    className: "nav-menu"
                },
                React.createElement("li", {},
                    React.createElement("a", {
                        href: "#",
                        className: "btn btn-primary"
                    }, "main page")
                ),
                React.createElement("li", {},
                    React.createElement("a", {
                        href: "#newitem",
                        className: "btn btn-success"

                    }, "add new contact")
                )
            )
        );
    }
});

// main page
var MainPage = React.createClass({
    propTypes: {
        "id": React.PropTypes.number,
        "name": React.PropTypes.string,
        "email": React.PropTypes.string,
        "onDeleteButtonClicked": React.PropTypes.func
    },
    render: function () {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu, {}),
                React.createElement("h2", {}, "Main Page"),
                React.createElement("div", {},
                    React.createElement(List, state, {})
                ))
        );
    }
});

// rendering the page for new item, with the formview 
var AddNewItemPage = React.createClass({

    render: function () {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu, {}),
                React.createElement("h2", {}, "Add Contact"),
                React.createElement(FormView, Object.assign({}, state, {
                    onNewcontactItemChange: updateNewcontactItem,
                    onSubmitNewItem: addNewItem
                })))
        );
    }
});

// detail page
var ItemPage = React.createClass({

    render: function () {
        return (
            React.createElement("div", {},
                React.createElement(NavMenu, {}),

                React.createElement("h2", {}, "Detail Info"),
                React.createElement("div", {
                        className: "panel panel-default"
                    },
                    React.createElement("h3", {}, this.props.name),
                    React.createElement("a", {
                        href: "mailto:" + this.props.email
                    }, this.props.email)))
        );
    }
});

var state = {
    location: ""
};

function setState(changes) {
    var component;
    var componentProperties = {};

    state.deleteElement = function (e) {
        var elementID = e.target.id.split("-")[1];
        alert(elementID);
        var i;
        var newArray = [];
        var items = state.items;
        for (i = 0; i < items.length; i += 1) {
            if (items[i].id != elementID) {
                newArray.push(items[i]);
            }
        }

        setState({
            items: newArray
        });
    };

    Object.assign(state, changes);

    var splittedUrl = state.location.replace(/^#\/?|\/$/g, "").split("/");

    switch (splittedUrl[0]) {
        case "newitem":
            component = AddNewItemPage;
            break;
        case "item":
            component = ItemPage;
            componentProperties = state.items.find((i) => i.id == splittedUrl[1]);
            break;
        default:
            component = MainPage;
    }

    ReactDOM.render(React.createElement(component, componentProperties), document.getElementById("react-app"));
}

window.addEventListener("hashchange", () => setState({
    location: location.hash
}));

setState({
    location: location.hash,
    contactItem: {
        name: "",
        email: ""
    },
    items: [{
            key: 1,
            id: 1,
            name: "Damian Ha",
            email: "daydreamha@gmail.com"
                },
        {
            key: 2,
            id: 2,
            name: "Natalie Portman",
            email: "natalieportman@gmail.com"
                },
        {
            key: 3,
            id: 3,
            name: "Rosamund Pike",
            email: "rosamundpike@gmail.com"
                },
        {
            key: 4,
            id: 4,
            name: "Daisy Ridley",
            email: "daisyridley@gmail.com"
                },
        {
            key: 5,
            id: 5,
            name: "Giada de Laurentiis",
            email: "giada@giadadelaurentiis.com"
                }
            ]
});
