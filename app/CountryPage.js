import React, {useState, useEffect} from "react";
import {getCountryStats} from "../api/pandemic"
import { withRouter } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    flexContainer: {
        display:'flex',
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'center'
    },  
    root: {
        minWidth: 300,
        margin: '1rem',
        background: '#F9F6F4'
    },
    title: {
        fontSize: '1rem',
    },
    pos: {
        marginBottom: 12,
    },
    cases: {
        color: 'red'
    },
    recovered: {
        color: 'green'
    },
    backBtn: {
        cursor: 'pointer',
        marginRight: '1rem',
        marginLeft: '-2rem'
    },
    topHeading: {
        color: '#00AAA0'
    }
  });

//Country page component to display stats for individual country
const CountryPage = (props) => {
    const classes = useStyles();
    const { match } = props;
    const countryName = match?.params?.name;
    const [countryStats, setCountryStats] = useState(undefined);
    
    //Load country stats only on first load
    useEffect(() => {
        getCountryStats(countryName).then(
            data => {        
                setCountryStats(data);
            }
        )
      }, []); 

    //function to capture back event click and push it to router
    const goBack = (e) => {
        e?.stopPropagation();
        e?.preventDefault();
        props.history.push('/');
    }
      
    return (
        <div>
            <div className={classes.flexContainer}>
                <Button variant="contained" className={classes.backBtn} onClick={(e) => goBack(e)}>Go back</Button>
                <Typography 
                    variant="h5" 
                    component="h2" 
                    className={classes.topHeading}>
                    {decodeURI(countryName)}{" Covid-19 Tracker"}
                </Typography>
            </div>
            {countryStats && 
                <div className={classes.flexContainer}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2" className={classes.cases}>
                            {countryStats?.cases}
                            </Typography>
                            <br/>
                            <Typography variant="body2" component="p">
                            Total Cases
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2" className={classes.cases}>
                            {countryStats?.active}
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.cases}>
                            Today : + {countryStats?.todayCases}
                            </Typography>
                            <Typography variant="body2" component="p">
                            Active Cases
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2" className={classes.recovered}>
                            {countryStats?.recovered}
                            </Typography>
                            <Typography variant="body2" component="p" className={classes.recovered}>
                            Today : + {countryStats?.todayRecovered}
                            </Typography>
                            <Typography variant="body2" component="p">
                            Recovered Cases
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            }
        </div>
    )
}


export default withRouter(CountryPage);