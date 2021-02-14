import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import CreateElectionView from '../views/CreateElectionView/CreateElectionView';

export default function RouteHandler() {
    return (
        <Switch>
            <Route path="create" component={CreateElectionView}/>
        </Switch>
    )
}