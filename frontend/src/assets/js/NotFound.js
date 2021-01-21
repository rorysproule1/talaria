import React from "react";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Footer from "./Footer";
import * as urls from "../utils/urls";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "300px",
  },
  text: {
    padding: theme.spacing(8),
  },
  link: {
    textAlign: "center",
  },
}));

export default function NotFound() {
  // The NotFound component is output when a URL is provided that is not found within the app's directory,
  // preventing a fatal crash from occurring, which is confusing for the user.

  const classes = useStyles();

  return (
    <React.Fragment>
      <Header connectToStrava={true} />
      <main className={classes.root}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          className={classes.text}
        >
          Whoops, we can't seem to find what you're looking for!
        </Typography>
        <div className={classes.link}>
          <Link href={urls.Login}>Click here to return to the Home Menu</Link>
        </div>
      </main>
      <Footer />
    </React.Fragment>
  );
}
