import React from "react";

import CreateElectionForm from './CreateElectionForm';

export default function CreateElectionView(props) {
    const id = props.match.params.id;

    return(
        <CreateElectionForm/>
    )
}

function getElectionData(id) {
    //  todo
}
