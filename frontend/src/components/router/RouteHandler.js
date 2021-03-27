import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BallotView from '../views/BallotView/BallotView';
import ElectionFormView from '../views/ElectionFormView/ElectionFormView';
import Login from '../views/LoginAndSignupView/Login';
import Signup from '../views/LoginAndSignupView/Signup';
import ElectionListView from '../views/ElectionListView/ElectionListView';
import ResultsView from "../views/ResultsView/ResultsView";

export default function RouteHandler() {
    return (
        <Switch>
            <Route exact path="/" component={Login}/>
            <Route path="/ballot" component={BallotView}/>
            <Route exact path="/elections/:id" component={BallotView}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route exact path="/elections" component = {ElectionListView}/>
            <Route exact path="/elections/create" component={ElectionFormView}/>
            <Route exact path="/elections/:id/edit" component = {ElectionFormView}/>
            <Route exact path="/elections/:id/results" component = {ResultsView}/>
        </Switch>
    )
}
