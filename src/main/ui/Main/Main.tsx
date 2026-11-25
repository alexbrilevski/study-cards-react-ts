import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../bll/store';
import { initializeApp } from '../../bll/appReducer';
import { Header } from './Header/Header';
import { Pages } from './Pages';
import { Spinner } from '../common/components/Spinner/Spinner';
import { Snackbar } from '../common/components/Snackbar/Snackbar';
import { ErrorBoundary } from '../common/components/ErrorBoundary/ErrorBoundary';
import { ProgressBar } from '../common/components/ProgressBar/ProgressBar';

export const Main = () => {
  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const notification = useAppSelector(state => state.app.notification);
  const isLoading = useAppSelector(state => state.app.isLoading);
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  if (!isInitialized) {
    return <Spinner />;
  }

  return (
    <>
      <Header />
      <ProgressBar active={isLoading} />
      <main>
        <div className="main-content">
          <ErrorBoundary resetKey={location.pathname}>
            <Pages />
          </ErrorBoundary>
        </div>
      </main>
      {notification && <Snackbar notification={notification} />}
    </>
  );
};
