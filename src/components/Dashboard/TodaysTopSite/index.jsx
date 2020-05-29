import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';

const TodaysTopSite = ({ topSite }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        Today&#39;s top site
      </Typography>
      <Typography variant="h4" component="h2">
        {topSite}
      </Typography>
    </CardContent>
  </Card>
);

TodaysTopSite.propTypes = {
  topSite: PropTypes.string.isRequired,
};

export default TodaysTopSite;
