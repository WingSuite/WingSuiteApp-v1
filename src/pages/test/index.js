import { useContext } from "react";
import { AppProvider, AppContext } from "./context";
import { ItemList } from "./ItemList";
import React, { Fragment, ScrollContainer } from "react";

export default function TestPage() {

  return (
    <Fragment>
      <ScrollContainer>
        <h1>This is a scrolling text</h1>
      </ScrollContainer>
    </Fragment>
  );
}