import React from "react";

import ElectionForm from "./ElectionForm";

export default function ElectionFormView(props) {
  const id = props.match.params.id;

  return <ElectionForm id={id} />;
}
