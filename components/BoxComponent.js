import { React, useState, useEffect } from "react";
import { Box, TextField, Grid, Button } from "@mui/material";

export default function BoxComponent({ configuration, setConfiguration }) {

    const [defaultStyle, setDefaultStyle] = useState({
        width: 300,
        height: 400,
        backgroundColor: "primary.dark",
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 3,
        marginRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3,
        paddingRight: 3,
    })

    const [style, setStyle] = useState({
        width: 300,
        height: 400,
        backgroundColor: "primary.dark",
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 3,
        marginRight: 3,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 3,
        paddingRight: 3,
    })

    const keys = Object.keys(style)

    const integerKeys = ["width", "height", "marginTop", "marginBottom", "marginLeft", "marginRight", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight"]
    const stringKeys = ["backgroundColor"]

    function changeKey(key, e) {
        let value = null;
        if (stringKeys.includes(key)) {
            value = e.target.value;
        } else if (integerKeys.includes(key)) {
            value = parseInt(e.target.value);
        }
        setStyle({
            ...style,
            [key]: value,
        });
    }

    function resetStyle() {
        setStyle(defaultStyle)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <Button onClick={resetStyle}>RESET</Button>
                {keys.map((k) => (
                    <>
                        <div>{k}</div>
                        <TextField
                            value={style[k]}
                            onChange={(e) => changeKey(k, e)}
                            defaultValue={style[k]}
                            disabled={k == "output"}
                        ></TextField>
                    </>
                ))}
            </Grid>
            <Grid item xs={8}>
                <Box width={250} sx={{ ...style }}>
                </Box>
            </Grid>
        </Grid>
    );
}
