import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {getHeaderLinks} from '../../actions/game';
import './Header.scss';

const Header = ({getHeaderLinks, links}) => {

    useEffect(() => {
        (async function() {
            await getHeaderLinks();
        })()
    }, []);
    console.log(links);
    return <div className="header">
        <Grid container spacing={1} className="header-container">
            <Grid item md={4} xs={12}>
                <h1 className="header-container-title">УправLand</h1>
            </Grid>
            <Grid item md={8} xs={12} container spacing={2}>
                <Grid item>
                    <Link to="/" className="header-container-link">биржа</Link>
                </Grid>
                <Grid item>
                    <Link to="/countries" className="header-container-link">страны</Link>
                </Grid>
                {links.map((link) => {
                    return <Grid item>
                        <a href={link.link} target="__blank" className="header-container-link">{link.name}</a>
                    </Grid>
                })}
            </Grid>
        </Grid>
    </div>
}

const mapToStateToProps = ({ game }) => ({
    links: game.links
  });

  export default compose(
    connect(mapToStateToProps, {
        getHeaderLinks
    }))(Header);
