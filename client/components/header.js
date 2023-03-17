/* eslint-disable react/jsx-props-no-spreading */
import { React } from "react";
import { Typography, Toolbar, AppBar } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export default function header() {
  let { asPath } = useRouter();

  if (asPath == "/") {
    asPath = "Audio Features";
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ height: 95, marginBottom: "5%", backgroundColor: "#133d2f" }}
      >
        <Toolbar style={{ height: 95 }}>
          <span>
            <Typography variant="h6" noWrap>
              <Link color="inherit" href={asPath} passHref>
                <a hred="#" style={{ textDecoration: "none", color: "white" }}>
                  Visualize {asPath}
                </a>
              </Link>
            </Typography>
          </span>
        </Toolbar>
      </AppBar>
    </div>
  );
}
