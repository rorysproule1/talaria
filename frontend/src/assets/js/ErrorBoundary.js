import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Footer from "./Footer";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <React.Fragment>
        <Header connectToStrava={true} />
        <main style={{height: "300px"}}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            style={{padding: "64px"}}
          >
            Oh no! Something's gone wrong.
          </Typography>
          <div style={{textAlign: "center"}}>
            <Link href="/login">Click here to return to the Home Menu</Link>
          </div>
        </main>
        <Footer />
      </React.Fragment>
    ) : (
      this.props.children
    );
  }
}
