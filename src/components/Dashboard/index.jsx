import React, { useEffect, useState } from 'react';
import {
  Grid,
  Breadcrumbs,
  Link,
  Typography,
} from '@material-ui/core';
import Layout from '../Layout';
import TodaysTopSite from './TodaysTopSite';
import TodaysTotalVisits from './TodaysTotalVisits';
import EstimatedTimeBrowsing from './EstimatedTimeBrowsing';
import TopSitesCard from './TopSitesCard';
import SkeletonCardSmall from './SkeletonCardSmall';
import TopSitesSkeleton from './TopSitesSkeleton';
import { getSearchParams, searchHistory } from '../../lib/chrome-helpers';
import { groupHistoryByDate } from '../../lib/history-helpers';
import { isToday, isYesterday } from '../../lib/millisecond-helpers';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [topSite, setTopSite] = useState('');
  const [totalVisits, setTotalVisits] = useState({});

  // takes the first day of history, makes sure its the current day, returns the top site of the day
  const getTodaysTopSite = (today) => {
    if (!isToday(today.date)) return 'No history today';
    // eslint-disable-next-line max-len
    return today.items.reduce((prev, current) => ((prev.visitCount > current.visitCount) ? prev.title : current.title));
  };

  // returns number of visits today + % change over previous day
  const getTotalVisits = (today, yesterday) => {
    if (!isToday(today.date)) return { total: null, change: null };

    if (!isYesterday(yesterday.date)) {
      return {
        total: today.items.length,
        change: null,
      };
    }

    // eslint-disable-next-line max-len
    const percentChange = Math.floor(((today.items.length - yesterday.items.length) / yesterday.items.length) * 100);
    return {
      total: today.items.length,
      change: percentChange,
    };
  };

  useEffect(() => {
    setIsLoading(true);
    const searchParams = getSearchParams('', 'Seven', {}, 5000);
    searchHistory(searchParams)
      .then((results) => {
        const sortedHistory = groupHistoryByDate(results);
        const top = sortedHistory.length > 0 ? getTodaysTopSite(sortedHistory[0]) : 'No history today';
        const totals = getTotalVisits(sortedHistory[0], sortedHistory[1] || []);
        setHistory(sortedHistory);
        setTopSite(top);
        setTotalVisits(totals);
        setIsLoading(false);
      })
      .catch((error) => console.error('Error getting history', error)); // HANDLE THIS
  }, []);

  return (
    <Layout>
      <Grid
        container
        spacing={4}
        direction="row"
        justify="center"
      >
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" onClick={() => {}}>
              Insights
            </Link>
            <Typography color="textPrimary">Dashboard</Typography>
          </Breadcrumbs>
          <Typography variant="h3" gutterBottom>Welcome back!</Typography>
        </Grid>
        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <TodaysTopSite topSite={topSite} />}
        </Grid>
        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <TodaysTotalVisits totalVisits={totalVisits} />}
        </Grid>
        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <TodaysTopSite topSite={topSite} />}
        </Grid>
        <Grid item xs={3}>
          {isLoading ? <SkeletonCardSmall /> : <EstimatedTimeBrowsing />}
        </Grid>
        <Grid item xs={3}>
          {isLoading ? <TopSitesSkeleton /> : <TopSitesCard />}
        </Grid>
        <Grid item xs={9}>
          <TopSitesCard />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
