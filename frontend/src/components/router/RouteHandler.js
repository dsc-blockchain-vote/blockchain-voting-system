import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import BallotView from "../views/BallotView/BallotView";
import CreateElectionView from "../views/ElectionFormView/CreateElectionView";
import EditElectionView from "../views/ElectionFormView/EditElectionView";
import Login from "../views/LoginAndSignupView/Login";
import Signup from "../views/LoginAndSignupView/Signup";
import ElectionListView from "../views/ElectionListView/ElectionListView";
import ResultsView from "../views/ResultsView/ResultsView";
import Profile from '../views/ProfileView/Profile';
import { PinDropSharp } from '@material-ui/icons';

export default function RouteHandler(props) {
    return (
        <Switch>
            <Route exact path="/" render={() => 
                            (<Login setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn}
                                user={props.user} setUser={props.setUser}/>)}/>
            <Route path="/ballot" component={BallotView}/>
            <Route path="/login" render={() => 
                            (<Login setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn}
                                user={props.user} setUser={props.setUser}/>)}/>
            <Route path="/signup" render={() => 
                            (<Signup setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn}
                                user={props.user} setUser={props.setUser}/>)}/>
            <Route path="/profile" component={Profile}/>
            <Route exact path="/elections" render={() => 
                            (<ElectionListView setLoggedIn={props.setLoggedIn} loggedIn={props.loggedIn}
                                user={props.user} setUser={props.setUser}/>)}/>
            <Route exact path="/elections/create" component={CreateElectionView}/>
            <Route exact path="/elections/:id/ballot" component={BallotView}/>
            <Route exact path="/elections/:id/edit" component = {EditElectionView}/>
            <Route exact path="/elections/:id/preview" component = {EditElectionView}/>
            <Route exact path="/elections/:id/results" component = {ResultsView}/>
        </Switch>
    )
}
